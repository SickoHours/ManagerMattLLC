"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const clientSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "We understand your vision, goals, and constraints.",
    deliverables: ["Project brief", "Technical requirements", "Timeline"],
    color: "from-purple-500 to-purple-600",
  },
  {
    number: "02",
    title: "Design",
    description: "Wireframes and mockups before any code is written.",
    deliverables: ["Wireframes", "Visual designs", "Your approval"],
    color: "from-purple-600 to-pink-500",
  },
  {
    number: "03",
    title: "Build",
    description: "Development in focused sprints with real-time visibility.",
    deliverables: ["Staging environment", "Weekly updates", "Working features"],
    color: "from-pink-500 to-pink-600",
  },
  {
    number: "04",
    title: "Review",
    description: "QA testing, bug fixes, and polish before launch.",
    deliverables: ["QA results", "Performance tuning", "Final sign-off"],
    color: "from-pink-600 to-purple-500",
  },
  {
    number: "05",
    title: "Ship",
    description: "Production deployment with documentation and support.",
    deliverables: ["Live deployment", "Documentation", "30-day support"],
    color: "from-purple-500 to-blue-500",
  },
];

/**
 * Horizontal Scroll Process Section
 *
 * Apple-style horizontal scroll section that pins to the viewport
 * and translates vertical scroll into horizontal movement.
 *
 * Falls back to vertical layout on mobile (<768px).
 */
export function ProcessSectionHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Skip horizontal scroll on mobile
    if (isMobile) return;
    if (!sectionRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;

    // Calculate total scroll width
    const totalWidth = track.scrollWidth;
    const viewportWidth = section.offsetWidth;
    const scrollDistance = totalWidth - viewportWidth + 100; // Extra padding

    // Create the horizontal scroll animation
    const tween = gsap.to(track, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animate each card as it comes into view
    const cards = track.querySelectorAll(".process-card");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0.3,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 80%",
            end: "left 20%",
            scrub: true,
          },
        }
      );
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) {
          t.kill();
        }
      });
    };
  }, [isMobile]);

  // Mobile layout (vertical)
  if (isMobile) {
    return <ProcessSectionVertical />;
  }

  // Desktop layout (horizontal scroll)
  // Use dvh (dynamic viewport height) with vh fallback for mobile Safari compatibility
  return (
    <section
      ref={sectionRef}
      className="bg-vibe-dark relative overflow-hidden"
      style={{ height: "100dvh", minHeight: "100vh" }}
    >
      {/* Ambient glow */}
      <div className="glow-purple-sm absolute top-1/4 right-0 opacity-30" />

      {/* Header - stays fixed */}
      <div className="absolute top-0 left-0 right-0 pt-16 pb-8 px-6 z-10 bg-gradient-to-b from-[#020202] via-[#020202]/90 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-display-premium text-white text-3xl md:text-5xl">
            How We Work Together
          </h2>
          <p className="text-zinc-400 text-lg mt-4">
            A clear, predictable process from idea to launch.
          </p>
        </div>
      </div>

      {/* Horizontal track */}
      <div className="absolute inset-0 flex items-center pt-24">
        <div
          ref={trackRef}
          className="horizontal-scroll-track pl-6 pr-[40vw]"
          style={{
            display: "flex",
            gap: "2rem",
            paddingTop: "4rem",
          }}
        >
          {clientSteps.map((step, index) => (
            <div
              key={step.number}
              className="process-card horizontal-scroll-panel"
              style={{
                flex: "0 0 auto",
                width: "min(500px, 70vw)",
              }}
            >
              <div className="h-full vibe-card-enhanced p-8 relative overflow-hidden">
                {/* Gradient accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`}
                />

                {/* Large number background */}
                <span className="absolute -top-4 -right-4 text-[120px] font-bold text-white/[0.02] font-mono leading-none select-none">
                  {step.number}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  {/* Number badge */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-sm mb-6">
                    {step.number}
                  </div>

                  <h3 className="text-white text-2xl md:text-3xl font-medium mb-4">
                    {step.title}
                  </h3>

                  <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Deliverables */}
                  <div className="flex flex-wrap gap-2">
                    {step.deliverables.map((item, i) => (
                      <span
                        key={i}
                        className="text-sm text-zinc-400 bg-white/5 px-3 py-1.5 border border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* End card */}
          <div
            className="process-card horizontal-scroll-panel flex items-center justify-center"
            style={{
              flex: "0 0 auto",
              width: "min(400px, 60vw)",
            }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-white text-2xl font-medium">Ready to ship?</p>
              <p className="text-zinc-400 mt-2">Let&apos;s build something amazing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-zinc-500 text-sm">
        <span>Scroll to explore</span>
        <svg
          className="w-4 h-4 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </section>
  );
}

/**
 * Vertical fallback for mobile
 */
function ProcessSectionVertical() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      <div className="glow-purple-sm absolute top-1/4 right-0 opacity-30" />

      <div className="vibe-container px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="aura-hidden">
            <h2 className="text-display-premium text-white text-3xl md:text-5xl">
              How We Work Together
            </h2>
          </div>
          <div className="aura-hidden mt-4">
            <p className="text-zinc-400 text-lg">
              A clear, predictable process from idea to launch.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />

            <div className="space-y-8">
              {clientSteps.map((step) => (
                <div key={step.number} className="aura-hidden relative">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-sm z-10">
                      {step.number}
                    </div>

                    <div className="flex-1 vibe-card-enhanced p-6 hover-glow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="text-white text-xl font-medium mb-2">
                            {step.title}
                          </h3>
                          <p className="text-zinc-400 text-base">
                            {step.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                          {step.deliverables.map((item, i) => (
                            <span
                              key={i}
                              className="text-xs text-zinc-500 bg-white/5 px-2 py-1 border border-white/10"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
