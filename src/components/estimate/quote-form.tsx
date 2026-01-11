"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/mock-data";

interface QuoteFormProps {
  estimateId: Id<"estimates">;
  estimate: {
    priceMin: number;
    priceMax: number;
    confidence: number;
    status: string;
  };
}

export function QuoteForm({ estimateId, estimate }: QuoteFormProps) {
  const [email, setEmail] = useState("");
  const [assumptions, setAssumptions] = useState({
    featureListComplete: false,
    rangesMayChange: false,
    thirdPartyCosts: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createAndSendQuote = useMutation(api.quotes.createAndSend);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const allAssumptionsConfirmed =
    assumptions.featureListComplete &&
    assumptions.rangesMayChange &&
    assumptions.thirdPartyCosts;

  const canSubmit = email && isValidEmail(email) && allAssumptionsConfirmed && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createAndSendQuote({
        estimateId,
        email,
        assumptionsConfirmed: allAssumptionsConfirmed,
      });

      setShareId(result.shareId);
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to create quote:", err);
      setError("Failed to send quote. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Already quoted state
  if (estimate.status === "quoted" && !isSuccess) {
    return (
      <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md sticky top-24">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-h3 text-foreground mb-2">Quote Sent</h2>
          <p className="text-body text-secondary-custom">
            A quote has already been sent for this estimate.
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess && shareId) {
    return (
      <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md sticky top-24">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-h3 text-foreground mb-2">Quote Sent!</h2>
          <p className="text-body text-secondary-custom mb-6">
            Check your email at <strong>{email}</strong> for your detailed quote.
          </p>

          <div className="space-y-3">
            <a
              href={`/q/${shareId}`}
              className="block w-full h-11 flex items-center justify-center bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              View Quote Now
            </a>
            <a
              href="/estimate"
              className="block w-full h-11 flex items-center justify-center border border-border-default text-foreground rounded-lg font-medium hover:bg-subtle transition-colors"
            >
              Create Another Estimate
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md sticky top-24">
      <h2 className="text-h3 text-foreground mb-2">Get Your Quote</h2>
      <p className="text-body-sm text-secondary-custom mb-6">
        Enter your email to receive a detailed quote with everything you need to get started.
      </p>

      {/* Price summary */}
      <div className="p-4 bg-subtle rounded-xl mb-6">
        <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
          Estimated Range
        </p>
        <p className="text-h3 font-semibold text-foreground">
          {formatPrice(estimate.priceMin)} - {formatPrice(estimate.priceMax)}
        </p>
        <p className="text-body-sm text-secondary-custom mt-1">
          {estimate.confidence}% confidence
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email input */}
        <div>
          <label
            htmlFor="email"
            className="block text-body-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full h-11 px-4 bg-page border border-border-default rounded-lg text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            disabled={isSubmitting}
          />
        </div>

        {/* Assumptions checklist */}
        <div className="space-y-3">
          <p className="text-body-sm font-medium text-foreground">
            Please confirm the following:
          </p>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="featureListComplete"
              checked={assumptions.featureListComplete}
              onChange={(e) =>
                setAssumptions((prev) => ({
                  ...prev,
                  featureListComplete: e.target.checked,
                }))
              }
              className="mt-1 w-4 h-4 rounded border-border-default text-accent focus:ring-ring"
              disabled={isSubmitting}
            />
            <label htmlFor="featureListComplete" className="text-body-sm text-secondary-custom">
              My feature list is complete for this estimate
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="rangesMayChange"
              checked={assumptions.rangesMayChange}
              onChange={(e) =>
                setAssumptions((prev) => ({
                  ...prev,
                  rangesMayChange: e.target.checked,
                }))
              }
              className="mt-1 w-4 h-4 rounded border-border-default text-accent focus:ring-ring"
              disabled={isSubmitting}
            />
            <label htmlFor="rangesMayChange" className="text-body-sm text-secondary-custom">
              I understand ranges may change with new requirements
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="thirdPartyCosts"
              checked={assumptions.thirdPartyCosts}
              onChange={(e) =>
                setAssumptions((prev) => ({
                  ...prev,
                  thirdPartyCosts: e.target.checked,
                }))
              }
              className="mt-1 w-4 h-4 rounded border-border-default text-accent focus:ring-ring"
              disabled={isSubmitting}
            />
            <label htmlFor="thirdPartyCosts" className="text-body-sm text-secondary-custom">
              I understand third-party services (hosting, APIs) may cost extra
            </label>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-body-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full h-12"
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
              Sending Quote...
            </>
          ) : (
            <>
              Send Quote to Email
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </>
          )}
        </Button>
      </form>

      {/* Help text */}
      <div className="mt-6 pt-6 border-t border-border-default">
        <p className="text-body-sm text-secondary-custom text-center">
          Need help?{" "}
          <a href="mailto:matt@managermatt.com" className="text-accent hover:underline">
            Talk to a human
          </a>
        </p>
      </div>
    </div>
  );
}
