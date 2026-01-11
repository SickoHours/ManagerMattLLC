// Estimator algorithm for P10/P50/P90 price ranges
// Based on PRD Section 8: Estimator Engine

export interface BuildSpec {
  platform: "web" | "mobile" | "both" | "unknown";
  authLevel: "none" | "basic" | "roles" | "multi-tenant" | "unknown";
  modules: string[];
  quality: "prototype" | "mvp" | "production" | "unknown";
}

export interface ModuleCatalogEntry {
  moduleId: string;
  name: string;
  description: string;
  category: string;
  baseHours: number;
  baseTokens: number;
  riskWeight: number;
  dependencies: string[];
}

export interface RateCard {
  hourlyRate: number;
  tokenRateIn: number;
  tokenRateOut: number;
  markup: number;
}

export interface CostDriver {
  name: string;
  impact: string; // "high" | "medium" | "low"
  amount: number;
}

export interface EstimateResult {
  priceMin: number; // P10
  priceMid: number; // P50
  priceMax: number; // P90
  confidence: number;
  hoursMin: number;
  hoursMax: number;
  daysMin: number;
  daysMax: number;
  costDrivers: CostDriver[];
  assumptions: string[];
}

// Multipliers
const PLATFORM_MULTIPLIERS: Record<BuildSpec["platform"], number> = {
  web: 1.0,
  mobile: 1.3,
  both: 1.7,
  unknown: 1.35,
};

const AUTH_MULTIPLIERS: Record<BuildSpec["authLevel"], number> = {
  none: 1.0,
  basic: 1.1,
  roles: 1.3,
  "multi-tenant": 1.5,
  unknown: 1.25,
};

const QUALITY_MULTIPLIERS: Record<BuildSpec["quality"], number> = {
  prototype: 0.6,
  mvp: 1.0,
  production: 1.8,
  unknown: 1.0,
};

// Human-readable labels
const PLATFORM_LABELS: Record<BuildSpec["platform"], string> = {
  web: "Web Application",
  mobile: "Mobile Apps (iOS + Android)",
  both: "Web + Mobile",
  unknown: "Platform TBD",
};

const AUTH_LABELS: Record<BuildSpec["authLevel"], string> = {
  none: "No Authentication",
  basic: "Basic Auth (Email/Password)",
  roles: "Role-Based Access Control",
  "multi-tenant": "Multi-Tenant Architecture",
  unknown: "Auth Level TBD",
};

const QUALITY_LABELS: Record<BuildSpec["quality"], string> = {
  prototype: "Prototype",
  mvp: "MVP",
  production: "Production-Ready",
  unknown: "Quality Level TBD",
};

/**
 * Expand module dependencies using DAG traversal
 * Returns deduplicated list of all modules including dependencies
 */
function expandDependencies(
  selectedModules: string[],
  catalog: ModuleCatalogEntry[]
): string[] {
  const catalogMap = new Map(catalog.map((m) => [m.moduleId, m]));
  const expanded = new Set<string>();

  function traverse(moduleId: string) {
    if (expanded.has(moduleId)) return;

    const mod = catalogMap.get(moduleId);
    if (!mod) return;

    // First, traverse dependencies
    for (const dep of mod.dependencies) {
      traverse(dep);
    }

    // Then add this module
    expanded.add(moduleId);
  }

  for (const moduleId of selectedModules) {
    traverse(moduleId);
  }

  return Array.from(expanded);
}

/**
 * Calculate estimate from build spec
 */
export function calculateEstimate(
  spec: BuildSpec,
  catalog: ModuleCatalogEntry[],
  rateCard: RateCard
): EstimateResult {
  const { hourlyRate } = rateCard;

  // 1. Expand dependencies
  const allModules = expandDependencies(spec.modules, catalog);
  const catalogMap = new Map(catalog.map((m) => [m.moduleId, m]));

  // 2. Sum base hours from selected modules
  let totalBaseHours = 0;
  let totalRiskWeight = 0;
  const moduleBreakdown: { name: string; hours: number; cost: number }[] = [];

  for (const moduleId of allModules) {
    const mod = catalogMap.get(moduleId);
    if (mod) {
      totalBaseHours += mod.baseHours;
      totalRiskWeight += mod.riskWeight;
      moduleBreakdown.push({
        name: mod.name,
        hours: mod.baseHours,
        cost: mod.baseHours * hourlyRate,
      });
    }
  }

  // Average risk weight (for variance calculation)
  const avgRiskWeight =
    allModules.length > 0 ? totalRiskWeight / allModules.length : 1.0;

  // 3. Apply multipliers
  const platformMultiplier = PLATFORM_MULTIPLIERS[spec.platform];
  const authMultiplier = AUTH_MULTIPLIERS[spec.authLevel];
  const qualityMultiplier = QUALITY_MULTIPLIERS[spec.quality];

  const totalMultiplier = platformMultiplier * authMultiplier * qualityMultiplier;
  const adjustedHours = totalBaseHours * totalMultiplier;

  // 4. Calculate variance based on unknowns and risk
  let variance = 0.25; // Base 25% variance

  if (spec.platform === "unknown") variance += 0.15;
  if (spec.authLevel === "unknown") variance += 0.1;
  if (spec.quality === "unknown") variance += 0.2;

  // Risk weight affects variance
  variance *= avgRiskWeight;

  // Cap variance at 70%
  variance = Math.min(variance, 0.7);

  // 5. Generate P10/P50/P90
  const midpointCost = adjustedHours * hourlyRate;
  const p10 = midpointCost * (1 - variance);
  const p50 = midpointCost;
  const p90 = midpointCost * (1 + variance);

  // Hours and days
  const hoursMin = adjustedHours * (1 - variance * 0.5);
  const hoursMax = adjustedHours * (1 + variance * 0.5);
  const daysMin = hoursMin / 8;
  const daysMax = hoursMax / 8;

  // 6. Calculate confidence score
  let confidence = 85;

  if (spec.platform === "unknown") confidence -= 10;
  if (spec.authLevel === "unknown") confidence -= 8;
  if (spec.quality === "unknown") confidence -= 10;
  if (allModules.length === 0) confidence -= 30;
  if (allModules.length < 3) confidence -= 10;

  // Risk affects confidence
  if (avgRiskWeight > 1.2) confidence -= 5;
  if (avgRiskWeight > 1.4) confidence -= 5;

  confidence = Math.max(0, Math.min(100, confidence));

  // 7. Extract cost drivers
  const costDrivers: CostDriver[] = [];

  // Platform cost driver
  if (platformMultiplier > 1.0) {
    const impact = platformMultiplier >= 1.5 ? "high" : "medium";
    costDrivers.push({
      name: PLATFORM_LABELS[spec.platform],
      impact,
      amount: Math.round((platformMultiplier - 1.0) * midpointCost * 0.4),
    });
  }

  // Auth cost driver
  if (authMultiplier > 1.0) {
    const impact = authMultiplier >= 1.3 ? "high" : "medium";
    costDrivers.push({
      name: AUTH_LABELS[spec.authLevel],
      impact,
      amount: Math.round((authMultiplier - 1.0) * midpointCost * 0.3),
    });
  }

  // Quality cost driver
  if (qualityMultiplier > 1.0) {
    const impact = qualityMultiplier >= 1.5 ? "high" : "medium";
    costDrivers.push({
      name: QUALITY_LABELS[spec.quality],
      impact,
      amount: Math.round((qualityMultiplier - 1.0) * midpointCost * 0.3),
    });
  } else if (qualityMultiplier < 1.0) {
    costDrivers.push({
      name: `${QUALITY_LABELS[spec.quality]} (savings)`,
      impact: "medium",
      amount: -Math.round((1.0 - qualityMultiplier) * midpointCost * 0.3),
    });
  }

  // Top modules by cost
  const sortedModules = [...moduleBreakdown].sort((a, b) => b.cost - a.cost);
  for (const mod of sortedModules.slice(0, 3)) {
    if (mod.cost > 1000) {
      costDrivers.push({
        name: mod.name,
        impact: mod.cost > 2000 ? "high" : "low",
        amount: Math.round(mod.cost * totalMultiplier),
      });
    }
  }

  // Sort by amount descending
  costDrivers.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  // 8. Generate assumptions
  const assumptions: string[] = [];

  // Always add base assumptions
  assumptions.push("Hourly rate of $150/hour for development work");
  assumptions.push("Client provides timely feedback within 48 hours");
  assumptions.push("Requirements are well-defined before development begins");

  // Platform-specific
  if (spec.platform === "mobile" || spec.platform === "both") {
    assumptions.push("Mobile apps will be built using cross-platform framework (React Native)");
    assumptions.push("App Store / Play Store submission handled separately");
  }

  if (spec.platform === "unknown") {
    assumptions.push("Platform decision may affect timeline and cost by +/- 30%");
  }

  // Auth-specific
  if (spec.authLevel === "multi-tenant") {
    assumptions.push("Multi-tenant data isolation using row-level security");
    assumptions.push("Organization management UI included");
  }

  if (spec.authLevel === "unknown") {
    assumptions.push("Authentication approach to be determined; may affect scope");
  }

  // Quality-specific
  if (spec.quality === "prototype") {
    assumptions.push("Prototype code not intended for production use");
    assumptions.push("Limited error handling and edge cases");
  } else if (spec.quality === "production") {
    assumptions.push("Includes comprehensive error handling and logging");
    assumptions.push("Performance optimization and load testing included");
    assumptions.push("Security audit and penetration testing recommended");
  }

  if (spec.quality === "unknown") {
    assumptions.push("Quality level decision may significantly impact timeline");
  }

  // Module-specific
  if (allModules.includes("chat")) {
    assumptions.push("Real-time messaging using WebSocket connections");
  }
  if (allModules.includes("subscriptions")) {
    assumptions.push("Payment processing via Stripe integration");
  }
  if (allModules.includes("text-gen") || allModules.includes("image-gen")) {
    assumptions.push("AI features using third-party APIs (OpenAI, Anthropic, etc.)");
    assumptions.push("AI API costs billed separately based on usage");
  }

  return {
    priceMin: roundToNearest100(Math.max(2000, p10)),
    priceMid: roundToNearest100(Math.max(3000, p50)),
    priceMax: roundToNearest100(Math.max(4000, p90)),
    confidence,
    hoursMin: Math.round(hoursMin),
    hoursMax: Math.round(hoursMax),
    daysMin: Math.round(daysMin * 10) / 10,
    daysMax: Math.round(daysMax * 10) / 10,
    costDrivers: costDrivers.slice(0, 6), // Top 6 drivers
    assumptions,
  };
}

function roundToNearest100(value: number): number {
  return Math.round(value / 100) * 100;
}
