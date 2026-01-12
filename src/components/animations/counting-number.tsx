"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CountingNumberProps {
  /** Target number to count to */
  target: number;
  /** Duration of the counting animation in seconds */
  duration?: number;
  /** Prefix before the number (e.g., "$") */
  prefix?: string;
  /** Suffix after the number (e.g., "%", "+") */
  suffix?: string;
  /** Number of decimal places to show */
  decimals?: number;
  /** Only animate once when entering view */
  once?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Start counting from this number (default: 0) */
  from?: number;
}

/**
 * Counting Number Animation
 *
 * Animates a number from 0 (or `from`) to `target` when scrolled into view.
 * Uses GSAP ScrollTrigger for smooth, performant counting.
 *
 * Usage:
 * <CountingNumber target={25} suffix="%" />
 * <CountingNumber target={1000} prefix="$" duration={2} />
 */
export function CountingNumber({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  once = true,
  className = "",
  from = 0,
}: CountingNumberProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(from);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Skip if already animated and once is true
    if (once && hasAnimated.current) return;

    // Ensure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger);

    const obj = { value: from };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 85%",
      once: once,
      onEnter: () => {
        if (once && hasAnimated.current) return;
        hasAnimated.current = true;

        gsap.to(obj, {
          value: target,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            setDisplayValue(obj.value);
          },
        });
      },
      onEnterBack: () => {
        // Only re-animate if once is false
        if (!once) {
          obj.value = from;
          gsap.to(obj, {
            value: target,
            duration: duration,
            ease: "power2.out",
            onUpdate: () => {
              setDisplayValue(obj.value);
            },
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [target, duration, from, once]);

  // Format the display value
  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span ref={containerRef} className={`counting-number ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
