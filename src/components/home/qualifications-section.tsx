"use client";

import { X, Check } from "lucide-react";

const dontHave = [
  "Computer Science Degree",
  "10 years of enterprise experience",
  "Ability to invert a binary tree on a whiteboard",
];

const doHave = [
  "Understanding of how software actually works",
  "Taste (underrated)",
  "The ability to review AI code and know when it's wrong",
  "Clients who pay me real money",
  "Apps in production right now",
  "Zero shame",
];

export function QualificationsSection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32">
      <div className="vibe-container px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="aura-reveal">
            <h2 className="text-vibe-display text-white text-3xl md:text-5xl">
              My Qualifications
            </h2>
          </div>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* What I Don't Have */}
          <div className="aura-reveal aura-reveal-delay-1">
            <div className="vibe-card p-6 md:p-8 h-full">
              <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-6">
                What I Don&apos;t Have
              </h3>
              <ul className="space-y-4">
                {dontHave.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500/10 text-red-400">
                      <X size={16} strokeWidth={2} />
                    </span>
                    <span className="text-zinc-400 text-base line-through decoration-zinc-600">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What I Have */}
          <div className="aura-reveal aura-reveal-delay-2">
            <div className="vibe-card p-6 md:p-8 h-full">
              <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-6">
                What I Have
              </h3>
              <ul className="space-y-4">
                {doHave.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-500/10 text-green-400">
                      <Check size={16} strokeWidth={2} />
                    </span>
                    <span className="text-zinc-300 text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom quote / mic drop */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="aura-reveal aura-reveal-delay-3">
            <p className="text-zinc-500 text-lg italic mb-6">
              &ldquo;But how can you call yourself a developer if—&rdquo;
            </p>
          </div>
          <div className="aura-reveal aura-reveal-delay-4">
            <p className="text-white text-xl md:text-2xl font-medium leading-relaxed">
              I ship features. I fix bugs. I make things that work.
            </p>
          </div>
          <div className="aura-reveal aura-reveal-delay-5 mt-4">
            <p className="text-vibe-display text-purple-400 text-2xl md:text-3xl">
              What would you call that?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
