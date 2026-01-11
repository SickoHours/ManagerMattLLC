"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 800,
  formatFn = (v) => v.toLocaleString(),
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Don't animate if values are the same
    if (startValue === endValue) {
      return;
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return <span className={className}>{formatFn(displayValue)}</span>;
}

// Specialized version for price formatting
interface AnimatedPriceProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedPrice({
  value,
  duration = 800,
  className,
}: AnimatedPriceProps) {
  const formatPrice = (v: number) => {
    if (v >= 1000) {
      return `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
    }
    return `$${v.toLocaleString()}`;
  };

  return (
    <AnimatedNumber
      value={value}
      duration={duration}
      formatFn={formatPrice}
      className={className}
    />
  );
}

// Version for percentages
interface AnimatedPercentProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedPercent({
  value,
  duration = 600,
  className,
}: AnimatedPercentProps) {
  return (
    <AnimatedNumber
      value={value}
      duration={duration}
      formatFn={(v) => `${Math.round(v)}%`}
      className={className}
    />
  );
}
