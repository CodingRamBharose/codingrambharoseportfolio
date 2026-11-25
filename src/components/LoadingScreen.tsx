'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MILESTONES } from '@/data/story';

interface LoadingScreenProps {
  /** 100% reached: mount the site underneath so the curtain can lift off it. */
  onReveal?: () => void;
  /** The curtain is gone: unmount the loader. */
  onLoadingComplete?: () => void;
}

/** The real work the site needs before the story can start. */
const ASSETS: (() => Promise<unknown>)[] = [
  () => document.fonts?.ready ?? Promise.resolve(),
  () => import('@/components/three/SceneCanvas'),
  () => import('@/components/StarField'),
  () => import('@/components/three/scenes/FarmIsland'),
  () => import('@/components/three/scenes/LetterStorm'),
  () => import('@/components/three/scenes/RetroComputer'),
  () => import('@/components/three/scenes/CodePhone'),
  () => import('@/components/three/scenes/HealingSpine'),
  () => import('@/components/three/scenes/TrophyPodium'),
  () => import('@/components/three/scenes/Glider'),
  () => import('@/components/three/scenes/FlightPath'),
  () => import('@/components/three/scenes/SkillGlobe'),
];

/** Even on a fast or cached connection, let the little flight play out. */
const MIN_MS = 2200;
/** Never keep anyone waiting on a stalled request. */
const GIVE_UP_MS = 10000;

/** Field (bottom left) up to the sunrise (top right). */
const ROUTE = 'M 34 132 C 150 138, 230 124, 300 92 S 450 28, 556 34';
const CHAPTERS = MILESTONES.slice(0, 7);
const dotAt = (i: number) => (i + 1) / (CHAPTERS.length + 1);

/** Deterministic stars, so the server and client render the same sky. */
function makeStars(n: number) {
  let s = 42;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, () => ({
    left: r() * 100,
    top: r() * 70,
    size: r() < 0.85 ? 1 : 2,
    delay: r() * 3,
    opacity: 0.3 + r() * 0.6,
  }));
}

export default function LoadingScreen({ onReveal, onLoadingComplete }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onLoadingComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onLoadingComplete;

  const [progress, setProgress] = useState(0);
  const [plane, setPlane] = useState({ x: 34, y: 132, angle: 0 });
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const stars = useMemo(() => makeStars(70), []);

  // Real loading drives the progress, eased so the plane glides instead of jumping.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = reduced ? 600 : MIN_MS;
    const path = pathRef.current;
    const len = path?.getTotalLength() ?? 0;
    if (path) setDots(CHAPTERS.map((_, i) => path.getPointAtLength(dotAt(i) * len)));

    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    let done = 0;
    let real = 0;
    ASSETS.forEach((load) =>
      load()
        .catch(() => undefined)
        .finally(() => {
          done += 1;
          real = done / ASSETS.length;
        }),
    );
    const giveUp = window.setTimeout(() => (real = 1), GIVE_UP_MS);

    const start = performance.now();
    let last = start;
    let p = 0;
    let raf = 0;
    let finished = false;
    const timers: number[] = [];
    let tl: gsap.core.Timeline | undefined;

    const exit = () => {
      setIsComplete(true);
      if (!reduced && planeRef.current) {
        gsap.to(planeRef.current, { x: 70, y: -26, scale: 0.4, opacity: 0, duration: 0.7, ease: 'power2.in' });
      }
      timers.push(
        window.setTimeout(() => {
          onRevealRef.current?.();
          // give the site two frames to mount before the curtain moves, so the lift stays smooth
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              tl = gsap.timeline({
                onComplete: () => {
                  document.body.style.overflow = '';
                  onCompleteRef.current?.();
                },
              });
              if (reduced) {
                tl.to(rootRef.current, { opacity: 0, duration: 0.4 });
              } else {
                tl.to(contentRef.current, { y: -40, opacity: 0, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' }).to(
                  rootRef.current,
                  { yPercent: -100, duration: 1.1, ease: 'power3.inOut' },
                  0.15,
                );
              }
            }),
          );
        }, reduced ? 150 : 650),
      );
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = Math.min(real, (now - start) / minMs);
      p += (target - p) * Math.min(1, dt * 5);
      if (target - p < 0.002) p = target;
      setProgress(p);

      if (path && len) {
        const at = p * len;
        const a = path.getPointAtLength(at);
        const b = path.getPointAtLength(Math.min(len, at + 1));
        const angle = at + 1 <= len ? (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI : -8;
        setPlane({ x: a.x, y: a.y, angle });
      }

      if (p >= 1 && !finished) {
        finished = true;
        exit();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(giveUp);
      timers.forEach(window.clearTimeout);
      tl?.kill();
      document.body.style.overflow = '';
    };
  }, []);

  const pct = Math.round(progress * 100);

  const getLoadingMessage = () => {
    if (isComplete) return '🎉 Welcome to my story!';
    if (pct < 20) return '🌾 Preparing the village fields...';
    if (pct < 40) return '📚 Loading the learning journey...';
    if (pct < 60) return '🧊 Sculpting the 3D story world...';
    if (pct < 80) return '✈️ Fuelling the glider for take-off...';
    return '🌅 Almost ready for sunrise...';
  };
  const message = getLoadingMessage();

  return (
    <div
      ref={rootRef}
      className="loading-screen fixed inset-0 z-[1000001] overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(to bottom, #070d1f 0%, #0A192F 55%, rgb(15, 32, 72) 100%)' }}
      aria-label="Loading screen"
    >
      {/* stars fade as the dawn comes up */}
      <div className="absolute inset-0" style={{ opacity: 1 - progress * 0.55 }} aria-hidden>
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      {/* dawn on the horizon: this glowing edge leads the curtain up as the site appears */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          opacity: 0.15 + progress * 0.85,
          background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,140,0,0.42) 0%, rgba(255,179,71,0.14) 45%, transparent 75%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ opacity: 0.3 + progress * 0.7, background: 'linear-gradient(90deg, transparent, #FFB347, #F9D342, #FFB347, transparent)' }}
        aria-hidden
      />

      <div ref={contentRef} className="relative w-full px-6 flex flex-col items-center text-center">
        <p className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-tech-neon/80">
          <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-tech-neon/80" />
          Ram Avtar
          <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-tech-neon/80" />
        </p>
        <h1 className="mt-4 font-poppins font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
          From Fields to <span className="gradient-text">Frameworks</span>
        </h1>
        <p className="mt-3 text-gray-400">Loading my journey...</p>

        {/* the route: village field to sunrise, one beacon per chapter */}
        <svg viewBox="0 0 590 160" className="mt-8 w-full max-w-[590px] overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="ls-trail" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#F9D342" />
              <stop offset="55%" stopColor="#64FFDA" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <radialGradient id="ls-sun">
              <stop offset="0%" stopColor="#FFE9A8" />
              <stop offset="35%" stopColor="#FFB347" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* sunrise at the end of the route */}
          <circle cx="556" cy="34" r={26 + progress * 16} fill="url(#ls-sun)" opacity={0.25 + progress * 0.75} />
          <circle cx="556" cy="34" r="9" fill="#FFE9A8" opacity={0.5 + progress * 0.5} />

          {/* field at the start */}
          <text x="34" y="140" fontSize="26" textAnchor="middle" dominantBaseline="middle">🌾</text>

          <path ref={pathRef} d={ROUTE} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
          <path
            d={ROUTE}
            fill="none"
            stroke="url(#ls-trail)"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - progress}
            style={{ filter: 'drop-shadow(0 0 6px rgba(100,255,218,0.55))' }}
          />

          {dots.map((d, i) => {
            const lit = progress >= dotAt(i);
            const c = CHAPTERS[i].color;
            return (
              <g key={CHAPTERS[i].title} transform={`translate(${d.x} ${d.y})`}>
                <circle r={lit ? 10 : 0} fill={c} opacity="0.18" style={{ transition: 'r 0.5s ease-out' }} />
                <circle
                  r={lit ? 4.5 : 3}
                  fill={lit ? c : 'rgba(255,255,255,0.25)'}
                  style={{ transition: 'r 0.4s cubic-bezier(.34,1.56,.64,1), fill 0.4s', filter: lit ? `drop-shadow(0 0 6px ${c})` : 'none' }}
                />
              </g>
            );
          })}

          {/* paper plane */}
          <g transform={`translate(${plane.x} ${plane.y}) rotate(${plane.angle})`}>
            <g ref={planeRef} style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.7))' }}>
              <polygon points="11,0 -9,-8 -4,0 -9,8" fill="#ffffff" />
              <polygon points="11,0 -4,0 -9,8" fill="#cfe8ff" />
            </g>
          </g>
        </svg>

        <div
          className="mt-6 flex items-baseline gap-1 font-poppins tabular-nums text-white"
          role="progressbar"
          aria-label="Loading progress"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="text-4xl sm:text-5xl font-bold">{String(pct).padStart(2, '0')}</span>
          <span className="text-lg font-semibold text-tech-neon">%</span>
        </div>

        <p
          key={message}
          className={`mt-4 h-6 text-sm animate-rise ${isComplete ? 'text-tech-neon font-semibold' : 'text-gray-400'}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </div>
  );
}
