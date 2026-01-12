import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // estimates - draft estimates from wizard
  estimates: defineTable({
    // BuildSpec from wizard
    platform: v.union(
      v.literal("web"),
      v.literal("mobile"),
      v.literal("both"),
      v.literal("unknown")
    ),
    authLevel: v.union(
      v.literal("none"),
      v.literal("basic"),
      v.literal("roles"),
      v.literal("multi-tenant"),
      v.literal("unknown")
    ),
    modules: v.array(v.string()),
    quality: v.union(
      v.literal("prototype"),
      v.literal("mvp"),
      v.literal("production"),
      v.literal("unknown")
    ),
    // Additional factors (PRD Section 8.3)
    // Optional for backward compatibility with existing estimates
    integrations: v.optional(
      v.union(
        v.literal("none"),
        v.literal("simple"),
        v.literal("moderate"),
        v.literal("complex"),
        v.literal("unknown")
      )
    ),
    urgency: v.optional(
      v.union(
        v.literal("standard"),
        v.literal("fast"),
        v.literal("rush"),
        v.literal("unknown")
      )
    ),
    iteration: v.optional(
      v.union(
        v.literal("minimal"),
        v.literal("standard"),
        v.literal("exploratory"),
        v.literal("unknown")
      )
    ),

    // Calculated results
    priceMin: v.number(),
    priceMax: v.number(),
    priceMid: v.number(),
    confidence: v.number(),
    hoursMin: v.number(),
    hoursMax: v.number(),
    daysMin: v.number(),
    daysMax: v.number(),

    // Token-based pricing (PRD Section 8.5)
    // Optional for backward compatibility with existing estimates
    tokensIn: v.optional(v.number()),
    tokensOut: v.optional(v.number()),
    materialsCost: v.optional(v.number()),
    laborCost: v.optional(v.number()),
    riskBuffer: v.optional(v.number()),

    // Degraded mode (PRD Section 12.2)
    degradedMode: v.optional(v.boolean()),
    degradedReason: v.optional(v.string()),

    // Architect review (PRD Section 8.6)
    needsReview: v.optional(v.boolean()),
    reviewTriggerModules: v.optional(v.array(v.string())),

    // Explainability
    costDrivers: v.array(
      v.object({
        name: v.string(),
        impact: v.string(),
        amount: v.number(),
      })
    ),
    assumptions: v.array(v.string()),

    // Metadata
    createdAt: v.number(),
    status: v.union(v.literal("draft"), v.literal("quoted")),
  }),

  // quotes - published quotes with email
  quotes: defineTable({
    estimateId: v.id("estimates"),
    email: v.string(),

    // Snapshot of estimate at quote time
    snapshot: v.object({
      platform: v.string(),
      authLevel: v.string(),
      modules: v.array(v.string()),
      quality: v.string(),
      priceMin: v.number(),
      priceMax: v.number(),
      priceMid: v.number(),
      confidence: v.number(),
      hoursMin: v.number(),
      hoursMax: v.number(),
      daysMin: v.number(),
      daysMax: v.number(),
      // Token-based pricing (optional for backward compatibility)
      tokensIn: v.optional(v.number()),
      tokensOut: v.optional(v.number()),
      materialsCost: v.optional(v.number()),
      laborCost: v.optional(v.number()),
      riskBuffer: v.optional(v.number()),
      // Degraded mode
      degradedMode: v.optional(v.boolean()),
      degradedReason: v.optional(v.string()),
      // Architect review
      needsReview: v.optional(v.boolean()),
      reviewTriggerModules: v.optional(v.array(v.string())),
      costDrivers: v.array(
        v.object({
          name: v.string(),
          impact: v.string(),
          amount: v.number(),
        })
      ),
      assumptions: v.array(v.string()),
    }),

    // Quote metadata
    shareId: v.string(), // Short unique ID for /q/:shareId
    pdfUrl: v.optional(v.string()),

    // Status
    status: v.union(
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("accepted")
    ),
    assumptionsConfirmed: v.boolean(),

    createdAt: v.number(),
    viewedAt: v.optional(v.number()),
  }).index("by_shareId", ["shareId"]),

  // moduleCatalog - module definitions (seeded from mock-data)
  moduleCatalog: defineTable({
    moduleId: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    baseHours: v.number(),
    baseTokens: v.number(),
    riskWeight: v.number(),
    dependencies: v.array(v.string()),
    // PRD Section 8.6: Architect review trigger for complex modules
    architectReviewTrigger: v.optional(v.boolean()),
  }).index("by_moduleId", ["moduleId"]),

  // rateCards - pricing configuration
  rateCards: defineTable({
    name: v.string(),
    hourlyRate: v.number(),
    tokenRateIn: v.number(),
    tokenRateOut: v.number(),
    markup: v.number(),
    isActive: v.boolean(),
  }).index("by_active", ["isActive"]),

  // projectInquiries - consumer-friendly project submissions
  projectInquiries: defineTable({
    // User input (simple, non-technical)
    description: v.string(), // Free-text project description
    // userType and timeline are now extracted from AI answers, but kept for backward compat
    userType: v.optional(
      v.union(
        v.literal("just-me"),
        v.literal("team"),
        v.literal("customers"),
        v.literal("everyone")
      )
    ),
    timeline: v.optional(
      v.union(
        v.literal("exploring"),
        v.literal("soon"),
        v.literal("asap")
      )
    ),
    email: v.string(),
    name: v.optional(v.string()),

    // Legacy AI-generated questions (v1 format with emoji)
    generatedQuestions: v.optional(
      v.array(
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
      )
    ),

    // New Claude Code-style questions (v2 format with descriptions)
    generatedQuestionsV2: v.optional(
      v.array(
        v.object({
          question: v.string(), // Full question text
          header: v.string(), // Short label (max 12 chars)
          options: v.array(
            v.object({
              label: v.string(), // Option text
              description: v.string(), // Trade-off explanation
            })
          ),
          multiSelect: v.boolean(), // Allow multiple selections
        })
      )
    ),

    // User answers to AI questions
    // V1 format: "1A, 2C, 3B"
    // V2 format: "Question header=Selected option, Question 2=Option A, Option B"
    answers: v.optional(v.string()),

    // Two-stage PRD flow
    // Stage 1: Initial PRD from description + answers
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

    // Stage 2: AI reviewer findings
    reviewerGaps: v.optional(v.array(v.string())),
    reviewerRecommendations: v.optional(v.array(v.string())),
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
    reviewerAnswers: v.optional(v.string()), // "SKIPPED" if user skipped

    // Stage 3: Enhanced PRD (after review)
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

    // Current stage in the flow
    stage: v.optional(
      v.union(
        v.literal("questions"),
        v.literal("initial-prd"),
        v.literal("review"),
        v.literal("enhanced"),
        v.literal("estimated")
      )
    ),

    // Final PRD (enhanced if available, otherwise initial) - kept for backward compat
    prd: v.optional(
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

    // AI-generated line-item estimate
    lineItems: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          hours: v.number(),
          cost: v.number(),
          confidence: v.string(),
        })
      )
    ),

    // AI-calculated estimate (more accurate than rough)
    estimateMin: v.optional(v.number()),
    estimateMax: v.optional(v.number()),
    estimateSubtotal: v.optional(v.number()),
    estimateRiskBuffer: v.optional(v.number()),
    estimateRiskPercent: v.optional(v.number()),
    estimateTotalHours: v.optional(v.number()),
    estimateConfidence: v.optional(v.string()),
    estimateNotes: v.optional(v.array(v.string())),

    // Fallback rough estimate (keyword-based)
    roughMin: v.number(),
    roughMax: v.number(),
    keywords: v.array(v.string()), // Detected keywords for admin review

    // Flag if AI estimation was used vs fallback
    usedAI: v.optional(v.boolean()),
    aiError: v.optional(v.string()),

    // Admin workflow
    status: v.union(
      v.literal("new"),
      v.literal("reviewed"),
      v.literal("quoted"),
      v.literal("converted")
    ),
    reviewNotes: v.optional(v.string()),
    actualQuote: v.optional(v.number()),
    linkedEstimateId: v.optional(v.id("estimates")), // Link to detailed estimate if created

    // Metadata
    createdAt: v.number(),
    reviewedAt: v.optional(v.number()),
  }).index("by_status", ["status"]).index("by_email", ["email"]),
});
