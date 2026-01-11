"use client";

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

interface OrderSummaryProps {
  config: EstimateConfig;
  priceRange: PriceRange;
  isCalculating?: boolean;
  onGetQuote?: () => void;
  className?: string;
}

export function OrderSummary({
  config,
  priceRange,
  isCalculating = false,
  onGetQuote,
  className,
}: OrderSummaryProps) {
  const platform = PLATFORM_OPTIONS.find((p) => p.id === config.platform);
  const auth = AUTH_OPTIONS.find((a) => a.id === config.authLevel);
  const quality = QUALITY_OPTIONS.find((q) => q.id === config.quality);

  const hasSelections =
    config.platform || config.authLevel || config.modules.length > 0 || config.quality;

  return (
    <div
      className={cn(
        "bg-surface rounded-2xl shadow-lg p-8",
        "sticky top-24",
        className
      )}
    >
      {/* Header */}
      <h3 className="text-h4 text-foreground">Your Estimate</h3>

      <div className="mt-6 h-px bg-border" />

      {/* Line items */}
      <div className="mt-6 space-y-4">
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
          value={config.modules.length > 0 ? `${config.modules.length} selected` : "None"}
          isPlaceholder={config.modules.length === 0}
        />
        <LineItem
          label="Quality"
          value={quality?.name ?? "Not selected"}
          isPlaceholder={!quality}
        />
      </div>

      <div className="mt-6 h-px bg-border" />

      {/* Price */}
      <div className="mt-6">
        <p className="text-body-sm text-secondary-custom">Estimated Range</p>

        {isCalculating ? (
          <div className="mt-2 space-y-2">
            {/* PRD 5.5.3: Skeleton matches rendered content dimensions */}
            <div className="h-10 min-w-[200px] skeleton rounded-lg" />
            <div className="h-4 w-32 skeleton rounded" />
          </div>
        ) : hasSelections ? (
          <>
            {/* PRD 5.5.3: Layout shift guard with min-width and tabular-nums, animated prices */}
            <div className="mt-2 flex items-baseline gap-2 min-w-[200px]">
              <AnimatedPrice value={priceRange.min} className="text-h2 text-primary tabular-nums" />
              <span className="text-body text-secondary-custom">–</span>
              <AnimatedPrice value={priceRange.max} className="text-h2 text-primary tabular-nums" />
            </div>
            <p className="mt-1 text-label text-muted-custom">
              P10 – P90 confidence range
            </p>
            {priceRange.confidence < 70 && (
              <p className="mt-2 text-body-sm text-warning">
                Low confidence — add more details for accuracy
              </p>
            )}
          </>
        ) : (
          <p className="mt-2 text-h3 text-muted-foreground">
            Configure your build
          </p>
        )}
      </div>

      <div className="mt-6 h-px bg-border" />

      {/* CTA */}
      <div className="mt-6">
        <Button
          className="w-full h-12"
          onClick={onGetQuote}
          disabled={!hasSelections || isCalculating}
        >
          Get Your Full Quote
        </Button>
      </div>

      <div className="mt-4 h-px bg-border" />

      {/* Escape hatch */}
      <div className="mt-4">
        <button className="flex items-center gap-2 text-body-sm text-secondary-custom hover:text-foreground transition-colors">
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
    </div>
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
