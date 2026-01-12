"use client";

import { useState, useEffect } from "react";
import { getLenis } from "@/lib/lenis-config";

/**
 * Hook to track scroll progress (0 to 1)
 * Uses Lenis scroll events for smooth updates
 *
 * Usage:
 * const progress = useScrollProgress();
 * // progress is 0 at top, 1 at bottom
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lenis = getLenis();

    if (lenis) {
      // Use Lenis scroll event
      const handleScroll = () => {
        setProgress(lenis.progress);
      };

      lenis.on("scroll", handleScroll);
      return () => lenis.off("scroll", handleScroll);
    } else {
      // Fallback to native scroll
      const handleScroll = () => {
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        setProgress(scrollHeight > 0 ? scrollPosition / scrollHeight : 0);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return progress;
}
