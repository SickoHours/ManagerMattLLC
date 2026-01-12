import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

/**
 * Initialize GSAP with ScrollTrigger plugin
 * Should be called once at app initialization
 */
export function initGSAP() {
  if (typeof window === "undefined") return;
  if (initialized) return;

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Configure GSAP defaults for premium feel
  gsap.defaults({
    ease: "power3.out",
    duration: 1,
  });

  // Configure ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
  });

  initialized = true;
}

/**
 * Kill all ScrollTrigger instances
 * Call on unmount to clean up
 */
export function killScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/**
 * Refresh ScrollTrigger calculations
 * Call after layout changes
 */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}
