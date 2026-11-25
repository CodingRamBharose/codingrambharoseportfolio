'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';

const FarmIsland = dynamic(() => import('@/components/three/scenes/FarmIsland'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const NIGHT_TOP = [15, 32, 72];
const NIGHT_BOTTOM = [25, 42, 82];
const SUNRISE_TOP = [255, 179, 71];
const SUNRISE_BOTTOM = [255, 140, 0];

const lerpColor = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',');

export default function Chapter1Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);

  // Sky continues the Hero's sunrise (gradient reversed so the colours flow into each other)
  useEffect(() => {
    const handleProgress = (e: CustomEvent<number>) => {
      const p = e.detail;
      if (skyRef.current) {
        skyRef.current.style.background = `linear-gradient(to bottom, rgb(${lerpColor(NIGHT_BOTTOM, SUNRISE_BOTTOM, p)}), rgb(${lerpColor(NIGHT_TOP, SUNRISE_TOP, p)}))`;
      }
    };
    window.addEventListener('sunriseProgress', handleProgress as EventListener);
    return () => window.removeEventListener('sunriseProgress', handleProgress as EventListener);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );

      gsap.fromTo(
        cardsRef.current?.children || [],
        { scale: 0, rotation: -45, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
        },
      );

      // Sunrise → night blue as we head into Chapter 2
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (skyRef.current) {
            skyRef.current.style.background = `linear-gradient(to bottom, rgb(${lerpColor(SUNRISE_BOTTOM, NIGHT_BOTTOM, self.progress)}), rgb(${lerpColor(SUNRISE_TOP, NIGHT_TOP, self.progress)}))`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cards = [
    { icon: '🚜', label: 'Farm Work' },
    { icon: '📚', label: 'Studies' },
    { icon: '🌾', label: 'Harvest' },
    { icon: '🏆', label: 'Excellence' },
  ];

  return (
    <section id="chapter-1" ref={sectionRef} className="relative min-h-screen section-padding overflow-hidden flex items-center">
      <div ref={skyRef} className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgb(255, 140, 0), rgb(255, 179, 71))' }} />
      {/* soft horizon haze */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0F2048]/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <ChapterHeader number="01" label="Village Roots" title="Rooted in Discipline" from="#0A192F" to="#5D3A00" accent="#0A192F" />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex flex-col gap-8">
            <div ref={contentRef} className="flex flex-col gap-5">
              <p className="text-base md:text-lg text-white leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
                I come from a farming background where effort, not excuses, shaped my mindset. While others were still asleep,
                I was already up — helping on the farm and preparing for school. Not out of necessity, but out of choice.
              </p>
              <p className="text-base md:text-lg text-white leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
                That early exposure to discipline and responsibility gave me a head start. It wasn’t about hardship —
                it was about building character. From ploughing soil to solving problems, I’ve always worked with the same intention: to grow.
              </p>
            </div>

            <div ref={cardsRef} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="group rounded-2xl p-5 text-center bg-[#5D3A00]/25 backdrop-blur-md border border-white/25 hover:-translate-y-1 hover:bg-[#5D3A00]/40 transition-all duration-300"
                >
                  <div className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">{c.icon}</div>
                  <p className="text-white font-semibold">{c.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <FarmIsland className="w-full h-[340px] sm:h-[420px] lg:h-[500px]" />
            <blockquote className="text-lg md:text-xl font-medium text-white italic text-center drop-shadow-[0_1px_10px_rgba(0,0,0,0.3)]">
              &quot;Discipline is not about punishment. <br />
              It&apos;s about training yourself to do what needs to be done.&quot;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
