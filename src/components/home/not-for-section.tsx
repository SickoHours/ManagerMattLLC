"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";

export function NotForSection() {
  const notForItems = [
    {
      title: "Enterprise companies needing 50+ person teams",
      description: "We're a lean operation focused on high-quality, hands-on work",
    },
    {
      title: "Projects requiring certifications from day one",
      description: "SOC2, HIPAA, and similar certifications need specialized compliance teams",
    },
    {
      title: "Agencies looking to white-label our work",
      description: "We build direct relationships with our clients",
    },
    {
      title: "Projects with undefined scope and unlimited budget",
      description: "We thrive with clear outcomes and honest constraints",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-subtle">
      <div className="container-wide mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="text-h2 text-foreground mb-4">
                Who This Might Not Be For
              </h2>
              <p className="text-body text-secondary-custom">
                We believe in honest alignment. Here&apos;s when we&apos;re probably not the right fit.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {notForItems.map((item, index) => (
              <FadeIn key={index} delay={index * 100} direction="up">
                <div className="flex items-start gap-4 p-5 bg-surface rounded-xl border border-border-default hover:bg-subtle hover:shadow-sm transition-all duration-200">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-4 h-4 text-destructive"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-body-sm text-secondary-custom mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400} direction="up">
            <div className="mt-10 p-6 bg-accent/5 rounded-xl border border-accent/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    We&apos;re best for:
                  </p>
                  <p className="text-body text-secondary-custom">
                    Founders, small teams, and companies with specific builds and clear outcomes.
                    We excel at turning your vision into working software without the overhead of
                    traditional agencies.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Secondary CTA for edge cases */}
          <FadeIn delay={500} direction="up">
            <div className="mt-8 text-center">
              <p className="text-body-sm text-secondary-custom mb-3">
                Still think we might be a fit?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-accent hover:text-accent-hover font-medium transition-colors"
              >
                Let&apos;s chat and find out
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
