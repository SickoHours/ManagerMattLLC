"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "@/components/layout/header";
import { ResultsSummary } from "@/components/estimate/results-summary";
import { CostBreakdown } from "@/components/estimate/cost-breakdown";
import { AssumptionsList } from "@/components/estimate/assumptions-list";
import { QuoteForm } from "@/components/estimate/quote-form";

export default function ResultsPage() {
  const params = useParams();
  const estimateId = params.estimateId as Id<"estimates">;

  const estimate = useQuery(api.estimates.get, { estimateId });

  if (estimate === undefined) {
    return (
      <div className="min-h-screen bg-page">
        <Header />
        <main className="container-wide mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-subtle rounded w-1/3 mb-4" />
            <div className="h-4 bg-subtle rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-subtle rounded-2xl" />
                <div className="h-48 bg-subtle rounded-2xl" />
              </div>
              <div className="h-96 bg-subtle rounded-2xl" />
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
            <CostBreakdown estimate={estimate} />
            <AssumptionsList assumptions={estimate.assumptions} />
          </div>

          {/* Right column - Quote form */}
          <div className="lg:col-span-1">
            <QuoteForm estimateId={estimateId} estimate={estimate} />
          </div>
        </div>
      </main>
    </div>
  );
}
