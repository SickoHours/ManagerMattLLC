"use client";

import { cn } from "@/lib/utils";

// PRD 10.2: Enhanced comparable builds with outcome data
interface ComparableBuild {
  type: string;
  modules: string[];
  priceTier: "$" | "$$" | "$$$" | "$$$$";
  priceRange: { min: number; max: number }; // Actual range for variance calculation
  timeline: string;
  quality: string;
  outcome?: {
    status: "shipped" | "live" | "ongoing";
    satisfaction?: "high" | "medium";
    note?: string;
  };
}

// Static anonymized comparable builds with outcome data
const COMPARABLE_BUILDS: ComparableBuild[] = [
  {
    type: "Internal Dashboard",
    modules: ["Dashboard", "Analytics", "Database", "API"],
    priceTier: "$$",
    priceRange: { min: 15000, max: 25000 },
    timeline: "2-3 weeks",
    quality: "MVP",
    outcome: {
      status: "live",
      satisfaction: "high",
      note: "Shipped on time",
    },
  },
  {
    type: "SaaS Platform",
    modules: ["Auth", "Dashboard", "Settings", "Billing", "API"],
    priceTier: "$$$",
    priceRange: { min: 35000, max: 55000 },
    timeline: "4-6 weeks",
    quality: "Production",
    outcome: {
      status: "live",
      satisfaction: "high",
      note: "500+ users",
    },
  },
  {
    type: "Mobile App",
    modules: ["Auth", "Push Notifications", "API", "Database"],
    priceTier: "$$",
    priceRange: { min: 20000, max: 35000 },
    timeline: "3-4 weeks",
    quality: "MVP",
    outcome: {
      status: "shipped",
      satisfaction: "high",
      note: "App Store approved",
    },
  },
  {
    type: "E-commerce Site",
    modules: ["Products", "Cart", "Payments", "Admin", "API"],
    priceTier: "$$$",
    priceRange: { min: 40000, max: 65000 },
    timeline: "5-8 weeks",
    quality: "Production",
    outcome: {
      status: "live",
      satisfaction: "high",
      note: "$100k+ processed",
    },
  },
  {
    type: "Automation Tool",
    modules: ["Integrations", "Workflows", "Dashboard", "API"],
    priceTier: "$$",
    priceRange: { min: 18000, max: 30000 },
    timeline: "2-4 weeks",
    quality: "MVP",
    outcome: {
      status: "live",
      satisfaction: "medium",
      note: "10+ integrations",
    },
  },
];

interface ComparableBuildsProps {
  selectedModules?: string[];
  quality?: string;
  userPriceMin?: number;
  userPriceMax?: number;
}

export function ComparableBuilds({
  selectedModules = [],
  quality,
  userPriceMin,
  userPriceMax,
}: ComparableBuildsProps) {
  // Find the most relevant comparable builds based on selected modules
  const scoredBuilds = COMPARABLE_BUILDS.map((build) => {
    let score = 0;
    let matchedModules: string[] = [];

    // Score based on module overlap
    const selectedLower = selectedModules.map((m) => m.toLowerCase());
    build.modules.forEach((m) => {
      const matched = selectedLower.some(
        (s) => m.toLowerCase().includes(s) || s.includes(m.toLowerCase())
      );
      if (matched) {
        score += 1;
        matchedModules.push(m);
      }
    });

    // Score based on quality match
    if (quality && build.quality.toLowerCase() === quality.toLowerCase()) {
      score += 0.5;
    }

    // Calculate relevance percentage
    const totalPossible = Math.max(build.modules.length, selectedModules.length);
    const relevance = totalPossible > 0 ? Math.round((matchedModules.length / totalPossible) * 100) : 0;

    // Calculate price variance from user's estimate
    let priceVariance: "lower" | "similar" | "higher" | null = null;
    if (userPriceMin && userPriceMax) {
      const userMid = (userPriceMin + userPriceMax) / 2;
      const buildMid = (build.priceRange.min + build.priceRange.max) / 2;
      const variance = ((buildMid - userMid) / userMid) * 100;

      if (variance < -15) priceVariance = "lower";
      else if (variance > 15) priceVariance = "higher";
      else priceVariance = "similar";
    }

    return { ...build, score, matchedModules, relevance, priceVariance };
  });

  // Sort by score and take top 3
  const topBuilds = scoredBuilds
    .filter((b) => b.score > 0) // Only show builds with some relevance
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // If no relevant builds, show top 3 anyway
  const displayBuilds = topBuilds.length > 0 ? topBuilds : scoredBuilds.slice(0, 3);

  const priceTierColors: Record<string, string> = {
    $: "bg-success/10 text-success",
    $$: "bg-blue-100 text-blue-700",
    $$$: "bg-purple-100 text-purple-700",
    $$$$: "bg-amber-100 text-amber-700",
  };

  const outcomeStatusIcons: Record<string, { icon: string; color: string; label: string }> = {
    shipped: {
      icon: "M5 13l4 4L19 7",
      color: "text-success",
      label: "Shipped",
    },
    live: {
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      color: "text-accent",
      label: "Live",
    },
    ongoing: {
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
      color: "text-secondary-custom",
      label: "In Progress",
    },
  };

  const varianceInfo: Record<string, { icon: string; color: string; label: string }> = {
    lower: {
      icon: "M19 14l-7 7m0 0l-7-7m7 7V3",
      color: "text-success",
      label: "Lower cost",
    },
    similar: {
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-secondary-custom",
      label: "Similar cost",
    },
    higher: {
      icon: "M5 10l7-7m0 0l7 7m-7-7v18",
      color: "text-warning",
      label: "Higher cost",
    },
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-md">
      <h3 className="text-h4 text-foreground mb-2">Similar Projects</h3>
      <p className="text-body-sm text-secondary-custom mb-5">
        Anonymized examples of comparable builds we&apos;ve delivered, ranked by relevance to your project.
      </p>

      <div className="space-y-4">
        {displayBuilds.map((build, index) => {
          const outcomeIcon = build.outcome ? outcomeStatusIcons[build.outcome.status] : null;
          const varianceIcon = build.priceVariance ? varianceInfo[build.priceVariance] : null;

          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-border-default hover:border-accent/30 transition-colors"
            >
              {/* Header with relevance badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{build.type}</h4>
                  {build.relevance > 0 && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      build.relevance >= 60 ? "bg-success/10 text-success" :
                      build.relevance >= 30 ? "bg-warning/10 text-warning" :
                      "bg-subtle text-secondary-custom"
                    )}>
                      {build.relevance}% match
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-body-sm font-medium ${priceTierColors[build.priceTier]}`}
                >
                  {build.priceTier}
                </span>
              </div>

              {/* Modules with highlighting for matched */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {build.modules.slice(0, 4).map((module, mIndex) => {
                  const isMatched = build.matchedModules.includes(module);
                  return (
                    <span
                      key={mIndex}
                      className={cn(
                        "px-2 py-0.5 rounded text-body-sm",
                        isMatched
                          ? "bg-accent/10 text-accent font-medium"
                          : "bg-subtle text-secondary-custom"
                      )}
                    >
                      {module}
                    </span>
                  );
                })}
                {build.modules.length > 4 && (
                  <span className="px-2 py-0.5 text-body-sm text-secondary-custom">
                    +{build.modules.length - 4} more
                  </span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-body-sm text-secondary-custom">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {build.timeline}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {build.quality}
                </span>
                {varianceIcon && (
                  <span className={`flex items-center gap-1 ${varianceIcon.color}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={varianceIcon.icon}
                      />
                    </svg>
                    {varianceIcon.label}
                  </span>
                )}
              </div>

              {/* Outcome badge - PRD 10.2 */}
              {build.outcome && outcomeIcon && (
                <div className="mt-3 pt-3 border-t border-border-default flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className={`w-4 h-4 ${outcomeIcon.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={outcomeIcon.icon}
                      />
                    </svg>
                    <span className={`text-body-sm font-medium ${outcomeIcon.color}`}>
                      {outcomeIcon.label}
                    </span>
                  </div>
                  {build.outcome.note && (
                    <span className="text-body-sm text-secondary-custom">
                      {build.outcome.note}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust footer */}
      <div className="mt-5 pt-4 border-t border-border-default">
        <div className="flex items-center gap-2 text-body-sm text-secondary-custom">
          <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>All builds completed with full transparency</span>
        </div>
      </div>
    </div>
  );
}
