import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Keyword patterns for rough pricing estimation
const KEYWORD_PATTERNS = {
  ai: {
    keywords: ["ai", "artificial intelligence", "ml", "machine learning", "generate", "predict", "recommend", "chatbot", "gpt", "claude", "llm"],
    minAdd: 2000,
    maxAdd: 4000,
  },
  payments: {
    keywords: ["pay", "payment", "subscribe", "subscription", "checkout", "billing", "stripe", "invoice", "recurring"],
    minAdd: 1000,
    maxAdd: 2000,
  },
  realtime: {
    keywords: ["chat", "live", "real-time", "realtime", "instant", "notifications", "push", "websocket"],
    minAdd: 1000,
    maxAdd: 2000,
  },
  mobile: {
    keywords: ["app", "mobile", "phone", "ios", "android", "gps", "location", "offline", "native"],
    minAdd: 1000,
    maxAdd: 3000,
  },
  marketplace: {
    keywords: ["marketplace", "buyers", "sellers", "listings", "booking", "reservations", "two-sided", "matching"],
    minAdd: 2000,
    maxAdd: 4000,
  },
  ecommerce: {
    keywords: ["ecommerce", "e-commerce", "shop", "store", "products", "cart", "orders"],
    minAdd: 1500,
    maxAdd: 3000,
  },
  auth: {
    keywords: ["login", "users", "accounts", "roles", "permissions", "admin", "team"],
    minAdd: 500,
    maxAdd: 1500,
  },
  data: {
    keywords: ["analytics", "reports", "dashboard", "metrics", "charts", "graphs", "insights"],
    minAdd: 500,
    maxAdd: 1500,
  },
};

// User type multipliers
const USER_TYPE_MULTIPLIERS: Record<string, { min: number; max: number }> = {
  "just-me": { min: 0.6, max: 0.7 },
  "team": { min: 0.9, max: 1.0 },
  "customers": { min: 1.2, max: 1.4 },
  "everyone": { min: 1.4, max: 1.6 },
};

// Timeline multipliers
const TIMELINE_MULTIPLIERS: Record<string, { min: number; max: number }> = {
  "exploring": { min: 0.9, max: 1.0 },
  "soon": { min: 1.0, max: 1.0 },
  "asap": { min: 1.1, max: 1.2 },
};

// Base price range
const BASE_MIN = 2000;
const BASE_MAX = 4000;

function detectKeywords(description: string): string[] {
  const lowerDesc = description.toLowerCase();
  const detected: string[] = [];

  for (const [category, config] of Object.entries(KEYWORD_PATTERNS)) {
    for (const keyword of config.keywords) {
      if (lowerDesc.includes(keyword)) {
        detected.push(category);
        break; // Only count each category once
      }
    }
  }

  return detected;
}

function calculateRoughRange(
  description: string,
  userType: string,
  timeline: string
): { min: number; max: number; keywords: string[] } {
  const keywords = detectKeywords(description);

  // Start with base
  let minPrice = BASE_MIN;
  let maxPrice = BASE_MAX;

  // Add keyword-based pricing
  for (const keyword of keywords) {
    const pattern = KEYWORD_PATTERNS[keyword as keyof typeof KEYWORD_PATTERNS];
    if (pattern) {
      minPrice += pattern.minAdd;
      maxPrice += pattern.maxAdd;
    }
  }

  // Apply user type multiplier
  const userMult = USER_TYPE_MULTIPLIERS[userType] || { min: 1, max: 1 };
  minPrice = Math.round(minPrice * userMult.min);
  maxPrice = Math.round(maxPrice * userMult.max);

  // Apply timeline multiplier
  const timeMult = TIMELINE_MULTIPLIERS[timeline] || { min: 1, max: 1 };
  minPrice = Math.round(minPrice * timeMult.min);
  maxPrice = Math.round(maxPrice * timeMult.max);

  // Round to nearest $500
  minPrice = Math.round(minPrice / 500) * 500;
  maxPrice = Math.round(maxPrice / 500) * 500;

  // Ensure reasonable minimum
  minPrice = Math.max(minPrice, 1500);
  maxPrice = Math.max(maxPrice, minPrice + 1000);

  return { min: minPrice, max: maxPrice, keywords };
}

// Submit a new project inquiry
export const submit = mutation({
  args: {
    description: v.string(),
    userType: v.union(
      v.literal("just-me"),
      v.literal("team"),
      v.literal("customers"),
      v.literal("everyone")
    ),
    timeline: v.union(
      v.literal("exploring"),
      v.literal("soon"),
      v.literal("asap")
    ),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Calculate rough pricing based on description
    const { min, max, keywords } = calculateRoughRange(
      args.description,
      args.userType,
      args.timeline
    );

    const inquiryId = await ctx.db.insert("projectInquiries", {
      description: args.description,
      userType: args.userType,
      timeline: args.timeline,
      email: args.email,
      name: args.name,
      roughMin: min,
      roughMax: max,
      keywords,
      status: "new",
      createdAt: Date.now(),
    });

    return {
      inquiryId,
      roughMin: min,
      roughMax: max,
      keywords,
    };
  },
});

// Get an inquiry by ID
export const get = query({
  args: {
    inquiryId: v.id("projectInquiries"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.inquiryId);
  },
});

// List all inquiries (for admin)
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("reviewed"),
        v.literal("quoted"),
        v.literal("converted")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("projectInquiries")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("projectInquiries")
      .order("desc")
      .collect();
  },
});

// Update inquiry status (for admin workflow)
export const updateStatus = mutation({
  args: {
    inquiryId: v.id("projectInquiries"),
    status: v.union(
      v.literal("new"),
      v.literal("reviewed"),
      v.literal("quoted"),
      v.literal("converted")
    ),
    reviewNotes: v.optional(v.string()),
    actualQuote: v.optional(v.number()),
    linkedEstimateId: v.optional(v.id("estimates")),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      status: args.status,
    };

    if (args.status !== "new") {
      updates.reviewedAt = Date.now();
    }

    if (args.reviewNotes !== undefined) {
      updates.reviewNotes = args.reviewNotes;
    }

    if (args.actualQuote !== undefined) {
      updates.actualQuote = args.actualQuote;
    }

    if (args.linkedEstimateId !== undefined) {
      updates.linkedEstimateId = args.linkedEstimateId;
    }

    await ctx.db.patch(args.inquiryId, updates);

    return { success: true };
  },
});

// ============================================
// AI-POWERED INQUIRY FLOW
// ============================================

// Question type for AI-generated questions
type AIQuestion = {
  id: number;
  question: string;
  options: { key: string; label: string; emoji?: string }[];
};

// Action to generate AI questions for a project description
export const getAIQuestions = action({
  args: {
    description: v.string(),
  },
  handler: async (ctx, args): Promise<
    | { success: true; questions: AIQuestion[]; usage: unknown }
    | { success: false; error: string; questions: null }
  > => {
    try {
      // Call the AI question generator
      const result = await ctx.runAction(api.ai.generateQuestions, {
        description: args.description,
      });

      return {
        success: true,
        questions: result.questions as AIQuestion[],
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to generate AI questions:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        questions: null,
      };
    }
  },
});

// Helper mutation to create inquiry with full AI data
export const createWithAI = mutation({
  args: {
    description: v.string(),
    userType: v.union(
      v.literal("just-me"),
      v.literal("team"),
      v.literal("customers"),
      v.literal("everyone")
    ),
    timeline: v.union(
      v.literal("exploring"),
      v.literal("soon"),
      v.literal("asap")
    ),
    email: v.string(),
    name: v.optional(v.string()),
    // AI data
    generatedQuestions: v.array(
      v.object({
        id: v.number(),
        question: v.string(),
        options: v.array(
          v.object({
            key: v.string(),
            label: v.string(),
            emoji: v.optional(v.string()),
          })
        ),
      })
    ),
    answers: v.string(),
    prd: v.object({
      summary: v.string(),
      userStories: v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          description: v.string(),
          acceptanceCriteria: v.array(v.string()),
        })
      ),
      functionalRequirements: v.array(
        v.object({
          id: v.string(),
          description: v.string(),
        })
      ),
      nonGoals: v.array(v.string()),
    }),
    estimate: v.object({
      lineItems: v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          hours: v.number(),
          cost: v.number(),
          confidence: v.string(),
        })
      ),
      subtotal: v.number(),
      riskBuffer: v.number(),
      riskPercent: v.number(),
      total: v.object({
        min: v.number(),
        max: v.number(),
      }),
      totalHours: v.number(),
      confidence: v.string(),
      notes: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Also calculate rough estimate as fallback/comparison
    const { min, max, keywords } = calculateRoughRange(
      args.description,
      args.userType,
      args.timeline
    );

    const inquiryId = await ctx.db.insert("projectInquiries", {
      description: args.description,
      userType: args.userType,
      timeline: args.timeline,
      email: args.email,
      name: args.name,
      // AI-generated data
      generatedQuestions: args.generatedQuestions,
      answers: args.answers,
      prd: args.prd,
      lineItems: args.estimate.lineItems,
      estimateMin: args.estimate.total.min,
      estimateMax: args.estimate.total.max,
      estimateSubtotal: args.estimate.subtotal,
      estimateRiskBuffer: args.estimate.riskBuffer,
      estimateRiskPercent: args.estimate.riskPercent,
      estimateTotalHours: args.estimate.totalHours,
      estimateConfidence: args.estimate.confidence,
      estimateNotes: args.estimate.notes,
      // Fallback rough estimate
      roughMin: min,
      roughMax: max,
      keywords,
      usedAI: true,
      status: "new",
      createdAt: Date.now(),
    });

    return {
      inquiryId,
      estimateMin: args.estimate.total.min,
      estimateMax: args.estimate.total.max,
      lineItems: args.estimate.lineItems,
      prd: args.prd,
      confidence: args.estimate.confidence,
      notes: args.estimate.notes,
    };
  },
});

// PRD and Estimate types
type PRDType = {
  summary: string;
  userStories: {
    id: string;
    title: string;
    description: string;
    acceptanceCriteria: string[];
  }[];
  functionalRequirements: { id: string; description: string }[];
  nonGoals: string[];
};

type EstimateType = {
  lineItems: {
    id: string;
    title: string;
    hours: number;
    cost: number;
    confidence: string;
  }[];
  subtotal: number;
  riskBuffer: number;
  riskPercent: number;
  total: { min: number; max: number };
  totalHours: number;
  confidence: string;
  notes: string[];
};

// Action that orchestrates the full AI flow: PRD generation + estimation
export const generatePRDAndEstimate = action({
  args: {
    description: v.string(),
    answers: v.string(),
    questions: v.array(
      v.object({
        id: v.number(),
        question: v.string(),
        options: v.array(
          v.object({
            key: v.string(),
            label: v.string(),
            emoji: v.optional(v.string()),
          })
        ),
      })
    ),
    userType: v.string(),
    timeline: v.string(),
  },
  handler: async (ctx, args): Promise<
    | { success: true; prd: PRDType; estimate: EstimateType; usage: unknown }
    | { success: false; error: string; prd: null; estimate: null }
  > => {
    try {
      // Step 1: Generate PRD from description + answers
      const prdResult = await ctx.runAction(api.ai.generatePRD, {
        description: args.description,
        answers: args.answers,
        questions: args.questions,
      });

      // Step 2: Generate estimate from PRD
      const estimateResult = await ctx.runAction(api.ai.estimateFromPRD, {
        prd: prdResult.prd,
        userType: args.userType,
        timeline: args.timeline,
      });

      return {
        success: true,
        prd: prdResult.prd as PRDType,
        estimate: estimateResult.estimate as EstimateType,
        usage: {
          prd: prdResult.usage,
          estimate: estimateResult.usage,
        },
      };
    } catch (error) {
      console.error("Failed to generate PRD and estimate:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        prd: null,
        estimate: null,
      };
    }
  },
});

// Fallback submit (uses keyword-based estimation when AI fails)
export const submitFallback = mutation({
  args: {
    description: v.string(),
    userType: v.union(
      v.literal("just-me"),
      v.literal("team"),
      v.literal("customers"),
      v.literal("everyone")
    ),
    timeline: v.union(
      v.literal("exploring"),
      v.literal("soon"),
      v.literal("asap")
    ),
    email: v.string(),
    name: v.optional(v.string()),
    aiError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Calculate rough pricing based on description
    const { min, max, keywords } = calculateRoughRange(
      args.description,
      args.userType,
      args.timeline
    );

    const inquiryId = await ctx.db.insert("projectInquiries", {
      description: args.description,
      userType: args.userType,
      timeline: args.timeline,
      email: args.email,
      name: args.name,
      roughMin: min,
      roughMax: max,
      keywords,
      usedAI: false,
      aiError: args.aiError,
      status: "new",
      createdAt: Date.now(),
    });

    return {
      inquiryId,
      roughMin: min,
      roughMax: max,
      keywords,
      usedAI: false,
    };
  },
});

// ============================================
// V2 AI-POWERED INQUIRY FLOW (Claude Code-style)
// ============================================

// V2 Question type (Claude Code-style)
type AIQuestionV2 = {
  question: string;
  header: string;
  options: { label: string; description: string }[];
  multiSelect: boolean;
};

// Helper to extract userType and timeline from AI question answers
function extractScopeAndTimeline(
  questions: AIQuestionV2[],
  answers: string
): { userType: string; timeline: string } {
  // Parse V2 answers - format: "Header=Option label, Header2=Option A"
  const answerMap = new Map<string, string>();
  answers.split(/,\s*(?=[A-Z])/).forEach(part => {
    const eqIndex = part.indexOf("=");
    if (eqIndex > 0) {
      const header = part.substring(0, eqIndex).trim();
      const value = part.substring(eqIndex + 1).trim();
      answerMap.set(header.toLowerCase(), value.toLowerCase());
    }
  });

  // Combine all answer text for pattern matching
  const allAnswerText = Array.from(answerMap.values()).join(" ");

  // User type patterns
  const userTypePatterns: Record<string, string[]> = {
    "just-me": ["just me", "only me", "myself", "personal use", "personal project"],
    "team": ["my team", "our team", "small team", "internal team", "coworkers", "colleagues"],
    "customers": ["my customers", "our customers", "clients", "paying users", "subscribers"],
    "everyone": ["everyone", "public", "anyone", "general public", "open to all"],
  };

  // Timeline patterns
  const timelinePatterns: Record<string, string[]> = {
    "exploring": ["exploring", "just exploring", "thinking about", "no rush", "someday", "eventually"],
    "soon": ["2-3 months", "within 2-3 months", "next quarter", "few months", "soon"],
    "asap": ["asap", "as soon as possible", "immediately", "urgent", "right away", "this month"],
  };

  // Find userType
  let userType = "team"; // default
  for (const [type, patterns] of Object.entries(userTypePatterns)) {
    for (const pattern of patterns) {
      if (allAnswerText.includes(pattern)) {
        userType = type;
        break;
      }
    }
  }

  // Find timeline
  let timeline = "soon"; // default
  for (const [time, patterns] of Object.entries(timelinePatterns)) {
    for (const pattern of patterns) {
      if (allAnswerText.includes(pattern)) {
        timeline = time;
        break;
      }
    }
  }

  // Check if questions explicitly ask about users/timeline
  for (const q of questions) {
    const header = q.header.toLowerCase();
    const question = q.question.toLowerCase();
    const answer = answerMap.get(header) || "";

    // User type question
    if (
      header.includes("user") ||
      header.includes("who") ||
      header.includes("audience") ||
      question.includes("who will use") ||
      question.includes("who is this for")
    ) {
      for (const [type, patterns] of Object.entries(userTypePatterns)) {
        for (const pattern of patterns) {
          if (answer.includes(pattern)) {
            userType = type;
          }
        }
      }
    }

    // Timeline question
    if (
      header.includes("time") ||
      header.includes("when") ||
      header.includes("urgency") ||
      question.includes("when do you need") ||
      question.includes("timeline")
    ) {
      for (const [time, patterns] of Object.entries(timelinePatterns)) {
        for (const pattern of patterns) {
          if (answer.includes(pattern)) {
            timeline = time;
          }
        }
      }
    }
  }

  return { userType, timeline };
}

// Action to generate V2 AI questions for a project description
export const getAIQuestionsV2 = action({
  args: {
    description: v.string(),
  },
  handler: async (ctx, args): Promise<
    | { success: true; questions: AIQuestionV2[]; usage: unknown }
    | { success: false; error: string; questions: null }
  > => {
    try {
      const result = await ctx.runAction(api.ai.generateQuestionsV2, {
        description: args.description,
      });

      return {
        success: true,
        questions: result.questions as AIQuestionV2[],
        usage: result.usage,
      };
    } catch (error) {
      console.error("Failed to generate AI questions V2:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        questions: null,
      };
    }
  },
});

// V2 result types for orchestration
type GeneratePRDAndEstimateV2Result =
  | {
      success: true;
      stage: "review";
      initialPRD: PRDType;
      reviewerQuestions: AIQuestionV2[];
      gaps: string[];
      recommendations: string[];
      extractedUserType: string;
      extractedTimeline: string;
      prd: null;
      estimate: null;
      usage: { review: unknown };
    }
  | {
      success: true;
      stage: "complete";
      prd: PRDType;
      estimate: EstimateType;
      initialPRD: PRDType;
      enhancedPRD: PRDType | null;
      extractedUserType: string;
      extractedTimeline: string;
      reviewerQuestions: null;
      gaps: null;
      recommendations: null;
      usage: { estimate: unknown };
    }
  | {
      success: false;
      stage: "error";
      error: string;
      prd: null;
      estimate: null;
      initialPRD: null;
      enhancedPRD: null;
      extractedUserType: string;
      extractedTimeline: string;
      reviewerQuestions: null;
      gaps: null;
      recommendations: null;
      usage: null;
    };

// V2 orchestration: Two-stage PRD generation with review
export const generatePRDAndEstimateV2 = action({
  args: {
    description: v.string(),
    answers: v.string(),
    questions: v.array(
      v.object({
        question: v.string(),
        header: v.string(),
        options: v.array(
          v.object({
            label: v.string(),
            description: v.string(),
          })
        ),
        multiSelect: v.boolean(),
      })
    ),
    // Optional: for resuming from review stage
    initialPRD: v.optional(
      v.object({
        summary: v.string(),
        userStories: v.array(
          v.object({
            id: v.string(),
            title: v.string(),
            description: v.string(),
            acceptanceCriteria: v.array(v.string()),
          })
        ),
        functionalRequirements: v.array(
          v.object({
            id: v.string(),
            description: v.string(),
          })
        ),
        nonGoals: v.array(v.string()),
      })
    ),
    reviewerAnswers: v.optional(v.string()), // "Header=Option" or "SKIPPED"
    reviewerQuestions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          header: v.string(),
          options: v.array(
            v.object({
              label: v.string(),
              description: v.string(),
            })
          ),
          multiSelect: v.boolean(),
        })
      )
    ),
    gaps: v.optional(v.array(v.string())),
    recommendations: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<GeneratePRDAndEstimateV2Result> => {
    // Extract userType and timeline from AI answers
    const { userType, timeline } = extractScopeAndTimeline(
      args.questions,
      args.answers
    );

    try {
      // Stage 1: Generate initial PRD if not provided
      let prd = args.initialPRD;
      if (!prd) {
        const prdResult = await ctx.runAction(api.ai.generatePRDV2, {
          description: args.description,
          answers: args.answers,
          questions: args.questions,
        });
        prd = prdResult.prd as PRDType;
      }

      // Stage 2: If no reviewer answers yet, get review questions
      if (args.reviewerAnswers === undefined) {
        const reviewResult = await ctx.runAction(api.ai.reviewPRD, {
          prd,
          originalDescription: args.description,
          previousAnswers: args.answers,
        });

        // Return early with review stage data
        return {
          success: true,
          stage: "review" as const,
          initialPRD: prd,
          reviewerQuestions: reviewResult.questions,
          gaps: reviewResult.gaps,
          recommendations: reviewResult.recommendations,
          extractedUserType: userType,
          extractedTimeline: timeline,
          prd: null,
          estimate: null,
          usage: { review: reviewResult.usage },
        };
      }

      // Stage 3: Enhance PRD with review answers
      let finalPRD = prd;
      if (
        args.reviewerAnswers !== "SKIPPED" &&
        args.reviewerQuestions &&
        args.gaps &&
        args.recommendations
      ) {
        const enhanceResult = await ctx.runAction(api.ai.enhancePRD, {
          originalPRD: prd,
          gaps: args.gaps,
          reviewerQuestions: args.reviewerQuestions,
          userAnswers: args.reviewerAnswers,
          recommendations: args.recommendations,
        });
        if (enhanceResult.enhanced) {
          finalPRD = enhanceResult.prd as PRDType;
        }
      }

      // Stage 4: Generate estimate from final PRD
      const estimateResult = await ctx.runAction(api.ai.estimateFromPRD, {
        prd: finalPRD,
        userType,
        timeline,
      });

      return {
        success: true,
        stage: "complete" as const,
        prd: finalPRD,
        estimate: estimateResult.estimate as EstimateType,
        initialPRD: args.initialPRD ?? prd,
        enhancedPRD: args.reviewerAnswers !== "SKIPPED" ? finalPRD : null,
        extractedUserType: userType,
        extractedTimeline: timeline,
        reviewerQuestions: null,
        gaps: null,
        recommendations: null,
        usage: { estimate: estimateResult.usage },
      };
    } catch (error) {
      console.error("Failed to generate PRD and estimate V2:", error);
      return {
        success: false,
        stage: "error" as const,
        error: error instanceof Error ? error.message : "Unknown error",
        prd: null,
        estimate: null,
        initialPRD: null,
        enhancedPRD: null,
        extractedUserType: userType,
        extractedTimeline: timeline,
        reviewerQuestions: null,
        gaps: null,
        recommendations: null,
        usage: null,
      };
    }
  },
});

// V2 mutation to create inquiry with full AI data (two-stage)
export const createWithAIV2 = mutation({
  args: {
    description: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    // V2 questions
    generatedQuestions: v.array(
      v.object({
        question: v.string(),
        header: v.string(),
        options: v.array(
          v.object({
            label: v.string(),
            description: v.string(),
          })
        ),
        multiSelect: v.boolean(),
      })
    ),
    answers: v.string(),
    // Two-stage PRD
    initialPRD: v.object({
      summary: v.string(),
      userStories: v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          description: v.string(),
          acceptanceCriteria: v.array(v.string()),
        })
      ),
      functionalRequirements: v.array(
        v.object({
          id: v.string(),
          description: v.string(),
        })
      ),
      nonGoals: v.array(v.string()),
    }),
    reviewerQuestions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          header: v.string(),
          options: v.array(
            v.object({
              label: v.string(),
              description: v.string(),
            })
          ),
          multiSelect: v.boolean(),
        })
      )
    ),
    reviewerAnswers: v.optional(v.string()),
    reviewerGaps: v.optional(v.array(v.string())),
    reviewerRecommendations: v.optional(v.array(v.string())),
    enhancedPRD: v.optional(
      v.object({
        summary: v.string(),
        userStories: v.array(
          v.object({
            id: v.string(),
            title: v.string(),
            description: v.string(),
            acceptanceCriteria: v.array(v.string()),
          })
        ),
        functionalRequirements: v.array(
          v.object({
            id: v.string(),
            description: v.string(),
          })
        ),
        nonGoals: v.array(v.string()),
      })
    ),
    // Estimate
    estimate: v.object({
      lineItems: v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          hours: v.number(),
          cost: v.number(),
          confidence: v.string(),
        })
      ),
      subtotal: v.number(),
      riskBuffer: v.number(),
      riskPercent: v.number(),
      total: v.object({
        min: v.number(),
        max: v.number(),
      }),
      totalHours: v.number(),
      confidence: v.string(),
      notes: v.array(v.string()),
    }),
    // Extracted from answers
    extractedUserType: v.string(),
    extractedTimeline: v.string(),
  },
  handler: async (ctx, args) => {
    // Calculate rough estimate for fallback/comparison
    const { min, max, keywords } = calculateRoughRange(
      args.description,
      args.extractedUserType,
      args.extractedTimeline
    );

    // Use enhanced PRD if available, otherwise initial
    const finalPRD = args.enhancedPRD ?? args.initialPRD;

    const inquiryId = await ctx.db.insert("projectInquiries", {
      description: args.description,
      userType: args.extractedUserType as "just-me" | "team" | "customers" | "everyone",
      timeline: args.extractedTimeline as "exploring" | "soon" | "asap",
      email: args.email,
      name: args.name,
      // V2 questions
      generatedQuestionsV2: args.generatedQuestions,
      answers: args.answers,
      // Two-stage PRD
      initialPRD: args.initialPRD,
      reviewerQuestions: args.reviewerQuestions,
      reviewerAnswers: args.reviewerAnswers,
      reviewerGaps: args.reviewerGaps,
      reviewerRecommendations: args.reviewerRecommendations,
      enhancedPRD: args.enhancedPRD,
      prd: finalPRD,
      stage: args.enhancedPRD ? "enhanced" : "initial-prd",
      // Estimate
      lineItems: args.estimate.lineItems,
      estimateMin: args.estimate.total.min,
      estimateMax: args.estimate.total.max,
      estimateSubtotal: args.estimate.subtotal,
      estimateRiskBuffer: args.estimate.riskBuffer,
      estimateRiskPercent: args.estimate.riskPercent,
      estimateTotalHours: args.estimate.totalHours,
      estimateConfidence: args.estimate.confidence,
      estimateNotes: args.estimate.notes,
      // Fallback
      roughMin: min,
      roughMax: max,
      keywords,
      usedAI: true,
      status: "new",
      createdAt: Date.now(),
    });

    return {
      inquiryId,
      estimateMin: args.estimate.total.min,
      estimateMax: args.estimate.total.max,
      lineItems: args.estimate.lineItems,
      prd: finalPRD,
      confidence: args.estimate.confidence,
      notes: args.estimate.notes,
    };
  },
});

// V2 fallback submit (when AI fails)
export const submitFallbackV2 = mutation({
  args: {
    description: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    // V2 questions (if we got that far)
    generatedQuestions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          header: v.string(),
          options: v.array(
            v.object({
              label: v.string(),
              description: v.string(),
            })
          ),
          multiSelect: v.boolean(),
        })
      )
    ),
    answers: v.optional(v.string()),
    aiError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Extract userType/timeline from answers if available
    let userType = "team";
    let timeline = "soon";

    if (args.generatedQuestions && args.answers) {
      const extracted = extractScopeAndTimeline(
        args.generatedQuestions,
        args.answers
      );
      userType = extracted.userType;
      timeline = extracted.timeline;
    }

    // Calculate rough pricing
    const { min, max, keywords } = calculateRoughRange(
      args.description,
      userType,
      timeline
    );

    const inquiryId = await ctx.db.insert("projectInquiries", {
      description: args.description,
      userType: userType as "just-me" | "team" | "customers" | "everyone",
      timeline: timeline as "exploring" | "soon" | "asap",
      email: args.email,
      name: args.name,
      generatedQuestionsV2: args.generatedQuestions,
      answers: args.answers,
      roughMin: min,
      roughMax: max,
      keywords,
      usedAI: false,
      aiError: args.aiError,
      stage: "questions",
      status: "new",
      createdAt: Date.now(),
    });

    return {
      inquiryId,
      roughMin: min,
      roughMax: max,
      keywords,
      usedAI: false,
    };
  },
});
