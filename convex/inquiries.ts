import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
