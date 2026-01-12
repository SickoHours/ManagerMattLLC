/**
 * Scroll Animation System
 * IntersectionObserver-based animation triggers
 *
 * Elements with `.aura-hidden` class will animate in when they
 * enter the viewport. The class is replaced with `.aura-reveal`
 * to trigger the CSS animation.
 */

let observer: IntersectionObserver | null = null;

export function initScrollAnimations(): () => void {
  // Don't run on server
  if (typeof window === 'undefined') return () => {};

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // If user prefers reduced motion, immediately reveal all elements
    document.querySelectorAll('.aura-hidden').forEach((el) => {
      el.classList.remove('aura-hidden');
    });
    return () => {};
  }

  // Create observer with premium timing
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;

          // Add the animation class
          element.classList.add('aura-reveal');
          element.classList.remove('aura-hidden');

          // Stop observing after animation triggered
          observer?.unobserve(element);
        }
      });
    },
    {
      // Trigger when 10% of element is visible
      threshold: 0.1,
      // Start animation slightly before element is fully in view
      rootMargin: '0px 0px -10% 0px',
    }
  );

  // Observe all elements with .aura-hidden class
  document.querySelectorAll('.aura-hidden').forEach((el) => {
    observer?.observe(el);
  });

  // Return cleanup function
  return () => {
    observer?.disconnect();
    observer = null;
  };
}

/**
 * Re-initialize scroll animations
 * Useful after dynamic content is added
 */
export function refreshScrollAnimations(): void {
  if (!observer) return;

  document.querySelectorAll('.aura-hidden').forEach((el) => {
    observer?.observe(el);
  });
}
