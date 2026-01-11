"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header } from "@/components/layout/header";
import { formatPrice } from "@/lib/mock-data";

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

export default function PublicQuotePage() {
  const params = useParams();
  const shareId = params.shareId as string;

  const quote = useQuery(api.quotes.getByShareId, { shareId });
  const markViewed = useMutation(api.quotes.markViewed);

  // Mark as viewed when page loads
  useEffect(() => {
    if (quote && quote.status === "sent") {
      markViewed({ shareId });
    }
  }, [quote, shareId, markViewed]);

  // Loading state
  if (quote === undefined) {
    return (
      <div className="min-h-screen bg-page">
        <Header />
        <main className="container-wide mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-subtle rounded w-1/3 mb-4" />
            <div className="h-4 bg-subtle rounded w-1/2 mb-8" />
            <div className="h-64 bg-subtle rounded-2xl mb-6" />
            <div className="h-48 bg-subtle rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  // Not found state
  if (quote === null) {
    return (
      <div className="min-h-screen bg-page">
        <Header />
        <main className="container-wide mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-subtle flex items-center justify-center">
              <svg
                className="w-8 h-8 text-secondary-custom"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-h2 text-foreground mb-4">Quote Not Found</h1>
            <p className="text-body text-secondary-custom mb-8">
              This quote link may have expired or is invalid.
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

  const { snapshot, moduleDetails } = quote;

  const confidenceColor =
    snapshot.confidence >= 70
      ? "text-success"
      : snapshot.confidence >= 50
        ? "text-warning"
        : "text-destructive";

  return (
    <div className="min-h-screen bg-page">
      <Header />
      <main className="container-wide mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-10">
            <p className="text-label text-secondary-custom uppercase tracking-wider mb-2">
              Your Project Quote
            </p>
            <h1 className="text-h1 text-foreground">Manager Matt LLC</h1>
          </div>

          {/* Price card */}
          <div className="bg-surface rounded-2xl p-8 shadow-md mb-6">
            <div className="text-center pb-6 border-b border-border-default">
              <p className="text-label text-secondary-custom uppercase tracking-wider mb-2">
                Estimated Cost Range
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-display text-foreground">
                  {formatPrice(snapshot.priceMin)}
                </span>
                <span className="text-h3 text-secondary-custom">to</span>
                <span className="text-display text-foreground">
                  {formatPrice(snapshot.priceMax)}
                </span>
              </div>
              <p className="mt-2 text-body text-secondary-custom">
                Most likely: {formatPrice(snapshot.priceMid)}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-b border-border-default">
              <div className="text-center">
                <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
                  Confidence
                </p>
                <p className={`text-h3 font-semibold ${confidenceColor}`}>
                  {snapshot.confidence}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
                  Timeline
                </p>
                <p className="text-h3 font-semibold text-foreground">
                  {Math.round(snapshot.daysMin)}-{Math.round(snapshot.daysMax)} days
                </p>
              </div>
              <div className="text-center">
                <p className="text-label text-secondary-custom uppercase tracking-wider mb-1">
                  Hours
                </p>
                <p className="text-h3 font-semibold text-foreground">
                  {snapshot.hoursMin}-{snapshot.hoursMax}
                </p>
              </div>
            </div>

            {/* Build spec */}
            <div className="pt-6">
              <h3 className="text-label text-secondary-custom uppercase tracking-wider mb-4">
                Project Specification
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-body-sm text-secondary-custom">Platform</p>
                  <p className="text-body font-medium text-foreground">
                    {PLATFORM_LABELS[snapshot.platform] || snapshot.platform}
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-secondary-custom">Auth</p>
                  <p className="text-body font-medium text-foreground">
                    {AUTH_LABELS[snapshot.authLevel] || snapshot.authLevel}
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-secondary-custom">Quality</p>
                  <p className="text-body font-medium text-foreground">
                    {QUALITY_LABELS[snapshot.quality] || snapshot.quality}
                  </p>
                </div>
              </div>

              {/* Modules */}
              {moduleDetails && moduleDetails.length > 0 && (
                <div className="pt-4 border-t border-border-default">
                  <p className="text-body-sm text-secondary-custom mb-2">
                    {moduleDetails.length} Module{moduleDetails.length !== 1 ? "s" : ""} Included
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {moduleDetails.map((module) => (
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

          {/* Cost drivers */}
          {snapshot.costDrivers.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md mb-6">
              <h2 className="text-h3 text-foreground mb-4">Cost Breakdown</h2>
              <div className="space-y-2">
                {snapshot.costDrivers.map((driver, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border-default"
                  >
                    <span className="text-body text-foreground">{driver.name}</span>
                    <span
                      className={`text-body font-medium ${
                        driver.amount >= 0 ? "text-foreground" : "text-success"
                      }`}
                    >
                      {driver.amount >= 0 ? "+" : ""}
                      {formatPrice(driver.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assumptions */}
          {snapshot.assumptions.length > 0 && (
            <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md mb-6">
              <h2 className="text-h3 text-foreground mb-4">Assumptions</h2>
              <ul className="space-y-3">
                {snapshot.assumptions.map((assumption, index) => (
                  <li key={index} className="flex items-start gap-3">
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
                    <span className="text-body text-foreground">{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA section */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 text-center">
            <h2 className="text-h3 text-foreground mb-2">Ready to get started?</h2>
            <p className="text-body text-secondary-custom mb-6">
              Schedule a discovery call to finalize scope and get a fixed-price quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:matt@managermatt.com"
                className="inline-flex items-center justify-center h-12 px-8 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
              >
                Schedule Discovery Call
              </a>
              <a
                href={`/api/quote/${shareId}/pdf`}
                className="inline-flex items-center justify-center h-12 px-8 border border-border-default text-foreground rounded-lg font-medium hover:bg-subtle transition-colors"
              >
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-body-sm text-secondary-custom">
              Quote ID: {shareId} &bull; Generated on{" "}
              {new Date(quote.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
