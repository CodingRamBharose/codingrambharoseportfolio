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

const StarField = dynamic(() => import('@/components/StarField'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef(null);
  const sunRef = useRef(null);
  const skyRef = useRef(null);

  const [text] = useTypewriter({
    words: ["Hi, I'm Ram Avtar", 'नमस्ते, मैं राम अवतार हूँ'],
    loop: true,
    typeSpeed: 120,
    deleteSpeed: 80,
    delaySpeed: 1500,
  });


  useEffect(() => {
    // ... GSAP animation code remains the same
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;

          // Dispatch progress to Chapter 1
          window.dispatchEvent(new CustomEvent('sunriseProgress', { detail: progress }));
          const sunY = 50 - progress * 80; // Reduced range to keep sun within Hero section
          const scale = 0.4 + progress * 0.6;
          const opacity = Math.min(progress * 2, 1);

          gsap.to(sunRef.current, {
            y: `${sunY}%`,
            scale,
            opacity,
            duration: 0.3,
            ease: 'power2.out',
          });

          const nightTop = [15, 32, 72];
          const nightBottom = [25, 42, 82];
          const sunriseTop = [255, 179, 71];
          const sunriseBottom = [255, 140, 0];

          const topColor = nightTop.map((n, i) => Math.round(n + (sunriseTop[i] - n) * progress));
          const bottomColor = nightBottom.map((n, i) => Math.round(n + (sunriseBottom[i] - n) * progress));

          gsap.to(skyRef.current, {
            background: `linear-gradient(to bottom, rgb(${topColor.join(',')}), rgb(${bottomColor.join(',')}))`,
            duration: 0.5,
            ease: 'power2.out',
          });
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    const next = document.getElementById('chapter-1');
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-around gap-12 overflow-x-hidden section-padding"
    >
      <div
        ref={skyRef}
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(to bottom, rgb(15, 32, 72), rgb(25, 42, 82))' }}
      />
      <StarField />
      <div className="absolute hidden md:block md:top-0 md:left-10 lg:top-0 lg:left-10 z-30">
        <Image src={logo} alt="Logo" width={130} height={60} />
      </div>
      <div
        ref={sunRef}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 w-32 h-32 rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          boxShadow: '0 0 80px rgba(255, 215, 0, 0.6)',
        }}
      />
      <div className="relative z-20 w-[280px] sm:w-[350px] md:w-[450px] lg:w-[550px]">
        <Image src={banner} alt="Characters" width={600} height={600} className="object-contain drop-shadow-2xl" priority />
      </div>

      {/* Right Panel with Text */}
      <div className="relative flex flex-col gap-3 z-20 text-white max-w-lg text-center lg:text-right ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 h-24 md:h-16">
          <span className="text-amber-400">{text}</span>
          <Cursor cursorColor="#FBBF24" />
        </h1>

        <p className="text-base sm:text-lg font-medium text-white mb-8" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
          A Developer who started from soil and reached the server.
        </p>
        <p className="text-sm sm:text-base md:text-xs text-gray-300 leading-relaxed">
          Raised in a village where the sky was my ceiling and hard work my daily ritual,I grew from solving real-life problems to solving algorithms. <br />
          <span className="text-tech-neon font-semibold">Every line of code I write honors those humble beginnings.</span>
        </p>

        <div className="flex items-center gap-3 sm:gap-4 mb-8 justify-center lg:justify-end flex-wrap">
          {/* Social Icons */}
          <a href="https://www.linkedin.com/in/codingrambharose" target="_blank" rel="noopener noreferrer" className='p-3 h-11 w-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(96,165,250,0.3)] transition-all duration-300'>
            <Linkedin className="w-5 h-5 text-blue-300" />
          </a>

          <a href="https://github.com/CodingRamBharose" target="_blank" rel="noopener noreferrer" className="p-3 h-11 w-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-gray-400/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
            <Github className="w-5 h-5 text-gray-200" />
          </a>

          <a href="https://leetcode.com/u/CodingRamBharose/" target="_blank" rel="noopener noreferrer" className="p-3 h-11 w-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300">
            <LeetCodeIcon className="w-5 h-5 text-amber-400" />
          </a>


          <a href="mailto:codingrambharose@gmail.com" target="_blank" rel="noopener noreferrer" className="p-3 h-11 w-11 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-red-400/50 hover:shadow-[0_0_15px_rgba(252,165,165,0.3)] transition-all duration-300">
            <Mail className="w-5 h-5 text-red-300" />
          </a>

          {/* Resume Button with Icon */}
          <a
            href="/RamAvtar.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 justify-center items-center gap-2 rounded-full bg-tech-neon/10 backdrop-blur-sm border border-tech-neon/30 hover:bg-tech-neon/20 hover:border-tech-neon/60 text-tech-neon font-semibold py-3 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(100,255,218,0.2)]"
            style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Resume</span>
          </a>
        </div>

      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white/80">
        <button onClick={scrollToNext} className="flex flex-col items-center group">
          <span className="text-xs sm:text-sm mb-1 opacity-60 group-hover:opacity-100 transition-opacity">Scroll down</span>
          <div className="animate-bounce">
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>
      </div>
    </section>
  );
}