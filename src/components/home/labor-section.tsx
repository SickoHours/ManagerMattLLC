"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Value Bar Component - Simple, reliable animation
 */
function ValueBar({
  label,
  targetPercent,
  variant,
  isActive,
}: {
  label: string;
  targetPercent: number;
  variant: "money" | "labor";
  isActive: boolean;
}) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fillRef.current) return;

    if (isActive) {
      gsap.to(fillRef.current, {
        height: `${targetPercent}%`,
        duration: 1.5,
        ease: "power2.out",
        delay: variant === "labor" ? 0.3 : 0,
      });
    }
  }, [isActive, targetPercent, variant]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-48 w-14 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50">
        <div
          ref={fillRef}
          className={`absolute bottom-0 left-0 right-0 rounded-full transition-all ${
            variant === "money"
              ? "bg-gradient-to-t from-green-600 to-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
              : "bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          }`}
          style={{ height: "0%" }}
        />
      </div>
      <span
        className={`text-sm font-semibold tracking-wide ${
          variant === "money" ? "text-green-400" : "text-red-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Labor Section - "The Compression"
 * Clean, reliable implementation with visible content
 */
export function LaborSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const laborWordRef = useRef<HTMLSpanElement>(null);
  const strikethroughRef = useRef<SVGLineElement>(null);
  const [barsActive, setBarsActive] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const laborWord = laborWordRef.current;
    const strikethrough = strikethroughRef.current;

    if (!section) return;

    // Trigger animation when section comes into view
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => {
        setBarsActive(true);
        setHasAnimated(true);

        // Animate the word compression
        if (laborWord) {
          gsap.to(laborWord, {
            scaleX: 0.7,
            opacity: 0.6,
            duration: 1.2,
            delay: 0.5,
            ease: "power2.inOut",
          });
        }

        // Draw strikethrough
        if (strikethrough) {
          gsap.to(strikethrough, {
            strokeDashoffset: 0,
            duration: 0.6,
            delay: 1.2,
            ease: "power2.out",
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-zinc-950 py-24 md:py-32 relative overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* The Quote */}
        <div className="text-center mb-16">
          <blockquote className="relative">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-7xl text-purple-500/20 font-serif select-none">
              &ldquo;
            </span>

            <p className="text-white text-2xl md:text-4xl lg:text-5xl font-medium leading-tight pt-8">
              AI doesn&apos;t reduce the value of{" "}
              <span className="text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                money
              </span>
              .
              <br className="hidden md:block" />
              <span className="md:mt-2 inline-block">
                It reduces the value of{" "}
                <span className="relative inline-block">
                  <span
                    ref={laborWordRef}
                    className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block origin-center"
                  >
                    labor
                  </span>
                  <svg
                    className="absolute left-0 top-1/2 w-full h-1 -translate-y-1/2 overflow-visible pointer-events-none"
                  >
                    <line
                      ref={strikethroughRef}
                      x1="0"
                      y1="2"
                      x2="100%"
                      y2="2"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="200"
                      strokeDashoffset="200"
                    />
                  </svg>
                </span>
                .
              </span>
            </p>

            <p className="text-zinc-400 text-xl md:text-2xl mt-8 font-medium">
              Big difference.
            </p>
          </blockquote>

          <cite className="block mt-6 text-zinc-500 text-sm not-italic">
            — Alex Hormozi,{" "}
            <a
              href="https://x.com/AlexHormozi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              @AlexHormozi
            </a>
          </cite>
        </div>

        {/* Value Bars */}
        <div className="flex justify-center gap-16 md:gap-24 mb-16">
          <ValueBar
            label="MONEY"
            targetPercent={100}
            variant="money"
            isActive={barsActive}
          />
          <ValueBar
            label="LABOR"
            targetPercent={25}
            variant="labor"
            isActive={barsActive}
          />
        </div>

        {/* Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              What this means for you:
            </h3>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-0.5">→</span>
                <span>The same quality software that cost $100k in 2023 might cost a fraction today</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-0.5">→</span>
                <span>Not because the work is worth less, but because the labor required has collapsed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 mt-0.5">→</span>
                <span>Startups that couldn&apos;t afford custom software can now compete</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              What stays the same:
            </h3>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Quality standards and code review</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Testing and security practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Communication and project management</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>The expertise to know what to build</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-16 text-center">
          <p className="text-zinc-300 text-lg">
            This is the first time in history that{" "}
            <span className="text-white font-semibold">custom software is accessible to everyone</span>.
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            Not templates. Not no-code workarounds. Real, custom software.
          </p>
        </div>
      </div>
    </section>
  );
}
