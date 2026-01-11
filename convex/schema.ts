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

    // Calculated results
    priceMin: v.number(),
    priceMax: v.number(),
    priceMid: v.number(),
    confidence: v.number(),
    hoursMin: v.number(),
    hoursMax: v.number(),
    daysMin: v.number(),
    daysMax: v.number(),

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
});
