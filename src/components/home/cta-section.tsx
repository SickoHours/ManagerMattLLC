"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const evidenceBullets = [
  "25% of Y Combinator startups are 95% AI-coded",
  "Claude Opus 4.5 just hit 80.9% on real-world coding benchmarks",
  "Solo devs are out-shipping VC-funded teams",
];

export function CTASection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-purple glow-top opacity-50" />

      {/* Subtle gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-24" />

      <div className="vibe-container px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header */}
          <div className="aura-hidden">
            <h2 className="text-display-premium text-white text-3xl md:text-5xl lg:text-6xl">
              Ready to Hire a Vibe Coder?
            </h2>
          </div>

          {/* The hesitation */}
          <div className="aura-hidden mt-10">
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              I know. It feels wrong.
              <br />
              Like ordering dessert before dinner.
              <br />
              Like skipping the tutorial.
            </p>
          </div>

          {/* The pivot */}
          <div className="aura-hidden mt-10">
            <p className="text-zinc-300 text-lg">But consider this:</p>
          </div>

          {/* Evidence bullets */}
          <div className="aura-hidden mt-8 space-y-4 max-w-xl mx-auto">
            {evidenceBullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                  →
                </span>
                <p className="text-zinc-300 text-base text-left">{bullet}</p>
              </div>
            ))}
          </div>

          {/* The closer */}
          <div className="aura-hidden mt-12">
            <p className="text-white text-xl md:text-2xl font-medium">
              The future is here.{" "}
              <span className="text-gradient-purple">It&apos;s just vibes.</span>
            </p>
          </div>

          {/* CTA with Border Beam */}
          <div className="aura-hidden mt-12 flex flex-col items-center gap-4">
            <Link
              href="/estimate"
              className="group relative inline-flex items-center gap-2 bg-white text-black rounded-full text-lg px-10 py-4 font-medium border-beam overflow-visible hover:bg-zinc-100 transition-colors"
            >
              <span className="relative z-10">Get Your Estimate</span>
              <ArrowRight
                size={20}
                className="relative z-10 transition-transform group-hover:translate-x-1"
              />
            </Link>
            <p className="text-zinc-500 text-sm">— no judgment, I promise</p>
          </div>
        </div>
      </div>
    </section>
  );
}
