'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Projects grid animation
      gsap.fromTo(projectsRef.current?.children || [],
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-6xl text-white mb-8">
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 mx-auto">
            From AI-powered deepfake detection to full-stack web applications,
            here&apos;s what I&apos;ve built with passion and precision.
          </p>
        </div>
      </div>
    </section>
  );
}
