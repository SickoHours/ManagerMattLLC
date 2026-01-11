"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NetworkErrorBannerProps {
  error?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

// PRD 12.2: Degraded mode UI for network failures
export function NetworkErrorBanner({ error, onRetry, isRetrying = false }: NetworkErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-body font-semibold text-destructive">
            Connection Issue
          </h3>
          <p className="mt-1 text-body-sm text-secondary-custom">
            {error || "We're having trouble calculating your estimate. This is usually temporary."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                disabled={isRetrying}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                {isRetrying ? (
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
                    Retrying...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Try Again
                  </>
                )}
              </Button>
            )}
            <a
              href="mailto:hello@managermatt.com?subject=Quote%20Generator%20Issue"
              className="inline-flex items-center gap-2 text-body-sm text-secondary-custom hover:text-foreground transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email us directly
            </a>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-secondary-custom hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Submission error banner with more specific messaging
export function SubmissionErrorBanner({
  error,
  onRetry,
  isRetrying = false,
}: NetworkErrorBannerProps) {
  return (
    <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-body font-semibold text-destructive">
            Couldn&apos;t Create Estimate
          </h3>
          <p className="mt-1 text-body-sm text-secondary-custom">
            {error || "Something went wrong while creating your estimate. Please try again."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {onRetry && (
              <Button
                size="sm"
                onClick={onRetry}
                disabled={isRetrying}
              >
                {isRetrying ? (
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
                    Creating...
                  </>
                ) : (
                  "Try Again"
                )}
              </Button>
            )}
            <a
              href="mailto:hello@managermatt.com?subject=Estimate%20Creation%20Error"
              className="inline-flex items-center gap-2 text-body-sm text-secondary-custom hover:text-foreground transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Get help via email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
