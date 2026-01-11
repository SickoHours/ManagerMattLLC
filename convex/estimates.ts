import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { calculateEstimate, BuildSpec, ModuleCatalogEntry, RateCard } from "./lib/estimator";

// Create a new estimate from wizard configuration
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Fetch module catalog
    const moduleCatalog = await ctx.db.query("moduleCatalog").collect();

    // Fetch active rate card
    const rateCards = await ctx.db
      .query("rateCards")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const rateCard = rateCards[0];
    if (!rateCard) {
      throw new Error("No active rate card found. Run seed:seedAll first.");
    }

    // Prepare build spec
    const buildSpec: BuildSpec = {
      platform: args.platform,
      authLevel: args.authLevel,
      modules: args.modules,
      quality: args.quality,
    };

    // Prepare catalog entries
    const catalogEntries: ModuleCatalogEntry[] = moduleCatalog.map((m) => ({
      moduleId: m.moduleId,
      name: m.name,
      description: m.description,
      category: m.category,
      baseHours: m.baseHours,
      baseTokens: m.baseTokens,
      riskWeight: m.riskWeight,
      dependencies: m.dependencies,
    }));

    // Prepare rate card
    const rateCardData: RateCard = {
      hourlyRate: rateCard.hourlyRate,
      tokenRateIn: rateCard.tokenRateIn,
      tokenRateOut: rateCard.tokenRateOut,
      markup: rateCard.markup,
    };

    // Calculate estimate
    const result = calculateEstimate(buildSpec, catalogEntries, rateCardData);

    // Insert estimate
    const estimateId = await ctx.db.insert("estimates", {
      platform: args.platform,
      authLevel: args.authLevel,
      modules: args.modules,
      quality: args.quality,
      priceMin: result.priceMin,
      priceMax: result.priceMax,
      priceMid: result.priceMid,
      confidence: result.confidence,
      hoursMin: result.hoursMin,
      hoursMax: result.hoursMax,
      daysMin: result.daysMin,
      daysMax: result.daysMax,
      costDrivers: result.costDrivers,
      assumptions: result.assumptions,
      createdAt: Date.now(),
      status: "draft",
    });

    return { estimateId, ...result };
  },
});

// Get estimate by ID
export const get = query({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, args) => {
    const estimate = await ctx.db.get(args.estimateId);
    if (!estimate) {
      return null;
    }

    // Get module details for display
    const moduleCatalog = await ctx.db.query("moduleCatalog").collect();
    const moduleMap = new Map(moduleCatalog.map((m) => [m.moduleId, m]));

    const moduleDetails = estimate.modules
      .map((id) => moduleMap.get(id))
      .filter(Boolean)
      .map((m) => ({
        id: m!.moduleId,
        name: m!.name,
        category: m!.category,
      }));

    return {
      ...estimate,
      moduleDetails,
    };
  },
});

// Get all modules for wizard
export const getModuleCatalog = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("moduleCatalog").collect();
  },
});

// Recalculate estimate (for preview during wizard without saving)
export const preview = query({
  args: {
    platform: v.union(
      v.literal("web"),
      v.literal("mobile"),
      v.literal("both"),
      v.literal("unknown"),
      v.null()
    ),
    authLevel: v.union(
      v.literal("none"),
      v.literal("basic"),
      v.literal("roles"),
      v.literal("multi-tenant"),
      v.literal("unknown"),
      v.null()
    ),
    modules: v.array(v.string()),
    quality: v.union(
      v.literal("prototype"),
      v.literal("mvp"),
      v.literal("production"),
      v.literal("unknown"),
      v.null()
    ),
  },
  handler: async (ctx, args) => {
    // Fetch module catalog
    const moduleCatalog = await ctx.db.query("moduleCatalog").collect();

    // Fetch active rate card
    const rateCards = await ctx.db
      .query("rateCards")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const rateCard = rateCards[0];
    if (!rateCard) {
      return {
        priceMin: 0,
        priceMax: 0,
        priceMid: 0,
        confidence: 0,
        hoursMin: 0,
        hoursMax: 0,
        daysMin: 0,
        daysMax: 0,
        costDrivers: [],
        assumptions: [],
      };
    }

    // Use defaults for null values
    const buildSpec: BuildSpec = {
      platform: args.platform ?? "unknown",
      authLevel: args.authLevel ?? "unknown",
      modules: args.modules,
      quality: args.quality ?? "unknown",
    };

    // Prepare catalog entries
    const catalogEntries: ModuleCatalogEntry[] = moduleCatalog.map((m) => ({
      moduleId: m.moduleId,
      name: m.name,
      description: m.description,
      category: m.category,
      baseHours: m.baseHours,
      baseTokens: m.baseTokens,
      riskWeight: m.riskWeight,
      dependencies: m.dependencies,
    }));

    // Prepare rate card
    const rateCardData: RateCard = {
      hourlyRate: rateCard.hourlyRate,
      tokenRateIn: rateCard.tokenRateIn,
      tokenRateOut: rateCard.tokenRateOut,
      markup: rateCard.markup,
    };

    // Calculate preview
    return calculateEstimate(buildSpec, catalogEntries, rateCardData);
  },
});
