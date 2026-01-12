"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has enabled "reduce motion" in system settings
 *
 * Usage:
 * const prefersReducedMotion = useReducedMotion();
 * if (prefersReducedMotion) { // skip animations }
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}
