import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get dashboard statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all inquiries
    const inquiries = await ctx.db.query("projectInquiries").collect();

    // Count by status
    const newInquiries = inquiries.filter((i) => i.status === "new").length;
    const reviewedInquiries = inquiries.filter(
      (i) => i.status === "reviewed"
    ).length;
    const quotedInquiries = inquiries.filter(
      (i) => i.status === "quoted"
    ).length;
    const convertedInquiries = inquiries.filter(
      (i) => i.status === "converted"
    ).length;

    // Get all quotes
    const quotes = await ctx.db.query("quotes").collect();
    const quotesSent = quotes.length;
    const quotesViewed = quotes.filter((q) => q.viewedAt).length;

    // Calculate potential revenue from active quotes
    const potentialRevenue = quotes
      .filter((q) => q.status !== "accepted")
      .reduce((sum, q) => {
        const max = q.snapshot?.priceMax || 0;
        return sum + max;
      }, 0);

    return {
      newInquiries,
      reviewedInquiries,
      quotedInquiries,
      convertedInquiries,
      totalInquiries: inquiries.length,
      quotesSent,
      quotesViewed,
      potentialRevenue,
    };
  },
});

// Get recent inquiries for dashboard
export const getRecentInquiries = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const inquiries = await ctx.db
      .query("projectInquiries")
      .order("desc")
      .take(limit);

    return inquiries;
  },
});

// Get all inquiries with optional status filter
export const listInquiries = query({
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
    let inquiriesQuery = ctx.db.query("projectInquiries").order("desc");

    const inquiries = await inquiriesQuery.collect();

    // Filter by status if provided
    if (args.status) {
      return inquiries.filter((i) => i.status === args.status);
    }

    return inquiries;
  },
});

// Get a single inquiry by ID
export const getInquiry = query({
  args: {
    id: v.id("projectInquiries"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get module catalog for config
export const getModuleCatalog = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("moduleCatalog").collect();
  },
});

// Get rate cards for config
export const getRateCards = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rateCards").collect();
  },
});

// List all quotes
export const listQuotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quotes").order("desc").collect();
  },
});

// Get conversion funnel stats for analytics
export const getConversionFunnel = query({
  args: {},
  handler: async (ctx) => {
    const inquiries = await ctx.db.query("projectInquiries").collect();

    const funnel = {
      new: inquiries.filter((i) => i.status === "new").length,
      reviewed: inquiries.filter((i) => i.status === "reviewed").length,
      quoted: inquiries.filter((i) => i.status === "quoted").length,
      converted: inquiries.filter((i) => i.status === "converted").length,
    };

    const total = inquiries.length;
    const rates = {
      reviewRate: total > 0 ? ((funnel.reviewed + funnel.quoted + funnel.converted) / total) * 100 : 0,
      quoteRate: total > 0 ? ((funnel.quoted + funnel.converted) / total) * 100 : 0,
      conversionRate: total > 0 ? (funnel.converted / total) * 100 : 0,
    };

    return { funnel, rates, total };
  },
});

// Update inquiry status
export const updateInquiryStatus = mutation({
  args: {
    id: v.id("projectInquiries"),
    status: v.union(
      v.literal("new"),
      v.literal("reviewed"),
      v.literal("quoted"),
      v.literal("converted")
    ),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { status: args.status };

    // Set reviewedAt when moving to reviewed status
    if (args.status === "reviewed") {
      updates.reviewedAt = Date.now();
    }

    await ctx.db.patch(args.id, updates);
    return { success: true };
  },
});

// Update inquiry notes
export const updateInquiryNotes = mutation({
  args: {
    id: v.id("projectInquiries"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { reviewNotes: args.notes });
    return { success: true };
  },
});

// Update a module in the catalog
export const updateModule = mutation({
  args: {
    id: v.id("moduleCatalog"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      baseHours: v.optional(v.number()),
      baseTokens: v.optional(v.number()),
      riskWeight: v.optional(v.number()),
      architectReviewTrigger: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
    return { success: true };
  },
});

// Update a rate card
export const updateRateCard = mutation({
  args: {
    id: v.id("rateCards"),
    updates: v.object({
      name: v.optional(v.string()),
      hourlyRate: v.optional(v.number()),
      tokenRateIn: v.optional(v.number()),
      tokenRateOut: v.optional(v.number()),
      markup: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
    return { success: true };
  },
});

// Set a rate card as active (deactivate others)
export const setActiveRateCard = mutation({
  args: {
    id: v.id("rateCards"),
  },
  handler: async (ctx, args) => {
    // Deactivate all rate cards
    const rateCards = await ctx.db.query("rateCards").collect();
    for (const card of rateCards) {
      if (card.isActive) {
        await ctx.db.patch(card._id, { isActive: false });
      }
    }

    // Activate the selected one
    await ctx.db.patch(args.id, { isActive: true });
    return { success: true };
  },
});
