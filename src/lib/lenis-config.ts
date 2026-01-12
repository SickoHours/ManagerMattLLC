import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

/**
 * Create and configure Lenis smooth scroll instance
 * Syncs with GSAP ScrollTrigger for seamless integration
 */
export function createLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease out
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenisInstance.on("scroll", ScrollTrigger.update);

  return lenisInstance;
}

/**
 * Start the Lenis animation frame loop
 */
export function startLenisLoop() {
  if (!lenisInstance) return;

  function raf(time: number) {
    lenisInstance?.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);
}

/**
 * Stop the Lenis animation frame loop
 */
export function stopLenisLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/**
 * Destroy Lenis instance and clean up
 */
export function destroyLenis() {
  stopLenisLoop();
  lenisInstance?.destroy();
  lenisInstance = null;
}

/**
 * Get the current Lenis instance
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Check if device is touch-only (mobile/tablet)
 * Used to disable smooth scroll on touch devices
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}
