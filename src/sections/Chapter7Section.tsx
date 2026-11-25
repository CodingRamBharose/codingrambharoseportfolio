'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';

const TrophyPodium = dynamic(() => import('@/components/three/scenes/TrophyPodium'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter7Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 50, opacity: 0, rotation: (i: number) => (i % 2 === 0 ? -3 : 3) },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        },
      );

      // count-up numbers
      statsRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count || '0');
        const decimals = (el.dataset.count || '').split('.')[1]?.length ?? 0;
        const suffix = el.dataset.suffix || '';
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals) + suffix;
          },
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="chapter-7" ref={sectionRef} className="relative min-h-screen section-padding bg-gradient-to-b from-[#0F2048] to-[#192A52] flex items-center overflow-hidden">
      {/* spotlight */}
      <div className="absolute right-[10%] top-0 w-[40rem] h-[40rem] rounded-full bg-aviation-gold/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <ChapterHeader
          number="06"
          label="Academic Excellence"
          title="From Village to Toppers List"
          from="#FFD700"
          to="#FFA500"
          lead="Despite all odds, I secured 2nd position in BCA out of ~3500 students in Punjabi University. In MCA at Thapar, among 120 bright minds, I stood 3rd overall and 1st among boys with 9.84 CGPA."
        />

        <div ref={statsRef} className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Achievement Story */}
          <div ref={cardsRef} className="flex flex-col gap-6">
            <div>
              <h3 className="font-poppins font-semibold text-2xl text-aviation-gold mb-4">The Impossible Journey</h3>
              <div className="flex flex-col gap-4 text-base text-gray-200 leading-relaxed">
                <p>
                  &quot;Nobody in my village knew what &apos;coding&apos; meant. They saw a boy who worked in fields, struggled with English, and learned on a phone.&quot;
                </p>
                <p>But results speak louder than backgrounds. When the BCA results came out, I was 2nd out of 3500+ students across Punjabi University.</p>
                <p className="text-aviation-gold font-semibold">
                  &quot;From a village school to university topper — that&apos;s the power of consistency and refusing to accept limitations.&quot;
                </p>
              </div>
            </div>

            {/* BCA Achievement */}
            <div className="relative overflow-hidden bg-gradient-to-r from-aviation-gold/20 to-earth-wheat/10 rounded-2xl p-6 border border-aviation-gold/30">
              <div className="absolute -right-6 -top-8 text-[7rem] font-black text-aviation-gold/10 leading-none select-none">#2</div>
              <h4 className="font-semibold text-aviation-gold mb-3 text-xl">🏆 BCA Achievement</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2nd</div>
                  <p className="text-gray-300 text-sm">Position</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white" data-count="3500" data-suffix="+">3500+</div>
                  <p className="text-gray-300 text-sm">Students</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-3">University College, Ghanaur (Punjabi University, Patiala)</p>
            </div>

            {/* MCA Achievement */}
            <div className="relative overflow-hidden bg-gradient-to-r from-tech-neon/20 to-tech-cyan/10 rounded-2xl p-6 border border-tech-neon/30">
              <div className="absolute -right-6 -top-8 text-[7rem] font-black text-tech-neon/10 leading-none select-none">#3</div>
              <h4 className="font-semibold text-tech-neon mb-3 text-xl">🎓 MCA Excellence</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">3rd</div>
                  <p className="text-gray-300 text-xs">Overall</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1st</div>
                  <p className="text-gray-300 text-xs">Among Boys</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white" data-count="9.84">9.84</div>
                  <p className="text-gray-300 text-xs">CGPA</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-3">Thapar Institute of Engineering & Technology</p>
            </div>
          </div>

          {/* 3D trophy */}
          <div className="flex flex-col items-center gap-6">
            <TrophyPodium className="w-full h-[380px] sm:h-[440px] lg:h-[480px]" />
            <div className="text-center -mt-4">
              <h3 className="font-poppins font-bold text-2xl text-aviation-gold">Academic Excellence</h3>
              <p className="text-gray-300">Against All Odds</p>
            </div>
            <blockquote className="text-xl md:text-2xl font-medium text-white italic text-center max-w-xl">
              &quot;They measured me by my background. I measured myself by my potential. The results spoke for themselves.&quot;
            </blockquote>
            <div className="text-center glass-card py-4 px-8">
              <div className="text-4xl font-bold text-tech-cyan mb-1" data-count="15" data-suffix="+">15+</div>
              <p className="text-gray-300">Years of Being Topper</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
