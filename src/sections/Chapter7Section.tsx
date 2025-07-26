'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter7Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trophyRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Trophy animation
      gsap.fromTo(trophyRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.5,
          rotation: -10
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: trophyRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Certificates floating animation
      gsap.fromTo(certificatesRef.current?.children || [],
        {
          y: 50,
          opacity: 0,
          rotation: (i) => (i % 2 === 0 ? -5 : 5)
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: certificatesRef.current,
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
      id="chapter-7"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#0F2048] to-[#192A52] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8">
            <span className="gradient-text">From Village to Toppers List</span>
          </h2>
          <p className="text-xl w-full">
            Despite all odds, I secured 2nd position in BCA out of ~3500 students in Punjabi University.
            In MCA at Thapar, among 120 bright minds, I stood 3rd overall and 1st among boys with 9.84 CGPA.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Achievement Story */}
          <div className="space-y-8">
            <div className="!p-4">
              <h3 className="font-poppins font-semibold text-2xl text-aviation-gold mb-6">
                The Impossible Journey
              </h3>

              <div className="space-y-4 text-md text-gray-200 leading-relaxed">
                <p>
                  "Nobody in my village knew what 'coding' meant. They saw a boy who worked
                  in fields, struggled with English, and learned on a phone."
                </p>

                <p>
                  But results speak louder than backgrounds. When the BCA results came out,
                  I was 2nd out of 3500+ students across Punjabi University.
                </p>

                <p className="text-aviation-gold font-semibold">
                  "From a village school to university topper — that's the power of
                  consistency and refusing to accept limitations."
                </p>
              </div>
            </div>

            {/* BCA Achievement */}
            <div className="bg-gradient-to-r from-aviation-gold/20 to-earth-wheat/20 rounded-lg !p-6 border border-aviation-gold/30">
              <h4 className="font-semibold text-aviation-gold mb-3 text-xl">🏆 BCA Achievement</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">2nd</div>
                  <p className="text-gray-300 text-sm">Position</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">3500+</div>
                  <p className="text-gray-300 text-sm">Students</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-3">University College, Ghanaur (Punjabi University, Patiala)</p>
            </div>

            {/* MCA Achievement */}
            <div className="bg-gradient-to-r from-tech-neon/20 to-tech-cyan/20 rounded-lg !p-6 border border-tech-neon/30">
              <h4 className="font-semibold text-tech-neon mb-3 text-xl">🎓 MCA Excellence</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">3rd</div>
                  <p className="text-gray-300 text-xs">Overall</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1st</div>
                  <p className="text-gray-300 text-xs">Among Boys</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">9.84</div>
                  <p className="text-gray-300 text-xs">CGPA</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-3">Thapar Institute of Engineering & Technology</p>
            </div>
          </div>

          {/* Visual Achievement Display */}
          <div className="relative">
            {/* Main Trophy */}
            <div ref={trophyRef} className="text-center mb-8">
              <div className="relative inline-block">
                <div className="text-8xl mb-4 animate-float">🏆</div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-aviation-gold rounded-full flex items-center justify-center text-tech-midnight font-bold text-sm animate-glow">
                  #2
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-tech-neon rounded-full flex items-center justify-center text-tech-midnight font-bold text-sm animate-glow" style={{ animationDelay: '0.5s' }}>
                  #3
                </div>
              </div>
              <h3 className="font-poppins font-bold text-2xl text-aviation-gold !mt-2">Academic Excellence</h3>
              <p className="text-gray-300 !mb-2">Against All Odds</p>
            </div>
            <div className="mt-16 text-center flex gap-4 flex-col justify-center">
              <blockquote className="text-xl md:text-2xl font-medium text-white italic max-w-4xl mx-auto">
                "They measured me by my background. I measured myself by my potential.
                The results spoke for themselves."
              </blockquote>
              <div className="flex items-center justify-center animate-pulse">
                <div className="text-center bg-white/5 rounded-lg !py-3 !px-6 border border-white/10">
                  <div className="text-4xl font-bold text-tech-cyan mb-2">15+</div>
                  <p className="text-gray-300">Years of Being Topper</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
