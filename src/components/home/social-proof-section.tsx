"use client";

import { useEffect, useRef, useState } from "react";
import { CountingNumber } from "@/components/animations/counting-number";

interface StatCardProps {
  number: number;
  suffix?: string;
  label: string;
  source: string;
  sourceUrl: string;
  delay: number;
}

function StatCard({
  number,
  suffix = "%",
  label,
  source,
  sourceUrl,
  delay,
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay, isVisible]);

  return (
    <div
      ref={cardRef}
      className={`text-center px-6 py-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* The Big Number - CountingNumber handles its own scroll-triggered animation */}
      <div className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        <CountingNumber
          target={number}
          suffix={suffix}
          duration={2}
          decimals={number % 1 !== 0 ? 1 : 0}
        />
      </div>

      {/* Label */}
      <p className="text-zinc-400 text-sm md:text-base mt-2 leading-relaxed max-w-[200px] mx-auto">
        {label}
      </p>

      {/* Source Citation */}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-zinc-500 text-xs mt-3 hover:text-purple-400 transition-colors group"
      >
        <span className="border-b border-zinc-700 group-hover:border-purple-400/50">
          {source}
        </span>
        <span className="transition-transform group-hover:translate-x-0.5">
          ↗
        </span>
      </a>
    </div>
  );
}

const stats = [
  {
    number: 84,
    suffix: "%",
    label: "of developers now use AI coding tools",
    source: "Stack Overflow 2025",
    sourceUrl: "https://survey.stackoverflow.co/2025/",
  },
  {
    number: 82,
    suffix: "%",
    label: "of companies using agentic AI for coding",
    source: "Business Insider",
    sourceUrl: "https://www.businessinsider.com/ai-coding-agents-adoption-top-tools-2025-8",
  },
  {
    number: 25,
    suffix: "%",
    label: "of YC startups are 95% AI-coded",
    source: "TechCrunch / Garry Tan",
    sourceUrl:
      "https://techcrunch.com/2025/03/06/a-quarter-of-startups-in-ycs-current-cohort-have-codebases-that-are-almost-entirely-ai-generated/",
  },
  {
    number: 76,
    suffix: "%",
    label: "of companies doing AI code reviews",
    source: "Business Insider",
    sourceUrl: "https://www.businessinsider.com/ai-coding-agents-adoption-top-tools-2025-8",
  },
];

/**
 * Social Proof Section - Citation-Backed Authority
 *
 * A clean, horizontal stats strip that establishes credibility
 * through real numbers from reputable sources.
 */
export function SocialProofSection() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-zinc-950 py-16 md:py-20 relative overflow-hidden border-t border-b border-zinc-800/50">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-transparent to-zinc-900/20 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-10 md:mb-12 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-mono mb-2">
            The Numbers Don&apos;t Lie
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
            AI Coding Is Already Here
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              source={stat.source}
              sourceUrl={stat.sourceUrl}
              delay={index * 150}
            />
          ))}
        </div>

        {/* Pull Quote */}
        <div
          className={`max-w-3xl mx-auto mt-12 text-center transition-all duration-700 delay-500 ${
            headerVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <blockquote className="relative">
            <span className="absolute -top-4 -left-2 text-5xl text-purple-500/20 font-serif">
              &ldquo;
            </span>
            <p className="text-zinc-300 text-lg md:text-xl italic leading-relaxed pl-6">
              This isn&apos;t a fad. This isn&apos;t going away. This is the
              dominant way to code.
            </p>
            <cite className="block text-zinc-500 text-sm mt-3 not-italic">
              — Garry Tan, CEO of Y Combinator
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
