"use client";

import { formatPrice } from "@/lib/mock-data";

interface CostDriver {
  name: string;
  impact: string;
  amount: number;
}

interface CostBreakdownProps {
  estimate: {
    costDrivers: CostDriver[];
    hoursMin: number;
    hoursMax: number;
  };
}

// PRD 8.2: Categorize drivers by source for better traceability
function getCategoryInfo(driverName: string): { category: string; icon: string; description: string } {
  const name = driverName.toLowerCase();

  if (name.includes("platform") || name.includes("web") || name.includes("mobile")) {
    return { category: "Platform", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", description: "Based on target platform selection" };
  }
  if (name.includes("auth") || name.includes("tenant") || name.includes("role")) {
    return { category: "Auth", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", description: "Based on authentication complexity" };
  }
  if (name.includes("quality") || name.includes("production") || name.includes("prototype") || name.includes("mvp")) {
    return { category: "Quality", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", description: "Based on quality tier requirements" };
  }
  if (name.includes("integration") || name.includes("api")) {
    return { category: "Integration", icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", description: "Based on external API integrations" };
  }
  if (name.includes("urgency") || name.includes("rush") || name.includes("fast")) {
    return { category: "Timeline", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", description: "Based on delivery timeline" };
  }
  if (name.includes("iteration") || name.includes("exploratory")) {
    return { category: "Scope", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", description: "Based on expected iteration level" };
  }
  if (name.includes("token") || name.includes("ai") || name.includes("material")) {
    return { category: "AI", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", description: "AI token usage for code generation" };
  }
  if (name.includes("buffer") || name.includes("uncertainty") || name.includes("risk")) {
    return { category: "Buffer", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", description: "Risk buffer for unforeseen complexity" };
  }

  // Default: Module
  return { category: "Module", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", description: "Based on selected module" };
}

export function CostBreakdown({ estimate }: CostBreakdownProps) {
  const { costDrivers } = estimate;

  // Sort by absolute amount (highest first)
  const sortedDrivers = [...costDrivers].sort(
    (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
  );

  const impactColors: Record<string, string> = {
    high: "bg-accent/10 text-accent border-accent/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-subtle text-secondary-custom border-border-default",
  };

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md">
      <h2 className="text-h3 text-foreground mb-6">Cost Breakdown</h2>

      {/* Hours summary */}
      <div className="flex items-center justify-between p-4 bg-subtle rounded-xl mb-6">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-secondary-custom"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-body text-secondary-custom">
            Estimated Hours
          </span>
        </div>
        <span className="text-body font-medium text-foreground">
          {estimate.hoursMin} - {estimate.hoursMax} hours
        </span>
      </div>

      {/* Cost drivers */}
      <div className="space-y-3">
        <h3 className="text-label text-secondary-custom uppercase tracking-wider">
          Cost Drivers
        </h3>

        {sortedDrivers.length === 0 ? (
          <p className="text-body-sm text-secondary-custom py-4">
            Select some modules to see cost breakdown.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedDrivers.map((driver, index) => {
              const categoryInfo = getCategoryInfo(driver.name);
              return (
                <div
                  key={index}
                  className="group flex items-center justify-between p-3 rounded-lg border border-border-default hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* PRD 8.2: Category icon with tooltip for traceability */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-subtle flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-secondary-custom"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={categoryInfo.icon}
                          />
                        </svg>
                      </div>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-foreground text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <p className="font-medium">{categoryInfo.category}</p>
                        <p className="text-white/80 mt-0.5">{categoryInfo.description}</p>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body text-foreground">{driver.name}</span>
                      <span className="text-label text-muted-custom">{categoryInfo.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${impactColors[driver.impact] || impactColors.low}`}
                    >
                      {driver.impact}
                    </span>
                    <span
                      className={`text-body font-medium tabular-nums min-w-[80px] text-right ${
                        driver.amount >= 0 ? "text-foreground" : "text-success"
                      }`}
                    >
                      {driver.amount >= 0 ? "+" : ""}
                      {formatPrice(driver.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note about variance */}
      <div className="mt-6 p-4 bg-warning/5 border border-warning/20 rounded-xl">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-warning flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-body-sm text-foreground font-medium">
              About this estimate
            </p>
            <p className="text-body-sm text-secondary-custom mt-1">
              The price range reflects uncertainty in scope and complexity.
              &quot;I don&apos;t know&quot; selections widen the range.
              Final pricing confirmed after discovery call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
