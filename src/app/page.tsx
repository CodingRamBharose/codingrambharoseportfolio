'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/sections/HeroSection';
import Chapter1Section from '@/sections/Chapter1Section';
import Chapter2Section from '@/sections/Chapter2Section';
import Chapter3Section from '@/sections/Chapter3Section';
import Chapter4Section from '@/sections/Chapter4Section';
import Chapter6Section from '@/sections/Chapter6Section';
import Chapter7Section from '@/sections/Chapter7Section';
import Chapter8Section from '@/sections/Chapter8Section';
import FlightPathSection from '@/sections/FlightPathSection';
import SkillsSection from '@/sections/SkillsSection';
import ContactSection from '@/sections/ContactSection';
import Navigation from '@/components/Navigation';
import MobileNav from '@/components/MobileNav';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';

// One shared WebGL canvas renders every chapter's 3D model
const SceneCanvas = dynamic(() => import('@/components/three/SceneCanvas'), { ssr: false });

export default function Home() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  return (
    <>
      {!isLoadingComplete && <LoadingScreen onLoadingComplete={() => setIsLoadingComplete(true)} />}

      {isLoadingComplete && (
        <>
          <SmoothScroll />
          <SceneCanvas />
          <ScrollProgress />
          <CustomCursor />
          <Navigation />
          <MobileNav />
          <div className="grain" aria-hidden />

          <main className="relative animate-fade-in">
            <HeroSection />
            <Chapter1Section />
            <Chapter2Section />
            <Chapter3Section />
            <Chapter4Section />
            <Chapter6Section />
            <Chapter7Section />
            <Chapter8Section />
            <FlightPathSection />
            <SkillsSection />
            <ContactSection />
          </main>
        </>
      )}
    </>
  );
}
