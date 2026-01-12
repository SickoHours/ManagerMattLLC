"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Clock, MessageSquare, Kanban } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const expectations = [
  {
    icon: Mail,
    title: "Weekly Updates",
    description:
      "Written summary every week: progress, blockers, and what's next.",
  },
  {
    icon: Clock,
    title: "48-Hour Response",
    description:
      "All messages answered within 2 business days. Usually same-day.",
  },
  {
    icon: MessageSquare,
    title: "Async by Default",
    description:
      "Email or Slack for most things. Calls scheduled when actually needed.",
  },
  {
    icon: Kanban,
    title: "Transparent Timeline",
    description:
      "Real-time access to the project board. See what's done, in progress, and coming up.",
  },
];

/**
 * Notification Card - slides in from alternating sides
 */
function NotificationCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Alternate direction: even = left, odd = right
  const fromLeft = index % 2 === 0;
  const delay = index * 150;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setTimeout(() => {
            setIsVisible(true);
            // Show notification dot after card appears
            setTimeout(() => setShowDot(true), 300);
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
      className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 relative transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : `opacity-0 ${fromLeft ? "-translate-x-8" : "translate-x-8"}`
      } hover:border-purple-500/30`}
    >
      {/* Notification Dot */}
      {showDot && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-500/10 text-purple-400 rounded">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Communication Section - The Signal
 */
export function CommunicationSection() {
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
    <section className="bg-zinc-950 py-24 md:py-32 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight">
            What to Expect
          </h2>
          <p className="text-zinc-400 text-lg mt-4">
            Clear communication, no surprises.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {expectations.map((item, index) => (
            <NotificationCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
