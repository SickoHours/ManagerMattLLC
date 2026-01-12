"use client";

import { useEffect, useRef, useState } from "react";

interface CountingNumberProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * Counting Number Animation - Simple, reliable implementation
 * Shows target value immediately, animates as enhancement when scrolled into view
 */
export function CountingNumber({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountingNumberProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  // Start with target value so numbers always display correctly
  const [displayValue, setDisplayValue] = useState(target);
  const hasAnimatedRef = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Update display value if target changes
    setDisplayValue(target);
  }, [target]);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;

    const runAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      // Reset to 0 and animate to target
      const startTime = performance.now();
      const durationMs = duration * 1000;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * easeProgress;

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      // Start from 0
      setDisplayValue(0);
      animationRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedRef.current) {
          runAnimation();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span ref={containerRef} className={`counting-number ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
