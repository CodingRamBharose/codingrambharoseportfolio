'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDown } from 'lucide-react';
import { MILESTONES } from '@/data/story';
import { scrollToTarget } from '@/lib/smooth';

const FlightPath = dynamic(() => import('@/components/three/scenes/FlightPath'), { ssr: false });

/** Scroll distance per milestone, in viewport heights. */
const VH_PER_STOP = 85;

/**
 * "From Soil to Sky": the whole story replayed as one flight.
 * A tall section with a sticky full-screen 3D view; scrolling flies a paper plane
 * past a beacon for every chapter, from the farm fields up into the sunrise.
 */
export default function FlightPathSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const read = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const s = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    setProgress(s);
    setActive(Math.min(MILESTONES.length - 1, Math.round(s * (MILESTONES.length - 1))));
  }, []);

  useEffect(() => {
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [read]);

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    scrollToTarget(top + (i / (MILESTONES.length - 1)) * total + 2);
  };

  const m = MILESTONES[active];
  const isLast = active === MILESTONES.length - 1;

  return (
    <section
      id="flight-path"
      ref={sectionRef}
      className="relative bg-[#070d1f]"
      style={{ height: `${(MILESTONES.length - 1) * VH_PER_STOP + 100}vh` }}
      aria-label="From Soil to Sky: the whole journey in one flight"
    >
      {/* z-20: sticky makes a stacking context, so lift it above the shared 3D canvas (z-10) for the overlay text */}
      <div className="sticky top-0 z-20 h-[100svh] w-full overflow-hidden">
        <FlightPath className="absolute inset-0" section={sectionRef} />

        {/* readability vignette */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,11,31,0.65)_100%)]" />

        <div className="relative z-30 h-full w-full pointer-events-none flex flex-col justify-between px-5 sm:px-10 lg:px-16 pt-20 pb-8 sm:pb-12">
          {/* Title */}
          <div className={`max-w-xl transition-all duration-700 ${progress > 0.06 ? 'opacity-0 -translate-y-6' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-tech-neon">
              <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-tech-neon" />
              08 · The whole story, one flight
            </div>
            <h2 className="mt-4 font-poppins font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
              <span className="bg-gradient-to-r from-earth-wheat via-tech-neon to-aviation-gold bg-clip-text text-transparent">From Soil to Sky</span>
            </h2>
            <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-md">
              Every chapter is a beacon on the route. Keep scrolling and the plane flies you through the journey, from the village fields to the sunrise.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/60">
              <ArrowDown className="w-4 h-4 animate-bounce" /> Scroll to take off
            </div>
          </div>

          {/* Bottom: milestone card + rail */}
          <div className="flex items-end justify-between gap-6">
            <div
              key={active}
              className="pointer-events-auto max-w-md w-full rounded-2xl border border-white/10 bg-[#0A192F]/70 backdrop-blur-xl p-5 sm:p-6 shadow-2xl animate-rise"
              style={{ boxShadow: `0 0 60px -20px ${m.color}` }}
            >
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: m.color }}>
                <span className="text-2xl not-italic">{m.icon}</span>
                {m.chapter}
                <span className="ml-auto font-mono text-white/40 tracking-normal">
                  {String(active + 1).padStart(2, '0')} / {String(MILESTONES.length).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-3 font-poppins font-bold text-2xl sm:text-3xl text-white">{m.title}</h3>
              <p className="mt-2 text-gray-300 leading-relaxed">{m.line}</p>
              <button
                onClick={() => scrollToTarget(m.target)}
                className="mt-4 text-sm font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
                style={{ color: m.color }}
              >
                {isLast ? 'Write the next chapter with me' : 'Revisit this chapter'} →
              </button>
            </div>

            {/* Route rail */}
            <nav aria-label="Flight path milestones" className="pointer-events-auto hidden md:flex flex-col items-end gap-2.5 mr-10 mb-16">
              {MILESTONES.map((ms, i) => (
                <button
                  key={ms.title}
                  onClick={() => jumpTo(i)}
                  className="group flex items-center gap-3 cursor-pointer"
                  aria-label={`Fly to ${ms.title}`}
                >
                  <span
                    className={`text-xs font-medium transition-all duration-300 ${i === active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-70 group-hover:translate-x-0'}`}
                    style={{ color: ms.color }}
                  >
                    {ms.title}
                  </span>
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === active ? 14 : 8,
                      height: i === active ? 14 : 8,
                      background: i <= active ? ms.color : 'rgba(255,255,255,0.2)',
                      boxShadow: i === active ? `0 0 16px ${ms.color}` : 'none',
                    }}
                  />
                </button>
              ))}
              <button
                onClick={() => scrollToTarget('skills')}
                className="mt-3 text-[11px] uppercase tracking-[0.25em] text-white/40 hover:text-white/80 cursor-pointer"
              >
                Skip the flight ↓
              </button>
            </nav>
          </div>

          {/* progress bar */}
          <div className="absolute left-0 bottom-0 h-0.5 w-full bg-white/5">
            <div className="h-full bg-gradient-to-r from-earth-wheat via-tech-neon to-aviation-gold" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
