'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      setIsVisible(window.scrollY > 300);

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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav 
        className="space-y-4 hidden md:block"
        style={{ 
          position: 'fixed',
          right: '20px',
          top: '200px',
          zIndex: 999999,
        }}
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`group relative block w-4 h-4 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-tech-neon scale-125'
                : 'bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to ${section.label}`}
          >
            {/* Tooltip */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-tech-midnight text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg border border-tech-neon/30">
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[999999] bg-tech-neon text-tech-midnight p-3 rounded-full shadow-lg hover:bg-tech-cyan transition-all duration-300 transform hover:scale-110 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}





