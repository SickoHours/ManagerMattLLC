"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const evidenceBullets = [
  "25% of Y Combinator startups are 95% AI-coded",
  "Claude Opus 4.5 just hit 80.9% on real-world coding benchmarks",
  "Solo devs are out-shipping VC-funded teams",
];

/**
 * CTA Section - The Grand Finale
 * Clean, reliable animations with proper visibility
 */
export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showHesitation, setShowHesitation] = useState([false, false, false]);
  const [showBullets, setShowBullets] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);

          // Stagger hesitation lines with comedic timing
          setTimeout(() => setShowHesitation([true, false, false]), 300);
          setTimeout(() => setShowHesitation([true, true, false]), 800);
          setTimeout(() => setShowHesitation([true, true, true]), 1200);

          // Show bullets
          setTimeout(() => setShowBullets(true), 1600);

          // Show button
          setTimeout(() => setShowButton(true), 2200);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="bg-zinc-950 py-24 md:py-40 relative overflow-hidden"
    >
      {/* Spotlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[800px] bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent pointer-events-none blur-3xl" />

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-16 md:mb-24" />

      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center">
          {/* Headline */}
          <h2
            className={`text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            Ready to Hire a Vibe Coder?
          </h2>

          {/* Hesitation lines with comedic timing */}
          <div className="mt-10 space-y-3">
            <p
              className={`text-zinc-400 text-lg md:text-xl transition-all duration-500 ${
                showHesitation[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              I know. It feels wrong.
            </p>
            <p
              className={`text-zinc-400 text-lg md:text-xl transition-all duration-500 ${
                showHesitation[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Like ordering dessert before dinner.
            </p>
            <p
              className={`text-zinc-400 text-lg md:text-xl transition-all duration-500 ${
                showHesitation[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Like skipping the tutorial.
            </p>
          </div>

          {/* The pivot */}
          <p
            className={`mt-10 text-zinc-300 text-lg font-medium transition-all duration-500 ${
              showBullets ? "opacity-100" : "opacity-0"
            }`}
          >
            But consider this:
          </p>

          {/* Evidence bullets */}
          <div
            className={`mt-6 space-y-3 max-w-xl mx-auto transition-all duration-700 ${
              showBullets ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {evidenceBullets.map((bullet, index) => (
              <div
                key={index}
                className="flex items-start gap-3 group"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                  →
                </span>
                <p className="text-zinc-300 text-base text-left">{bullet}</p>
              </div>
            ))}
          </div>

          {/* The closer */}
          <p
            className={`mt-12 text-white text-xl md:text-2xl font-semibold transition-all duration-500 ${
              showButton ? "opacity-100" : "opacity-0"
            }`}
          >
            The future is here.{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              It&apos;s just vibes.
            </span>
          </p>

          {/* CTA Button */}
          <div
            className={`mt-10 flex flex-col items-center gap-4 transition-all duration-700 ${
              showButton ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-90"
            }`}
          >
            <Link
              href="/estimate"
              className="group relative inline-flex items-center gap-2 bg-white text-black rounded-full text-lg px-10 py-4 font-semibold overflow-hidden hover:bg-zinc-100 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              {/* Animated border */}
              <span className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-pulse" />
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
