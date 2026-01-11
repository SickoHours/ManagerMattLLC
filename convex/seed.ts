import { mutation } from "./_generated/server";

// Module catalog data (migrated from src/lib/mock-data.ts)
// architectReviewTrigger: true for complex modules that need human review
const MODULES = [
  // Core
  {
    moduleId: "dashboard",
    name: "Dashboard",
    description: "Overview page with key metrics and activity",
    category: "core",
    baseHours: 2,
    baseTokens: 50000,
    riskWeight: 1.0,
    dependencies: [],
    architectReviewTrigger: false,
  },
  {
    moduleId: "analytics",
    name: "Analytics",
    description: "Charts, graphs, and data visualization",
    category: "core",
    baseHours: 4,
    baseTokens: 80000,
    riskWeight: 1.2,
    dependencies: ["dashboard"],
    architectReviewTrigger: false,
  },
  {
    moduleId: "settings",
    name: "Settings",
    description: "User preferences and account management",
    category: "core",
    baseHours: 2,
    baseTokens: 30000,
    riskWeight: 1.0,
    dependencies: [],
    architectReviewTrigger: false,
  },
  // Data
  {
    moduleId: "database",
    name: "Database",
    description: "Data models and persistence layer",
    category: "data",
    baseHours: 4,
    baseTokens: 60000,
    riskWeight: 1.1,
    dependencies: [],
    architectReviewTrigger: false,
  },
  {
    moduleId: "api",
    name: "API Layer",
    description: "REST or GraphQL endpoints",
    category: "data",
    baseHours: 6,
    baseTokens: 70000,
    riskWeight: 1.2,
    dependencies: ["database"],
    architectReviewTrigger: false,
  },
  {
    moduleId: "file-storage",
    name: "File Storage",
    description: "Upload, store, and serve files",
    category: "data",
    baseHours: 2,
    baseTokens: 40000,
    riskWeight: 1.1,
    dependencies: [],
    architectReviewTrigger: false,
  },
  // Communication
  {
    moduleId: "email",
    name: "Email",
    description: "Transactional and notification emails",
    category: "communication",
    baseHours: 2,
    baseTokens: 35000,
    riskWeight: 1.0,
    dependencies: [],
    architectReviewTrigger: false,
  },
  {
    moduleId: "notifications",
    name: "Notifications",
    description: "In-app and push notifications",
    category: "communication",
    baseHours: 3,
    baseTokens: 45000,
    riskWeight: 1.1,
    dependencies: [],
    architectReviewTrigger: false,
  },
  {
    moduleId: "chat",
    name: "Real-time Chat",
    description: "Live messaging between users",
    category: "communication",
    baseHours: 6,
    baseTokens: 90000,
    riskWeight: 1.4,
    dependencies: ["database"],
    architectReviewTrigger: true, // Complex real-time infrastructure
  },
  // Payments
  {
    moduleId: "checkout",
    name: "Checkout",
    description: "One-time payment processing",
    category: "payments",
    baseHours: 4,
    baseTokens: 55000,
    riskWeight: 1.3,
    dependencies: [],
    architectReviewTrigger: false,
  },
  {
    moduleId: "subscriptions",
    name: "Subscriptions",
    description: "Recurring billing management",
    category: "payments",
    baseHours: 6,
    baseTokens: 75000,
    riskWeight: 1.4,
    dependencies: ["checkout"],
    architectReviewTrigger: true, // Complex billing logic
  },
  {
    moduleId: "invoices",
    name: "Invoices",
    description: "Invoice generation and history",
    category: "payments",
    baseHours: 2,
    baseTokens: 40000,
    riskWeight: 1.1,
    dependencies: [],
    architectReviewTrigger: false,
  },
  // AI
  {
    moduleId: "text-gen",
    name: "Text Generation",
    description: "AI-powered content creation",
    category: "ai",
    baseHours: 4,
    baseTokens: 100000,
    riskWeight: 1.3,
    dependencies: ["api"],
    architectReviewTrigger: false,
  },
  {
    moduleId: "image-gen",
    name: "Image Generation",
    description: "AI image creation and editing",
    category: "ai",
    baseHours: 6,
    baseTokens: 120000,
    riskWeight: 1.5,
    dependencies: ["api", "file-storage"],
    architectReviewTrigger: true, // Complex AI infrastructure
  },
  {
    moduleId: "embeddings",
    name: "Embeddings & Search",
    description: "Semantic search and recommendations",
    category: "ai",
    baseHours: 6,
    baseTokens: 80000,
    riskWeight: 1.4,
    dependencies: ["database", "api"],
    architectReviewTrigger: true, // Complex vector DB setup
  },
];

// Default rate card
const DEFAULT_RATE_CARD = {
  name: "Standard",
  hourlyRate: 150,
  tokenRateIn: 0.00001, // $0.01 per 1K tokens
  tokenRateOut: 0.00003, // $0.03 per 1K tokens
  markup: 1.0,
  isActive: true,
};

export const seedModuleCatalog = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingModules = await ctx.db.query("moduleCatalog").collect();
    if (existingModules.length > 0) {
      return { status: "already_seeded", moduleCount: existingModules.length };
    }

    // Seed modules
    for (const mod of MODULES) {
      await ctx.db.insert("moduleCatalog", mod);
    }

    return { status: "seeded", moduleCount: MODULES.length };
  },
});

export const seedRateCard = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingCards = await ctx.db.query("rateCards").collect();
    if (existingCards.length > 0) {
      return { status: "already_seeded", cardCount: existingCards.length };
    }

    // Seed default rate card
    await ctx.db.insert("rateCards", DEFAULT_RATE_CARD);

    return { status: "seeded", cardCount: 1 };
  },
});

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if modules already seeded
    const existingModules = await ctx.db.query("moduleCatalog").collect();
    let modulesSeeded = false;
    if (existingModules.length === 0) {
      for (const mod of MODULES) {
        await ctx.db.insert("moduleCatalog", mod);
      }
      modulesSeeded = true;
    }

    // Check if rate cards already seeded
    const existingCards = await ctx.db.query("rateCards").collect();
    let rateCardSeeded = false;
    if (existingCards.length === 0) {
      await ctx.db.insert("rateCards", DEFAULT_RATE_CARD);
      rateCardSeeded = true;
    }

    return {
      modules: modulesSeeded ? "seeded" : "already_exists",
      moduleCount: modulesSeeded ? MODULES.length : existingModules.length,
      rateCard: rateCardSeeded ? "seeded" : "already_exists",
    };
  },
});

// Migration: Update baseHours for AI-accelerated development
// Run once via: npx convex run seed:migrateBaseHours
export const migrateBaseHours = mutation({
  args: {},
  handler: async (ctx) => {
    // New AI-accelerated base hours (61% reduction overall)
    const updates: Record<string, number> = {
      // Tier 1: Standard patterns (2-3 hours)
      "dashboard": 2,
      "settings": 2,
      "file-storage": 2,
      "email": 2,
      "notifications": 3,
      "invoices": 2,
      // Tier 2: Moderate complexity (4 hours)
      "analytics": 4,
      "database": 4,
      "checkout": 4,
      "text-gen": 4,
      // Tier 3: High complexity (6 hours)
      "api": 6,
      "chat": 6,
      "subscriptions": 6,
      "image-gen": 6,
      "embeddings": 6,
    };

    const modules = await ctx.db.query("moduleCatalog").collect();
    let updated = 0;
    const changes: Array<{ moduleId: string; oldHours: number; newHours: number }> = [];

    for (const mod of modules) {
      const newHours = updates[mod.moduleId];
      if (newHours !== undefined && mod.baseHours !== newHours) {
        changes.push({
          moduleId: mod.moduleId,
          oldHours: mod.baseHours,
          newHours: newHours,
        });
        await ctx.db.patch(mod._id, { baseHours: newHours });
        updated++;
      }
    }

    return {
      status: updated > 0 ? "migrated" : "no_changes_needed",
      updated,
      total: modules.length,
      changes,
    };
  },
});
