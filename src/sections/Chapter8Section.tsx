'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChapterHeader from '@/components/ChapterHeader';
import TiltCard from '@/components/TiltCard';
import cadet from '../assets/cadet.png';

const Glider = dynamic(() => import('@/components/three/scenes/Glider'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const JOURNEY = [
  { icon: '🎖️', iconBg: 'bg-aviation-blue', title: 'NCC A Certificate', text: 'Introduced to NCC culture, drill basics, and foundational physical training.', tag: 'Level 1', tagColor: 'text-aviation-gold', card: 'from-aviation-blue/20 border-aviation-blue/30' },
  { icon: '🎖️', iconBg: 'bg-aviation-blue', title: 'NCC B Certificate', text: 'Intermediate level: weapon handling, map reading, team leadership, and physical endurance.', tag: 'Level 2', tagColor: 'text-aviation-gold', card: 'from-aviation-blue/20 border-aviation-blue/30' },
  { icon: '🏅', iconBg: 'bg-aviation-gold', title: 'NCC C Certificate', text: 'Advanced command training, drill commanding, and national-level preparation.', tag: 'Level 3', tagColor: 'text-aviation-gold', card: 'from-aviation-gold/20 border-aviation-gold/30' },
  { icon: '🏕️', iconBg: 'bg-yellow-500/20', title: 'Camps Attended', text: <>Participated in <strong>4 Camps</strong>: 1 National Camp and 3 Annual Training Camps across India.</>, tag: 'Field', tagColor: 'text-yellow-400', card: 'from-yellow-500/20 border-yellow-500/30' },
  { icon: '👨‍✈️', iconBg: 'bg-tech-neon', title: 'Cadet Warrant Officer', text: 'Cadet rank. Led parades, mentored juniors, and coordinated inter-unit operations.', tag: 'Leadership', tagColor: 'text-tech-neon', card: 'from-tech-neon/20 border-tech-neon/30' },
  { icon: '✈️', iconBg: 'bg-red-500/20', title: 'Air Force Training', text: 'Underwent ground training and safety drills with Indian Air Force personnel.', tag: 'Elite', tagColor: 'text-red-400', card: 'from-red-500/20 border-red-500/30' },
  { icon: '🛩️', iconBg: 'bg-purple-500/20', title: 'SW-80 Virus Aircraft', text: 'Completed 7 training sorties in the co-pilot seat — first taste of aviation in action.', tag: 'Flight', tagColor: 'text-purple-400', card: 'from-purple-500/20 border-purple-500/30' },
];

const GAVE = [
  { icon: '⏰', title: 'Discipline', text: '4 AM wake-ups became a lifestyle', color: 'text-aviation-gold' },
  { icon: '👥', title: 'Leadership', text: 'Leading teams under pressure', color: 'text-tech-neon' },
  { icon: '💪', title: 'Resilience', text: 'Mental and physical toughness', color: 'text-earth-wheat' },
  { icon: '🎯', title: 'Precision', text: 'Attention to detail and excellence', color: 'text-tech-cyan' },
];

export default function Chapter8Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nccTimelineRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const cadetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        nccTimelineRef.current?.children || [],
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: nccTimelineRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        achievementsRef.current?.children || [],
        { y: 50, opacity: 0, scale: 0.85 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: achievementsRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        cadetRef.current,
        { yPercent: 10 },
        { yPercent: -10, ease: 'none', scrollTrigger: { trigger: cadetRef.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="chapter-8" ref={sectionRef} className="relative min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center overflow-hidden">
      <div className="relative max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
          <ChapterHeader
            number="07"
            label="NCC Aviation"
            title="Airborne with NCC"
            from="#42A5F5"
            to="#FFD700"
            lead="NCC made me who I am. I was up at 4 AM, trained with the Indian Air Force, and co-operated in SW-80 virus aircraft sorties during training. I earned A, B, and C certificates, and proudly served as a Cadet Warrant Officer."
          />
          <div className="flex flex-col gap-2">
            <Glider className="w-full h-[320px] sm:h-[400px] lg:h-[440px]" />
            <p className="text-center text-xs uppercase tracking-[0.3em] text-sky-300/70">SW-80 · 7 sorties · co-pilot seat</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* NCC Journey */}
          <div className="flex flex-col gap-5">
            <h3 className="font-poppins font-semibold text-2xl text-white">My NCC Journey</h3>
            <div ref={nccTimelineRef} className="flex flex-col gap-3">
              {JOURNEY.map((j) => (
                <div key={j.title} className={`flex items-center gap-4 bg-gradient-to-r to-transparent rounded-xl p-4 border ${j.card}`}>
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl ${j.iconBg}`}>{j.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{j.title}</h4>
                    <p className="text-gray-300 text-sm">{j.text}</p>
                  </div>
                  <div className={`font-bold text-sm shrink-0 ${j.tagColor}`}>{j.tag}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={cadetRef} className="relative flex items-center justify-center">
            <div className="absolute inset-10 rounded-full bg-aviation-blue/30 blur-3xl" />
            <Image src={cadet} alt="Ram Avtar as an NCC cadet" width={420} height={520} className="relative object-contain drop-shadow-2xl" />
          </div>
        </div>

        {/* What NCC Gave Me */}
        <div className="flex flex-col gap-6">
          <h3 className="font-poppins font-semibold text-2xl text-white text-center">What NCC Gave Me</h3>
          <div ref={achievementsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {GAVE.map((g) => (
              <TiltCard key={g.title} className="glass-card text-center p-5 sm:p-6">
                <div className="text-4xl mb-3">{g.icon}</div>
                <h4 className={`font-semibold mb-2 ${g.color}`}>{g.title}</h4>
                <p className="text-gray-300 text-sm">{g.text}</p>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="text-center max-w-4xl mx-auto">
          <blockquote className="text-xl md:text-2xl font-medium text-white italic leading-snug">
            &quot;NCC didn&apos;t just teach me to fly aircraft. It taught me to soar above limitations, to lead with purpose, and to serve with honor.&quot;
          </blockquote>
          <p className="text-aviation-gold mt-4 text-lg font-semibold">— From cadet to leader, from ground to sky</p>
        </div>
      </div>
    </section>
  );
}
