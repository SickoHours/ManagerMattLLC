"use client";

import { useEffect, createContext, useContext } from "react";
import type Lenis from "lenis";
import { initGSAP, killScrollTriggers } from "@/lib/gsap-config";
import {
  createLenis,
  startLenisLoop,
  destroyLenis,
  getLenis,
  isTouchDevice,
} from "@/lib/lenis-config";
import { initScrollAnimations } from "@/lib/scroll-animations";
import { initFlashlightEffect } from "@/lib/flashlight-effect";

// Context for accessing Lenis instance
const LenisContext = createContext<Lenis | null>(null);

/**
 * Hook to access Lenis instance
 * Returns null on touch devices or before initialization
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Animation Provider
 *
 * Initializes all premium animation systems:
 * - GSAP + ScrollTrigger (advanced animations)
 * - Lenis smooth scroll (60fps buttery scrolling)
 * - Scroll-triggered reveals (IntersectionObserver fallback)
 * - Flashlight/spotlight card effects (mouse tracking)
 *
 * Wrap your page content with this provider to enable animations.
 */
export function AnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initialize GSAP first (needed for ScrollTrigger)
    initGSAP();

    // Initialize Lenis smooth scroll (skip on touch devices or reduced motion)
    const isTouch = isTouchDevice();
    let lenis: Lenis | null = null;

    if (!isTouch && !prefersReducedMotion) {
      lenis = createLenis();
      startLenisLoop();
    }

    // Initialize legacy systems with small delay for DOM readiness
    const timeoutId = setTimeout(() => {
      // IntersectionObserver reveals (kept as fallback/supplement)
      const cleanupScroll = initScrollAnimations();

      // Mouse tracking flashlight effect
      const cleanupFlashlight = initFlashlightEffect();

      // Store cleanup functions
      (
        window as Window & { __animationCleanup?: () => void }
      ).__animationCleanup = () => {
        cleanupScroll();
        cleanupFlashlight();
      };
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);

      // Kill all ScrollTrigger instances
      killScrollTriggers();

      // Destroy Lenis
      destroyLenis();

      // Run legacy cleanup
      const cleanup = (
        window as Window & { __animationCleanup?: () => void }
      ).__animationCleanup;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <LenisContext.Provider value={getLenis()}>
      {children}
    </LenisContext.Provider>
  );
}
