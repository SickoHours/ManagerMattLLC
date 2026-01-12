import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// List all playground tests (most recent first)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db.query("playgroundTests").order("desc").take(50);
    return tests;
  },
});

// Get a single playground test by ID
export const get = query({
  args: { id: v.id("playgroundTests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new playground test (starts with just description)
export const create = mutation({
  args: {
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("playgroundTests", {
      description: args.description,
      stage: "questions",
      createdAt: Date.now(),
    });
    return id;
  },
});

// Update test with questions
export const updateWithQuestions = mutation({
  args: {
    id: v.id("playgroundTests"),
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
    debugInfo: v.optional(
      v.object({
        tokensIn: v.number(),
        tokensOut: v.number(),
        durationMs: v.number(),
        rawResponse: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Test not found");

    await ctx.db.patch(args.id, {
      generatedQuestions: args.questions,
      debugInfo: args.debugInfo
        ? { questionsCall: args.debugInfo }
        : existing.debugInfo,
    });
  },
});

// Update test with answers
export const updateWithAnswers = mutation({
  args: {
    id: v.id("playgroundTests"),
    answers: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      answers: args.answers,
      stage: "initial-prd",
    });
  },
});

// Update test with initial PRD
export const updateWithInitialPRD = mutation({
  args: {
    id: v.id("playgroundTests"),
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
    debugInfo: v.optional(
      v.object({
        tokensIn: v.number(),
        tokensOut: v.number(),
        durationMs: v.number(),
        rawResponse: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Test not found");

    await ctx.db.patch(args.id, {
      initialPRD: args.initialPRD,
      stage: "review",
      debugInfo: args.debugInfo
        ? { ...existing.debugInfo, prdCall: args.debugInfo }
        : existing.debugInfo,
    });
  },
});

// Update test with review data
export const updateWithReview = mutation({
  args: {
    id: v.id("playgroundTests"),
    gaps: v.array(v.string()),
    recommendations: v.array(v.string()),
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
    debugInfo: v.optional(
      v.object({
        tokensIn: v.number(),
        tokensOut: v.number(),
        durationMs: v.number(),
        rawResponse: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Test not found");

    await ctx.db.patch(args.id, {
      reviewerGaps: args.gaps,
      reviewerRecommendations: args.recommendations,
      reviewerQuestions: args.questions,
      debugInfo: args.debugInfo
        ? { ...existing.debugInfo, reviewCall: args.debugInfo }
        : existing.debugInfo,
    });
  },
});

// Update test with reviewer answers (or "SKIPPED")
export const updateWithReviewerAnswers = mutation({
  args: {
    id: v.id("playgroundTests"),
    answers: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      reviewerAnswers: args.answers,
      stage: "enhanced",
    });
  },
});

// Update test with enhanced PRD
export const updateWithEnhancedPRD = mutation({
  args: {
    id: v.id("playgroundTests"),
    enhancedPRD: v.object({
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
    debugInfo: v.optional(
      v.object({
        tokensIn: v.number(),
        tokensOut: v.number(),
        durationMs: v.number(),
        rawResponse: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Test not found");

    await ctx.db.patch(args.id, {
      enhancedPRD: args.enhancedPRD,
      debugInfo: args.debugInfo
        ? { ...existing.debugInfo, enhanceCall: args.debugInfo }
        : existing.debugInfo,
    });
  },
});

// Update test with final estimate
export const updateWithEstimate = mutation({
  args: {
    id: v.id("playgroundTests"),
    lineItems: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        hours: v.number(),
        cost: v.number(),
        confidence: v.string(),
      })
    ),
    estimateMin: v.number(),
    estimateMax: v.number(),
    estimateSubtotal: v.number(),
    estimateRiskBuffer: v.number(),
    estimateRiskPercent: v.number(),
    estimateTotalHours: v.number(),
    estimateConfidence: v.string(),
    debugInfo: v.optional(
      v.object({
        tokensIn: v.number(),
        tokensOut: v.number(),
        durationMs: v.number(),
        rawResponse: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Test not found");

    // Calculate total cost from all debug calls
    const debugInfo = existing.debugInfo || {};
    const estimateDebug = args.debugInfo
      ? { estimateCall: args.debugInfo }
      : {};
    const allDebug = { ...debugInfo, ...estimateDebug };

    // Calculate approximate cost (Gemini 2.5 Flash pricing)
    const COST_PER_1K_IN = 0.00015; // $0.15 per 1M input tokens
    const COST_PER_1K_OUT = 0.0006; // $0.60 per 1M output tokens
    let totalCost = 0;
    for (const call of Object.values(allDebug) as Array<{
      tokensIn?: number;
      tokensOut?: number;
    }>) {
      if (call && typeof call === "object" && "tokensIn" in call) {
        totalCost +=
          ((call.tokensIn || 0) / 1000) * COST_PER_1K_IN +
          ((call.tokensOut || 0) / 1000) * COST_PER_1K_OUT;
      }
    }

    await ctx.db.patch(args.id, {
      lineItems: args.lineItems,
      estimateMin: args.estimateMin,
      estimateMax: args.estimateMax,
      estimateSubtotal: args.estimateSubtotal,
      estimateRiskBuffer: args.estimateRiskBuffer,
      estimateRiskPercent: args.estimateRiskPercent,
      estimateTotalHours: args.estimateTotalHours,
      estimateConfidence: args.estimateConfidence,
      stage: "estimated",
      completedAt: Date.now(),
      debugInfo: { ...allDebug, totalCost },
    });
  },
});

// Mark test as error
export const markError = mutation({
  args: {
    id: v.id("playgroundTests"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      stage: "error",
      error: args.error,
    });
  },
});

// Delete a single test
export const deleteTest = mutation({
  args: { id: v.id("playgroundTests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Delete all tests
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db.query("playgroundTests").collect();
    for (const test of tests) {
      await ctx.db.delete(test._id);
    }
    return tests.length;
  },
});

// Promote a playground test to a real inquiry
export const promoteToInquiry = mutation({
  args: {
    id: v.id("playgroundTests"),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.id);
    if (!test) throw new Error("Test not found");
    if (test.stage !== "estimated") {
      throw new Error("Can only promote completed tests");
    }

    // Create inquiry from test data
    const inquiryId = await ctx.db.insert("projectInquiries", {
      description: test.description,
      email: args.email,
      name: args.name,
      generatedQuestionsV2: test.generatedQuestions,
      answers: test.answers,
      initialPRD: test.initialPRD,
      enhancedPRD: test.enhancedPRD,
      reviewerGaps: test.reviewerGaps,
      reviewerRecommendations: test.reviewerRecommendations,
      reviewerQuestions: test.reviewerQuestions,
      reviewerAnswers: test.reviewerAnswers,
      prd: test.enhancedPRD || test.initialPRD,
      lineItems: test.lineItems,
      estimateMin: test.estimateMin,
      estimateMax: test.estimateMax,
      estimateSubtotal: test.estimateSubtotal,
      estimateRiskBuffer: test.estimateRiskBuffer,
      estimateRiskPercent: test.estimateRiskPercent,
      estimateTotalHours: test.estimateTotalHours,
      estimateConfidence: test.estimateConfidence,
      stage: "estimated",
      usedAI: true,
      // Rough estimate fallback (use AI estimate)
      roughMin: test.estimateMin || 5000,
      roughMax: test.estimateMax || 25000,
      keywords: [],
      status: "new",
      createdAt: Date.now(),
    });

    return inquiryId;
  },
});
