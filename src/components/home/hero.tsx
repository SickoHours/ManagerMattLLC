"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

export function Hero() {
  return (
    <section className="section-padding-lg">
      <div className="container-wide mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <FadeIn delay={0} direction="up">
            <h1 className="text-display text-foreground">
              Build products that matter.
            </h1>
          </FadeIn>

          {/* Tagline */}
          <FadeIn delay={100} direction="up">
            <p className="mt-6 text-h2 text-secondary-custom font-semibold">
              Faster. Clearer. Cheaper.
            </p>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={200} direction="up">
            <p className="mt-8 text-body text-secondary-custom max-w-xl mx-auto">
              AI-accelerated development with radically transparent estimates and
              delivery. See every assumption, track every change, own your
              outcomes.
            </p>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={300} direction="up">
            <div className="mt-12">
              <Link href="/estimate">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-medium shadow-sm hover:shadow-md transition-all"
                >
                  Get Your Estimate
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Subtle trust indicator */}
          <FadeIn delay={400} direction="up">
            <p className="mt-8 text-label text-muted-custom">
              Free estimate in under 5 minutes
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
