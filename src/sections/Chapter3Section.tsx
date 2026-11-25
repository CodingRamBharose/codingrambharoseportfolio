'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';

const RetroComputer = dynamic(() => import('@/components/three/scenes/RetroComputer'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter3Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        storyRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="chapter-3" ref={sectionRef} className="relative min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <ChapterHeader
          number="03"
          label="Computer Spark"
          title="The Computer Spark"
          from="#64FFDA"
          to="#00BCD4"
          lead="In 6th standard, computer science was introduced as a subject. The first time I touched a keyboard, I felt a strange excitement. But things really changed in 8th grade..."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div ref={storyRef} className="flex flex-col gap-5 text-base md:text-lg leading-relaxed text-gray-200">
            <p>
              I was known for being good at studies, and one day our class teacher called me and said,
              “You’re sharp — can you help enter some student data into the system?”
            </p>
            <p>
              I had no idea what a database was, but I eagerly agreed. I skipped regular classes just to sit at that
              big old desktop and type in roll numbers, marks, and names.
            </p>
            <p>
              Within days, my typing speed reached 30 words per minute. I started participating in typing competitions — and won many!
            </p>
            <p className="text-tech-neon font-semibold">I didn’t even realize it, but the computer had become my favorite place to be.</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="inline-flex items-center gap-2 bg-tech-cyan text-tech-midnight px-6 py-3 rounded-full font-semibold shadow-[0_0_30px_rgba(0,188,212,0.35)]">
                💡 The Spark Was Lit
              </div>
              <div className="inline-flex items-center gap-2 border border-tech-neon/30 text-tech-neon px-5 py-3 rounded-full font-mono text-sm">
                ⌨ 30 WPM
              </div>
            </div>
          </div>

          <RetroComputer className="w-full h-[340px] sm:h-[420px] lg:h-[480px]" />
        </div>
      </div>
    </section>
  );
}
