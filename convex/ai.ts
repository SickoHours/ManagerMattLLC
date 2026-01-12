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

      // Normalize user stories - AI sometimes returns "criteria" instead of "acceptanceCriteria"
      const normalizedPRD = {
        ...parsed,
        userStories: parsed.userStories.map((story: Record<string, unknown>) => ({
          id: story.id,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptanceCriteria || story.criteria || [],
        })),
      };

      return {
        prd: normalizedPRD,
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

// ============================================
// V2 ACTIONS - Claude Code-style questioning
// ============================================

// Generate Claude Code-style clarifying questions
export const generateQuestionsV2 = action({
  args: {
    description: v.string(),
  },
  handler: async (_, args) => {
    const systemPrompt = `You ask clarifying questions like Claude Code - only when there are genuinely multiple valid approaches with different trade-offs.

## Question Design Principles
1. ASK ABOUT DECISIONS, NOT DEFINITIONS
   - Bad: "Do you need user accounts?"
   - Good: "How will people access your app?"

2. OPTIONS REVEAL TRADE-OFFS
   - Each description explains what you gain AND what you give up
   - Example: { "label": "Mobile app", "description": "Best experience but requires app store approval and longer development" }

3. HEADERS ARE SCANNABLE
   - Max 12 characters
   - Examples: "Platform", "Auth", "Scale", "Data", "Users", "Timeline"

4. 2-4 OPTIONS MAXIMUM
   - Cover the realistic spectrum
   - Don't list every edge case

5. MULTI-SELECT WHEN APPROPRIATE
   - Use multiSelect: true when options aren't mutually exclusive

## When NOT to Ask
- If the answer is implied by context
- If it's a technical decision users don't care about
- If all options lead to similar outcomes

## MUST Include (if not obvious from description)
- WHO will use this (scope: just me, my team, my customers, everyone)
- WHEN they need it (timeline: just exploring, within 2-3 months, ASAP)
These replace the old fixed userType/timeline questions - generate them as natural questions.

## Output Format
Return JSON with 3-5 focused questions (including scope/timeline if needed):
{
  "questions": [
    {
      "question": "Full question that makes sense standalone",
      "header": "ShortLabel",
      "options": [
        { "label": "Option A", "description": "What this means for your project" },
        { "label": "Option B", "description": "Alternative approach and trade-offs" }
      ],
      "multiSelect": false
    }
  ]
}

NO emojis. NO technical jargon. Simple business language only.`;

    const userPrompt = `A user wants to build this:

"${args.description}"

Generate 3-5 focused, non-technical clarifying questions to understand their project.
Each question should help scope the work with clear trade-offs in each option.

IMPORTANT: Include questions about:
- Who will use this (if not clear from description)
- When they need it (if not mentioned)

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

      const parsed = JSON.parse(result.content);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid response format: missing questions array");
      }

      // Validate question format
      for (const q of parsed.questions) {
        if (!q.question || !q.header || !q.options || !Array.isArray(q.options)) {
          throw new Error("Invalid question format");
        }
        if (q.header.length > 12) {
          q.header = q.header.substring(0, 12);
        }
        for (const opt of q.options) {
          if (!opt.label || !opt.description) {
            throw new Error("Invalid option format: missing label or description");
          }
        }
        if (q.multiSelect === undefined) {
          q.multiSelect = false;
        }
      }

      return {
        questions: parsed.questions,
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to generate questions V2:", error);
      throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Generate PRD from description and V2 answers
export const generatePRDV2 = action({
  args: {
    description: v.string(),
    answers: v.string(), // Format: "Header=Selected option, Header2=Option A"
    questions: v.array(v.object({
      question: v.string(),
      header: v.string(),
      options: v.array(v.object({
        label: v.string(),
        description: v.string(),
      })),
      multiSelect: v.boolean(),
    })),
  },
  handler: async (_, args) => {
    // Parse V2 answers - format: "Header=Option label, Header2=Option A, Option B"
    const answerMap = new Map<string, string[]>();
    args.answers.split(/,\s*(?=[A-Z])/).forEach(part => {
      const [header, ...values] = part.split("=");
      if (header && values.length > 0) {
        const answers = values.join("=").split(/,\s*/).map(v => v.trim());
        answerMap.set(header.trim(), answers);
      }
    });

    // Build context from Q&A
    const qaContext = args.questions.map(q => {
      const selectedAnswers = answerMap.get(q.header) || [];
      const answersText = selectedAnswers.length > 0
        ? selectedAnswers.join(", ")
        : "Not answered";
      return `Q: ${q.question}\nA: ${answersText}`;
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
          temperature: 0.5,
          responseFormat: { type: "json_object" },
        }
      );

      const parsed = JSON.parse(result.content);

      if (!parsed.userStories || !Array.isArray(parsed.userStories)) {
        throw new Error("Invalid PRD format: missing userStories");
      }

      // Normalize user stories - AI sometimes returns "criteria" instead of "acceptanceCriteria"
      const normalizedPRD = {
        ...parsed,
        userStories: parsed.userStories.map((story: Record<string, unknown>) => ({
          id: story.id,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptanceCriteria || story.criteria || [],
        })),
      };

      return {
        prd: normalizedPRD,
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to generate PRD V2:", error);
      throw new Error(`Failed to generate PRD: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Review PRD and generate follow-up questions
export const reviewPRD = action({
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
    originalDescription: v.string(),
    previousAnswers: v.string(),
  },
  handler: async (_, args) => {
    const systemPrompt = `You are a senior engineer reviewing a PRD before estimation.

## Your Goal
Identify 2-3 critical gaps or ambiguities that would significantly affect the estimate.

## What to Look For
1. VAGUE REQUIREMENTS - "user-friendly" or "fast" without specifics
2. MISSING EDGE CASES - error handling, empty states, permissions
3. INTEGRATION RISKS - third-party services, data migration, APIs
4. SCOPE CREEP SIGNALS - features that could balloon in complexity

## Question Format (same as before)
Each question should have:
- question: Full question text
- header: Short label (max 12 chars)
- options: Array of { label, description } (2-4 options)
- multiSelect: boolean

## Output Format
Return JSON:
{
  "gaps": ["Gap 1 description", "Gap 2 description"],
  "questions": [
    {
      "question": "Clarifying question about the gap",
      "header": "ShortLabel",
      "options": [
        { "label": "Option", "description": "What this means" }
      ],
      "multiSelect": false
    }
  ],
  "recommendations": ["Suggestion 1", "Suggestion 2"]
}

IMPORTANT: Maximum 3 questions. Focus on HIGH-SIGNAL gaps only.
Questions should be simple, non-technical, and help clarify scope.`;

    const prdSummary = `
Summary: ${args.prd.summary}

User Stories:
${args.prd.userStories.map(s => `- ${s.id}: ${s.title}\n  ${s.description}\n  Criteria: ${s.acceptanceCriteria.join("; ")}`).join("\n")}

Functional Requirements:
${args.prd.functionalRequirements.map(r => `- ${r.id}: ${r.description}`).join("\n")}

Non-Goals:
${args.prd.nonGoals.map(n => `- ${n}`).join("\n")}`;

    const userPrompt = `Review this PRD and identify gaps that need clarification:

Original Request: "${args.originalDescription}"

Previous Answers: ${args.previousAnswers}

PRD:
${prdSummary}

Identify 2-3 gaps and generate 1-3 clarifying questions. Return ONLY valid JSON.`;

    try {
      const result = await callOpenRouter(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        {
          temperature: 0.6,
          responseFormat: { type: "json_object" },
        }
      );

      const parsed = JSON.parse(result.content);

      if (!parsed.gaps || !Array.isArray(parsed.gaps)) {
        parsed.gaps = [];
      }
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        parsed.questions = [];
      }
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        parsed.recommendations = [];
      }

      // Validate and fix question format
      for (const q of parsed.questions) {
        if (q.header && q.header.length > 12) {
          q.header = q.header.substring(0, 12);
        }
        if (q.multiSelect === undefined) {
          q.multiSelect = false;
        }
      }

      return {
        gaps: parsed.gaps,
        questions: parsed.questions,
        recommendations: parsed.recommendations,
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to review PRD:", error);
      throw new Error(`Failed to review PRD: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});

// Enhance PRD based on review feedback and user answers
export const enhancePRD = action({
  args: {
    originalPRD: v.object({
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
    gaps: v.array(v.string()),
    reviewerQuestions: v.array(v.object({
      question: v.string(),
      header: v.string(),
      options: v.array(v.object({
        label: v.string(),
        description: v.string(),
      })),
      multiSelect: v.boolean(),
    })),
    userAnswers: v.string(), // "Header=Option, Header2=Option" or "SKIPPED"
    recommendations: v.array(v.string()),
  },
  handler: async (_, args) => {
    // If user skipped, return original PRD
    if (args.userAnswers === "SKIPPED") {
      return {
        prd: args.originalPRD,
        usage: undefined,
        enhanced: false,
      };
    }

    // Parse answers
    const answerMap = new Map<string, string[]>();
    args.userAnswers.split(/,\s*(?=[A-Z])/).forEach(part => {
      const [header, ...values] = part.split("=");
      if (header && values.length > 0) {
        const answers = values.join("=").split(/,\s*/).map(v => v.trim());
        answerMap.set(header.trim(), answers);
      }
    });

    const qaContext = args.reviewerQuestions.map(q => {
      const selectedAnswers = answerMap.get(q.header) || [];
      return `Q: ${q.question}\nA: ${selectedAnswers.length > 0 ? selectedAnswers.join(", ") : "Not answered"}`;
    }).join("\n\n");

    const systemPrompt = `You are enhancing a PRD based on review feedback and user clarifications.

## Your Task
1. Take the original PRD
2. Address the identified gaps using the user's answers
3. Incorporate the recommendations where appropriate
4. Return an enhanced PRD with the same structure but improved detail

## Guidelines
- Add specificity to vague requirements
- Include edge cases that were missing
- Clarify integration requirements
- DO NOT add features the user didn't ask for
- Keep the same PRD structure (summary, userStories, functionalRequirements, nonGoals)
- User story IDs should continue from the original (if last was US-006, start new ones at US-007)

Return ONLY valid JSON with the enhanced PRD.`;

    const originalPRDText = `
Summary: ${args.originalPRD.summary}

User Stories:
${args.originalPRD.userStories.map(s => `- ${s.id}: ${s.title}\n  ${s.description}\n  Criteria: ${s.acceptanceCriteria.join("; ")}`).join("\n")}

Functional Requirements:
${args.originalPRD.functionalRequirements.map(r => `- ${r.id}: ${r.description}`).join("\n")}

Non-Goals:
${args.originalPRD.nonGoals.map(n => `- ${n}`).join("\n")}`;

    const userPrompt = `Enhance this PRD:

Original PRD:
${originalPRDText}

Identified Gaps:
${args.gaps.map(g => `- ${g}`).join("\n")}

User Clarifications:
${qaContext}

Recommendations to Consider:
${args.recommendations.map(r => `- ${r}`).join("\n")}

Return an enhanced PRD as JSON with the same structure: {"summary":"...","userStories":[...],"functionalRequirements":[...],"nonGoals":[...]}`;

    try {
      const result = await callOpenRouter(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        {
          temperature: 0.5,
          responseFormat: { type: "json_object" },
        }
      );

      const parsed = JSON.parse(result.content);

      if (!parsed.userStories || !Array.isArray(parsed.userStories)) {
        throw new Error("Invalid enhanced PRD format: missing userStories");
      }

      // Normalize user stories - AI sometimes returns "criteria" instead of "acceptanceCriteria"
      const normalizedPRD = {
        ...parsed,
        userStories: parsed.userStories.map((story: Record<string, unknown>) => ({
          id: story.id,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptanceCriteria || story.criteria || [],
        })),
      };

      return {
        prd: normalizedPRD,
        usage: result.usage,
        enhanced: true,
      };
    } catch (error) {
      console.error("Failed to enhance PRD:", error);
      throw new Error(`Failed to enhance PRD: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});
