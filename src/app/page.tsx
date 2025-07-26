'use client';

import { useState } from 'react';
import HeroSection from '@/sections/HeroSection';
import Chapter1Section from '@/sections/Chapter1Section';
import Chapter2Section from '@/sections/Chapter2Section';
import Chapter3Section from '@/sections/Chapter3Section';
import Chapter4Section from '@/sections/Chapter4Section';
import Chapter6Section from '@/sections/Chapter6Section';
import Chapter7Section from '@/sections/Chapter7Section';
import Chapter8Section from '@/sections/Chapter8Section';
import SkillsSection from '@/sections/SkillsSection';
import ProjectsSection from '@/sections/ProjectsSection';
import ContactSection from '@/sections/ContactSection';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true);
  };

  return (
    <>
      {/* Loading Screen - Always shows first */}
      {!isLoadingComplete && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}

      {/* Main Content - Only shows after loading is complete */}
      {isLoadingComplete && (
        <>
          <ScrollProgress />
          <CustomCursor />
          <Navigation /> {/* Should be here, not inside main */}
          
          <main className="relative animate-fade-in">
            <HeroSection />
            <Chapter1Section />
            <Chapter2Section />
            <Chapter3Section />
            <Chapter4Section />
            <Chapter6Section />
            <Chapter7Section />
            <Chapter8Section />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </main>
        </>
      )}
    </>
  );
}

