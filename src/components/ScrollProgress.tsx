'use client';

import { useEffect, useState, useCallback } from 'react';
import { NAV_SECTIONS } from '@/data/story';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('');

  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(Math.min((window.scrollY / totalHeight) * 100, 100));

    const scrollPosition = window.scrollY + 150;
    for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
      const el = document.getElementById(NAV_SECTIONS[i].id);
      if (el && scrollPosition >= el.offsetTop) {
        setCurrentSection(NAV_SECTIONS[i].progressLabel);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <div className="h-1 bg-gray-800/50">
        <div className="h-full bg-gradient-to-r from-earth-wheat via-tech-neon to-aviation-gold" style={{ width: `${scrollProgress}%` }} />
      </div>
      {currentSection && scrollProgress > 2 && (
        <div key={currentSection} className="absolute top-3 left-4 sm:left-6 text-[10px] sm:text-xs text-white/70 font-semibold tracking-[0.2em] uppercase animate-rise">
          {currentSection}
        </div>
      )}
    </div>
  );
}
