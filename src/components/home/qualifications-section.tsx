"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";

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
 * Rejection Item - Shows text then strikes through
 */
function RejectionItem({ text, delay }: { text: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isStruck, setIsStruck] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setTimeout(() => {
            setIsVisible(true);
            // Strike through after text appears
            setTimeout(() => setIsStruck(true), 800);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );

    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, [delay, isVisible]);

  return (
    <li
      ref={itemRef}
      className={`flex items-start gap-3 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      } ${isStruck ? "opacity-50" : ""}`}
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500/10 rounded text-red-400">
        <X size={14} strokeWidth={2.5} />
      </span>
      <span className="relative">
        <span className={`text-zinc-400 text-base ${isStruck ? "text-zinc-600" : ""}`}>
          {text}
        </span>
        {/* Strikethrough line */}
        <span
          className={`absolute left-0 top-1/2 h-0.5 bg-red-500 transition-all duration-300 ${
            isStruck ? "w-full" : "w-0"
          }`}
          style={{ transform: "translateY(-50%)" }}
        />
      </span>
    </li>
  );
}

/**
 * Approval Item - Slides in with checkmark
 */
function ApprovalItem({ text, delay }: { text: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, [delay, isVisible]);

  return (
    <li
      ref={itemRef}
      className={`flex items-start gap-3 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
    >
      <span
        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded transition-all duration-300 ${
          isVisible ? "bg-green-500/20 text-green-400" : "bg-zinc-700/30 text-zinc-500"
        }`}
      >
        <Check size={14} strokeWidth={2.5} />
      </span>
      <span className="text-zinc-300 text-base">{text}</span>
    </li>
  );
}

/**
 * Qualifications Section - Clean, reliable animations
 */
export function QualificationsSection() {
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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tight">
            My Qualifications
          </h2>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* What I Don't Have */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
            <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-6 font-semibold">
              What I Don&apos;t Have
            </h3>
            <ul className="space-y-5">
              {dontHave.map((item, index) => (
                <RejectionItem key={index} text={item} delay={index * 200} />
              ))}
            </ul>
          </div>

          {/* What I Have */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8 hover:border-green-500/30 transition-colors">
            <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-6 font-semibold">
              What I Have
            </h3>
            <ul className="space-y-4">
              {doHave.map((item, index) => (
                <ApprovalItem key={index} text={item} delay={index * 150} />
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-zinc-500 text-lg italic mb-4">
            &ldquo;But how can you call yourself a developer if—&rdquo;
          </p>
          <p className="text-white text-xl md:text-2xl font-medium">
            I ship features. I fix bugs. I make things that work.
          </p>
          <p className="text-purple-400 text-2xl md:text-3xl font-bold mt-4">
            What would you call that?
          </p>
        </div>
      </div>
    </section>
  );
}
