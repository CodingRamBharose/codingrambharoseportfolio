'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';

const CodePhone = dynamic(() => import('@/components/three/scenes/CodePhone'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BUILT = [
  { icon: '👋', label: 'Hello World' },
  { icon: '🔢', label: 'Math Solvers' },
  { icon: '🎮', label: 'Number Guessing Game' },
  { icon: '🧮', label: 'Basic Calculator' },
];

export default function Chapter4Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const builtRef = useRef<HTMLDivElement>(null);

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
      gsap.fromTo(
        builtRef.current?.querySelectorAll('.built-item') || [],
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: builtRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="chapter-4" ref={sectionRef} className="relative min-h-screen section-padding bg-gradient-to-b from-[#0F2048] to-[#192A52] flex items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <ChapterHeader
          number="04"
          label="Phone Coding"
          title="Code on a Phone"
          from="#64FFDA"
          to="#42A5F5"
          lead="After 12th, I couldn't join B.Tech. Everyone pushed me toward B.Sc., but I chose BCA. I started learning Python on my phone and wrote mini games and calculators — all on a 5-inch screen."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div ref={storyRef} className="flex flex-col gap-4 text-base md:text-lg text-gray-200 leading-relaxed">
              <h3 className="font-poppins font-semibold text-2xl text-tech-neon">The Phone Programmer</h3>
              <p className="text-white text-lg md:text-xl italic">
                &quot;I didn&apos;t have a laptop. I didn&apos;t have a computer. But I had a smartphone and an unstoppable desire to learn coding.&quot;
              </p>
              <p>
                I downloaded Python apps, watched YouTube tutorials, and typed code with my thumbs. My friends thought I was crazy — who codes on a phone?
              </p>
              <p className="text-tech-neon font-semibold">
                &quot;Limitation breeds creativity. I learned to think in code before I could type it comfortably.&quot;
              </p>
            </div>

            <div ref={builtRef} className="rounded-2xl p-5 sm:p-6 bg-earth-wheat/10 backdrop-blur-sm border border-earth-wheat/30">
              <h4 className="font-semibold text-earth-wheat mb-4 text-center">What I Built on My Phone:</h4>
              <div className="grid grid-cols-2 gap-3">
                {BUILT.map((b) => (
                  <div key={b.label} className="built-item bg-white/5 hover:bg-white/10 rounded-xl text-center p-3 transition-colors">
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <p className="text-sm text-gray-300">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-3">
            <CodePhone className="w-full h-[440px] sm:h-[500px] lg:h-[560px]" />
            <p className="text-center text-xs uppercase tracking-[0.3em] text-tech-neon/70">Python Mobile IDE · live</p>
          </div>
        </div>
      </div>
    </section>
  );
}
