'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';
import { CORE_STRENGTHS, SKILLS, SKILL_CATEGORIES } from '@/data/skills';

const SkillGlobe = dynamic(() => import('@/components/three/scenes/SkillGlobe'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CIRCUMFERENCE = 2 * Math.PI * 50;

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const circularSkillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const barTrigger = { trigger: skillsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' };
      const ringTrigger = { trigger: circularSkillsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' };

      gsap.fromTo(
        skillsRef.current?.querySelectorAll<HTMLElement>('.skill-bar') || [],
        { width: '0%' },
        { width: (_i: number, el: HTMLElement) => `${el.dataset.level}%`, duration: 1.5, stagger: 0.05, ease: 'power3.out', scrollTrigger: barTrigger },
      );

      gsap.fromTo(
        circularSkillsRef.current?.children || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: ringTrigger },
      );

      gsap.fromTo(
        circularSkillsRef.current?.querySelectorAll<SVGCircleElement>('.circular-progress') || [],
        { strokeDashoffset: CIRCUMFERENCE },
        {
          strokeDashoffset: (_i: number, el: SVGCircleElement) => CIRCUMFERENCE * (1 - parseInt(el.dataset.level || '0', 10) / 100),
          duration: 2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: ringTrigger,
        },
      );

      sectionRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: parseInt(el.dataset.count || '0', 10),
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative min-h-screen section-padding bg-gradient-to-b from-[#070d1f] via-[#0F2048] to-[#192A52] flex items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <ChapterHeader
            number="09"
            label="The Toolkit"
            title="Skills & Technologies"
            from="#ffffff"
            to="#64FFDA"
            accent="#64FFDA"
            lead="Adaptable. Self-taught. Consistently learning. Every skill reflects a chapter of growth, from learning the basics to tackling real-world challenges in tech."
          />
          <SkillGlobe className="w-full h-[380px] sm:h-[440px] lg:h-[480px]" />
        </div>

        {/* Soft Skills */}
        <div className="flex flex-col gap-8">
          <h3 className="font-poppins font-semibold text-2xl text-white text-center">Core Strengths</h3>
          <div ref={circularSkillsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {CORE_STRENGTHS.map((skill) => (
              <div key={skill.name} className="text-center flex items-center justify-center flex-col group">
                <div className="relative w-32 h-32 mx-auto mb-4 transition-transform duration-500 group-hover:scale-110">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={skill.hex}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE}
                      className="circular-progress"
                      data-level={skill.level}
                      style={{ filter: `drop-shadow(0 0 6px ${skill.hex}88)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      <span data-count={skill.level}>{skill.level}</span>%
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-white">{skill.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills by Category */}
        <div ref={skillsRef} className="flex flex-col gap-8">
          <h3 className="font-poppins font-semibold text-2xl text-white text-center">Technical Expertise</h3>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {SKILL_CATEGORIES.map((category) => {
              const categorySkills = SKILLS.filter((s) => s.category === category);
              if (categorySkills.length === 0) return null;
              return (
                <div key={category} className="glass-card p-6">
                  <h4 className="font-semibold text-tech-neon mb-4 text-lg">{category}</h4>
                  <div className="flex flex-col gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{skill.icon}</span>
                            <span className={`font-medium ${skill.color}`}>{skill.name}</span>
                          </div>
                          <span className="text-white font-semibold">
                            <span data-count={skill.level}>{skill.level}</span>%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="skill-bar h-2 rounded-full"
                            data-level={skill.level}
                            style={{ width: `${skill.level}%`, background: `linear-gradient(to right, ${skill.hex}, #64FFDA)`, boxShadow: `0 0 12px ${skill.hex}66` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <div className="text-center max-w-4xl mx-auto">
          <blockquote className="text-xl md:text-2xl font-medium text-white italic leading-snug">
            &quot;Every skill I&apos;ve learned started with curiosity and was mastered through persistence. From coding on a phone to building complex systems - the journey never stops.&quot;
          </blockquote>
          <p className="text-tech-neon text-lg font-semibold mt-4">— Continuous learning, continuous growth</p>
        </div>
      </div>
    </section>
  );
}
