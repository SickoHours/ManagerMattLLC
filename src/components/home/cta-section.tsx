"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const evidenceBullets = [
  "25% of Y Combinator startups are 95% AI-coded",
  "Claude Opus 4.5 just hit 80.9% on real-world coding benchmarks",
  "Solo devs are out-shipping VC-funded teams",
];

/**
 * CTA Section - "The Crescendo"
 *
 * A theatrical spotlight reveal with 5 phases:
 * 1. Darkness - Section starts dim with spotlight cone appearing
 * 2. Headline - Title scales up dramatically
 * 3. Hesitation - Humor lines with comedic timing
 * 4. Evidence - Bullets fly in from alternating sides
 * 5. Button - Elastic entrance with spotlight focus
 */
export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hesitationRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const bulletRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closerRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const spotlight = spotlightRef.current;
    const headline = headlineRef.current;
    const hesitations = hesitationRefs.current.filter(Boolean);
    const bullets = bulletRefs.current.filter(Boolean);
    const closer = closerRef.current;
    const button = buttonRef.current;

    // Set initial states
    gsap.set(spotlight, { opacity: 0, scaleY: 0, transformOrigin: "top" });
    gsap.set(headline, { opacity: 0, scale: 0.8, y: 30 });
    gsap.set(hesitations, { opacity: 0, y: 20 });
    gsap.set(bullets, { opacity: 0, x: (i) => (i % 2 === 0 ? -80 : 80) });
    gsap.set(closer, { opacity: 0, y: 20 });
    gsap.set(button, { opacity: 0, scale: 0 });

    // Create the theatrical timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        once: true,
        onEnter: () => setHasAnimated(true),
      },
    });

    // Mobile: simplified sequence
    if (isMobile) {
      tl.to(headline, { opacity: 1, scale: 1, y: 0, duration: 0.6 }, 0)
        .to(hesitations, { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 }, 0.3)
        .to(bullets, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1 }, 0.6)
        .to(closer, { opacity: 1, y: 0, duration: 0.4 }, 0.9)
        .to(button, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 1.1);
      return;
    }

    // Desktop: full theatrical sequence

    // Phase 1: Spotlight appears (0 - 0.8s)
    tl.to(
      spotlight,
      {
        opacity: 1,
        scaleY: 1,
        duration: 1,
        ease: "power2.out",
      },
      0
    );

    // Phase 2: Headline emerges (0.3 - 1.1s)
    tl.to(
      headline,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      0.3
    );

    // Phase 3: Hesitation lines with comedic timing (1.0 - 2.5s)
    tl.to(
      hesitations[0],
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      1.0
    );
    tl.to(
      hesitations[1],
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      1.5 // Deliberate pause for comedic timing
    );
    tl.to(
      hesitations[2],
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      1.9
    );

    // Phase 4: Evidence bullets fly in (2.3 - 3.2s)
    bullets.forEach((bullet, i) => {
      tl.to(
        bullet,
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        2.3 + i * 0.2
      );
    });

    // Closer line (3.0s)
    tl.to(
      closer,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      3.0
    );

    // Phase 5: Button entrance with spotlight focus (3.3 - 4.2s)
    tl.to(
      spotlight,
      {
        scaleX: 0.6,
        y: 100,
        duration: 0.8,
        ease: "power2.inOut",
      },
      3.3
    );

    tl.to(
      button,
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)",
      },
      3.5
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, [hasAnimated, isMobile]);

  // Helper to set refs
  const setHesitationRef = (index: number) => (el: HTMLParagraphElement | null) => {
    hesitationRefs.current[index] = el;
  };

  const setBulletRef = (index: number) => (el: HTMLDivElement | null) => {
    bulletRefs.current[index] = el;
  };

  return (
    <section
      ref={sectionRef}
      className="bg-vibe-dark py-24 md:py-40 relative overflow-hidden"
    >
      {/* Spotlight Cone */}
      <div
        ref={spotlightRef}
        className="spotlight-cone hidden md:block"
        aria-hidden="true"
      />

      {/* Ambient glow (fallback) */}
      <div className="glow-purple glow-top opacity-30" />

      {/* Subtle gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-16 md:mb-24" />

      <div className="vibe-container px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2
            ref={headlineRef}
            className="text-display-premium text-white text-3xl md:text-5xl lg:text-6xl will-change-transform"
          >
            Ready to Hire a Vibe Coder?
          </h2>

          {/* The hesitation - each line separate for timing control */}
          <div className="mt-10 space-y-2">
            <p
              ref={setHesitationRef(0)}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed"
            >
              I know. It feels wrong.
            </p>
            <p
              ref={setHesitationRef(1)}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed"
            >
              Like ordering dessert before dinner.
            </p>
            <p
              ref={setHesitationRef(2)}
              className="text-zinc-400 text-lg md:text-xl leading-relaxed"
            >
              Like skipping the tutorial.
            </p>
          </div>

          {/* The pivot */}
          <p className="mt-10 text-zinc-300 text-lg">But consider this:</p>

          {/* Evidence bullets */}
          <div className="mt-8 space-y-4 max-w-xl mx-auto">
            {evidenceBullets.map((bullet, index) => (
              <div
                key={index}
                ref={setBulletRef(index)}
                className="flex items-start gap-3 group will-change-transform"
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
            ref={closerRef}
            className="mt-12 text-white text-xl md:text-2xl font-medium"
          >
            The future is here.{" "}
            <span className="text-gradient-purple">It&apos;s just vibes.</span>
          </p>

          {/* CTA with Border Beam */}
          <div
            ref={buttonRef}
            className="mt-12 flex flex-col items-center gap-4 will-change-transform"
          >
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
