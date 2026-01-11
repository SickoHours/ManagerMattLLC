"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedPrice } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";
import {
  EstimateConfig,
  PriceRange,
  PLATFORM_OPTIONS,
  AUTH_OPTIONS,
  QUALITY_OPTIONS,
} from "@/lib/mock-data";

interface SummaryPillProps {
  config: EstimateConfig;
  priceRange: PriceRange;
  isCalculating?: boolean;
  onGetQuote?: () => void;
}

export function SummaryPill({
  config,
  priceRange,
  isCalculating = false,
  onGetQuote,
}: SummaryPillProps) {
  const [expanded, setExpanded] = useState(false);

  const platform = PLATFORM_OPTIONS.find((p) => p.id === config.platform);
  const auth = AUTH_OPTIONS.find((a) => a.id === config.authLevel);
  const quality = QUALITY_OPTIONS.find((q) => q.id === config.quality);

  const hasSelections =
    config.platform || config.authLevel || config.modules.length > 0 || config.quality;

  return (
    <>
      {/* Backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 bg-foreground/20 z-30 lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Pill - PRD 5.5.3: Safe area inset for iOS home indicator */}
      <div
        className={cn(
          "fixed left-4 right-4 z-40 lg:hidden",
          "bottom-4 pb-[env(safe-area-inset-bottom)]",
          "bg-surface rounded-2xl shadow-xl",
          "transition-all duration-300 ease-out",
          expanded ? "max-h-[60vh]" : "max-h-16"
        )}
      >
        {/* Collapsed view */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 h-16"
        >
          {/* PRD 5.5.3: Layout shift guard - min-width and tabular-nums for stable layout */}
          <div className="flex items-center gap-3 min-w-[160px]">
            {isCalculating ? (
              <div className="h-6 w-full skeleton rounded" />
            ) : hasSelections ? (
              <span className="flex items-center gap-1 text-h4 text-primary tabular-nums">
                <AnimatedPrice value={priceRange.min} />
                <span className="text-secondary-custom">–</span>
                <AnimatedPrice value={priceRange.max} />
              </span>
            ) : (
              <span className="text-body text-muted-foreground">
                Configure your build
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-secondary-custom">
            <span className="text-body-sm">
              {expanded ? "Hide" : "View Details"}
            </span>
            <svg
              className={cn(
                "w-5 h-5 transition-transform duration-200",
                expanded && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 overflow-y-auto max-h-[calc(60vh-64px)]">
            <div className="h-px bg-border mb-4" />

            {/* Line items */}
            <div className="space-y-3">
              <LineItem
                label="Platform"
                value={platform?.name ?? "Not selected"}
                isPlaceholder={!platform}
              />
              <LineItem
                label="Authentication"
                value={auth?.name ?? "Not selected"}
                isPlaceholder={!auth}
              />
              <LineItem
                label="Modules"
                value={
                  config.modules.length > 0
                    ? `${config.modules.length} selected`
                    : "None"
                }
                isPlaceholder={config.modules.length === 0}
              />
              <LineItem
                label="Quality"
                value={quality?.name ?? "Not selected"}
                isPlaceholder={!quality}
              />
            </div>

            <div className="h-px bg-border my-4" />

            {/* Price - PRD 5.5.3: Layout shift guard */}
            <div className="min-w-[180px]">
              <p className="text-body-sm text-secondary-custom">
                Estimated Range
              </p>
              {isCalculating ? (
                <div className="mt-2 h-8 w-full skeleton rounded" />
              ) : hasSelections ? (
                <>
                  <div className="mt-1 flex items-baseline gap-2 text-h3 text-primary tabular-nums">
                    <AnimatedPrice value={priceRange.min} />
                    <span className="text-body text-secondary-custom">–</span>
                    <AnimatedPrice value={priceRange.max} />
                  </div>
                  <p className="mt-1 text-label text-muted-custom">
                    P10 – P90 confidence range
                  </p>
                </>
              ) : (
                <p className="mt-1 text-body text-muted-foreground">—</p>
              )}
            </div>

            <div className="h-px bg-border my-4" />

            {/* CTA */}
            <Button
              className="w-full h-12"
              onClick={onGetQuote}
              disabled={!hasSelections || isCalculating}
            >
              Get Your Full Quote
            </Button>

            {/* Escape hatch */}
            <button className="mt-4 w-full flex items-center justify-center gap-2 text-body-sm text-secondary-custom">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Questions? Ask a human
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function LineItem({
  label,
  value,
  isPlaceholder = false,
}: {
  label: string;
  value: string;
  isPlaceholder?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-body-sm text-secondary-custom">{label}</span>
      <span
        className={cn(
          "text-body-sm font-medium",
          isPlaceholder ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
