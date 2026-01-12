"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Value Bar Component
 * Animated progress bar that fills/drains based on scroll
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
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="value-bar">
        <div
          className={`value-bar-fill ${variant}`}
          style={{
            height: isActive ? `${targetPercent}%` : "0%",
          }}
        />
      </div>
      <span
        className={`text-sm font-medium transition-colors duration-500 ${
          variant === "money"
            ? isActive
              ? "text-green-400"
              : "text-zinc-500"
            : isActive
              ? "text-red-400"
              : "text-zinc-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Labor Section - "The Compression"
 *
 * Visually demonstrates "labor being reduced" through:
 * 1. Text compression animation on the word "labor"
 * 2. Value bars showing money stable vs labor draining
 * 3. Strikethrough animation
 */
export function LaborSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const laborWordRef = useRef<HTMLSpanElement>(null);
  const strikethroughRef = useRef<SVGLineElement>(null);
  const [barsActive, setBarsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !laborWordRef.current || isMobile) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const laborWord = laborWordRef.current;
    const strikethrough = strikethroughRef.current;

    // Main compression timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "center center",
        scrub: 1,
        onEnter: () => setBarsActive(true),
      },
    });

    // Compress the word "labor" horizontally
    tl.to(
      laborWord,
      {
        scaleX: 0.6,
        opacity: 0.5,
        filter: "blur(1px)",
        ease: "power2.inOut",
      },
      0
    );

    // Draw strikethrough line
    if (strikethrough) {
      tl.fromTo(
        strikethrough,
        { strokeDashoffset: 300 },
        { strokeDashoffset: 0, ease: "power2.inOut" },
        0.2
      );
    }

    // Trigger bars animation
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => setBarsActive(true),
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="glow-purple-sm absolute top-1/2 left-0 -translate-y-1/2 opacity-40" />

      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

      <div className="vibe-container px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* The Quote with Compression Animation */}
          <div ref={quoteRef} className="aura-hidden text-center mb-12">
            <blockquote className="relative">
              {/* Decorative quote mark */}
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 md:-top-10 text-6xl md:text-8xl text-purple-500/10 font-serif select-none">
                &ldquo;
              </span>

              {/* The quote text */}
              <p className="text-white text-2xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight pt-8">
                AI doesn&apos;t reduce the value of{" "}
                <span className="relative inline-block">
                  <span className="text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    money
                  </span>
                </span>
                .
                <br />
                <span className="mt-2 inline-block">
                  It reduces the value of{" "}
                  <span className="relative inline-block">
                    {/* The compressing word */}
                    <span
                      ref={laborWordRef}
                      className="text-gradient-purple inline-block origin-center will-change-transform"
                      style={{ display: "inline-block" }}
                    >
                      labor
                    </span>
                    {/* Strikethrough SVG */}
                    <svg
                      className="absolute left-0 top-1/2 w-full h-[4px] -translate-y-1/2 overflow-visible pointer-events-none"
                      style={{ transform: "translateY(-50%)" }}
                    >
                      <line
                        ref={strikethroughRef}
                        x1="0"
                        y1="2"
                        x2="100%"
                        y2="2"
                        stroke="url(#strikeGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="300"
                        strokeDashoffset="300"
                      />
                      <defs>
                        <linearGradient
                          id="strikeGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  .
                </span>
              </p>

              {/* The punchline */}
              <p className="text-zinc-400 text-xl md:text-2xl mt-8 font-medium">
                Big difference.
              </p>
            </blockquote>

            {/* Attribution */}
            <cite className="block mt-6 text-zinc-500 text-base not-italic">
              — Alex Hormozi,{" "}
              <a
                href="https://x.com/AlexHormozi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                @AlexHormozi
              </a>{" "}
              · Jan 3, 2026
            </cite>
          </div>

          {/* Value Bars Visualization */}
          <div className="aura-hidden flex justify-center gap-12 md:gap-20 mb-16">
            <ValueBar
              label="Money"
              targetPercent={100}
              variant="money"
              isActive={barsActive}
            />
            <ValueBar
              label="Labor"
              targetPercent={20}
              variant="labor"
              isActive={barsActive}
            />
          </div>

          {/* The Explanation Cards */}
          <div className="aura-hidden max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* What this means */}
              <div className="vibe-card-enhanced p-6">
                <h3 className="text-white text-lg font-medium mb-4">
                  What this means for you:
                </h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3 group">
                    <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    <span>
                      The same quality software that cost $100k in 2023 might
                      cost a fraction of that today
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    <span>
                      Not because the work is worth less, but because the labor
                      required has collapsed
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="text-purple-400 mt-1 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    <span>
                      Startups that couldn&apos;t afford custom software can now
                      compete with funded companies
                    </span>
                  </li>
                </ul>
              </div>

              {/* What stays the same */}
              <div className="vibe-card-enhanced p-6">
                <h3 className="text-white text-lg font-medium mb-4">
                  What stays the same:
                </h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Quality standards and code review</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Testing and security practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Communication and project management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>The expertise to know what to build</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* The punchline */}
          <div className="aura-hidden mt-16 text-center">
            <p className="text-zinc-300 text-lg md:text-xl">
              This is the first time in history that{" "}
              <span className="text-white font-medium">
                custom software is accessible to everyone
              </span>
              .
            </p>
            <p className="text-zinc-500 text-base mt-2">
              Not templates. Not no-code workarounds. Real, custom software.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
