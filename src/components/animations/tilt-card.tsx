"use client";

import { useRef, useState, useCallback } from "react";

interface TiltCardProps {
  /** Maximum tilt angle in degrees */
  maxTilt?: number;
  /** Perspective distance in pixels */
  perspective?: number;
  /** Scale factor on hover */
  hoverScale?: number;
  /** Transition duration in ms */
  transitionDuration?: number;
  /** Children to render inside the card */
  children: React.ReactNode;
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Additional CSS classes for the inner content */
  contentClassName?: string;
  /** Disable tilt on touch devices */
  disableOnTouch?: boolean;
}

/**
 * 3D Tilt Card
 *
 * Creates a card that tilts in 3D space following mouse movement.
 * Perfect for testimonials, quotes, and featured content.
 *
 * Usage:
 * <TiltCard maxTilt={15}>
 *   <div>Your content here</div>
 * </TiltCard>
 */
export function TiltCard({
  maxTilt = 10,
  perspective = 1000,
  hoverScale = 1.02,
  transitionDuration = 150,
  children,
  className = "",
  contentClassName = "",
  disableOnTouch = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  // Check for touch device
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableOnTouch && isTouch) return;
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to card center
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate rotation (invert Y for natural tilt)
      const rotateX = (-mouseY / (rect.height / 2)) * maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${hoverScale}, ${hoverScale}, ${hoverScale})`
      );
    },
    [maxTilt, perspective, hoverScale, disableOnTouch, isTouch]
  );

  const handleMouseEnter = useCallback(() => {
    if (disableOnTouch && isTouch) return;
    setIsHovering(true);
  }, [disableOnTouch, isTouch]);

  const handleMouseLeave = useCallback(() => {
    if (disableOnTouch && isTouch) return;
    setIsHovering(false);
    setTransform("");
  }, [disableOnTouch, isTouch]);

  // Touch fallback: simple scale on tap
  const touchScale = isTouch ? `scale(${isHovering ? hoverScale : 1})` : "";

  return (
    <div
      ref={cardRef}
      className={`tilt-perspective ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => isTouch && setIsHovering(true)}
      onTouchEnd={() => isTouch && setIsHovering(false)}
    >
      <div
        className={`tilt-card ${contentClassName}`}
        style={{
          transform: isTouch ? touchScale : transform,
          transition: isHovering
            ? `transform ${transitionDuration}ms ease-out`
            : `transform ${transitionDuration * 2}ms ease-out`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Shine Effect Overlay
 *
 * Adds a glossy shine that follows mouse movement.
 * Use inside TiltCard for extra depth.
 */
interface ShineOverlayProps {
  /** Opacity of the shine effect (0-1) */
  opacity?: number;
  /** Additional CSS classes */
  className?: string;
}

export function ShineOverlay({
  opacity = 0.1,
  className = "",
}: ShineOverlayProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden rounded-inherit ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(255,255,255,${opacity}) 0%, transparent 50%)`,
      }}
      aria-hidden="true"
    />
  );
}
