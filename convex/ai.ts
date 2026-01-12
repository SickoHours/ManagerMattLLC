"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Generic OpenRouter API call
async function callOpenRouter(
  messages: Message[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: "json_object" };
  }
): Promise<{ content: string; usage?: OpenRouterResponse["usage"] }> {
  const apiKey = process.env.OPEN_ROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPEN_ROUTER_API_KEY environment variable is not set");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://managermatt.com",
      "X-Title": "Manager Matt Quote Generator",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      response_format: options?.responseFormat,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as OpenRouterResponse;

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response from OpenRouter");
  }

  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}

// Generate clarifying questions based on project description
export const generateQuestions = action({
  args: {
    description: v.string(),
  },
  handler: async (_, args) => {
    const systemPrompt = `Help non-technical users scope software projects. Ask 3-5 simple, jargon-free questions.

NO technical terms (auth, API, database, backend, frontend). Use business language.

Return JSON: {"questions":[{"id":1,"question":"How should people access this?","options":[{"key":"A","label":"On their phones","emoji":"📱"},{"key":"B","label":"On a computer","emoji":"💻"},{"key":"C","label":"Both","emoji":"📱💻"}]}]}

3-4 options per question with emojis. Focus on: who uses it, how accessed, what actions, data flow.`;

    const userPrompt = `A user wants to build this:

"${args.description}"

Generate 3-5 simple, non-technical clarifying questions to understand their project better.
Focus on: who uses it, how they access it, what actions they take, and how information flows.

Return ONLY valid JSON matching the format specified.`;

    try {
      const result = await callOpenRouter(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        {
          temperature: 0.7,
          responseFormat: { type: "json_object" },
        }
      );

      // Parse and validate the response
      const parsed = JSON.parse(result.content);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid response format: missing questions array");
      }

      return {
        questions: parsed.questions,
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to generate questions:", error);
      throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Generate PRD from description and answers
export const generatePRD = action({
  args: {
    description: v.string(),
    answers: v.string(), // Format: "1A, 2C, 3B"
    questions: v.array(v.object({
      id: v.number(),
      question: v.string(),
      options: v.array(v.object({
        key: v.string(),
        label: v.string(),
        emoji: v.optional(v.string()),
      })),
    })),
  },
  handler: async (_, args) => {
    // Parse answers into readable format
    const answerMap = new Map<number, string>();
    args.answers.split(",").forEach(a => {
      const match = a.trim().match(/(\d+)([A-D])/i);
      if (match) {
        answerMap.set(parseInt(match[1]), match[2].toUpperCase());
      }
    });

    // Build context from Q&A
    const qaContext = args.questions.map(q => {
      const selectedKey = answerMap.get(q.id);
      const selectedOption = q.options.find(o => o.key === selectedKey);
      return `Q: ${q.question}\nA: ${selectedOption?.label || "Not answered"}`;
    }).join("\n\n");

    const systemPrompt = `Create a PRD from project description and Q&A answers.

Return JSON: {"summary":"1-2 sentences","userStories":[{"id":"US-001","title":"Short title","description":"As a [user], I want [action] so that [benefit]","acceptanceCriteria":["testable criterion"]}],"functionalRequirements":[{"id":"FR-001","description":"The system shall..."}],"nonGoals":["out of scope items"]}

Generate 4-8 user stories (1-2 day size each), 3-6 functional requirements, 2-4 non-goals.`;

    const userPrompt = `Project Description:
"${args.description}"

Clarifying Questions & Answers:
${qaContext}

Generate a detailed PRD for this project. Return ONLY valid JSON.`;

    try {
      const result = await callOpenRouter(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        {
          temperature: 0.5, // Lower temp for more consistent structure
          responseFormat: { type: "json_object" },
        }
      );

      const parsed = JSON.parse(result.content);

      if (!parsed.userStories || !Array.isArray(parsed.userStories)) {
        throw new Error("Invalid PRD format: missing userStories");
      }

      return {
        prd: parsed,
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to generate PRD:", error);
      throw new Error(`Failed to generate PRD: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Estimate costs from PRD
export const estimateFromPRD = action({
  args: {
    prd: v.object({
      summary: v.string(),
      userStories: v.array(v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        acceptanceCriteria: v.array(v.string()),
      })),
      functionalRequirements: v.array(v.object({
        id: v.string(),
        description: v.string(),
      })),
      nonGoals: v.array(v.string()),
    }),
    userType: v.string(),
    timeline: v.string(),
  },
  handler: async (_, args) => {
    const systemPrompt = `Software cost estimator. Rate: $150/hr. Minimum: $1,500.

Hours guide: CRUD=2-4, Auth=4-6, Team=6-10, Mobile=4-8, Dashboard=8-12, Realtime=6-10, GPS=6-10, Payment=8-12, AI=10-16, Upload=3-5, Sync=4-6, Notif=4-6, Search=4-8, Export=4-8

Multipliers: just-me=0.8x, team=1.0x, customers=1.2x, everyone=1.4x | asap=1.15x (others=1.0x)

Return JSON: {"lineItems":[{"id":"US-001","title":"name","hours":6,"cost":900,"confidence":"high|medium|low"}],"subtotal":N,"riskBuffer":N,"riskPercent":10|15|20,"total":{"min":N,"max":N},"totalHours":N,"confidence":"high|medium|low","notes":["assumptions"]}

Risk: 10% simple, 15% medium, 20% complex/AI`;

    const prdSummary = `
Summary: ${args.prd.summary}

User Stories:
${args.prd.userStories.map(s => `- ${s.id}: ${s.title}\n  ${s.description}\n  Criteria: ${s.acceptanceCriteria.join("; ")}`).join("\n")}

Functional Requirements:
${args.prd.functionalRequirements.map(r => `- ${r.id}: ${r.description}`).join("\n")}

User Type: ${args.userType}
Timeline: ${args.timeline}`;

    const userPrompt = `Estimate the cost for this project:

${prdSummary}

Provide a line-item estimate for each user story plus an overall estimate with risk buffer.
Return ONLY valid JSON.`;

    try {
      const result = await callOpenRouter(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        {
          temperature: 0.3, // Low temp for consistent pricing
          responseFormat: { type: "json_object" },
        }
      );

      const parsed = JSON.parse(result.content);

      if (!parsed.lineItems || !Array.isArray(parsed.lineItems)) {
        throw new Error("Invalid estimate format: missing lineItems");
      }

      return {
        estimate: parsed,
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to generate estimate:", error);
      throw new Error(`Failed to generate estimate: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Test action for verifying OpenRouter connectivity
export const testConnection = action({
  args: {},
  handler: async () => {
    try {
      const result = await callOpenRouter(
        [
          { role: "user", content: "Say 'OpenRouter connection successful!' and nothing else." },
        ],
        { maxTokens: 50 }
      );
      return { success: true, message: result.content, usage: result.usage };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
});
