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
 * Safety Card with scan effect
 */
function SafetyCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setTimeout(() => {
            setIsVisible(true);
            // Show online status after card appears
            setTimeout(() => setIsOnline(true), 400);
          }, delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay, isVisible]);

  return (
    <div
      ref={cardRef}
      className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative overflow-hidden transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${isOnline ? "border-green-500/20" : ""}`}
    >
      {/* Scan line effect */}
      <div
        className={`absolute inset-0 pointer-events-none transition-transform duration-700 ${
          isVisible ? "translate-x-full" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.15), transparent)",
        }}
      />

      <div className="flex items-start gap-4 relative">
        <div
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded transition-all duration-500 ${
            isOnline
              ? "bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className={`font-semibold mb-1 transition-colors duration-500 ${
            isOnline ? "text-white" : "text-zinc-400"
          }`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed transition-colors duration-500 ${
            isOnline ? "text-zinc-400" : "text-zinc-600"
          }`}>
            {description}
          </p>
        </div>
      </div>

      {/* Online indicator */}
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
 * Safety Section - System Online
 */
export function SafetySection() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [allOnline, setAllOnline] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHeaderVisible(true);
          // Show "all systems online" after cards animate
          setTimeout(() => setAllOnline(true), safetyPractices.length * 150 + 1000);
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-zinc-950 py-24 md:py-32 relative overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-4 font-mono">
            &ldquo;But isn&apos;t vibe coding... risky?&rdquo;
          </p>
          <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight">
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
              delay={index * 150}
            />
          ))}
        </div>

        {/* System Online Status */}
        <div
          ref={statusRef}
          className={`max-w-md mx-auto mt-12 text-center transition-all duration-500 ${
            allOnline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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

        {/* Werner Vogels Quote - Verification Debt */}
        <div
          className={`max-w-2xl mx-auto mt-12 transition-all duration-700 delay-300 ${
            allOnline ? "opacity-100" : "opacity-0"
          }`}
        >
          <blockquote className="relative text-center">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl text-green-500/20 font-serif">
              &ldquo;
            </span>
            <p className="text-zinc-300 text-base md:text-lg italic leading-relaxed px-8">
              I no longer have to look at the code to say, &lsquo;This doesn&apos;t
              feel good.&rsquo; I still verify—&lsquo;verification debt&rsquo;
              exists—but the instinct remains the same.
            </p>
            <cite className="block text-zinc-500 text-sm mt-3 not-italic">
              — Werner Vogels, CTO of Amazon
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
