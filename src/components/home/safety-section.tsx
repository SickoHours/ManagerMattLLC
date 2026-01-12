"use client";

import { useEffect, useRef, useState } from "react";
import {
  GitBranch,
  TestTube,
  Shield,
  Activity,
  FileText,
  Server,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideIcon } from "lucide-react";

const safetyPractices = [
  {
    icon: GitBranch,
    title: "Version Control",
    description: "All code in Git with full history and backups. Nothing gets lost.",
  },
  {
    icon: Server,
    title: "Staging Environment",
    description: "Test changes safely before they touch production.",
  },
  {
    icon: TestTube,
    title: "Automated Testing",
    description: "Critical paths covered by tests that run on every change.",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Auth, data handling, and APIs follow industry best practices.",
  },
  {
    icon: Activity,
    title: "Monitoring & Alerts",
    description: "Real-time error tracking so issues get caught immediately.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Clear docs for maintenance and future development.",
  },
];

/**
 * Safety Card with Scan Activation Effect
 * Starts greyed out, scan line sweeps, then colorizes with icon glow
 */
function SafetyCard({
  icon: Icon,
  title,
  description,
  isActive,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!isActive || !cardRef.current || !scanRef.current || !iconRef.current) return;

    const card = cardRef.current;
    const scan = scanRef.current;
    const icon = iconRef.current;

    // Set initial state - greyed out
    gsap.set(card, { filter: "grayscale(1)", opacity: 0.5 });
    gsap.set(scan, { x: "-100%" });

    // Delay before this card activates
    const timeout = setTimeout(() => {
      // Start scan animation
      gsap.to(scan, {
        x: "100%",
        duration: 0.6,
        ease: "power1.inOut",
        onComplete: () => {
          // Colorize card
          gsap.to(card, {
            filter: "grayscale(0)",
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          setIsOnline(true);

          // Icon glow pulse
          gsap.fromTo(
            icon,
            { boxShadow: "0 0 0px rgba(34, 197, 94, 0)" },
            {
              boxShadow: "0 0 25px rgba(34, 197, 94, 0.6)",
              duration: 0.4,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            }
          );
        },
      });
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isActive, delay]);

  return (
    <div
      ref={cardRef}
      className="vibe-card-enhanced p-6 h-full relative overflow-hidden transition-all duration-300"
      style={{ filter: "grayscale(1)", opacity: 0.5 }}
    >
      {/* Scan Line */}
      <div
        ref={scanRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(34, 197, 94, 0.1) 40%,
            rgba(34, 197, 94, 0.3) 50%,
            rgba(34, 197, 94, 0.1) 60%,
            transparent 100%
          )`,
          transform: "translateX(-100%)",
        }}
      />

      <div className="flex items-start gap-4 relative z-0">
        <div
          ref={iconRef}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded transition-all duration-500 ${
            isOnline
              ? "bg-green-500/20 text-green-400"
              : "bg-zinc-700/30 text-zinc-500"
          }`}
        >
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3
            className={`font-medium mb-1 transition-colors duration-500 ${
              isOnline ? "text-white" : "text-zinc-500"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm leading-relaxed transition-colors duration-500 ${
              isOnline ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Online indicator dot */}
      {isOnline && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Safety Section - "System Online"
 *
 * A security system powering up - each card "comes online" sequentially
 * with a terminal boot aesthetic. Cards scan, colorize, and glow.
 */
export function SafetySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [allOnline, setAllOnline] = useState(false);
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

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) {
          t.kill();
        }
      });
    };
  }, []);

  // Trigger "all systems online" after last card
  useEffect(() => {
    if (!isActive) return;

    const totalDuration = safetyPractices.length * 0.35 + 1; // Total time for all cards + buffer
    const timeout = setTimeout(() => {
      setAllOnline(true);

      // Animate the status indicator
      if (statusRef.current) {
        gsap.fromTo(
          statusRef.current,
          { opacity: 0, y: 10, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          }
        );
      }
    }, totalDuration * 1000);

    return () => clearTimeout(timeout);
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden"
    >
      {/* Subtle grid pattern for terminal feel */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-16 opacity-0">
          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4 font-mono">
            &ldquo;But isn&apos;t vibe coding... risky?&rdquo;
          </p>
          <h2 className="text-display-premium text-white text-3xl md:text-5xl">
            Same Safety Standards
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mt-4">
            AI writes the code. I still apply the same engineering practices
            any senior team would use.
          </p>
        </div>

        {/* Safety Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {safetyPractices.map((practice, index) => (
            <SafetyCard
              key={practice.title}
              icon={practice.icon}
              title={practice.title}
              description={practice.description}
              isActive={isActive}
              delay={isMobile ? index * 0.15 : index * 0.35}
            />
          ))}
        </div>

        {/* System Online Status */}
        <div
          ref={statusRef}
          className={`max-w-md mx-auto mt-12 text-center opacity-0 ${
            allOnline ? "block" : "hidden"
          }`}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-green-500/30 bg-green-500/5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-400 font-mono text-sm tracking-wide">
              ALL SYSTEMS ONLINE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
