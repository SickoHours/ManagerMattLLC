"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// PRD 10.1: Enhanced assumptions with expandable details
interface StructuredAssumption {
  text: string;
  detail?: string;
  impact?: "high" | "medium" | "low";
  category?: "scope" | "timeline" | "quality" | "technical" | "integration";
}

interface AssumptionsListProps {
  assumptions: (string | StructuredAssumption)[];
}

// Category icons and labels
const CATEGORY_INFO: Record<string, { icon: string; label: string }> = {
  scope: {
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    label: "Scope",
  },
  timeline: {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "Timeline",
  },
  quality: {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    label: "Quality",
  },
  technical: {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    label: "Technical",
  },
  integration: {
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    label: "Integration",
  },
};

// Impact colors and labels
const IMPACT_INFO: Record<string, { color: string; bgColor: string; label: string }> = {
  high: { color: "text-destructive", bgColor: "bg-destructive/10", label: "High Impact" },
  medium: { color: "text-warning", bgColor: "bg-warning/10", label: "Medium Impact" },
  low: { color: "text-secondary-custom", bgColor: "bg-subtle", label: "Low Impact" },
};

// Normalize assumption to structured format
function normalizeAssumption(assumption: string | StructuredAssumption): StructuredAssumption {
  if (typeof assumption === "string") {
    return { text: assumption };
  }
  return assumption;
}

// Infer category from assumption text
function inferCategory(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("scope") || lowerText.includes("feature") || lowerText.includes("module")) {
    return "scope";
  }
  if (lowerText.includes("timeline") || lowerText.includes("time") || lowerText.includes("week") || lowerText.includes("day")) {
    return "timeline";
  }
  if (lowerText.includes("quality") || lowerText.includes("test") || lowerText.includes("production")) {
    return "quality";
  }
  if (lowerText.includes("api") || lowerText.includes("integration") || lowerText.includes("third-party")) {
    return "integration";
  }
  if (lowerText.includes("technical") || lowerText.includes("architecture") || lowerText.includes("database")) {
    return "technical";
  }
  return undefined;
}

function AssumptionItem({ assumption }: { assumption: string | StructuredAssumption }) {
  const [expanded, setExpanded] = useState(false);
  const normalized = normalizeAssumption(assumption);
  const category = normalized.category || inferCategory(normalized.text);
  const categoryInfo = category ? CATEGORY_INFO[category] : null;
  const impactInfo = normalized.impact ? IMPACT_INFO[normalized.impact] : null;
  const hasDetail = Boolean(normalized.detail);

  return (
    <li className="border border-border-default rounded-lg overflow-hidden">
      <button
        onClick={() => hasDetail && setExpanded(!expanded)}
        className={cn(
          "w-full flex items-start gap-3 p-4 text-left transition-colors",
          hasDetail && "hover:bg-subtle cursor-pointer",
          !hasDetail && "cursor-default"
        )}
        disabled={!hasDetail}
      >
        {/* Checkmark icon */}
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

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-body text-foreground">{normalized.text}</span>
            {hasDetail && (
              <svg
                className={cn(
                  "w-4 h-4 text-secondary-custom flex-shrink-0 transition-transform",
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </div>

          {/* Category and impact badges */}
          {(categoryInfo || impactInfo) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {categoryInfo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-subtle text-secondary-custom">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categoryInfo.icon} />
                  </svg>
                  {categoryInfo.label}
                </span>
              )}
              {impactInfo && (
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                  impactInfo.bgColor,
                  impactInfo.color
                )}>
                  {impactInfo.label}
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {hasDetail && expanded && (
        <div className="px-4 pb-4 pt-0 ml-8 border-t border-border-default mt-0">
          <div className="pt-3 text-body-sm text-secondary-custom">
            <p className="mb-2 font-medium text-foreground">What this means:</p>
            <p>{normalized.detail}</p>
            {normalized.impact && (
              <p className="mt-3">
                <span className="font-medium text-foreground">If this changes: </span>
                {normalized.impact === "high" && "Significant impact on timeline and cost. Please notify us immediately."}
                {normalized.impact === "medium" && "May affect timeline or cost. Let us know so we can adjust."}
                {normalized.impact === "low" && "Minor impact. Can usually be accommodated during development."}
              </p>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export function AssumptionsList({ assumptions }: AssumptionsListProps) {
  if (!assumptions || assumptions.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-foreground">Assumptions</h2>
        <span className="text-label text-secondary-custom">
          {assumptions.length} item{assumptions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-body-sm text-secondary-custom mb-6">
        This estimate is based on the following assumptions. Click any item with details to expand.
        Please review and confirm these are accurate for your project.
      </p>

      <ul className="space-y-2">
        {assumptions.map((assumption, index) => (
          <AssumptionItem key={index} assumption={assumption} />
        ))}
      </ul>

      {/* PRD 10.1: Call to action for assumption clarification */}
      <div className="mt-6 p-4 bg-subtle rounded-xl">
        <div className="flex items-start gap-3">
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
            <p className="text-body-sm font-medium text-foreground">
              Assumptions affect your estimate
            </p>
            <p className="mt-1 text-body-sm text-secondary-custom">
              If any of these don&apos;t match your needs, let us know during the discovery call
              and we&apos;ll adjust the estimate accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
