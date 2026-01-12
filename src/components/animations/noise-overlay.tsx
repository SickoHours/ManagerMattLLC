"use client";

/**
 * Noise Overlay
 *
 * Adds a subtle film grain texture over the entire page
 * for that premium Apple/Linear aesthetic.
 *
 * Uses CSS-based noise for performance (no canvas).
 */
export function NoiseOverlay() {
  return (
    <div
      className="noise-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
