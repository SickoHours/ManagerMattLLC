"use client";

import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step */}
            <button
              type="button"
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isCurrent && "bg-primary text-primary-foreground",
                isComplete && !isCurrent && "bg-subtle text-secondary-custom",
                !isComplete && !isCurrent && "text-muted-foreground",
                isClickable && !isCurrent && "hover:bg-subtle cursor-pointer",
                !isClickable && "cursor-default"
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Step number/check */}
              <span
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-label font-semibold",
                  isCurrent && "bg-primary-foreground/20 text-primary-foreground",
                  isComplete && !isCurrent && "bg-primary text-primary-foreground",
                  !isComplete && !isCurrent && "bg-subtle text-muted-foreground"
                )}
              >
                {isComplete && !isCurrent ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>

              {/* Label - hidden on mobile */}
              <span className="hidden sm:inline text-body-sm font-medium whitespace-nowrap">
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  index < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
