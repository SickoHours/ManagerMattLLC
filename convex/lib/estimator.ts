// Estimator algorithm for P10/P50/P90 price ranges
// Based on PRD Section 8: Estimator Engine

// Monte Carlo simulation constants (PRD Section 8.2)
const MONTE_CARLO_RUNS = 600; // ~600 runs for statistical accuracy

// Simple pseudo-random number generator for reproducibility
// Using mulberry32 algorithm for fast, good distribution
function createRNG(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Box-Muller transform for normal distribution
function normalRandom(rng: () => number, mean: number, stdDev: number): number {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + stdDev * z;
}

// Sample from a triangular distribution (for constrained uncertainty)
function triangularRandom(rng: () => number, min: number, mode: number, max: number): number {
  const u = rng();
  const f = (mode - min) / (max - min);
  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

export interface BuildSpec {
  platform: "web" | "mobile" | "both" | "unknown";
  authLevel: "none" | "basic" | "roles" | "multi-tenant" | "unknown";
  modules: string[];
  quality: "prototype" | "mvp" | "production" | "unknown";
  // Additional factors (PRD Section 8.3)
  integrations: "none" | "simple" | "moderate" | "complex" | "unknown";
  urgency: "standard" | "fast" | "rush" | "unknown";
  iteration: "minimal" | "standard" | "exploratory" | "unknown";
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
  // PRD Section 8.6: Architect review trigger for complex modules
  architectReviewTrigger?: boolean;
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
  // Token-based pricing (PRD Section 8.5)
  tokensIn: number;
  tokensOut: number;
  materialsCost: number;
  laborCost: number;
  riskBuffer: number;
  costDrivers: CostDriver[];
  assumptions: string[];
  // Degraded mode (PRD Section 12.2)
  degradedMode: boolean;
  degradedReason?: string;
  // Architect review trigger (PRD Section 8.6)
  needsReview: boolean;
  reviewTriggerModules?: string[];
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

// Additional multipliers (PRD Section 8.3)
const INTEGRATION_MULTIPLIERS: Record<BuildSpec["integrations"], number> = {
  none: 1.0,
  simple: 1.1,     // 1-2 APIs
  moderate: 1.25,  // 3-5 APIs
  complex: 1.5,    // 5+ APIs or legacy systems
  unknown: 1.2,
};

const URGENCY_MULTIPLIERS: Record<BuildSpec["urgency"], number> = {
  standard: 1.0,
  fast: 1.2,
  rush: 1.5,
  unknown: 1.1,
};

const ITERATION_MULTIPLIERS: Record<BuildSpec["iteration"], number> = {
  minimal: 0.9,     // Client knows exactly what they want
  standard: 1.0,
  exploratory: 1.3, // Expect significant iteration
  unknown: 1.1,
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

const INTEGRATION_LABELS: Record<BuildSpec["integrations"], string> = {
  none: "No External Integrations",
  simple: "Simple Integrations (1-2 APIs)",
  moderate: "Moderate Integrations (3-5 APIs)",
  complex: "Complex Integrations (5+ or Legacy)",
  unknown: "Integrations TBD",
};

const URGENCY_LABELS: Record<BuildSpec["urgency"], string> = {
  standard: "Standard Timeline",
  fast: "Fast Track (+20%)",
  rush: "Rush Delivery (+50%)",
  unknown: "Timeline TBD",
};

const ITERATION_LABELS: Record<BuildSpec["iteration"], string> = {
  minimal: "Minimal Iteration (Clear Scope)",
  standard: "Standard Iteration",
  exploratory: "Exploratory (Discovery Phase)",
  unknown: "Iteration Level TBD",
};

// Uncertainty ranges for multipliers when "unknown" is selected
// [min, mode, max] for triangular distribution
const MULTIPLIER_UNCERTAINTY_RANGES: Record<string, [number, number, number]> = {
  platform: [0.9, 1.35, 2.0],      // Could be simple web or full mobile+web
  authLevel: [1.0, 1.25, 1.6],    // Could be none or multi-tenant
  quality: [0.6, 1.0, 1.8],       // Could be prototype or production
  integrations: [1.0, 1.2, 1.6],  // Could be none or complex
  urgency: [1.0, 1.1, 1.5],       // Could be standard or rush
  iteration: [0.9, 1.1, 1.4],     // Could be minimal or exploratory
};

interface MonteCarloResult {
  p10: number;
  p50: number;
  p90: number;
  simulations: number[];
}

/**
 * Run Monte Carlo simulation for accurate P10/P50/P90 percentiles
 * PRD Section 8.2: ~600 runs for statistical accuracy
 */
function runMonteCarlo(
  baseHours: number,
  baseTokensIn: number,
  baseTokensOut: number,
  spec: BuildSpec,
  avgRiskWeight: number,
  rateCard: RateCard,
  runs: number = MONTE_CARLO_RUNS
): MonteCarloResult {
  const { hourlyRate, tokenRateIn, tokenRateOut, markup } = rateCard;

  // Use current timestamp as seed for varied but reproducible results within session
  const rng = createRNG(Date.now() % 100000);
  const simulations: number[] = [];

  for (let i = 0; i < runs; i++) {
    // Sample multipliers based on whether they are known or unknown
    let platformMult = PLATFORM_MULTIPLIERS[spec.platform];
    let authMult = AUTH_MULTIPLIERS[spec.authLevel];
    let qualityMult = QUALITY_MULTIPLIERS[spec.quality];
    let integrationMult = INTEGRATION_MULTIPLIERS[spec.integrations];
    let urgencyMult = URGENCY_MULTIPLIERS[spec.urgency];
    let iterationMult = ITERATION_MULTIPLIERS[spec.iteration];

    // For "unknown" values, sample from triangular distribution
    if (spec.platform === "unknown") {
      const range = MULTIPLIER_UNCERTAINTY_RANGES.platform;
      platformMult = triangularRandom(rng, range[0], range[1], range[2]);
    }
    if (spec.authLevel === "unknown") {
      const range = MULTIPLIER_UNCERTAINTY_RANGES.authLevel;
      authMult = triangularRandom(rng, range[0], range[1], range[2]);
    }
    if (spec.quality === "unknown") {
      const range = MULTIPLIER_UNCERTAINTY_RANGES.quality;
      qualityMult = triangularRandom(rng, range[0], range[1], range[2]);
    }
    if (spec.integrations === "unknown") {
      const range = MULTIPLIER_UNCERTAINTY_RANGES.integrations;
      integrationMult = triangularRandom(rng, range[0], range[1], range[2]);
    }
    if (spec.urgency === "unknown") {
      const range = MULTIPLIER_UNCERTAINTY_RANGES.urgency;
      urgencyMult = triangularRandom(rng, range[0], range[1], range[2]);
    }
    if (spec.iteration === "unknown") {
      const range = MULTIPLIER_UNCERTAINTY_RANGES.iteration;
      iterationMult = triangularRandom(rng, range[0], range[1], range[2]);
    }

    // Add inherent variation even for known values (based on risk weight)
    // Higher risk weight = more variation
    const variationFactor = 0.1 * avgRiskWeight;
    if (spec.platform !== "unknown") {
      platformMult *= normalRandom(rng, 1.0, variationFactor * 0.5);
    }
    if (spec.quality !== "unknown") {
      qualityMult *= normalRandom(rng, 1.0, variationFactor * 0.3);
    }
    if (spec.integrations === "complex") {
      // Complex integrations have high variance
      integrationMult *= normalRandom(rng, 1.0, variationFactor);
    }
    if (spec.iteration === "exploratory") {
      // Exploratory work has high variance
      iterationMult *= normalRandom(rng, 1.0, variationFactor);
    }

    // Sample hours variation (each module has uncertainty)
    const hoursVariation = normalRandom(rng, 1.0, variationFactor);
    const sampledHours = baseHours * Math.max(0.5, hoursVariation);

    // Sample token variation (AI usage can vary)
    const tokenVariation = normalRandom(rng, 1.0, variationFactor * 1.5);
    const sampledTokensIn = baseTokensIn * Math.max(0.3, tokenVariation);
    const sampledTokensOut = baseTokensOut * Math.max(0.3, tokenVariation);

    // Calculate total multiplier
    const totalMult =
      platformMult *
      authMult *
      qualityMult *
      integrationMult *
      urgencyMult *
      iterationMult;

    // Ensure multiplier stays positive and reasonable
    const clampedMult = Math.max(0.3, Math.min(5.0, totalMult));

    // Calculate costs for this simulation
    const simHours = sampledHours * clampedMult;
    const simTokensIn = sampledTokensIn * clampedMult;
    const simTokensOut = sampledTokensOut * clampedMult;

    const simMaterialsCost = (simTokensIn * tokenRateIn + simTokensOut * tokenRateOut) * markup;
    const simLaborCost = simHours * hourlyRate;

    // Risk buffer based on simulation variance
    const simRiskBuffer = (simMaterialsCost + simLaborCost) * variationFactor * 0.5;

    const simTotal = simMaterialsCost + simLaborCost + simRiskBuffer;
    simulations.push(Math.max(2000, simTotal)); // Floor at $2000
  }

  // Sort and extract percentiles
  simulations.sort((a, b) => a - b);

  const p10Index = Math.floor(runs * 0.10);
  const p50Index = Math.floor(runs * 0.50);
  const p90Index = Math.floor(runs * 0.90);

  return {
    p10: simulations[p10Index],
    p50: simulations[p50Index],
    p90: simulations[p90Index],
    simulations,
  };
}

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
 * PRD Section 8.5: Materials + Build Fee + Risk Buffer
 */
export function calculateEstimate(
  spec: BuildSpec,
  catalog: ModuleCatalogEntry[],
  rateCard: RateCard
): EstimateResult {
  const { hourlyRate, tokenRateIn, tokenRateOut, markup } = rateCard;

  // 1. Expand dependencies
  const allModules = expandDependencies(spec.modules, catalog);
  const catalogMap = new Map(catalog.map((m) => [m.moduleId, m]));

  // 2. Sum base hours and tokens from selected modules
  let totalBaseHours = 0;
  let totalBaseTokens = 0;
  let totalRiskWeight = 0;
  const moduleBreakdown: { name: string; hours: number; tokens: number; cost: number }[] = [];

  for (const moduleId of allModules) {
    const mod = catalogMap.get(moduleId);
    if (mod) {
      totalBaseHours += mod.baseHours;
      totalBaseTokens += mod.baseTokens;
      totalRiskWeight += mod.riskWeight;
      moduleBreakdown.push({
        name: mod.name,
        hours: mod.baseHours,
        tokens: mod.baseTokens,
        cost: mod.baseHours * hourlyRate,
      });
    }
  }

  // Average risk weight (for variance calculation)
  const avgRiskWeight =
    allModules.length > 0 ? totalRiskWeight / allModules.length : 1.0;

  // 3. Apply multipliers (all factors from PRD 8.3)
  const platformMultiplier = PLATFORM_MULTIPLIERS[spec.platform];
  const authMultiplier = AUTH_MULTIPLIERS[spec.authLevel];
  const qualityMultiplier = QUALITY_MULTIPLIERS[spec.quality];
  const integrationMultiplier = INTEGRATION_MULTIPLIERS[spec.integrations];
  const urgencyMultiplier = URGENCY_MULTIPLIERS[spec.urgency];
  const iterationMultiplier = ITERATION_MULTIPLIERS[spec.iteration];

  const totalMultiplier =
    platformMultiplier *
    authMultiplier *
    qualityMultiplier *
    integrationMultiplier *
    urgencyMultiplier *
    iterationMultiplier;
  const adjustedHours = totalBaseHours * totalMultiplier;
  const adjustedTokens = totalBaseTokens * totalMultiplier;

  // Split tokens: 60% input, 40% output (prompts are typically larger than outputs)
  const tokensIn = Math.round(adjustedTokens * 0.6);
  const tokensOut = Math.round(adjustedTokens * 0.4);

  // 4. Calculate variance based on unknowns and risk
  let variance = 0.25; // Base 25% variance

  // Original unknowns
  if (spec.platform === "unknown") variance += 0.15;
  if (spec.authLevel === "unknown") variance += 0.1;
  if (spec.quality === "unknown") variance += 0.2;

  // Additional unknowns (PRD Section 8.3)
  if (spec.integrations === "unknown") variance += 0.1;
  if (spec.urgency === "unknown") variance += 0.05;
  if (spec.iteration === "unknown") variance += 0.1;

  // Complex integrations and exploratory work add uncertainty
  if (spec.integrations === "complex") variance += 0.1;
  if (spec.iteration === "exploratory") variance += 0.15;

  // Risk weight affects variance
  variance *= avgRiskWeight;

  // Cap variance at 70%
  variance = Math.min(variance, 0.7);

  // 5. Calculate pricing components (PRD Section 8.5)
  // MaterialsCost = (tokens_in * rate_in + tokens_out * rate_out) * markup
  const materialsCost = (tokensIn * tokenRateIn + tokensOut * tokenRateOut) * markup;

  // BuildFee (Labor) = hours * hourlyRate
  const laborCost = adjustedHours * hourlyRate;

  // RiskBuffer = f(uncertaintyScore, integrationRisk, urgency)
  // Base buffer is variance * base cost, affected by risk weight
  const baseForBuffer = materialsCost + laborCost;
  const riskBuffer = baseForBuffer * variance * avgRiskWeight * 0.5;

  // Total = Materials + BuildFee + Buffer (deterministic midpoint for reference)
  const totalMidpoint = materialsCost + laborCost + riskBuffer;

  // 6. Generate P10/P50/P90 using Monte Carlo simulation
  // Split base tokens for simulation input
  const baseTokensIn = Math.round(totalBaseTokens * 0.6);
  const baseTokensOut = Math.round(totalBaseTokens * 0.4);

  const monteCarlo = runMonteCarlo(
    totalBaseHours,
    baseTokensIn,
    baseTokensOut,
    spec,
    avgRiskWeight,
    rateCard
  );

  // Use Monte Carlo results for price ranges
  const p10 = monteCarlo.p10;
  const p50 = monteCarlo.p50;
  const p90 = monteCarlo.p90;

  // Hours and days
  const hoursMin = adjustedHours * (1 - variance * 0.5);
  const hoursMax = adjustedHours * (1 + variance * 0.5);
  const daysMin = hoursMin / 8;
  const daysMax = hoursMax / 8;

  // 7. Calculate confidence score
  let confidence = 85;

  // Original factors
  if (spec.platform === "unknown") confidence -= 10;
  if (spec.authLevel === "unknown") confidence -= 8;
  if (spec.quality === "unknown") confidence -= 10;
  if (allModules.length === 0) confidence -= 30;
  if (allModules.length < 3) confidence -= 10;

  // Additional factors
  if (spec.integrations === "unknown") confidence -= 7;
  if (spec.urgency === "unknown") confidence -= 3;
  if (spec.iteration === "unknown") confidence -= 7;

  // Complex scenarios reduce confidence
  if (spec.integrations === "complex") confidence -= 5;
  if (spec.iteration === "exploratory") confidence -= 5;

  // Risk affects confidence
  if (avgRiskWeight > 1.2) confidence -= 5;
  if (avgRiskWeight > 1.4) confidence -= 5;

  confidence = Math.max(0, Math.min(100, confidence));

  // 8. Extract cost drivers
  const costDrivers: CostDriver[] = [];

  // Materials cost driver (if significant)
  if (materialsCost > 100) {
    costDrivers.push({
      name: "AI Token Usage (Materials)",
      impact: materialsCost > 500 ? "high" : "medium",
      amount: Math.round(materialsCost),
    });
  }

  // Platform cost driver
  if (platformMultiplier > 1.0) {
    const impact = platformMultiplier >= 1.5 ? "high" : "medium";
    costDrivers.push({
      name: PLATFORM_LABELS[spec.platform],
      impact,
      amount: Math.round((platformMultiplier - 1.0) * totalMidpoint * 0.4),
    });
  }

  // Auth cost driver
  if (authMultiplier > 1.0) {
    const impact = authMultiplier >= 1.3 ? "high" : "medium";
    costDrivers.push({
      name: AUTH_LABELS[spec.authLevel],
      impact,
      amount: Math.round((authMultiplier - 1.0) * totalMidpoint * 0.3),
    });
  }

  // Quality cost driver
  if (qualityMultiplier > 1.0) {
    const impact = qualityMultiplier >= 1.5 ? "high" : "medium";
    costDrivers.push({
      name: QUALITY_LABELS[spec.quality],
      impact,
      amount: Math.round((qualityMultiplier - 1.0) * totalMidpoint * 0.3),
    });
  } else if (qualityMultiplier < 1.0) {
    costDrivers.push({
      name: `${QUALITY_LABELS[spec.quality]} (savings)`,
      impact: "medium",
      amount: -Math.round((1.0 - qualityMultiplier) * totalMidpoint * 0.3),
    });
  }

  // Integration cost driver
  if (integrationMultiplier > 1.0) {
    const impact = integrationMultiplier >= 1.3 ? "high" : "medium";
    costDrivers.push({
      name: INTEGRATION_LABELS[spec.integrations],
      impact,
      amount: Math.round((integrationMultiplier - 1.0) * totalMidpoint * 0.25),
    });
  }

  // Urgency cost driver
  if (urgencyMultiplier > 1.0) {
    const impact = urgencyMultiplier >= 1.3 ? "high" : "medium";
    costDrivers.push({
      name: URGENCY_LABELS[spec.urgency],
      impact,
      amount: Math.round((urgencyMultiplier - 1.0) * totalMidpoint * 0.25),
    });
  }

  // Iteration cost driver
  if (iterationMultiplier > 1.0) {
    const impact = iterationMultiplier >= 1.2 ? "high" : "medium";
    costDrivers.push({
      name: ITERATION_LABELS[spec.iteration],
      impact,
      amount: Math.round((iterationMultiplier - 1.0) * totalMidpoint * 0.2),
    });
  } else if (iterationMultiplier < 1.0) {
    costDrivers.push({
      name: `${ITERATION_LABELS[spec.iteration]} (savings)`,
      impact: "medium",
      amount: -Math.round((1.0 - iterationMultiplier) * totalMidpoint * 0.2),
    });
  }

  // Risk buffer cost driver (if significant)
  if (riskBuffer > 200) {
    costDrivers.push({
      name: "Uncertainty Buffer",
      impact: riskBuffer > 1000 ? "high" : "medium",
      amount: Math.round(riskBuffer),
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

  // Integration-specific
  if (spec.integrations === "complex") {
    assumptions.push("Complex integrations may require additional discovery time");
    assumptions.push("Third-party API rate limits and costs apply");
  }
  if (spec.integrations === "unknown") {
    assumptions.push("Integration requirements to be determined; may affect scope");
  }

  // Urgency-specific
  if (spec.urgency === "fast") {
    assumptions.push("Fast track delivery requires dedicated focus");
  } else if (spec.urgency === "rush") {
    assumptions.push("Rush delivery may require overtime and premium resources");
    assumptions.push("Quality gates still enforced; timeline compression only");
  }
  if (spec.urgency === "unknown") {
    assumptions.push("Timeline requirements to be confirmed");
  }

  // Iteration-specific
  if (spec.iteration === "exploratory") {
    assumptions.push("Exploratory phase includes discovery and prototyping");
    assumptions.push("Scope may evolve based on learnings");
  }
  if (spec.iteration === "minimal") {
    assumptions.push("Assumes well-defined requirements with minimal changes");
  }
  if (spec.iteration === "unknown") {
    assumptions.push("Iteration approach to be determined");
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

  // 9. Check for architect review triggers (PRD Section 8.6)
  // Modules with architectReviewTrigger: true require human review
  const reviewTriggerModules = allModules
    .map((moduleId) => catalogMap.get(moduleId))
    .filter((m): m is ModuleCatalogEntry => m !== undefined && m.architectReviewTrigger === true)
    .map((m) => m.name);
  const needsReview = reviewTriggerModules.length > 0;

  // 10. Determine degraded mode (PRD Section 12.2)
  // Triggers: low confidence, too many unknowns, complex modules, or architect triggers
  let unknownCount = 0;
  if (spec.platform === "unknown") unknownCount++;
  if (spec.authLevel === "unknown") unknownCount++;
  if (spec.quality === "unknown") unknownCount++;
  if (spec.integrations === "unknown") unknownCount++;
  if (spec.urgency === "unknown") unknownCount++;
  if (spec.iteration === "unknown") unknownCount++;

  const degradedReasons: string[] = [];

  if (confidence < 40) {
    degradedReasons.push("Low confidence score");
  }
  if (unknownCount >= 3) {
    degradedReasons.push("Multiple undecided factors");
  }
  if (allModules.length === 0) {
    degradedReasons.push("No modules selected");
  }
  if (spec.integrations === "complex" && spec.iteration === "exploratory") {
    degradedReasons.push("Complex scope with high uncertainty");
  }
  if (needsReview) {
    degradedReasons.push(`Complex modules selected: ${reviewTriggerModules.join(", ")}`);
  }

  const degradedMode = degradedReasons.length > 0;
  const degradedReason = degradedMode
    ? `This estimate has higher uncertainty: ${degradedReasons.join(". ")}. We recommend a discovery call to refine the scope.`
    : undefined;

  return {
    priceMin: roundToNearest100(Math.max(2000, p10)),
    priceMid: roundToNearest100(Math.max(3000, p50)),
    priceMax: roundToNearest100(Math.max(4000, p90)),
    confidence,
    hoursMin: Math.round(hoursMin),
    hoursMax: Math.round(hoursMax),
    daysMin: Math.round(daysMin * 10) / 10,
    daysMax: Math.round(daysMax * 10) / 10,
    // Token-based pricing breakdown
    tokensIn,
    tokensOut,
    materialsCost: Math.round(materialsCost),
    laborCost: Math.round(laborCost),
    riskBuffer: Math.round(riskBuffer),
    costDrivers: costDrivers.slice(0, 6), // Top 6 drivers
    assumptions,
    // Degraded mode
    degradedMode,
    degradedReason,
    // Architect review
    needsReview,
    reviewTriggerModules: needsReview ? reviewTriggerModules : undefined,
  };
}

function roundToNearest100(value: number): number {
  return Math.round(value / 100) * 100;
}

/**
 * PRD Section 8.6: Delta Estimation
 * Calculate the cost difference when adding or removing modules from an existing estimate.
 *
 * This is a stub for future Control Room functionality.
 * When implemented, this will allow:
 * - Feature deltas (adding modules to existing builds)
 * - Negative deltas (removing modules)
 * - Scope change estimates
 *
 * @param baseEstimate - The existing estimate to modify
 * @param addModules - Module IDs to add
 * @param removeModules - Module IDs to remove
 * @param catalog - Module catalog for lookups
 * @param rateCard - Current rate card for pricing
 * @returns Delta estimate result (stub - returns null until implemented)
 */
export interface DeltaEstimateResult {
  priceDelta: number;
  hoursDelta: number;
  daysDelta: number;
  addedModules: string[];
  removedModules: string[];
  newTotal: EstimateResult;
}

export function calculateDelta(
  _baseEstimate: EstimateResult,
  _addModules: string[],
  _removeModules: string[],
  _catalog: ModuleCatalogEntry[],
  _rateCard: RateCard
): DeltaEstimateResult | null {
  // TODO: Implement delta estimation for Control Room
  // This will be implemented when the authenticated Control Room is built.
  // For now, return null to indicate feature is not yet available.
  return null;
}
