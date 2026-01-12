"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterProps {
  /** Text to type out */
  text: string;
  /** Delay between each character in ms */
  charDelay?: number;
  /** Delay before starting the animation in ms */
  startDelay?: number;
  /** Show blinking cursor */
  showCursor?: boolean;
  /** Callback when typing is complete */
  onComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to start typing immediately or wait for trigger */
  autoStart?: boolean;
}

/**
 * Typewriter Effect
 *
 * Types out text character by character with a blinking cursor.
 * Perfect for hero headlines and dramatic reveals.
 *
 * Usage:
 * <Typewriter text="I'm a vibe coder" charDelay={50} />
 */
export function Typewriter({
  text,
  charDelay = 50,
  startDelay = 500,
  showCursor = true,
  onComplete,
  className = "",
  autoStart = true,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!autoStart || hasStarted.current) return;
    hasStarted.current = true;

    // Start delay before typing begins
    const startTimer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();
        }
      }, charDelay);

      return () => clearInterval(typeInterval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, charDelay, startDelay, onComplete, autoStart]);

  return (
    <span ref={containerRef} className={className}>
      {displayText}
      {showCursor && !isComplete && (
        <span className="typewriter-cursor" aria-hidden="true" />
      )}
      {/* Screen reader gets full text immediately */}
      <span className="sr-only">{text}</span>
    </span>
  );
}

/**
 * Word-by-Word Typewriter
 *
 * Reveals text word by word instead of character by character.
 * Creates a more dramatic, readable effect for longer phrases.
 *
 * Usage:
 * <WordTypewriter text="I'm a vibe coder who ships fast" wordDelay={200} />
 */
interface WordTypewriterProps {
  /** Text to reveal word by word */
  text: string;
  /** Delay between each word in ms */
  wordDelay?: number;
  /** Delay before starting the animation in ms */
  startDelay?: number;
  /** Callback when reveal is complete */
  onComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Class applied to each word span */
  wordClassName?: string;
}

export function WordTypewriter({
  text,
  wordDelay = 150,
  startDelay = 300,
  onComplete,
  className = "",
  wordClassName = "",
}: WordTypewriterProps) {
  const words = text.split(" ");
  const [visibleCount, setVisibleCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTimer = setTimeout(() => {
      let count = 0;

      const revealInterval = setInterval(() => {
        if (count < words.length) {
          count++;
          setVisibleCount(count);
        } else {
          clearInterval(revealInterval);
          onComplete?.();
        }
      }, wordDelay);

      return () => clearInterval(revealInterval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [words.length, wordDelay, startDelay, onComplete]);

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ${wordClassName}`}
          style={{
            opacity: index < visibleCount ? 1 : 0,
            transform: index < visibleCount ? "translateY(0)" : "translateY(10px)",
            transitionDelay: `${index * 50}ms`,
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
      {/* Screen reader gets full text immediately */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
