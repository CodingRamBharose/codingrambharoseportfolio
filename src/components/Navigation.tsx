'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { NAV_SECTIONS } from '@/data/story';
import { scrollToTarget } from '@/lib/smooth';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      setIsVisible(window.scrollY > 300);
      for (const section of NAV_SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav aria-label="Story chapters" className="hidden md:flex flex-col items-center gap-3 fixed right-5 top-1/2 -translate-y-1/2 z-[999999]">
        {NAV_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToTarget(section.id)}
            className={`group relative block w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeSection === section.id ? 'bg-tech-neon scale-150 shadow-[0_0_12px_rgba(100,255,218,0.6)]' : 'bg-white/25 hover:bg-white/60 hover:scale-125'
            }`}
            aria-label={`Go to ${section.label}`}
            aria-current={activeSection === section.id ? 'true' : undefined}
          >
            {activeSection === section.id && <span className="absolute -inset-1 rounded-full border border-tech-neon/40 animate-ping" style={{ animationDuration: '2s' }} />}
            <span className="absolute right-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none">
              <span className="block bg-tech-midnight/90 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl border border-tech-neon/20">
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </span>
            </span>
          </button>
        ))}
      </nav>

      {isVisible && (
        <button
          onClick={() => scrollToTarget(0)}
          className="fixed bottom-6 right-6 z-[999999] bg-tech-neon text-tech-midnight p-3 rounded-full shadow-lg hover:bg-tech-cyan transition-all duration-300 hover:scale-110 animate-fade-in cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
