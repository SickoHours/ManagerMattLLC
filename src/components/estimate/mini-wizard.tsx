"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatPrice } from "@/lib/mock-data";

// Template presets map to full wizard configuration
export const TEMPLATES = {
  "internal-dashboard": {
    label: "Internal Dashboard",
    description: "Admin panels, analytics dashboards, internal tools",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    preset: {
      platform: "web" as const,
      authLevel: "roles" as const,
      modules: ["dashboard", "analytics", "database", "api"],
      quality: "mvp" as const,
    },
  },
  "saas-platform": {
    label: "SaaS Platform",
    description: "Multi-tenant apps with subscriptions and billing",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    preset: {
      platform: "web" as const,
      authLevel: "multi-tenant" as const,
      modules: ["dashboard", "settings", "database", "api", "email", "subscriptions"],
      quality: "production" as const,
    },
  },
  "ecommerce": {
    label: "E-commerce",
    description: "Online stores with products, cart, and checkout",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    preset: {
      platform: "web" as const,
      authLevel: "basic" as const,
      modules: ["products", "cart", "payments", "api", "database"],
      quality: "mvp" as const,
    },
  },
  "mobile-app": {
    label: "Mobile App",
    description: "iOS and Android apps with backend",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    preset: {
      platform: "mobile" as const,
      authLevel: "basic" as const,
      modules: ["api", "database", "push-notifications"],
      quality: "mvp" as const,
    },
  },
  "automation": {
    label: "Automation Tool",
    description: "Workflows, integrations, and background jobs",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    preset: {
      platform: "web" as const,
      authLevel: "basic" as const,
      modules: ["integrations", "workflows", "dashboard", "api"],
      quality: "mvp" as const,
    },
  },
  "custom": {
    label: "Something Else",
    description: "Start from scratch with full customization",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    preset: {
      platform: "unknown" as const,
      authLevel: "unknown" as const,
      modules: [],
      quality: "unknown" as const,
    },
  },
};

const COMPLEXITY_OPTIONS = [
  {
    value: "simple",
    label: "Simple",
    description: "Basic features, straightforward requirements",
    qualityAdjust: "prototype" as const,
    moduleMultiplier: 0.7,
  },
  {
    value: "medium",
    label: "Medium",
    description: "Standard features, typical complexity",
    qualityAdjust: "mvp" as const,
    moduleMultiplier: 1.0,
  },
  {
    value: "complex",
    label: "Complex",
    description: "Advanced features, custom requirements",
    qualityAdjust: "production" as const,
    moduleMultiplier: 1.4,
  },
  {
    value: "unknown",
    label: "Not Sure",
    description: "Help me figure it out",
    qualityAdjust: "unknown" as const,
    moduleMultiplier: 1.2,
  },
];

type TemplateKey = keyof typeof TEMPLATES;

interface MiniWizardProps {
  onStartFull: (preset?: {
    platform: "web" | "mobile" | "both" | "unknown";
    authLevel: "none" | "basic" | "roles" | "multi-tenant" | "unknown";
    modules: string[];
    quality: "prototype" | "mvp" | "production" | "unknown";
  }) => void;
}

export function MiniWizard({ onStartFull }: MiniWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<TemplateKey | null>(null);
  const [platform, setPlatform] = useState<"web" | "mobile" | "both" | "unknown" | null>(null);
  const [complexity, setComplexity] = useState<string | null>(null);

  // Build preview config based on selections
  const previewConfig = template && platform && complexity
    ? {
        platform: platform,
        authLevel: TEMPLATES[template].preset.authLevel,
        modules: TEMPLATES[template].preset.modules,
        quality: COMPLEXITY_OPTIONS.find(c => c.value === complexity)?.qualityAdjust || "mvp" as const,
      }
    : null;

  // Get live preview from Convex
  const previewResult = useQuery(
    api.estimates.preview,
    previewConfig
      ? {
          platform: previewConfig.platform,
          authLevel: previewConfig.authLevel,
          modules: previewConfig.modules,
          quality: previewConfig.quality,
        }
      : "skip"
  );

  const handleTemplateSelect = (key: TemplateKey) => {
    setTemplate(key);
    // If custom, go straight to full wizard
    if (key === "custom") {
      onStartFull();
      return;
    }
    // Pre-set platform from template
    setPlatform(TEMPLATES[key].preset.platform);
    setStep(1);
  };

  const handlePlatformSelect = (value: "web" | "mobile" | "both" | "unknown") => {
    setPlatform(value);
    setStep(2);
  };

  const handleComplexitySelect = (value: string) => {
    setComplexity(value);
    setStep(3);
  };

  const handleRefine = () => {
    if (!template || !platform || !complexity) return;

    const selectedComplexity = COMPLEXITY_OPTIONS.find(c => c.value === complexity);
    const preset = {
      platform: platform,
      authLevel: TEMPLATES[template].preset.authLevel,
      modules: TEMPLATES[template].preset.modules,
      quality: selectedComplexity?.qualityAdjust || ("mvp" as const),
    };

    onStartFull(preset);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i <= step ? "w-12 bg-accent" : "w-8 bg-border-default"
            }`}
          />
        ))}
      </div>

      {/* Step 0: What are you building? */}
      {step === 0 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-h2 text-foreground mb-2">What are you building?</h2>
            <p className="text-body text-secondary-custom">
              Pick the closest match to get a quick estimate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(TEMPLATES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleTemplateSelect(key as TemplateKey)}
                className="flex items-start gap-4 p-5 bg-surface rounded-xl border border-border-default hover:border-accent/50 hover:bg-subtle transition-all text-left group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                  {value.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {value.label}
                  </p>
                  <p className="text-body-sm text-secondary-custom mt-0.5">
                    {value.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Where will it live? */}
      {step === 1 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-h2 text-foreground mb-2">Where will it live?</h2>
            <p className="text-body text-secondary-custom">
              Choose your target platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "web", label: "Web", icon: "🌐" },
              { value: "mobile", label: "Mobile", icon: "📱" },
              { value: "both", label: "Both", icon: "🔄" },
              { value: "unknown", label: "Not Sure", icon: "🤔" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handlePlatformSelect(option.value as "web" | "mobile" | "both" | "unknown")}
                className={`p-5 rounded-xl border text-center transition-all ${
                  platform === option.value
                    ? "border-accent bg-accent/5"
                    : "border-border-default bg-surface hover:border-accent/50"
                }`}
              >
                <span className="text-3xl mb-2 block">{option.icon}</span>
                <p className="font-medium text-foreground">{option.label}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(0)}
            className="mt-6 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Step 2: How complex? */}
      {step === 2 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-h2 text-foreground mb-2">How complex?</h2>
            <p className="text-body text-secondary-custom">
              This helps us estimate the scope
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMPLEXITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleComplexitySelect(option.value)}
                className={`p-5 rounded-xl border text-center transition-all ${
                  complexity === option.value
                    ? "border-accent bg-accent/5"
                    : "border-border-default bg-surface hover:border-accent/50"
                }`}
              >
                <p className="font-medium text-foreground mb-1">{option.label}</p>
                <p className="text-body-sm text-secondary-custom">{option.description}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-6 text-secondary-custom hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && previewResult && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-h2 text-foreground mb-2">Your Quick Estimate</h2>
            <p className="text-body text-secondary-custom">
              Based on similar projects we&apos;ve delivered
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-8 border border-border-default mb-6">
            <div className="text-center mb-6">
              <p className="text-label text-secondary-custom uppercase tracking-wider mb-2">
                Estimated Range
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-h1 text-foreground">
                  {formatPrice(previewResult.priceMin)}
                </span>
                <span className="text-body text-secondary-custom">to</span>
                <span className="text-h1 text-foreground">
                  {formatPrice(previewResult.priceMax)}
                </span>
              </div>
              <p className="mt-2 text-body text-secondary-custom">
                Timeline: {Math.round(previewResult.daysMin)}-{Math.round(previewResult.daysMax)} days
              </p>
            </div>

            <div className="border-t border-border-default pt-6">
              <p className="text-body-sm text-secondary-custom mb-4">
                This is a rough estimate based on:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-subtle rounded-full text-body-sm text-foreground">
                  {template && TEMPLATES[template].label}
                </span>
                <span className="px-3 py-1 bg-subtle rounded-full text-body-sm text-foreground">
                  {platform === "web" ? "Web" : platform === "mobile" ? "Mobile" : platform === "both" ? "Web + Mobile" : "Platform TBD"}
                </span>
                <span className="px-3 py-1 bg-subtle rounded-full text-body-sm text-foreground">
                  {COMPLEXITY_OPTIONS.find(c => c.value === complexity)?.label} Complexity
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRefine}
              className="flex-1 h-12 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Refine Your Estimate
            </button>
            <button
              onClick={() => setStep(2)}
              className="h-12 px-6 bg-surface text-foreground rounded-lg font-medium border border-border-default hover:bg-subtle transition-colors"
            >
              Back
            </button>
          </div>

          <p className="text-center text-body-sm text-secondary-custom mt-6">
            Get a more accurate estimate by customizing modules and requirements
          </p>
        </div>
      )}

      {/* Loading state for step 3 */}
      {step === 3 && !previewResult && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 text-secondary-custom">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Calculating your estimate...
          </div>
        </div>
      )}
    </div>
  );
}
