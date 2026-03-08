'use client';

import { useEffect, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

const sections = [
  { id: 'hero', label: 'Start', icon: '🌅' },
  { id: 'chapter-1', label: 'Village Roots', icon: '🌾' },
  { id: 'chapter-2', label: 'English Struggle', icon: '📚' },
  { id: 'chapter-3', label: 'Computer Spark', icon: '💻' },
  { id: 'chapter-4', label: 'Phone Coding', icon: '📱' },
  { id: 'chapter-6', label: 'Recovery', icon: '💪' },
  { id: 'chapter-7', label: 'Academic Excellence', icon: '🏆' },
  { id: 'chapter-8', label: 'NCC Aviation', icon: '✈️' },
  { id: 'skills', label: 'Skills', icon: '🛠️' },
  { id: 'projects', label: 'Projects', icon: '💻' },
  { id: 'contact', label: 'Contact', icon: '📞' },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 100;
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[1000000] w-11 h-11 flex items-center justify-center rounded-full bg-tech-midnight/80 backdrop-blur-md border border-white/10 text-white shadow-lg"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Menu */}
      <nav
        className={`fixed top-0 right-0 z-[999999] h-full w-64 bg-tech-midnight/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-1 pt-20 px-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-tech-neon/15 text-tech-neon border border-tech-neon/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
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
