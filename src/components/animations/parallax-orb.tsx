"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type OrbColor = "purple" | "pink" | "blue";

interface ParallaxOrbProps {
  /** Size of the orb in pixels */
  size?: number;
  /** Color variant */
  color?: OrbColor;
  /** Parallax speed factor (0.1 = slow, 1 = fast) */
  parallaxFactor?: number;
  /** How much the orb responds to mouse movement (0 = none, 1 = full) */
  mouseInfluence?: number;
  /** Initial position from left (percentage or px) */
  left?: string;
  /** Initial position from top (percentage or px) */
  top?: string;
  /** Initial position from right (percentage or px) */
  right?: string;
  /** Initial position from bottom (percentage or px) */
  bottom?: string;
  /** Additional CSS classes */
  className?: string;
  /** Z-index for layering */
  zIndex?: number;
}

/**
 * Parallax Orb
 *
 * Floating gradient orb that responds to scroll and mouse movement.
 * Creates depth and visual interest in hero sections.
 *
 * Usage:
 * <ParallaxOrb size={400} color="purple" parallaxFactor={0.3} left="10%" top="20%" />
 */
export function ParallaxOrb({
  size = 300,
  color = "purple",
  parallaxFactor = 0.2,
  mouseInfluence = 0.05,
  left,
  top,
  right,
  bottom,
  className = "",
  zIndex = -1,
}: ParallaxOrbProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!orbRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const orb = orbRef.current;

    // Scroll parallax
    const scrollTrigger = ScrollTrigger.create({
      trigger: orb.parentElement || document.body,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const yOffset = (self.progress - 0.5) * 200 * parallaxFactor;
        gsap.set(orb, {
          y: yOffset,
        });
      },
    });

    // Mouse parallax (only on non-touch devices)
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseInfluence <= 0) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      targetPos.current = {
        x: (e.clientX - centerX) * mouseInfluence,
        y: (e.clientY - centerY) * mouseInfluence,
      };
    };

    // Smooth mouse follow animation
    let rafId: number;
    const smoothFollow = () => {
      mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.1;
      mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.1;

      gsap.set(orb, {
        x: mousePos.current.x,
      });

      rafId = requestAnimationFrame(smoothFollow);
    };

    // Check for touch device
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    if (!isTouch && mouseInfluence > 0) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      rafId = requestAnimationFrame(smoothFollow);
    }

    return () => {
      scrollTrigger.kill();
      if (!isTouch && mouseInfluence > 0) {
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(rafId);
      }
    };
  }, [parallaxFactor, mouseInfluence]);

  const colorClass = `parallax-orb-${color}`;

  return (
    <div
      ref={orbRef}
      className={`parallax-orb ${colorClass} ${className}`}
      style={{
        width: size,
        height: size,
        left,
        top,
        right,
        bottom,
        zIndex,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Pre-configured orb set for hero sections
 *
 * Usage:
 * <HeroOrbs />
 */
export function HeroOrbs() {
  return (
    <>
      {/* Large purple orb - top left */}
      <ParallaxOrb
        size={500}
        color="purple"
        parallaxFactor={0.15}
        mouseInfluence={0.03}
        left="-10%"
        top="10%"
      />

      {/* Medium pink orb - right side */}
      <ParallaxOrb
        size={350}
        color="pink"
        parallaxFactor={0.25}
        mouseInfluence={0.05}
        right="-5%"
        top="30%"
      />

      {/* Small blue orb - bottom left */}
      <ParallaxOrb
        size={200}
        color="blue"
        parallaxFactor={0.3}
        mouseInfluence={0.08}
        left="20%"
        bottom="10%"
      />

      {/* Extra purple orb - bottom right (hidden on mobile) */}
      <div className="hidden md:block">
        <ParallaxOrb
          size={250}
          color="purple"
          parallaxFactor={0.2}
          mouseInfluence={0.04}
          right="15%"
          bottom="20%"
        />
      </div>
    </>
  );
}
