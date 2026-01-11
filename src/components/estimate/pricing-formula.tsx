"use client";

import { formatPrice } from "@/lib/mock-data";

interface PricingFormulaProps {
  tokensIn: number;
  tokensOut: number;
  materialsCost: number;
  laborCost: number;
  riskBuffer: number;
  hoursMin: number;
  hoursMax: number;
  hourlyRate?: number;
  tokenRateIn?: number;
  tokenRateOut?: number;
}

/**
 * PRD Section 8.5: Pricing Composition Display
 * Shows: MaterialsCost + BuildFee + RiskBuffer = Total
 * With full breakdown of how each component was calculated
 */
export function PricingFormula({
  tokensIn,
  tokensOut,
  materialsCost,
  laborCost,
  riskBuffer,
  hoursMin,
  hoursMax,
  hourlyRate = 150,
  tokenRateIn = 0.003,
  tokenRateOut = 0.015,
}: PricingFormulaProps) {
  const total = materialsCost + laborCost + riskBuffer;
  const avgHours = (hoursMin + hoursMax) / 2;

  // Format token counts nicely
  const formatTokens = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`;
    }
    return count.toString();
  };

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md">
      <h2 className="text-h3 text-foreground mb-2">How We Calculated This</h2>
      <p className="text-body-sm text-secondary-custom mb-6">
        Our pricing follows a transparent formula: Materials + Build Fee + Risk Buffer
      </p>

      {/* Formula breakdown */}
      <div className="space-y-4">
        {/* Materials (AI Tokens) */}
        <div className="p-4 bg-subtle rounded-xl border border-border-default">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-foreground">Materials (AI Tokens)</span>
            </div>
            <span className="text-h4 text-foreground tabular-nums">{formatPrice(materialsCost)}</span>
          </div>
          <div className="ml-10 text-body-sm text-secondary-custom space-y-1">
            <p>Input: {formatTokens(tokensIn)} tokens × ${tokenRateIn.toFixed(3)}/token</p>
            <p>Output: {formatTokens(tokensOut)} tokens × ${tokenRateOut.toFixed(3)}/token</p>
          </div>
        </div>

        {/* Build Fee (Labor) */}
        <div className="p-4 bg-subtle rounded-xl border border-border-default">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium text-foreground">Build Fee (Labor)</span>
            </div>
            <span className="text-h4 text-foreground tabular-nums">{formatPrice(laborCost)}</span>
          </div>
          <div className="ml-10 text-body-sm text-secondary-custom">
            <p>~{Math.round(avgHours)} hours × ${hourlyRate}/hour</p>
          </div>
        </div>

        {/* Risk Buffer */}
        <div className="p-4 bg-subtle rounded-xl border border-border-default">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className="font-medium text-foreground">Risk Buffer</span>
            </div>
            <span className="text-h4 text-foreground tabular-nums">{formatPrice(riskBuffer)}</span>
          </div>
          <div className="ml-10 text-body-sm text-secondary-custom">
            <p>Based on: uncertainty score, integration complexity</p>
          </div>
        </div>

        {/* Divider with equals sign */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-border-default" />
          <span className="text-xl font-bold text-secondary-custom">=</span>
          <div className="flex-1 h-px bg-border-default" />
        </div>

        {/* Total */}
        <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-foreground">Estimated Total (P50)</span>
            </div>
            <span className="text-h3 text-accent tabular-nums">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Note about Monte Carlo */}
      <p className="mt-4 text-body-sm text-secondary-custom">
        Final P10/P50/P90 ranges calculated using 600-run Monte Carlo simulation for statistical accuracy.
      </p>
    </div>
  );
}
