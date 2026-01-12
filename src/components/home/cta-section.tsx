"use client";

import Link from "next/link";

const evidenceBullets = [
  "25% of Y Combinator startups are 95% AI-coded",
  "Claude Opus 4.5 just hit 80.9% on real-world coding benchmarks",
  "Solo devs are out-shipping VC-funded teams",
];

export function CTASection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32">
      {/* Subtle gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-24" />

      <div className="vibe-container px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header */}
          <div className="aura-reveal">
            <h2 className="text-vibe-display text-white text-3xl md:text-5xl">
              Ready to Hire a Vibe Coder?
            </h2>
          </div>

          {/* The hesitation */}
          <div className="aura-reveal aura-reveal-delay-1 mt-10">
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              I know. It feels wrong.
              <br />
              Like ordering dessert before dinner.
              <br />
              Like skipping the tutorial.
            </p>
          </div>

          {/* The pivot */}
          <div className="aura-reveal aura-reveal-delay-2 mt-10">
            <p className="text-zinc-300 text-lg">But consider this:</p>
          </div>

          {/* Evidence bullets */}
          <div className="aura-reveal aura-reveal-delay-3 mt-8 space-y-4 max-w-xl mx-auto">
            {evidenceBullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-purple-400 mt-1">→</span>
                <p className="text-zinc-300 text-base text-left">{bullet}</p>
              </div>
            ))}
          </div>

          {/* The closer */}
          <div className="aura-reveal aura-reveal-delay-4 mt-12">
            <p className="text-white text-xl md:text-2xl font-medium">
              The future is here.{" "}
              <span className="text-gradient-purple">It&apos;s just vibes.</span>
            </p>
          </div>

          {/* CTA */}
          <div className="aura-reveal aura-reveal-delay-5 mt-12 flex flex-col items-center gap-4">
            <Link
              href="/estimate"
              className="btn-vibe-primary shimmer-border text-lg px-10 py-4"
            >
              Get Your Estimate
            </Link>
            <p className="text-zinc-500 text-sm">— no judgment, I promise</p>
          </div>
        </div>
      </div>
    </section>
  );
}
