"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  threshold?: number;
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 600,
  threshold = 0.1,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(20px)";
      case "down":
        return "translateY(-20px)";
      case "left":
        return "translateX(20px)";
      case "right":
        return "translateX(-20px)";
      case "none":
        return "none";
      default:
        return "translateY(20px)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Staggered children animation
interface FadeInStaggerProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export function FadeInStagger({
  children,
  className = "",
  staggerDelay = 100,
  direction = "up",
  duration = 600,
}: FadeInStaggerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={index * staggerDelay}
          direction={direction}
          duration={duration}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
