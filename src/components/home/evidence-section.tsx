"use client";

import { TrendingUp, Cpu, Users } from "lucide-react";
import { CountingNumber } from "@/components/animations/counting-number";

interface EvidenceCardProps {
  icon: React.ReactNode;
  /** Target number to animate to */
  statTarget: number;
  /** Number of decimal places */
  statDecimals?: number;
  /** Suffix after number (e.g., "%") */
  statSuffix?: string;
  label: string;
  quote: string;
  attribution?: string;
  sourceUrl: string;
  sourceName: string;
}

function EvidenceCard({
  icon,
  statTarget,
  statDecimals = 0,
  statSuffix = "",
  label,
  quote,
  attribution,
  sourceUrl,
  sourceName,
}: EvidenceCardProps) {
  return (
    <div className="vibe-card-enhanced p-6 md:p-8 flex flex-col h-full hover-lift">
      {/* Icon */}
      <div className="text-purple-400 mb-6">{icon}</div>

      {/* Animated Stat */}
      <div className="stat-number text-white">
        <CountingNumber
          target={statTarget}
          decimals={statDecimals}
          suffix={statSuffix}
          duration={2.5}
          once={true}
        />
      </div>

      {/* Label */}
      <p className="text-zinc-400 text-sm md:text-base mt-2 leading-relaxed">
        {label}
      </p>

      {/* Quote */}
      <blockquote className="mt-6 flex-1">
        <p className="text-zinc-300 text-sm md:text-base italic leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        {attribution && (
          <cite className="block text-zinc-500 text-sm mt-2 not-italic">
            — {attribution}
          </cite>
        )}
      </blockquote>

      {/* Source */}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-zinc-500 text-xs hover:text-zinc-400 transition-colors inline-flex items-center gap-1 group"
      >
        Source: {sourceName}
        <span className="transition-transform group-hover:translate-x-0.5">
          ↗
        </span>
      </a>
    </div>
  );
}

export function EvidenceSection() {
  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-purple glow-center opacity-30" />

      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="aura-hidden">
            <h2 className="text-display-premium text-white text-3xl md:text-5xl">
              But Does This Actually Work?
            </h2>
          </div>
          <div className="aura-hidden mt-4">
            <p className="text-zinc-400 text-lg">
              Great question. Let me show you the receipts.
            </p>
          </div>
        </div>

        {/* Evidence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          <div className="aura-hidden">
            <EvidenceCard
              icon={<TrendingUp size={32} strokeWidth={1.5} />}
              statTarget={25}
              statSuffix="%"
              label="of YC Winter 2025 startups have codebases that are 95% AI-generated"
              quote="This isn't a fad. This isn't going away. This is the dominant way to code."
              attribution="Garry Tan, YC CEO"
              sourceUrl="https://techcrunch.com/2025/03/06/a-quarter-of-startups-in-ycs-current-cohort-have-codebases-that-are-almost-entirely-ai-generated/"
              sourceName="TechCrunch"
            />
          </div>

          <div className="aura-hidden">
            <EvidenceCard
              icon={<Cpu size={32} strokeWidth={1.5} />}
              statTarget={80.9}
              statDecimals={1}
              statSuffix="%"
              label="Claude Opus 4.5 on SWE-bench Verified — the first AI to exceed 80%"
              quote="The gap between intention and execution has shrunk to almost nothing."
              sourceUrl="https://www.anthropic.com/news/claude-opus-4-5"
              sourceName="Anthropic"
            />
          </div>

          <div className="aura-hidden">
            <EvidenceCard
              icon={<Users size={32} strokeWidth={1.5} />}
              statTarget={84}
              statSuffix="%"
              label="of developers now use AI tools in their development processes"
              quote="The barrier to getting your first draft is down to zero. Anyone can do it."
              attribution="David Fowler, Microsoft"
              sourceUrl="https://news.microsoft.com/source/features/ai/vibe-coding-and-other-ways-ai-is-changing-who-can-build-apps-and-how/"
              sourceName="Microsoft"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
