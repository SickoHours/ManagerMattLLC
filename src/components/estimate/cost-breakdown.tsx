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
            {sortedDrivers.map((driver, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border-default"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${impactColors[driver.impact] || impactColors.low}`}
                  >
                    {driver.impact}
                  </span>
                  <span className="text-body text-foreground">{driver.name}</span>
                </div>
                <span
                  className={`text-body font-medium ${
                    driver.amount >= 0 ? "text-foreground" : "text-success"
                  }`}
                >
                  {driver.amount >= 0 ? "+" : ""}
                  {formatPrice(driver.amount)}
                </span>
              </div>
            ))}
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
