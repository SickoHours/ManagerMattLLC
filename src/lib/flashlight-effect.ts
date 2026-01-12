/**
 * Flashlight Effect System
 * Mouse tracking for premium card hover effects
 *
 * Cards with `.vibe-card` or `.vibe-card-enhanced` class will
 * have CSS custom properties `--mouse-x` and `--mouse-y` updated
 * as the mouse moves, enabling the radial gradient spotlight effect.
 */

let isInitialized = false;

export function initFlashlightEffect(): () => void {
  // Don't run on server
  if (typeof window === 'undefined') return () => {};

  // Prevent double initialization
  if (isInitialized) return () => {};
  isInitialized = true;

  const handleMouseMove = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.vibe-card, .vibe-card-enhanced') as HTMLElement;

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Use event delegation for better performance
  document.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Return cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    isInitialized = false;
  };
}

/**
 * Initialize flashlight effect for a specific container
 * Useful for dynamically loaded content
 */
export function initFlashlightForContainer(container: HTMLElement): () => void {
  const handleMouseMove = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.vibe-card, .vibe-card-enhanced') as HTMLElement;

    if (!card || !container.contains(card)) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  container.addEventListener('mousemove', handleMouseMove, { passive: true });

  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
  };
}
