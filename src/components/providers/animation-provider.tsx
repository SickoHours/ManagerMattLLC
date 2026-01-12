"use client";

import { useEffect } from "react";
import { initScrollAnimations } from "@/lib/scroll-animations";
import { initFlashlightEffect } from "@/lib/flashlight-effect";

/**
 * Animation Provider
 *
 * Initializes all premium animation systems:
 * - Scroll-triggered reveals (IntersectionObserver)
 * - Flashlight/spotlight card effects (mouse tracking)
 *
 * Wrap your page content with this provider to enable animations.
 */
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const cleanupScroll = initScrollAnimations();
      const cleanupFlashlight = initFlashlightEffect();

      // Store cleanup functions for unmount
      (window as Window & { __animationCleanup?: () => void }).__animationCleanup = () => {
        cleanupScroll();
        cleanupFlashlight();
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const cleanup = (window as Window & { __animationCleanup?: () => void }).__animationCleanup;
      if (cleanup) cleanup();
    };
  }, []);

  return <>{children}</>;
}
