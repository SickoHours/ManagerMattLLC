"use client";

import { useEffect, useRef, useState } from "react";

interface CountingNumberProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  once?: boolean;
  className?: string;
  from?: number;
}

/**
 * Counting Number Animation - Simple, reliable implementation
 * Uses Intersection Observer for better SSR compatibility
 */
export function CountingNumber({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  from = 0,
}: CountingNumberProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(from);
  const [hasStarted, setHasStarted] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);

            // Start the counting animation
            const startTime = performance.now();
            const durationMs = duration * 1000;

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / durationMs, 1);

              // Ease out cubic
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentValue = from + (target - from) * easeProgress;

              setDisplayValue(currentValue);

              if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
              }
            };

            animationRef.current = requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration, from, hasStarted]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span ref={containerRef} className={`counting-number ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
