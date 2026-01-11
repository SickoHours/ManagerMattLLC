"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "@/components/layout/header";
import { ResultsSummary } from "@/components/estimate/results-summary";
import { CostBreakdown } from "@/components/estimate/cost-breakdown";
import { PricingFormula } from "@/components/estimate/pricing-formula";
import { AssumptionsList } from "@/components/estimate/assumptions-list";
import { QuoteForm } from "@/components/estimate/quote-form";
import { RemediesSection } from "@/components/estimate/remedies-section";
import { ComparableBuilds } from "@/components/estimate/comparable-builds";
import { AskHumanButton } from "@/components/estimate/ask-human-button";
import { ResultsSummarySkeleton, CostBreakdownSkeleton, SkeletonCard, Skeleton } from "@/components/ui/skeleton";

export default function ResultsPage() {
  const params = useParams();
  const estimateId = params.estimateId as Id<"estimates">;

  const estimate = useQuery(api.estimates.get, { estimateId });

  if (estimate === undefined) {
    return (
      <div className="min-h-screen bg-page">
        <Header />
        <main className="container-wide mx-auto px-6 py-12">
          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - main content */}
            <div className="lg:col-span-2 space-y-6">
              <ResultsSummarySkeleton />
              <CostBreakdownSkeleton />
              <SkeletonCard />
            </div>

            {/* Right column - sidebar */}
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (estimate === null) {
    return (
      <div className="min-h-screen bg-page">
        <Header />
        <main className="container-wide mx-auto px-6 py-12">
          <div className="text-center py-16">
            <h1 className="text-h2 text-foreground mb-4">Estimate Not Found</h1>
            <p className="text-body text-secondary-custom mb-8">
              The estimate you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <a
              href="/estimate"
              className="inline-flex items-center justify-center h-11 px-6 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Create New Estimate
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <main className="container-wide mx-auto px-6 py-12">
        {/* Degraded mode banner */}
        {estimate.degradedMode && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-600"
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
                <h3 className="text-lg font-semibold text-amber-900 mb-1">
                  This Estimate Needs Human Review
                </h3>
                <p className="text-amber-800 mb-4">
                  {estimate.degradedReason ||
                    "This estimate has higher uncertainty. We recommend a discovery call to refine the scope."}
                </p>
                <a
                  href="mailto:hello@managermatt.com?subject=Estimate%20Review%20Request"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Talk to Us
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-h1 text-foreground">Your Estimate</h1>
          <p className="mt-2 text-body text-secondary-custom">
            Review your project estimate and get a detailed quote sent to your email.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Results and breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <ResultsSummary estimate={estimate} />
            {/* PRD 8.5: Pricing formula display */}
            <PricingFormula
              tokensIn={estimate.tokensIn ?? 0}
              tokensOut={estimate.tokensOut ?? 0}
              materialsCost={estimate.materialsCost ?? 0}
              laborCost={estimate.laborCost ?? 0}
              riskBuffer={estimate.riskBuffer ?? 0}
              hoursMin={estimate.hoursMin}
              hoursMax={estimate.hoursMax}
            />
            <CostBreakdown estimate={estimate} />
            <AssumptionsList assumptions={estimate.assumptions} />
            <RemediesSection />
          </div>

          {/* Right column - Quote form and comparable builds */}
          <div className="lg:col-span-1 space-y-6">
            <QuoteForm estimateId={estimateId} estimate={estimate} />
            <ComparableBuilds
              selectedModules={estimate.modules}
              quality={estimate.quality}
            />
          </div>
        </div>
      </main>

      {/* Floating "Ask a Human" button */}
      <AskHumanButton floating />
    </div>
  );
}
