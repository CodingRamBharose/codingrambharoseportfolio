'use client';

import { useEffect, useState, useCallback } from 'react';

const sectionLabels: Record<string, string> = {
  'hero': 'The Beginning',
  'chapter-1': 'Ch 1 · Village Roots',
  'chapter-2': 'Ch 2 · English Struggle',
  'chapter-3': 'Ch 3 · Computer Spark',
  'chapter-4': 'Ch 4 · Phone Coding',
  'chapter-6': 'Ch 6 · Recovery',
  'chapter-7': 'Ch 7 · Academic Excellence',
  'chapter-8': 'Ch 8 · NCC Aviation',
  'skills': 'Skills & Technologies',
  'projects': 'Projects',
  'contact': 'Contact',
};

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('');

  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(Math.min(progress, 100));

    // Detect current section
    const scrollPosition = window.scrollY + 150;
    const sectionIds = Object.keys(sectionLabels);
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (el && scrollPosition >= el.offsetTop) {
        setCurrentSection(sectionLabels[sectionIds[i]]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-gray-800/50">
        <div 
          className="h-full bg-gradient-to-r from-tech-neon via-tech-cyan to-aviation-gold transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* Chapter label */}
      {currentSection && scrollProgress > 2 && (
        <div className="absolute top-2 left-4 sm:left-6 text-[10px] sm:text-xs text-white/60 font-medium tracking-wider uppercase transition-opacity duration-300">
          {currentSection}
        </div>
      )}
    </div>
  );
}
