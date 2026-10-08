import React, { useEffect, useRef } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number; // stagger delay in ms
}

/**
 * MotionSection — Scroll-reveal using IntersectionObserver.
 * Elements fade up gently as they enter the viewport.
 * No Framer Motion. No animation libraries. Pure CSS + IO.
 */
export function MotionSection({
  children,
  className = "",
  delay = 0,
  ...props
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("is-visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <section
      ref={ref}
      className={`reveal-section w-full ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

export function MotionCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("is-visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-section luxury-card ${className}`}>
      {children}
    </div>
  );
}
