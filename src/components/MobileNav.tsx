'use client';

import { useEffect, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_SECTIONS } from '@/data/story';
import { getLenis, scrollToTarget } from '@/lib/smooth';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    for (const section of NAV_SECTIONS) {
      const element = document.getElementById(section.id);
      if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
        setActiveSection(section.id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const go = (sectionId: string) => {
    setIsOpen(false);
    // wait for the scroll lock to lift before scrolling
    requestAnimationFrame(() => scrollToTarget(sectionId));
  };

  // Lock page scroll while the menu is open
  useEffect(() => {
    const lenis = getLenis();
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      getLenis()?.start();
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[1000000] w-11 h-11 flex items-center justify-center rounded-full bg-tech-midnight/80 backdrop-blur-md border border-white/10 text-white shadow-lg"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      <nav
        aria-label="Story chapters"
        className={`fixed top-0 right-0 z-[999999] h-full w-72 bg-tech-midnight/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-1 pt-20 px-4 overflow-y-auto h-full pb-8">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => go(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === section.id ? 'bg-tech-neon/15 text-tech-neon border border-tech-neon/30' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
