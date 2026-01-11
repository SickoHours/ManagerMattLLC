"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header } from "@/components/layout/header";
import { formatPrice } from "@/lib/mock-data";
import { PricingFormula } from "@/components/estimate/pricing-formula";

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

// PRD 8.2: Token count formatting
function formatTokenCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${Math.round(count / 1000)}k`;
  }
  return count.toLocaleString();
}

// PRD 8.2: Confidence breakdown calculation
function getConfidenceBreakdown(snapshot: {
  platform: string;
  authLevel: string;
  quality: string;
  modules: string[];
}) {
  const factors: { label: string; impact: number; type: "positive" | "negative" | "neutral" }[] = [];
  const baseScore = 85;

  // Platform factor
  if (snapshot.platform === "unknown") {
    factors.push({ label: "Platform TBD", impact: -10, type: "negative" });
  } else if (snapshot.platform === "both") {
    factors.push({ label: "Cross-platform scope", impact: -5, type: "negative" });
  } else {
    factors.push({ label: "Platform specified", impact: 0, type: "positive" });
  }

  // Auth factor
  if (snapshot.authLevel === "unknown") {
    factors.push({ label: "Auth level TBD", impact: -8, type: "negative" });
  } else if (snapshot.authLevel === "multi-tenant") {
    factors.push({ label: "Multi-tenant complexity", impact: -5, type: "negative" });
  } else {
    factors.push({ label: "Auth defined", impact: 0, type: "positive" });
  }

  // Quality factor
  if (snapshot.quality === "unknown") {
    factors.push({ label: "Quality level TBD", impact: -10, type: "negative" });
  } else {
    factors.push({ label: "Quality tier set", impact: 0, type: "positive" });
  }

  // Module factors
  if (snapshot.modules.length === 0) {
    factors.push({ label: "No modules selected", impact: -30, type: "negative" });
  } else if (snapshot.modules.length < 3) {
    factors.push({ label: "Limited scope", impact: -10, type: "negative" });
  } else if (snapshot.modules.length > 8) {
    factors.push({ label: "Large scope (8+ modules)", impact: -5, type: "negative" });
  } else {
    factors.push({ label: `${snapshot.modules.length} modules defined`, impact: 0, type: "positive" });
  }

  return { baseScore, factors };
}

export default function PublicQuotePage() {
  const params = useParams();
  const shareId = params.shareId as string;

  const quote = useQuery(api.quotes.getByShareId, { shareId });
  const markViewed = useMutation(api.quotes.markViewed);

  // Mark as viewed when page loads
  useEffect(() => {
    if (quote && quote.status === "sent") {
      markViewed({ shareId });
    }
  }, [quote, shareId, markViewed]);

  // Loading state
  if (quote === undefined) {
    return (
      <div className="min-h-screen bg-page">
        <Header />
        <main className="container-wide mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-subtle rounded w-1/3 mb-4" />
            <div className="h-4 bg-subtle rounded w-1/2 mb-8" />
            <div className="h-64 bg-subtle rounded-2xl mb-6" />
            <div className="h-48 bg-subtle rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  // Not found state
  if (quote === null) {
    return (
      <div className="min-h-screen bg-page">
        <Header />
        <main className="container-wide mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-subtle flex items-center justify-center">
              <svg
                className="w-8 h-8 text-secondary-custom"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-h2 text-foreground mb-4">Quote Not Found</h1>
            <p className="text-body text-secondary-custom mb-8">
              This quote link may have expired or is invalid.
            </p>
            <a
              href="/estimate"
              className="inline-flex items-center justify-center h-11 px-6 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Create New Estimate
            </a>
          </div>
        </main>
      </div>
    );
  }

  const [showConfidenceTooltip, setShowConfidenceTooltip] = useState(false);
  const { snapshot, moduleDetails } = quote;

  const confidenceColor =
    snapshot.confidence >= 70
      ? "text-success"
      : snapshot.confidence >= 50
        ? "text-warning"
        : "text-destructive";

  // PRD 8.2: Calculate confidence breakdown
  const confidenceBreakdown = getConfidenceBreakdown(snapshot);

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <main className="container-wide mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-10">
            <p className="text-label text-secondary-custom uppercase tracking-wider mb-2">
              Your Project Quote
            </p>
            <h1 className="text-h1 text-foreground">Manager Matt LLC</h1>
          </div>

          {/* Price card */}
          <div className="bg-surface rounded-2xl p-8 shadow-md mb-6">
            <div className="text-center pb-6 border-b border-border-default">
              <p className="text-label text-secondary-custom uppercase tracking-wider mb-2">
                Estimated Cost Range
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-display text-foreground">
                  {formatPrice(snapshot.priceMin)}
                </span>
                <span className="text-h3 text-secondary-custom">to</span>
                <span className="text-display text-foreground">
                  {formatPrice(snapshot.priceMax)}
                </span>
              </div>
              <p className="mt-2 text-body text-secondary-custom">
                Most likely: {formatPrice(snapshot.priceMid)}
              </p>
            </div>

            {/* P10/P50/P90 Distribution Visualization - PRD 8.2 */}
            <div className="mt-6 pt-4">
              <div className="flex items-center justify-between text-label text-secondary-custom mb-2">
                <span>P10 (Best Case)</span>
                <span>P50 (Likely)</span>
                <span>P90 (Worst Case)</span>
              </div>
              <div className="relative h-3 bg-subtle rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #22c55e, #22c55e 20%, #eab308 40%, #eab308 60%, #ef4444 80%, #ef4444)",
                    opacity: 0.2,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-accent rounded-full"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-body-sm font-medium text-success">
                  {formatPrice(snapshot.priceMin)}
                </span>
                <span className="text-body-sm font-semibold text-accent">
                  {formatPrice(snapshot.priceMid)}
                </span>
                <span className="text-body-sm font-medium text-destructive">
                  {formatPrice(snapshot.priceMax)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-b border-border-default">
              {/* PRD 8.2: Enhanced confidence with breakdown tooltip */}
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
                  {snapshot.confidence}%
                </p>

                {/* Confidence breakdown tooltip */}
                {showConfidenceTooltip && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-surface border border-border-default rounded-xl shadow-xl z-10 text-left">
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
                        <span className={`font-bold ${confidenceColor}`}>{snapshot.confidence}%</span>
                      </div>
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-l border-t border-border-default rotate-45" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
                  Timeline
                </p>
                <p className="text-h3 font-semibold text-foreground">
                  {Math.round(snapshot.daysMin)}-{Math.round(snapshot.daysMax)} days
                </p>
              </div>
              <div className="text-center">
                <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
                  Hours
                </p>
                <p className="text-h3 font-semibold text-foreground">
                  {snapshot.hoursMin}-{snapshot.hoursMax}
                </p>
              </div>
            </div>

            {/* PRD 8.2: Token breakdown display */}
            {(snapshot.tokensIn || snapshot.tokensOut) && (
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
                      {formatTokenCount(snapshot.tokensIn ?? 0)}
                    </p>
                    <p className="text-label text-muted-custom mt-1">Prompts & context</p>
                  </div>
                  <div className="p-4 bg-subtle rounded-xl">
                    <p className="text-body-sm text-secondary-custom mb-1">Output Tokens</p>
                    <p className="text-h4 font-semibold text-foreground tabular-nums">
                      {formatTokenCount(snapshot.tokensOut ?? 0)}
                    </p>
                    <p className="text-label text-muted-custom mt-1">Generated code</p>
                  </div>
                </div>
              </div>
            )}

            {/* Build spec */}
            <div className="pt-6">
              <h3 className="text-label text-secondary-custom uppercase tracking-wider mb-4">
                Project Specification
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-body-sm text-secondary-custom">Platform</p>
                  <p className="text-body font-medium text-foreground">
                    {PLATFORM_LABELS[snapshot.platform] || snapshot.platform}
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-secondary-custom">Auth</p>
                  <p className="text-body font-medium text-foreground">
                    {AUTH_LABELS[snapshot.authLevel] || snapshot.authLevel}
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-secondary-custom">Quality</p>
                  <p className="text-body font-medium text-foreground">
                    {QUALITY_LABELS[snapshot.quality] || snapshot.quality}
                  </p>
                </div>
              </div>

              {/* Modules */}
              {moduleDetails && moduleDetails.length > 0 && (
                <div className="pt-4 border-t border-border-default">
                  <p className="text-body-sm text-secondary-custom mb-2">
                    {moduleDetails.length} Module{moduleDetails.length !== 1 ? "s" : ""} Included
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {moduleDetails.map((module) => (
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

          {/* PRD 8.5: Pricing formula display */}
          <PricingFormula
            tokensIn={snapshot.tokensIn ?? 0}
            tokensOut={snapshot.tokensOut ?? 0}
            materialsCost={snapshot.materialsCost ?? 0}
            laborCost={snapshot.laborCost ?? 0}
            riskBuffer={snapshot.riskBuffer ?? 0}
            hoursMin={snapshot.hoursMin}
            hoursMax={snapshot.hoursMax}
          />

          {/* Cost drivers */}
          {snapshot.costDrivers.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md mb-6">
              <h2 className="text-h3 text-foreground mb-4">Cost Breakdown</h2>
              <div className="space-y-2">
                {snapshot.costDrivers.map((driver, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border-default"
                  >
                    <span className="text-body text-foreground">{driver.name}</span>
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
            </div>
          )}

          {/* Assumptions */}
          {snapshot.assumptions.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md mb-6">
              <h2 className="text-h3 text-foreground mb-4">Assumptions</h2>
              <ul className="space-y-3">
                {snapshot.assumptions.map((assumption, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-body text-foreground">{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA section */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
            <h2 className="text-h3 text-foreground mb-2">Ready to get started?</h2>
            <p className="text-body text-secondary-custom mb-6">
              Schedule a discovery call to finalize scope and get a fixed-price quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:matt@managermatt.com"
                className="inline-flex items-center justify-center h-12 px-8 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                Schedule Discovery Call
              </a>
              <a
                href={`/api/quote/${shareId}/pdf`}
                className="inline-flex items-center justify-center h-12 px-8 border border-border-default text-foreground rounded-lg font-medium hover:bg-subtle transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-body-sm text-secondary-custom">
              Quote ID: {shareId} &bull; Generated on{" "}
              {new Date(quote.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
