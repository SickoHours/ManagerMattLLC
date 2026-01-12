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
    const systemPrompt = `You are an AI assistant helping non-technical users scope software projects.
Your job is to ask simple, jargon-free questions to understand what they want to build.

## Core Principles
- NEVER use technical jargon (no "auth", "API", "database", "endpoints", "backend", "frontend")
- Translate technical concepts to business language
- Each question should feel like a natural conversation
- Ask 3-5 questions maximum
- Questions should help clarify: who uses it, how they access it, what they do with it, how data flows

## Question Format
Return a JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "How should people access this?",
      "options": [
        {"key": "A", "label": "On their phones", "emoji": "📱"},
        {"key": "B", "label": "On a computer", "emoji": "💻"},
        {"key": "C", "label": "Both", "emoji": "📱💻"}
      ]
    }
  ]
}

Each question should have 3-4 options. Include relevant emojis to make options scannable.
Options should be mutually exclusive and cover the main possibilities.`;

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

    const systemPrompt = `You are a software architect creating a Product Requirements Document (PRD).
Based on the user's project description and their answers to clarifying questions, generate a structured PRD.

## PRD Structure
Return a JSON object with this exact structure:
{
  "summary": "Brief 1-2 sentence project summary",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short title",
      "description": "As a [user type], I want to [action] so that [benefit]",
      "acceptanceCriteria": ["Specific testable criterion 1", "Criterion 2"]
    }
  ],
  "functionalRequirements": [
    {
      "id": "FR-001",
      "description": "The system shall..."
    }
  ],
  "nonGoals": ["Things explicitly out of scope"]
}

## Guidelines
- Generate 4-8 user stories that cover the core functionality
- Each story should be small enough to complete in 1-2 days
- Acceptance criteria must be specific and testable
- Include 3-6 functional requirements
- List 2-4 non-goals to set clear boundaries`;

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
    const systemPrompt = `You are a software cost estimator for an AI-accelerated development agency.

## Pricing Rules
- Hourly rate: $150/hr (AI-accelerated development)
- Minimum project: $1,500

## Estimation Guidelines by Story Type
| Type | Hours | Notes |
|------|-------|-------|
| Simple CRUD screen | 2-4 | Basic forms, lists |
| Login/Auth | 4-6 | Email/password |
| Team/User management | 6-10 | Invites, roles |
| Mobile screen | 4-8 | React Native |
| Dashboard/Analytics | 8-12 | Charts, data viz |
| Real-time feature | 6-10 | Live updates |
| GPS/Location | 6-10 | Maps, tracking |
| Payment integration | 8-12 | Stripe |
| AI feature | 10-16 | LLM integration |
| File upload/storage | 3-5 | S3, processing |
| Data sync | 4-6 | Between platforms |
| Notifications | 4-6 | Push/email |
| Search | 4-8 | Depends on complexity |
| Export/Reports | 4-8 | PDF, CSV |

## User Type Multipliers
- "just-me": 0.8x (simpler requirements)
- "team": 1.0x (standard)
- "customers": 1.2x (needs polish, error handling)
- "everyone": 1.4x (most complex)

## Timeline Multipliers
- "exploring": 1.0x
- "soon": 1.0x
- "asap": 1.15x (rush premium)

## Output Format
Return JSON:
{
  "lineItems": [
    {
      "id": "US-001",
      "title": "Feature name",
      "hours": 6,
      "cost": 900,
      "confidence": "high"
    }
  ],
  "subtotal": 6150,
  "riskBuffer": 920,
  "riskPercent": 15,
  "total": { "min": 6150, "max": 7070 },
  "totalHours": 41,
  "confidence": "medium",
  "notes": ["Important assumptions or risks"]
}

confidence levels: "high" (well-defined), "medium" (some unknowns), "low" (needs discovery)
riskPercent: 10% for simple, 15% for medium, 20% for complex/AI`;

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
