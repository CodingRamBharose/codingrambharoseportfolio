'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ChapterHeaderProps {
  number: string;
  label: string;
  title: string;
  lead?: string;
  from?: string;
  to?: string;
  /** Colour of the kicker text and line */
  accent?: string;
  leadClassName?: string;
  className?: string;
}

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: string, b: string, t: number) => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `rgb(${ca.map((v, i) => Math.round(v + (cb[i] - v) * t)).join(',')})`;
};

/**
 * Cinematic chapter opener: giant outlined numeral with parallax, kicker line,
 * a word-by-word masked title reveal and a lead paragraph that lights up as you scroll.
 */
export default function ChapterHeader({
  number,
  label,
  title,
  lead,
  from = '#64FFDA',
  to = '#42A5F5',
  accent,
  leadClassName = 'text-gray-200',
  className = '',
}: ChapterHeaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const words = useMemo(() => title.split(' '), [title]);
  const leadWords = useMemo(() => (lead ? lead.split(' ') : []), [lead]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ch-word',
        { yPercent: 115, rotate: 5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        '.ch-kicker',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        '.ch-numeral',
        { yPercent: 35 },
        {
          yPercent: -35,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      if (leadWords.length) {
        gsap.fromTo(
          '.ch-lead-word',
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.04,
            scrollTrigger: { trigger: '.ch-lead', start: 'top 88%', end: 'bottom 55%', scrub: true },
          },
        );
      }
    }, root);
    return () => ctx.revert();
  }, [leadWords.length]);

  return (
    <div ref={root} className={`relative ${className}`}>
      <span aria-hidden className="ch-numeral chapter-numeral absolute -top-16 sm:-top-24 -left-2 text-[9rem] sm:text-[13rem] lg:text-[16rem] -z-0">
        {number}
      </span>

      <div className="relative flex flex-col gap-5">
        <div className="ch-kicker flex items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: accent ?? from }}>
          <span className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(90deg, transparent, ${accent ?? from})` }} />
          <span>{/^\d+$/.test(number) ? `Chapter ${number}` : number}</span>
          <span className="opacity-50">·</span>
          <span className="opacity-80">{label}</span>
        </div>

        <h2 aria-label={title} className="font-poppins font-extrabold leading-[1.02] tracking-tight text-[2.6rem] sm:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] mr-[0.25em] last:mr-0">
              <span
                className="ch-word inline-block will-change-transform"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${mix(from, to, i / words.length)}, ${mix(from, to, (i + 1) / words.length)})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {w}
              </span>
            </span>
          ))}
        </h2>

        {lead && (
          <p aria-label={lead} className={`ch-lead max-w-3xl text-lg sm:text-xl lg:text-2xl leading-relaxed font-light ${leadClassName}`}>
            {leadWords.map((w, i) => (
              <span key={i} aria-hidden className="ch-lead-word">
                {w}{' '}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
