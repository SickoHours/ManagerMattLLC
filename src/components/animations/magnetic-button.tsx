"use client";

import { useRef, useState, useCallback } from "react";

interface MagneticButtonProps {
  /** Button children */
  children: React.ReactNode;
  /** Maximum magnetic pull distance in pixels */
  magneticStrength?: number;
  /** Transition duration in ms */
  transitionDuration?: number;
  /** Additional CSS classes */
  className?: string;
  /** Disable magnetic effect on touch devices */
  disableOnTouch?: boolean;
  /** onClick handler */
  onClick?: () => void;
  /** Element type to render (default: button) */
  as?: "button" | "a" | "div";
  /** href for links */
  href?: string;
  /** target for links */
  target?: string;
  /** rel for links */
  rel?: string;
}

/**
 * Magnetic Button
 *
 * Button that follows the cursor with a subtle magnetic pull effect.
 * Creates a premium, interactive feel for CTAs.
 *
 * Usage:
 * <MagneticButton onClick={handleClick}>Get Started</MagneticButton>
 * <MagneticButton as="a" href="/pricing">View Pricing</MagneticButton>
 */
export function MagneticButton({
  children,
  magneticStrength = 12,
  transitionDuration = 150,
  className = "",
  disableOnTouch = true,
  onClick,
  as = "button",
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [contentTransform, setContentTransform] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Check for touch device
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disableOnTouch && isTouch) return;
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Calculate pull (stronger closer to center)
      const pullX = distanceX * 0.3;
      const pullY = distanceY * 0.3;

      // Clamp to max strength
      const clampedX = Math.max(-magneticStrength, Math.min(magneticStrength, pullX));
      const clampedY = Math.max(-magneticStrength, Math.min(magneticStrength, pullY));

      // Button moves less, content moves slightly more for depth
      setTransform({ x: clampedX, y: clampedY });
      setContentTransform({ x: clampedX * 0.3, y: clampedY * 0.3 });
    },
    [magneticStrength, disableOnTouch, isTouch]
  );

  const handleMouseEnter = useCallback(() => {
    if (disableOnTouch && isTouch) return;
    setIsHovering(true);
  }, [disableOnTouch, isTouch]);

  const handleMouseLeave = useCallback(() => {
    if (disableOnTouch && isTouch) return;
    setIsHovering(false);
    setTransform({ x: 0, y: 0 });
    setContentTransform({ x: 0, y: 0 });
  }, [disableOnTouch, isTouch]);

  const Component = as;

  const baseProps = {
    ref: buttonRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement & HTMLDivElement>,
    className: `magnetic-button ${className}`,
    style: {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
      transition: isHovering
        ? `transform ${transitionDuration}ms ease-out`
        : `transform ${transitionDuration * 2}ms ease-out`,
    },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick,
  };

  const linkProps = as === "a" ? { href, target, rel } : {};

  return (
    <Component {...baseProps} {...linkProps}>
      <span
        className="magnetic-button-content inline-flex items-center gap-2"
        style={{
          transform: `translate(${contentTransform.x}px, ${contentTransform.y}px)`,
          transition: isHovering
            ? `transform ${transitionDuration}ms ease-out`
            : `transform ${transitionDuration * 2}ms ease-out`,
        }}
      >
        {children}
      </span>
    </Component>
  );
}
