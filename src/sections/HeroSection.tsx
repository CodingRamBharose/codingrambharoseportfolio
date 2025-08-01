'use client';

import { useEffect, useRef } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter'; // NEW: Import the hook and cursor
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';
import banner from '../assets/banner.png';
import logo from '../assets/logo.png';

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
      <div className="relative z-20 w-[350px] md:w-[450px] lg:w-[550px]">
        <Image src={banner} alt="Characters" width={600} height={600} className="object-contain drop-shadow-2xl" priority />
      </div>

      {/* Right Panel with Text */}
      <div className="relative flex flex-col gap-3 z-20 text-white max-w-lg text-center lg:text-right ">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 h-24 md:h-16">
          <span className="text-amber-400">{text}</span>
          <Cursor cursorColor="#FBBF24" />
        </h1>

        <p className="text-lg font-medium text-white mb-8">
          A Developer who started from soil and reached the server.
        </p>
        <p className="text-lg md:text-xs text-gray-300 leading-relaxed">
          Raised in a village where the sky was my ceiling and hard work my daily ritual,I grew from solving real-life problems to solving algorithms. <br />
          <span className="text-tech-neon font-semibold">Every line of code I write honors those humble beginnings.</span>
        </p>

        <div className="flex items-center gap-2 md:gap-4 mb-8 justify-center lg:justify-end">
          {/* Social Icons */}
          <a href="https://www.linkedin.com/in/codingrambharose" target="_blank" className='p-3 h-10 w-10 flex items-center justify-center rounded-full bg-trasparent hover:bg-white/10 transition-colors duration-300'>
            <Linkedin className="w-6 h-6 text-blue-300" />
          </a>

          <a href="https://github.com/CodingRamBharose" target="_blank" className="p-3 h-10 w-10 flex items-center justify-center rounded-full bg-trasparent hover:bg-white/10 transition-colors duration-300">
            <Github className="w-6 h-6 text-gray-200" />
          </a>

          <a href="mailto:codingrambharose@gmail.com" target="_blank" className="p-3 h-10 w-10 flex items-center justify-center rounded-full bg-trasparent hover:bg-white/10 transition-colors duration-300">
            <Mail className="w-6 h-6 text-red-300" />
          </a>

          {/* Resume Button with Icon */}
          <a
            href="/Ram_Avtar.pdf"
            target="_blank"
            className="flex h-10 w-28 justify-center items-center gap-2 rounded-full bg-transparent hover:bg-white/10 text-gray-200 font-semibold px-4 py-3 transition-all duration-300 transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Resume</span>
          </a>
        </div>

      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white/80">
        <button onClick={scrollToNext} className="flex flex-col items-center animate-bounce">
          <span className="text-sm mb-1">Scroll down</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}