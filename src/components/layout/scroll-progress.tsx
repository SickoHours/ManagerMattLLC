"use client";

import { useScrollProgress } from "@/hooks/use-scroll-progress";

/**
 * Scroll Progress Bar
 *
 * Fixed progress indicator at the top of the page.
 * Shows how far the user has scrolled through the page.
 *
 * Usage: Add to layout.tsx
 * <ScrollProgress />
 */
export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="scroll-progress"
      style={{
        width: `${progress * 100}%`,
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}
