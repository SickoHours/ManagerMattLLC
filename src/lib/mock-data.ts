// Mock data for UI development
// This file provides placeholder data for the estimate wizard and pricing display

export interface Module {
  id: string;
  name: string;
  description: string;
  category: "core" | "data" | "communication" | "payments" | "ai";
  baseTokens: number;
  baseHours: number;
}

export interface EstimateConfig {
  platform: "web" | "mobile" | "both" | "unknown" | null;
  authLevel: "none" | "basic" | "roles" | "multi-tenant" | "unknown" | null;
  modules: string[];
  quality: "prototype" | "mvp" | "production" | "unknown" | null;
}

export interface PriceRange {
  min: number;
  max: number;
  confidence: number;
}

export const MODULES: Module[] = [
  // Core
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Overview page with key metrics and activity",
    category: "core",
    baseTokens: 50000,
    baseHours: 8,
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Charts, graphs, and data visualization",
    category: "core",
    baseTokens: 80000,
    baseHours: 12,
  },
  {
    id: "settings",
    name: "Settings",
    description: "User preferences and account management",
    category: "core",
    baseTokens: 30000,
    baseHours: 6,
  },
  // Data
  {
    id: "database",
    name: "Database",
    description: "Data models and persistence layer",
    category: "data",
    baseTokens: 60000,
    baseHours: 10,
  },
  {
    id: "api",
    name: "API Layer",
    description: "REST or GraphQL endpoints",
    category: "data",
    baseTokens: 70000,
    baseHours: 14,
  },
  {
    id: "file-storage",
    name: "File Storage",
    description: "Upload, store, and serve files",
    category: "data",
    baseTokens: 40000,
    baseHours: 8,
  },
  // Communication
  {
    id: "email",
    name: "Email",
    description: "Transactional and notification emails",
    category: "communication",
    baseTokens: 35000,
    baseHours: 6,
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "In-app and push notifications",
    category: "communication",
    baseTokens: 45000,
    baseHours: 8,
  },
  {
    id: "chat",
    name: "Real-time Chat",
    description: "Live messaging between users",
    category: "communication",
    baseTokens: 90000,
    baseHours: 16,
  },
  // Payments
  {
    id: "checkout",
    name: "Checkout",
    description: "One-time payment processing",
    category: "payments",
    baseTokens: 55000,
    baseHours: 10,
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    description: "Recurring billing management",
    category: "payments",
    baseTokens: 75000,
    baseHours: 14,
  },
  {
    id: "invoices",
    name: "Invoices",
    description: "Invoice generation and history",
    category: "payments",
    baseTokens: 40000,
    baseHours: 8,
  },
  // AI
  {
    id: "text-gen",
    name: "Text Generation",
    description: "AI-powered content creation",
    category: "ai",
    baseTokens: 100000,
    baseHours: 12,
  },
  {
    id: "image-gen",
    name: "Image Generation",
    description: "AI image creation and editing",
    category: "ai",
    baseTokens: 120000,
    baseHours: 16,
  },
  {
    id: "embeddings",
    name: "Embeddings & Search",
    description: "Semantic search and recommendations",
    category: "ai",
    baseTokens: 80000,
    baseHours: 14,
  },
];

export const CATEGORY_LABELS: Record<Module["category"], string> = {
  core: "Core",
  data: "Data",
  communication: "Communication",
  payments: "Payments",
  ai: "AI",
};

export const PLATFORM_OPTIONS = [
  {
    id: "web",
    name: "Web",
    description: "Browser-based application",
    icon: "globe",
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "iOS and Android apps",
    icon: "smartphone",
  },
  {
    id: "both",
    name: "Both",
    description: "Web + native mobile",
    icon: "layers",
  },
  {
    id: "unknown",
    name: "I don't know",
    description: "Widens estimate range",
    icon: "help-circle",
  },
] as const;

export const AUTH_OPTIONS = [
  {
    id: "none",
    name: "None",
    description: "Public, no login required",
    icon: "unlock",
  },
  {
    id: "basic",
    name: "Basic",
    description: "Email/password, social login",
    icon: "key",
  },
  {
    id: "roles",
    name: "Roles",
    description: "User roles and permissions",
    icon: "users",
  },
  {
    id: "multi-tenant",
    name: "Multi-tenant",
    description: "Organizations with members",
    icon: "building",
  },
  {
    id: "unknown",
    name: "I don't know",
    description: "Widens estimate range",
    icon: "help-circle",
  },
] as const;

export const QUALITY_OPTIONS = [
  {
    id: "prototype",
    name: "Prototype",
    badge: "P",
    description: "Quick validation, may have rough edges",
    typical: "Internal demos, testing ideas",
    multiplier: 0.6,
  },
  {
    id: "mvp",
    name: "MVP",
    badge: "M",
    description: "Production-ready core, limited scope",
    typical: "Initial launch, fundraising",
    multiplier: 1.0,
  },
  {
    id: "production",
    name: "Production",
    badge: "Prod",
    description: "Full polish, scalability, edge cases",
    typical: "Revenue-generating products",
    multiplier: 1.8,
  },
  {
    id: "unknown",
    name: "I don't know",
    badge: "?",
    description: "Not sure about quality level yet",
    typical: "Widens estimate range",
    multiplier: 1.0,
  },
] as const;

// Simple price calculation for UI mockup
export function calculateEstimate(config: EstimateConfig): PriceRange {
  const BASE_RATE = 150; // $/hour

  // Platform multiplier (unknown uses middle ground)
  const platformMultiplier =
    config.platform === "both" ? 1.7
    : config.platform === "mobile" ? 1.3
    : config.platform === "unknown" ? 1.35
    : 1.0;

  // Auth multiplier (unknown uses middle ground)
  const authMultiplier =
    config.authLevel === "multi-tenant"
      ? 1.5
      : config.authLevel === "roles"
        ? 1.3
        : config.authLevel === "basic"
          ? 1.1
          : config.authLevel === "unknown"
            ? 1.25
            : 1.0;

  // Calculate base hours from selected modules
  const selectedModules = MODULES.filter((m) => config.modules.includes(m.id));
  const baseHours = selectedModules.reduce((sum, m) => sum + m.baseHours, 0);

  // Quality multiplier
  const qualityOption = QUALITY_OPTIONS.find((q) => q.id === config.quality);
  const qualityMultiplier = qualityOption?.multiplier ?? 1.0;

  // Calculate range
  const midpoint =
    baseHours * BASE_RATE * platformMultiplier * authMultiplier * qualityMultiplier;

  // Base variance is 25%, but unknowns widen the range
  let variance = 0.25;
  if (config.platform === "unknown") variance += 0.15;
  if (config.authLevel === "unknown") variance += 0.10;
  if (config.quality === "unknown") variance += 0.20;

  // Add minimum for any estimate
  const minimum = Math.max(2000, midpoint * (1 - variance));
  const maximum = Math.max(4000, midpoint * (1 + variance));

  // Calculate confidence based on inputs
  // Unknowns reduce confidence but still allow estimate
  let confidence = 85;
  if (!config.platform) confidence -= 20;
  else if (config.platform === "unknown") confidence -= 10;

  if (!config.authLevel) confidence -= 15;
  else if (config.authLevel === "unknown") confidence -= 8;

  if (config.modules.length === 0) confidence -= 30;

  if (!config.quality) confidence -= 20;
  else if (config.quality === "unknown") confidence -= 10;

  return {
    min: Math.round(minimum / 100) * 100,
    max: Math.round(maximum / 100) * 100,
    confidence: Math.max(0, confidence),
  };
}

// Format price for display
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Default/initial config
export const DEFAULT_CONFIG: EstimateConfig = {
  platform: null,
  authLevel: null,
  modules: [],
  quality: null,
};
