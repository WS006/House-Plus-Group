/**
 * Scroll-reveal wrapper.
 *
 * Pages are prerendered, so the markup is already painted before React boots.
 * An animation that starts at `opacity: 0` therefore hides content that was
 * already visible — a flash, plus LCP delayed until the fade completes.
 *
 * So the reveal is opt-in: only elements still below the fold at boot are
 * hidden, and they fade in with a plain CSS transition. Anything above the fold
 * is never touched.
 */

import { useEffect, useRef, type ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  /** Seconds of delay before the transition starts. */
  delay?: number;
  className?: string;
}

export default function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Never ship (or inherit) a hidden state: start from a clean slate so a
    // stale inline style can't keep content invisible.
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Already on screen at boot: leave it alone (no flash, no LCP penalty).
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { rootMargin: '-50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className} data-fade-in="">
      {children}
    </div>
  );
}
