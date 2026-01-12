"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

/**
 * Rejection Item Component
 * Types in text, then slashes through with strikethrough
 */
function RejectionItem({
  text,
  delay,
  isActive,
}: {
  text: string;
  delay: number;
  isActive: boolean;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const strikeRef = useRef<SVGLineElement>(null);
  const containerRef = useRef<HTMLLIElement>(null);
  const [displayText, setDisplayText] = useState("");
  const [isStruck, setIsStruck] = useState(false);

  useEffect(() => {
    if (!isActive || !textRef.current || !strikeRef.current || !containerRef.current) return;

    // Reset state
    setDisplayText("");
    setIsStruck(false);
    gsap.set(strikeRef.current, { strokeDashoffset: 300 });
    gsap.set(containerRef.current, { opacity: 1 });

    // Typewriter effect
    const typeDelay = delay * 1000;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= text.length) {
        setDisplayText(text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);

        // Pause for comedic timing, then slash
        setTimeout(() => {
          // Draw strikethrough
          gsap.to(strikeRef.current, {
            strokeDashoffset: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              setIsStruck(true);
              // Shake on impact
              gsap.fromTo(
                containerRef.current,
                { x: -4 },
                {
                  x: 0,
                  duration: 0.4,
                  ease: "elastic.out(1, 0.3)",
                }
              );
              // Dim the text
              gsap.to(containerRef.current, {
                opacity: 0.4,
                duration: 0.3,
              });
            },
          });
        }, 400); // Pause before slash
      }
    }, 35); // Typing speed

    const totalDelay = setTimeout(() => {}, typeDelay);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(totalDelay);
    };
  }, [isActive, text, delay]);

  return (
    <li ref={containerRef} className="flex items-start gap-3 relative">
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500/10 rounded">
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-red-400">
          <line
            x1="2"
            y1="2"
            x2="12"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="2"
            x2="2"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="relative">
        <span
          ref={textRef}
          className={`text-zinc-400 text-base transition-colors duration-300 ${
            isStruck ? "text-zinc-600" : ""
          }`}
        >
          {displayText}
          <span className="animate-pulse">|</span>
        </span>
        {/* Strikethrough SVG */}
        <svg
          className="absolute left-0 top-1/2 w-full h-[3px] -translate-y-1/2 overflow-visible pointer-events-none"
          style={{ width: `${text.length * 8}px` }}
        >
          <line
            ref={strikeRef}
            x1="0"
            y1="1.5"
            x2="100%"
            y2="1.5"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="300"
            strokeDashoffset="300"
          />
        </svg>
      </span>
    </li>
  );
}

/**
 * Approval Item Component
 * Slides in with spring physics, checkmark draws itself
 */
function ApprovalItem({
  text,
  delay,
  isActive,
}: {
  text: string;
  delay: number;
  isActive: boolean;
}) {
  const containerRef = useRef<HTMLLIElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current || !checkRef.current) return;

    // Set initial state
    gsap.set(containerRef.current, { opacity: 0, x: 60 });
    gsap.set(checkRef.current, { strokeDashoffset: 20 });

    // Animate in with spring physics
    gsap.to(containerRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: delay,
      ease: "back.out(1.7)",
      onComplete: () => {
        // Draw checkmark
        gsap.to(checkRef.current, {
          strokeDashoffset: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            // Green glow pulse
            if (glowRef.current) {
              gsap.fromTo(
                glowRef.current,
                { boxShadow: "0 0 0px rgba(34, 197, 94, 0)" },
                {
                  boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1,
                }
              );
            }
          },
        });
      },
    });
  }, [isActive, delay]);

  return (
    <li ref={containerRef} className="flex items-start gap-3 opacity-0">
      <span
        ref={glowRef}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-500/10 rounded transition-shadow"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-green-400">
          <path
            ref={checkRef}
            d="M2 7.5L5.5 11L12 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="20"
            strokeDashoffset="20"
          />
        </svg>
      </span>
      <span className="text-zinc-300 text-base">{text}</span>
    </li>
  );
}

/**
 * Qualifications Section - "The Audit"
 *
 * A resume being reviewed - items get rejected (crossed out) or approved (checkmark draws).
 * Left column: Harsh rejection sequence with typing + strikethrough
 * Right column: Satisfying approval with spring physics + checkmark draw
 */
export function QualificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bottomQuoteRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;

    // Trigger animation when section comes into view
    ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      once: true,
      onEnter: () => setIsActive(true),
    });

    // Animate header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
        }
      );
    }

    // Animate bottom quote after main content
    if (bottomQuoteRef.current) {
      gsap.fromTo(
        bottomQuoteRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bottomQuoteRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section || t.vars.trigger === bottomQuoteRef.current) {
          t.kill();
        }
      });
    };
  }, []);

  // Calculate delays - rejection items type sequentially, approval items stagger
  const getRejectDelay = (index: number) => {
    // Each rejection item needs time to type + slash
    // ~35ms per char + 400ms pause + 700ms animation = ~2s per item
    return index * 2.2;
  };

  const getApprovalDelay = (index: number) => {
    // Start after first rejection starts, stagger every 0.3s
    return 0.8 + index * 0.25;
  };

  return (
    <section
      ref={sectionRef}
      className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="glow-purple-sm absolute bottom-0 left-1/2 -translate-x-1/2 opacity-30" />

      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-16 opacity-0">
          <h2 className="text-display-premium text-white text-3xl md:text-5xl">
            My Qualifications
          </h2>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* What I Don't Have - Rejection Column */}
          <div>
            <div className="vibe-card-enhanced p-6 md:p-8 h-full">
              <h3 className="text-zinc-500 text-sm uppercase tracking-widest mb-6">
                What I Don&apos;t Have
              </h3>
              <ul className="space-y-5">
                {dontHave.map((item, index) => (
                  <RejectionItem
                    key={index}
                    text={item}
                    delay={isMobile ? 0 : getRejectDelay(index)}
                    isActive={isActive}
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* What I Have - Approval Column */}
          <div>
            <div className="vibe-card-enhanced p-6 md:p-8 h-full hover-glow">
              <h3 className="text-zinc-500 text-sm uppercase tracking-widest mb-6">
                What I Have
              </h3>
              <ul className="space-y-4">
                {doHave.map((item, index) => (
                  <ApprovalItem
                    key={index}
                    text={item}
                    delay={isMobile ? index * 0.1 : getApprovalDelay(index)}
                    isActive={isActive}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom quote / mic drop */}
        <div ref={bottomQuoteRef} className="max-w-3xl mx-auto mt-16 text-center opacity-0">
          <p className="text-zinc-500 text-lg italic mb-6">
            &ldquo;But how can you call yourself a developer if—&rdquo;
          </p>
          <p className="text-white text-xl md:text-2xl font-medium leading-relaxed">
            I ship features. I fix bugs. I make things that work.
          </p>
          <p className="text-display-premium text-purple-400 text-2xl md:text-3xl mt-4">
            What would you call that?
          </p>
        </div>
      </div>
    </section>
  );
}
