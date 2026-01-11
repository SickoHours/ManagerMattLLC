"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Stepper } from "./stepper";
import { SelectionCard, ModuleCard } from "./selection-card";
import { OrderSummary } from "./order-summary";
import { SummaryPill } from "./summary-pill";
import {
  EstimateConfig,
  PriceRange,
  DEFAULT_CONFIG,
  PLATFORM_OPTIONS,
  AUTH_OPTIONS,
  QUALITY_OPTIONS,
  MODULES,
  CATEGORY_LABELS,
} from "@/lib/mock-data";

const STEPS = [
  { id: "platform", label: "Platform" },
  { id: "auth", label: "Auth" },
  { id: "modules", label: "Modules" },
  { id: "quality", label: "Quality" },
];

export function Wizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<EstimateConfig>(DEFAULT_CONFIG);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use Convex query for live price preview
  const previewResult = useQuery(api.estimates.preview, {
    platform: config.platform,
    authLevel: config.authLevel,
    modules: config.modules,
    quality: config.quality,
  });

  // Use Convex mutation to create estimate
  const createEstimate = useMutation(api.estimates.create);

  // Convert preview result to PriceRange format
  const priceRange: PriceRange = previewResult
    ? {
        min: previewResult.priceMin,
        max: previewResult.priceMax,
        confidence: previewResult.confidence,
      }
    : { min: 0, max: 0, confidence: 0 };

  const isCalculating = previewResult === undefined;

  const updateConfig = useCallback(
    <K extends keyof EstimateConfig>(key: K, value: EstimateConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleModule = useCallback((moduleId: string) => {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter((id) => id !== moduleId)
        : [...prev.modules, moduleId],
    }));
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return config.platform !== null;
      case 1:
        return config.authLevel !== null;
      case 2:
        return true; // Modules are optional
      case 3:
        return config.quality !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGetQuote = async () => {
    if (!config.platform || !config.authLevel || !config.quality) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createEstimate({
        platform: config.platform,
        authLevel: config.authLevel,
        modules: config.modules,
        quality: config.quality,
      });

      // Navigate to results page
      router.push(`/estimate/results/${result.estimateId}`);
    } catch (error) {
      console.error("Failed to create estimate:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Main wizard content */}
      <div className="flex-1 min-w-0">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(index) => index <= currentStep && setCurrentStep(index)}
          />
        </div>

        {/* Step content */}
        <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md">
          {currentStep === 0 && (
            <StepPlatform
              value={config.platform}
              onChange={(v) => updateConfig("platform", v)}
            />
          )}
          {currentStep === 1 && (
            <StepAuth
              value={config.authLevel}
              onChange={(v) => updateConfig("authLevel", v)}
            />
          )}
          {currentStep === 2 && (
            <StepModules
              selected={config.modules}
              onToggle={toggleModule}
            />
          )}
          {currentStep === 3 && (
            <StepQuality
              value={config.quality}
              onChange={(v) => updateConfig("quality", v)}
            />
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between items-center">
            {currentStep > 0 ? (
              <Button variant="ghost" onClick={handleBack} className="h-11">
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-11"
              >
                Continue
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            ) : (
              <Button
                onClick={handleGetQuote}
                disabled={!canProceed() || isSubmitting}
                className="h-11"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Estimate...
                  </>
                ) : (
                  <>
                    Get Full Quote
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop order summary */}
      <div className="hidden lg:block w-[400px] flex-shrink-0">
        <OrderSummary
          config={config}
          priceRange={priceRange}
          isCalculating={isCalculating}
          onGetQuote={handleGetQuote}
        />
      </div>

      {/* Mobile summary pill */}
      <SummaryPill
        config={config}
        priceRange={priceRange}
        isCalculating={isCalculating}
        onGetQuote={handleGetQuote}
      />
    </div>
  );
}

// Step Components

function StepPlatform({
  value,
  onChange,
}: {
  value: EstimateConfig["platform"];
  onChange: (v: EstimateConfig["platform"]) => void;
}) {
  const icons: Record<string, React.ReactNode> = {
    globe: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    smartphone: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    layers: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    "help-circle": (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div>
      <h2 className="text-h3 text-foreground">Where will your product live?</h2>
      <p className="mt-2 text-body text-secondary-custom">
        Select the platforms you want to target.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORM_OPTIONS.map((option) => (
          <SelectionCard
            key={option.id}
            selected={value === option.id}
            onClick={() => onChange(option.id as EstimateConfig["platform"])}
          >
            <div className="text-secondary-custom">{icons[option.icon]}</div>
            <h3 className="mt-4 text-h4 text-foreground">{option.name}</h3>
            <p className="mt-1 text-body-sm text-secondary-custom">
              {option.description}
            </p>
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}

function StepAuth({
  value,
  onChange,
}: {
  value: EstimateConfig["authLevel"];
  onChange: (v: EstimateConfig["authLevel"]) => void;
}) {
  const icons: Record<string, React.ReactNode> = {
    unlock: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
    key: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    users: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    building: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    "help-circle": (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div>
      <h2 className="text-h3 text-foreground">How will users log in?</h2>
      <p className="mt-2 text-body text-secondary-custom">
        Choose the authentication level you need.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {AUTH_OPTIONS.map((option) => (
          <SelectionCard
            key={option.id}
            selected={value === option.id}
            onClick={() => onChange(option.id as EstimateConfig["authLevel"])}
          >
            <div className="text-secondary-custom">{icons[option.icon]}</div>
            <h3 className="mt-4 text-h4 text-foreground">{option.name}</h3>
            <p className="mt-1 text-body-sm text-secondary-custom">
              {option.description}
            </p>
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}

function StepModules({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  // Group modules by category
  const categories = Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>;

  return (
    <div>
      <h2 className="text-h3 text-foreground">What features do you need?</h2>
      <p className="mt-2 text-body text-secondary-custom">
        Select all the modules you want to include. You can always add more later.
      </p>

      <div className="mt-8 space-y-8">
        {categories.map((category) => {
          const categoryModules = MODULES.filter((m) => m.category === category);

          return (
            <div key={category}>
              <h3 className="text-label font-medium uppercase tracking-wider text-muted-foreground mb-4">
                {CATEGORY_LABELS[category]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryModules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    name={module.name}
                    description={module.description}
                    category={CATEGORY_LABELS[module.category]}
                    selected={selected.includes(module.id)}
                    onClick={() => onToggle(module.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepQuality({
  value,
  onChange,
}: {
  value: EstimateConfig["quality"];
  onChange: (v: EstimateConfig["quality"]) => void;
}) {
  return (
    <div>
      <h2 className="text-h3 text-foreground">What quality level do you need?</h2>
      <p className="mt-2 text-body text-secondary-custom">
        This affects polish, testing, and edge case handling.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUALITY_OPTIONS.map((option) => (
          <SelectionCard
            key={option.id}
            selected={value === option.id}
            onClick={() => onChange(option.id as EstimateConfig["quality"])}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-subtle text-h4 font-semibold text-secondary-custom">
              {option.badge}
            </span>
            <h3 className="mt-4 text-h4 text-foreground">{option.name}</h3>
            <p className="mt-1 text-body-sm text-secondary-custom">
              {option.description}
            </p>
            <p className="mt-3 text-label text-muted-foreground">
              {option.typical}
            </p>
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}
