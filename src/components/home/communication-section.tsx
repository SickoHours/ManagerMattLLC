"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Clock, MessageSquare, Kanban } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
 * Notification Card Component
 * Slides in from alternating sides, lands with bounce, shows notification dot + ripple
 */
function NotificationCard({
  icon: Icon,
  title,
  description,
  index,
  isActive,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  // Alternate direction: even = left, odd = right
  const direction = index % 2 === 0 ? -1 : 1;
  const delay = index * 0.2;

  useEffect(() => {
    if (!isActive || !cardRef.current) return;

    const card = cardRef.current;

    // Set initial state
    gsap.set(card, {
      opacity: 0,
      x: direction * 80,
      scale: 0.95,
    });

    // Slide in with bounce
    gsap.to(card, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.6,
      delay: delay,
      ease: "back.out(1.7)",
      onComplete: () => {
        // Show notification dot after card lands
        setShowNotification(true);

        // Trigger ripple
        setTimeout(() => {
          setShowRipple(true);
          // Reset ripple after animation
          setTimeout(() => setShowRipple(false), 600);
        }, 100);
      },
    });
  }, [isActive, direction, delay]);

  return (
    <div
      ref={cardRef}
      className="vibe-card-enhanced p-6 h-full hover-glow relative overflow-visible"
      style={{ opacity: 0 }}
    >
      {/* Notification Dot + Ripple */}
      <div className="absolute top-3 right-3 z-10">
        {showNotification && (
          <>
            {/* Ripple effect */}
            {showRipple && (
              <span
                ref={rippleRef}
                className="absolute inset-0 rounded-full bg-purple-400/40 notification-ripple"
              />
            )}
            {/* Notification dot */}
            <span
              ref={dotRef}
              className="relative flex h-3 w-3"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-500/10 text-purple-400 rounded">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">{title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Communication Section - "The Signal"
 *
 * Notifications arriving - each card slides in like a message bubble
 * from alternating sides, creating a "conversation" rhythm.
 */
export function CommunicationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
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

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="glow-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-16 opacity-0">
          <h2 className="text-display-premium text-white text-3xl md:text-5xl">
            What to Expect
          </h2>
          <p className="text-zinc-400 text-lg mt-4">
            Clear communication, no surprises.
          </p>
        </div>

        {/* Expectations Grid - 2x2 for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {expectations.map((item, index) => (
            <NotificationCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              index={isMobile ? 0 : index} // On mobile, all slide from same direction
              isActive={isActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
