'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';
import banner from '../assets/banner.png';
import logo from '../assets/logo.png';
import LeetCodeIcon from '@/components/LeetCodeIcon';
import { scrollToTarget } from '@/lib/smooth';

const StarField = dynamic(() => import('@/components/StarField'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const NIGHT_TOP = [15, 32, 72];
const NIGHT_BOTTOM = [25, 42, 82];
const SUNRISE_TOP = [255, 179, 71];
const SUNRISE_BOTTOM = [255, 140, 0];

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [text] = useTypewriter({
    words: ["Hi, I'm Ram Avtar", 'नमस्ते, मैं राम अवतार हूँ'],
    loop: true,
    typeSpeed: 120,
    deleteSpeed: 80,
    delaySpeed: 1500,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // entrance
      gsap.from(textRef.current?.children || [], { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.1, stagger: 0.12, ease: 'expo.out', delay: 0.2 });
      gsap.from(bannerRef.current, { y: 80, opacity: 0, scale: 0.92, duration: 1.4, ease: 'expo.out' });

      // the banner drifts up slower than the page: depth
      gsap.to(bannerRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // sunrise driven by scroll, shared with Chapter 1
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          window.dispatchEvent(new CustomEvent('sunriseProgress', { detail: progress }));

          gsap.to(sunRef.current, {
            y: `${50 - progress * 80}%`,
            scale: 0.4 + progress * 0.6,
            opacity: Math.min(progress * 2, 1),
            duration: 0.3,
            ease: 'power2.out',
          });

          const topColor = NIGHT_TOP.map((n, i) => Math.round(n + (SUNRISE_TOP[i] - n) * progress));
          const bottomColor = NIGHT_BOTTOM.map((n, i) => Math.round(n + (SUNRISE_BOTTOM[i] - n) * progress));
          if (skyRef.current) {
            skyRef.current.style.background = `linear-gradient(to bottom, rgb(${topColor.join(',')}), rgb(${bottomColor.join(',')}))`;
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const socialClass =
    'p-3 h-11 w-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300';

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[100svh] flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-around gap-8 lg:gap-12 overflow-hidden px-5 sm:px-8 lg:px-16 pt-24 pb-28"
    >
      <div ref={skyRef} className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgb(15, 32, 72), rgb(25, 42, 82))' }} />
      <StarField />
      <div className="absolute hidden md:block top-0 left-10 z-30">
        <Image src={logo} alt="Coding Ram Bharose logo" width={130} height={60} />
      </div>
      <div
        ref={sunRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 w-32 h-32 rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          boxShadow: '0 0 120px 30px rgba(255, 190, 60, 0.55)',
        }}
      />

      <div ref={bannerRef} className="relative z-20 w-[260px] sm:w-[340px] md:w-[440px] lg:w-[540px]">
        <div className="absolute inset-[15%] rounded-full bg-tech-neon/15 blur-3xl" />
        <Image src={banner} alt="Illustration of Ram Avtar's journey from the village to the server" width={600} height={600} className="relative object-contain drop-shadow-2xl" priority />
      </div>

      {/* Right Panel with Text */}
      <div ref={textRef} className="relative flex flex-col gap-4 z-20 text-white max-w-lg text-center lg:text-right items-center lg:items-end">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-tech-neon animate-pulse" />
          Developer · NCC Aviation Cadet
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight min-h-[5.5rem] md:min-h-[4rem] font-poppins">
          <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.35)]">{text}</span>
          <Cursor cursorColor="#FBBF24" />
        </h1>

        <p className="font-medium text-white" style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)' }}>
          A Developer who started from soil and reached the server.
        </p>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Raised in a village where the sky was my ceiling and hard work my daily ritual,I grew from solving real-life problems to solving algorithms. <br />
          <span className="text-tech-neon font-semibold">Every line of code I write honors those humble beginnings.</span>
        </p>

        <div className="flex items-center gap-3 sm:gap-4 mt-2 justify-center lg:justify-end flex-wrap">
          <a href="https://www.linkedin.com/in/codingrambharose" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`${socialClass} hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(96,165,250,0.3)]`}>
            <Linkedin className="w-5 h-5 text-blue-300" />
          </a>
          <a href="https://github.com/CodingRamBharose" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`${socialClass} hover:border-gray-400/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
            <Github className="w-5 h-5 text-gray-200" />
          </a>
          <a href="https://leetcode.com/u/CodingRamBharose/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode" className={`${socialClass} hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]`}>
            <LeetCodeIcon className="w-5 h-5 text-amber-400" />
          </a>
          <a href="mailto:codingrambharose@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email" className={`${socialClass} hover:border-red-400/50 hover:shadow-[0_0_15px_rgba(252,165,165,0.3)]`}>
            <Mail className="w-5 h-5 text-red-300" />
          </a>
          <a
            href="/RamAvtar.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 rounded-full px-8 bg-tech-neon/10 backdrop-blur-sm border border-tech-neon/30 hover:bg-tech-neon/20 hover:border-tech-neon/60 text-tech-neon font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(100,255,218,0.2)]"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Resume</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/80">
        <button onClick={() => scrollToTarget('chapter-1')} className="flex flex-col items-center gap-1 group cursor-pointer">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">Scroll to begin the story</span>
          <span className="text-[10px] text-white/40 tracking-[0.2em]">7 chapters · 1 flight</span>
          <ChevronDown className="w-5 h-5 animate-bounce mt-1" />
        </button>
      </div>
    </section>
  );
}
