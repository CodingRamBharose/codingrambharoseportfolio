'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';

const LetterStorm = dynamic(() => import('@/components/three/scenes/LetterStorm'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter2Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blurredTextRef = useRef<HTMLDivElement>(null);
  const clearTextRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The confusion slowly comes into focus as you scroll
      gsap.fromTo(
        blurredTextRef.current,
        { filter: 'blur(10px)', opacity: 0.3 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: blurredTextRef.current, start: 'top 90%', end: 'top 45%', scrub: true },
        },
      );

      gsap.fromTo(
        clearTextRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: clearTextRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );

      gsap.fromTo(
        quoteRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="chapter-2"
      ref={sectionRef}
      className="relative min-h-screen section-padding flex items-center"
      style={{ background: 'linear-gradient(to bottom, rgb(15, 32, 72), rgb(25, 42, 82))' }}
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <ChapterHeader number="02" label="English Struggle" title="Lost in Translation" from="#FFB347" to="#64FFDA" />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex flex-col gap-8">
            <div ref={blurredTextRef} className="rounded-2xl p-6 sm:p-8 bg-white/[0.03] border border-orange-300/15 backdrop-blur-sm">
              <h3 className="font-poppins font-semibold text-xl text-orange-200 mb-4 flex items-center gap-3">
                <span className="text-2xl">ੳ→A</span> How I Felt in Class 11
              </h3>
              <div className="text-base text-gray-200 leading-relaxed flex flex-col gap-4">
                <p>
                  I studied in Punjabi medium till class 10, and my native language is Punjabi. Suddenly switching to English medium in class 11 felt like being thrown into a foreign world.
                </p>
                <p className="italic text-gray-300 border-l-2 border-orange-300/40 pl-4">
                  &quot;The teacher is explaining something about physics, but I can&apos;t understand. Everyone around me is nodding, taking notes. I&apos;m just sitting there, feeling invisible.&quot;
                </p>
              </div>
            </div>

            <div ref={clearTextRef} className="px-1">
              <h3 className="font-poppins font-semibold text-2xl text-yellow-300 mb-4">Small Steps, Big Changes</h3>
              <div className="text-base text-white leading-relaxed flex flex-col gap-4">
                <p>
                  I started watching simple English cartoons, using Google Translate for everything, and asking friends for help. I didn’t magically become fluent, but I learned to survive, step by step.
                </p>
                <p className="font-semibold text-yellow-300">&quot;Hard work beats talent when talent doesn&apos;t work hard.&quot;</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <LetterStorm className="w-full h-[340px] sm:h-[420px] lg:h-[480px]" />
            <p className="text-center text-xs uppercase tracking-[0.3em] text-tech-neon/70">Scroll · watch the letters find their place</p>
          </div>
        </div>

        <div ref={quoteRef} className="text-center flex flex-col gap-4 max-w-3xl mx-auto">
          <blockquote className="text-2xl md:text-3xl font-medium text-white italic leading-snug">
            &quot;I didn&apos;t just learn English. I learned that any barrier can be broken with enough determination and the right approach.&quot;
          </blockquote>
          <p className="text-gray-400 text-lg">— The moment I realized I could learn anything</p>
        </div>
      </div>
    </section>
  );
}
