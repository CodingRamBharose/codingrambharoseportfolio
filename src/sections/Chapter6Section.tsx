'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter6Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const recoveryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline animation
      gsap.fromTo(timelineRef.current?.children || [],
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Recovery visualization
      gsap.fromTo(recoveryRef.current,
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: recoveryRef.current,
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
      id="chapter-6"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8">
            <span className="gradient-text">Pain, Persistence & a Phone</span>
          </h2>
          <p className="text-xl w-full">
            In BCA Year 2, long hours of field work + coding gave me disc bulge. For 6 months,
            I couldn&apos;t sit. But I didn&apos;t stop. I watched tutorials on my phone. I studied lying on the floor.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Recovery Timeline */}
          <div>
            <h3 className="font-poppins font-semibold text-2xl text-white !mb-4 text-center">
              6 Months of Recovery
            </h3>

            <div ref={timelineRef} className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="bg-red-500/10 rounded-lg !p-3 flex-1 border border-red-500/30">
                  <h4 className="font-semibold text-red-400 mb-2">Month 1: The Diagnosis</h4>
                  <p className="text-gray-300 text-sm">
                    &quot;Doctor said complete bed rest. No sitting for extended periods.
                    My coding dreams seemed shattered.&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="bg-orange-500/10 rounded-lg !p-3 flex-1 border border-orange-500/30">
                  <h4 className="font-semibold text-orange-400 mb-2">Month 2: Adaptation</h4>
                  <p className="text-gray-300 text-sm">
                    &quot;Started watching coding tutorials lying down. Phone became my classroom.
                    YouTube University was in session.&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="bg-yellow-500/10 rounded-lg !p-3 flex-1 border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-400 mb-2">Month 3-4: Mental Coding</h4>
                  <p className="text-gray-300 text-sm">
                    &quot;Learned to visualize code in my head. Solved problems mentally.
                    Theory became my strength.&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="bg-green-500/10 rounded-lg !p-3 flex-1 border border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-2">Month 5: Gradual Return</h4>
                  <p className="text-gray-300 text-sm">
                    &quot;Started sitting for short periods. Every 15 minutes felt like a victory.
                    Slowly getting back to coding.&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-white rounded-full mt-2 flex-shrink-0 animate-glow"></div>
                <div className="bg-tech-neon/10 rounded-lg !p-3 flex-1 border border-tech-neon/30">
                  <h4 className="font-semibold text-tech-neon mb-2">Month 6: Stronger Than Before</h4>
                  <p className="text-gray-300 text-sm">
                    &quot;Full recovery. But now I had discipline, patience, and a deeper
                    understanding of perseverance.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Visualization */}
          <div ref={recoveryRef} className="relative w-full flex items-end justify-end h-full">
            <div className="w-full flex flex-col gap-4 !p-2 bg-gradient-to-br from-tech-midnight to-earth-soil rounded-2xl shadow-2xl border border-white/10">
              {/* Phone Learning Setup */}
              <div className="text-center mb-8">
                <h4 className="font-poppins font-semibold text-xl text-white mb-4">
                  My Recovery Setup
                </h4>

                <div className="relative">
                  {/* Bed/Floor representation */}
                  <div className="bg-earth-wheat/20 rounded-lg p-6 mb-4">
                    <div className="text-4xl mb-2">🛏️</div>
                    <p className="text-gray-300 text-sm !mb-2">Lying down position</p>
                  </div>

                  {/* Phone */}
                  <div className="bg-tech-midnight rounded-lg border border-white/20 !p-2">
                    <div className="text-3xl mb-2">📱</div>
                    <p className="text-tech-neon font-semibold">Mobile Learning</p>
                    <p className="text-gray-300 text-xs">YouTube tutorials, documentation, forums</p>
                  </div>
                </div>
              </div>

              {/* What I Learned During Recovery */}
              <div className="space-y-4">
                <h5 className="font-semibold text-tech-neon mb-3">What I Learned:</h5>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded !p-2 text-center">
                    <div className="text-2xl mb-1">🧠</div>
                    <p className="text-xs text-gray-300">Mental Problem Solving</p>
                  </div>

                  <div className="bg-white/5 rounded !p-2 text-center">
                    <div className="text-2xl mb-1">📚</div>
                    <p className="text-xs text-gray-300">Deep Theory Study</p>
                  </div>

                  <div className="bg-white/5 rounded !p-2 text-center">
                    <div className="text-2xl mb-1">⏰</div>
                    <p className="text-xs text-gray-300">Time Management</p>
                  </div>

                  <div className="bg-white/5 rounded !p-2 text-center">
                    <div className="text-2xl mb-1">💪</div>
                    <p className="text-xs text-gray-300">Mental Resilience</p>
                  </div>
                </div>
              </div>

              {/* Recovery Stats */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-tech-neon">6</div>
                    <p className="text-xs text-gray-300">Months Recovery</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-earth-wheat">100+</div>
                    <p className="text-xs text-gray-300">Hours of Tutorials</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-tech-cyan">0</div>
                    <p className="text-xs text-gray-300">Days I Quit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating motivation elements */}
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-earth-wheat rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
          </div>

        </div>

        {/* Lessons Learned */}
        <div className="flex flex-col gap-3">
          <h3 className="font-poppins font-semibold text-2xl text-tech-neon mb-6 text-center">
            What This Challenge Taught Me
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-white mb-2">Adaptability</h4>
              <p className="text-gray-300 text-sm">
                When circumstances change, find new ways to achieve your goals.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-3">🔥</div>
              <h4 className="font-semibold text-white mb-2">Persistence</h4>
              <p className="text-gray-300 text-sm">
                Physical limitations can&apos;t stop mental growth and determination.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-white mb-2">Innovation</h4>
              <p className="text-gray-300 text-sm">
                Constraints force you to find creative solutions and new approaches.
              </p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="flex items-center justify-center flex-col">
          <blockquote className="text-xl md:text-2xl font-medium text-white italic max-w-4xl mx-auto">
            &quot;That pain taught me power. When you can&apos;t sit, you learn to think.
            When you can&apos;t type, you learn to visualize. Limitations become innovations.&quot;
          </blockquote>
          <p className="text-tech-neon mt-4 text-lg font-semibold">
            — Turning setbacks into comebacks
          </p>
        </div>
      </div>
    </section>
  );
}
