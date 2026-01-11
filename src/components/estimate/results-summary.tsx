"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/mock-data";
import { AnimatedPrice, AnimatedPercent, AnimatedNumber } from "@/components/ui/animated-number";

// Format token counts nicely (e.g., 1.5M, 250k)
function formatTokenCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${Math.round(count / 1000)}k`;
  }
  return count.toLocaleString();
}

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
    // PRD 8.2: Token breakdown for P10/P50/P90
    tokensIn?: number;
    tokensOut?: number;
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

  // PRD 8.2: Generate detailed confidence score breakdown
  const getConfidenceBreakdown = () => {
    const factors: { label: string; impact: number; type: "positive" | "negative" | "neutral" }[] = [];
    let baseScore = 85;

    // Platform factor
    if (estimate.platform === "unknown") {
      factors.push({ label: "Platform TBD", impact: -10, type: "negative" });
    } else if (estimate.platform === "both") {
      factors.push({ label: "Cross-platform scope", impact: -5, type: "negative" });
    } else {
      factors.push({ label: "Platform specified", impact: 0, type: "positive" });
    }

    // Auth factor
    if (estimate.authLevel === "unknown") {
      factors.push({ label: "Auth level TBD", impact: -8, type: "negative" });
    } else if (estimate.authLevel === "multi-tenant") {
      factors.push({ label: "Multi-tenant complexity", impact: -5, type: "negative" });
    } else {
      factors.push({ label: "Auth defined", impact: 0, type: "positive" });
    }

    // Quality factor
    if (estimate.quality === "unknown") {
      factors.push({ label: "Quality level TBD", impact: -10, type: "negative" });
    } else {
      factors.push({ label: "Quality tier set", impact: 0, type: "positive" });
    }

    // Module factors
    if (estimate.modules.length === 0) {
      factors.push({ label: "No modules selected", impact: -30, type: "negative" });
    } else if (estimate.modules.length < 3) {
      factors.push({ label: "Limited scope", impact: -10, type: "negative" });
    } else if (estimate.modules.length > 8) {
      factors.push({ label: "Large scope (8+ modules)", impact: -5, type: "negative" });
    } else {
      factors.push({ label: `${estimate.modules.length} modules defined`, impact: 0, type: "positive" });
    }

    return { baseScore, factors };
  };

  const confidenceBreakdown = getConfidenceBreakdown();

  // Legacy support for simple explanation
  const getConfidenceExplanation = () => {
    const negativeFactors = confidenceBreakdown.factors.filter(f => f.type === "negative");
    if (negativeFactors.length === 0) {
      return "High confidence based on your specific selections.";
    }
    return negativeFactors.map(f => f.label).join(". ") + ".";
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
                className="w-4 h-4 rounded-full bg-subtle flex items-center justify-center text-secondary-custom hover:bg-muted transition-colors"
                aria-label="See confidence breakdown"
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
                    d={showConfidenceTooltip ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                  />
                </svg>
              </button>
            </div>
            <p className={`text-h3 font-semibold ${confidenceColor}`}>
              <AnimatedPercent value={estimate.confidence} />
            </p>

            {/* PRD 8.2: Expanded confidence breakdown */}
            {showConfidenceTooltip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-4 bg-surface border border-border-default rounded-xl shadow-xl z-10 text-left">
                <p className="font-semibold text-foreground mb-3">Confidence Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-secondary-custom">Base score</span>
                    <span className="font-medium text-foreground">{confidenceBreakdown.baseScore}%</span>
                  </div>
                  {confidenceBreakdown.factors.map((factor, idx) => (
                    <div key={idx} className="flex justify-between items-center text-body-sm">
                      <span className={factor.type === "negative" ? "text-destructive" : factor.type === "positive" ? "text-success" : "text-secondary-custom"}>
                        {factor.label}
                      </span>
                      <span className={`font-medium ${factor.impact < 0 ? "text-destructive" : factor.impact > 0 ? "text-success" : "text-muted-foreground"}`}>
                        {factor.impact > 0 ? "+" : ""}{factor.impact}%
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-border-default flex justify-between items-center">
                    <span className="font-medium text-foreground">Final Score</span>
                    <span className={`font-bold ${confidenceColor}`}>{estimate.confidence}%</span>
                  </div>
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-l border-t border-border-default rotate-45" />
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

      {/* PRD 8.2: Token breakdown display */}
      {(estimate.tokensIn || estimate.tokensOut) && (
        <div className="py-6 border-b border-border-default">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-label text-secondary-custom uppercase tracking-wider">
                AI Token Usage
              </h3>
              <div className="group relative">
                <button
                  className="w-4 h-4 rounded-full bg-subtle flex items-center justify-center text-secondary-custom hover:bg-muted transition-colors"
                  aria-label="What are tokens?"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-foreground text-white text-body-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <p className="font-medium mb-1">What are AI tokens?</p>
                  <p className="text-white/80">Tokens are units of text processed by AI models. Your project uses tokens for code generation, analysis, and refinement.</p>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-subtle rounded-xl">
              <p className="text-body-sm text-secondary-custom mb-1">Input Tokens</p>
              <p className="text-h4 font-semibold text-foreground tabular-nums">
                {formatTokenCount(estimate.tokensIn ?? 0)}
              </p>
              <p className="text-label text-muted-custom mt-1">Prompts & context</p>
            </div>
            <div className="p-4 bg-subtle rounded-xl">
              <p className="text-body-sm text-secondary-custom mb-1">Output Tokens</p>
              <p className="text-h4 font-semibold text-foreground tabular-nums">
                {formatTokenCount(estimate.tokensOut ?? 0)}
              </p>
              <p className="text-label text-muted-custom mt-1">Generated code</p>
            </div>
          </div>
        </div>
      )}

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
