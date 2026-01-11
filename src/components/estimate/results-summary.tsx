"use client";

import { formatPrice } from "@/lib/mock-data";

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
  const confidenceColor =
    estimate.confidence >= 70
      ? "text-success"
      : estimate.confidence >= 50
        ? "text-warning"
        : "text-destructive";

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md">
      {/* Price range */}
      <div className="text-center pb-6 border-b border-border-default">
        <p className="text-label text-secondary-custom uppercase tracking-wider mb-2">
          Estimated Cost Range
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-h2 text-foreground">
            {formatPrice(estimate.priceMin)}
          </span>
          <span className="text-body text-secondary-custom">to</span>
          <span className="text-h2 text-foreground">
            {formatPrice(estimate.priceMax)}
          </span>
        </div>
        <p className="mt-2 text-body-sm text-secondary-custom">
          Most likely: {formatPrice(estimate.priceMid)}
        </p>
      </div>

      {/* Confidence and timeline */}
      <div className="grid grid-cols-2 gap-6 py-6 border-b border-border-default">
        <div className="text-center">
          <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
            Confidence
          </p>
          <p className={`text-h3 font-semibold ${confidenceColor}`}>
            {estimate.confidence}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
            Timeline
          </p>
          <p className="text-h3 font-semibold text-foreground">
            {Math.round(estimate.daysMin)}-{Math.round(estimate.daysMax)} days
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
