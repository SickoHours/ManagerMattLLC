"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/mock-data";
import { AnimatedPrice, AnimatedPercent, AnimatedNumber } from "@/components/ui/animated-number";

interface ResultsSummaryProps {
  estimate: {
    priceMin: number;
    priceMax: number;
    priceMid: number;
    confidence: number;
    hoursMin: number;
    hoursMax: number;
    daysMin: number;
    daysMax: number;
    platform: string;
    authLevel: string;
    quality: string;
    modules: string[];
    moduleDetails?: { id: string; name: string; category: string }[];
    degradedMode?: boolean;
    unknownSelections?: number;
  };
}

const PLATFORM_LABELS: Record<string, string> = {
  web: "Web Application",
  mobile: "Mobile Apps",
  both: "Web + Mobile",
  unknown: "Platform TBD",
};

const AUTH_LABELS: Record<string, string> = {
  none: "No Authentication",
  basic: "Basic Auth",
  roles: "Role-Based",
  "multi-tenant": "Multi-Tenant",
  unknown: "Auth TBD",
};

const QUALITY_LABELS: Record<string, string> = {
  prototype: "Prototype",
  mvp: "MVP",
  production: "Production",
  unknown: "Quality TBD",
};

export function ResultsSummary({ estimate }: ResultsSummaryProps) {
  const [showConfidenceTooltip, setShowConfidenceTooltip] = useState(false);

  const confidenceColor =
    estimate.confidence >= 70
      ? "text-success"
      : estimate.confidence >= 50
        ? "text-warning"
        : "text-destructive";

  // Generate confidence explanation
  const getConfidenceExplanation = () => {
    const factors: string[] = [];

    if (estimate.platform === "unknown") {
      factors.push("Platform not specified");
    }
    if (estimate.authLevel === "unknown") {
      factors.push("Authentication level not specified");
    }
    if (estimate.quality === "unknown") {
      factors.push("Quality tier not specified");
    }
    if (estimate.modules.length === 0) {
      factors.push("No modules selected");
    }
    if (estimate.modules.length > 5) {
      factors.push("Complex feature set (many modules)");
    }
    if (estimate.authLevel === "multi-tenant") {
      factors.push("Multi-tenant auth adds complexity");
    }
    if (estimate.platform === "both") {
      factors.push("Cross-platform increases variance");
    }

    if (factors.length === 0) {
      return "High confidence based on your specific selections.";
    }

    return factors.join(". ") + ".";
  };

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md">
      {/* Price range */}
      <div className="text-center pb-6 border-b border-border-default">
        <p className="text-label text-secondary-custom uppercase tracking-wider mb-2">
          Estimated Cost Range
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <AnimatedPrice value={estimate.priceMin} className="text-h2 text-foreground" />
          <span className="text-body text-secondary-custom">to</span>
          <AnimatedPrice value={estimate.priceMax} className="text-h2 text-foreground" />
        </div>
        <p className="mt-2 text-body-sm text-secondary-custom">
          Most likely: <AnimatedPrice value={estimate.priceMid} />
        </p>

        {/* P10/P50/P90 Distribution Visualization */}
        <div className="mt-6 pt-4">
          <div className="flex items-center justify-between text-label text-secondary-custom mb-2">
            <span>P10 (Best Case)</span>
            <span>P50 (Likely)</span>
            <span>P90 (Worst Case)</span>
          </div>
          <div className="relative h-3 bg-subtle rounded-full overflow-hidden">
            {/* Background gradient showing distribution */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(to right, #22c55e, #22c55e 20%, #eab308 40%, #eab308 60%, #ef4444 80%, #ef4444)",
                opacity: 0.2,
              }}
            />
            {/* P50 marker (center) */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-accent rounded-full"
              style={{ left: "50%", transform: "translateX(-50%)" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-body-sm font-medium text-success">
              {formatPrice(estimate.priceMin)}
            </span>
            <span className="text-body-sm font-semibold text-accent">
              {formatPrice(estimate.priceMid)}
            </span>
            <span className="text-body-sm font-medium text-destructive">
              {formatPrice(estimate.priceMax)}
            </span>
          </div>
          <p className="mt-3 text-label text-muted-custom">
            Range based on {estimate.confidence >= 70 ? "Monte Carlo simulation" : "uncertainty in selections"}
          </p>
        </div>
      </div>

      {/* Confidence and timeline */}
      <div className={`grid ${estimate.degradedMode ? 'grid-cols-1' : 'grid-cols-2'} gap-6 py-6 border-b border-border-default`}>
        {!estimate.degradedMode && (
          <div className="text-center relative">
            <div className="flex items-center justify-center gap-1 mb-1">
              <p className="text-label text-secondary-custom uppercase tracking-wider">
                Confidence
              </p>
              <button
                onClick={() => setShowConfidenceTooltip(!showConfidenceTooltip)}
                onMouseEnter={() => setShowConfidenceTooltip(true)}
                onMouseLeave={() => setShowConfidenceTooltip(false)}
                className="w-4 h-4 rounded-full bg-subtle flex items-center justify-center text-secondary-custom hover:bg-muted transition-colors"
                aria-label="What affects confidence?"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <p className={`text-h3 font-semibold ${confidenceColor}`}>
              <AnimatedPercent value={estimate.confidence} />
            </p>

            {/* Confidence tooltip */}
            {showConfidenceTooltip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-foreground text-white text-body-sm rounded-lg shadow-lg z-10">
                <p className="font-medium mb-1">What affects confidence?</p>
                <p className="text-white/80">{getConfidenceExplanation()}</p>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
              </div>
            )}
          </div>
        )}
        <div className="text-center">
          <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
            Timeline
          </p>
          <p className="text-h3 font-semibold text-foreground">
            <AnimatedNumber value={Math.round(estimate.daysMin)} formatFn={(v) => v.toString()} />
            -
            <AnimatedNumber value={Math.round(estimate.daysMax)} formatFn={(v) => v.toString()} /> days
          </p>
        </div>
      </div>

      {/* Build spec summary */}
      <div className="pt-6 space-y-4">
        <h3 className="text-label text-secondary-custom uppercase tracking-wider">
          Your Build
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-body-sm text-secondary-custom">Platform</p>
            <p className="text-body font-medium text-foreground">
              {PLATFORM_LABELS[estimate.platform] || estimate.platform}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-secondary-custom">Auth</p>
            <p className="text-body font-medium text-foreground">
              {AUTH_LABELS[estimate.authLevel] || estimate.authLevel}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-secondary-custom">Quality</p>
            <p className="text-body font-medium text-foreground">
              {QUALITY_LABELS[estimate.quality] || estimate.quality}
            </p>
          </div>
        </div>

        {/* Modules */}
        {estimate.moduleDetails && estimate.moduleDetails.length > 0 && (
          <div className="pt-2">
            <p className="text-body-sm text-secondary-custom mb-2">
              {estimate.moduleDetails.length} Module
              {estimate.moduleDetails.length !== 1 ? "s" : ""} Selected
            </p>
            <div className="flex flex-wrap gap-2">
              {estimate.moduleDetails.map((module) => (
                <span
                  key={module.id}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-subtle text-body-sm text-secondary-custom"
                >
                  {module.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
