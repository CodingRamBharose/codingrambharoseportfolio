'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';

const HealingSpine = dynamic(() => import('@/components/three/scenes/HealingSpine'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TIMELINE = [
  {
    title: 'Month 1: The Diagnosis',
    text: 'Doctor said complete bed rest. No sitting for extended periods. My coding dreams seemed shattered.',
    dot: 'bg-red-500',
    card: 'bg-red-500/10 border-red-500/30',
    head: 'text-red-400',
  },
  {
    title: 'Month 2: Adaptation',
    text: 'Started watching coding tutorials lying down. Phone became my classroom. YouTube University was in session.',
    dot: 'bg-orange-500',
    card: 'bg-orange-500/10 border-orange-500/30',
    head: 'text-orange-400',
  },
  {
    title: 'Month 3-4: Mental Coding',
    text: 'Learned to visualize code in my head. Solved problems mentally. Theory became my strength.',
    dot: 'bg-yellow-500',
    card: 'bg-yellow-500/10 border-yellow-500/30',
    head: 'text-yellow-400',
  },
  {
    title: 'Month 5: Gradual Return',
    text: 'Started sitting for short periods. Every 15 minutes felt like a victory. Slowly getting back to coding.',
    dot: 'bg-green-500',
    card: 'bg-green-500/10 border-green-500/30',
    head: 'text-green-400',
  },
  {
    title: 'Month 6: Stronger Than Before',
    text: 'Full recovery. But now I had discipline, patience, and a deeper understanding of perseverance.',
    dot: 'bg-tech-neon animate-glow',
    card: 'bg-tech-neon/10 border-tech-neon/30',
    head: 'text-tech-neon',
  },
];

export default function Chapter6Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const recoveryRef = useRef<HTMLDivElement>(null);
  const lessonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineRef.current?.querySelectorAll('.tl-item') || [],
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: timelineRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        },
      );
      // the recovery line "heals" from red to teal as you read
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: timelineRef.current, start: 'top 75%', end: 'bottom 60%', scrub: true } },
      );
      gsap.fromTo(
        recoveryRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: recoveryRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        lessonsRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: lessonsRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="chapter-6" ref={sectionRef} className="relative min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <ChapterHeader
            number="05"
            label="Recovery"
            title="Pain, Persistence & a Phone"
            from="#FF6B6B"
            to="#64FFDA"
            lead="In BCA Year 2, long hours of field work + coding gave me disc bulge. For 6 months, I couldn't sit. But I didn't stop. I watched tutorials on my phone. I studied lying on the floor."
          />
          <div className="flex flex-col gap-2">
            <HealingSpine className="w-full h-[380px] sm:h-[440px] lg:h-[480px]" />
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.25em]">
              <span className="text-red-400">Pain</span>
              <span className="h-px w-16 bg-gradient-to-r from-red-400 to-tech-neon" />
              <span className="text-tech-neon">Power</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Recovery Timeline */}
          <div>
            <h3 className="font-poppins font-semibold text-2xl text-white mb-6">6 Months of Recovery</h3>
            <div ref={timelineRef} className="relative flex flex-col gap-4 pl-8">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-white/10" />
              <div ref={lineRef} className="absolute left-[7px] top-2 bottom-2 w-0.5 origin-top bg-gradient-to-b from-red-500 via-yellow-400 to-tech-neon" />
              {TIMELINE.map((m) => (
                <div key={m.title} className="tl-item relative">
                  <div className={`absolute -left-8 top-4 w-4 h-4 rounded-full ring-4 ring-[#14244d] ${m.dot}`} />
                  <div className={`rounded-xl p-4 border ${m.card}`}>
                    <h4 className={`font-semibold mb-1 ${m.head}`}>{m.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">&quot;{m.text}&quot;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Setup */}
          <div ref={recoveryRef} className="w-full flex flex-col gap-6 p-6 bg-gradient-to-br from-tech-midnight to-earth-soil/80 rounded-3xl shadow-2xl border border-white/10">
            <h4 className="font-poppins font-semibold text-xl text-white text-center">My Recovery Setup</h4>

            <div className="flex flex-col gap-3">
              <div className="bg-earth-wheat/15 rounded-xl p-5 text-center">
                <div className="text-4xl mb-2">🛏️</div>
                <p className="text-gray-300 text-sm">Lying down position</p>
              </div>
              <div className="bg-tech-midnight rounded-xl border border-white/20 p-4 text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="text-tech-neon font-semibold">Mobile Learning</p>
                <p className="text-gray-300 text-xs">YouTube tutorials, documentation, forums</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h5 className="font-semibold text-tech-neon">What I Learned:</h5>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['🧠', 'Mental Problem Solving'],
                  ['📚', 'Deep Theory Study'],
                  ['⏰', 'Time Management'],
                  ['💪', 'Mental Resilience'],
                ].map(([icon, label]) => (
                  <div key={label} className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">{icon}</div>
                    <p className="text-xs text-gray-300">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-tech-neon">6</div>
                <p className="text-xs text-gray-300">Months Recovery</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-earth-wheat">100+</div>
                <p className="text-xs text-gray-300">Hours of Tutorials</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-tech-cyan">0</div>
                <p className="text-xs text-gray-300">Days I Quit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Learned */}
        <div className="flex flex-col gap-8">
          <h3 className="font-poppins font-semibold text-2xl text-tech-neon text-center">What This Challenge Taught Me</h3>
          <div ref={lessonsRef} className="grid md:grid-cols-3 gap-5">
            {[
              ['🎯', 'Adaptability', 'When circumstances change, find new ways to achieve your goals.'],
              ['🔥', 'Persistence', "Physical limitations can't stop mental growth and determination."],
              ['🚀', 'Innovation', 'Constraints force you to find creative solutions and new approaches.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="glass-card p-6 text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h4 className="font-semibold text-white mb-2">{title}</h4>
                <p className="text-gray-300 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="text-center max-w-4xl mx-auto">
          <blockquote className="text-xl md:text-2xl font-medium text-white italic leading-snug">
            &quot;That pain taught me power. When you can&apos;t sit, you learn to think. When you can&apos;t type, you learn to visualize. Limitations become innovations.&quot;
          </blockquote>
          <p className="text-tech-neon mt-4 text-lg font-semibold">— Turning setbacks into comebacks</p>
        </div>
      </div>
    </section>
  );
}
