'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import banner from '../assets/cadet.png';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter8Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nccTimelineRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // NCC Timeline animation
      gsap.fromTo(nccTimelineRef.current?.children || [],
        {
          x: -100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: nccTimelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Achievements animation
      gsap.fromTo(achievementsRef.current?.children || [],
        {
          y: 50,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: achievementsRef.current,
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
      id="chapter-8"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8">
            <span className="gradient-text">Airborne with NCC</span>
          </h2>
          <p className="text-xl w-full">
            NCC made me who I am. I was up at 4 AM, trained with the Indian Air Force, and co-operated in SW-80 virus aircraft sorties during training. I earned A, B, and C certificates, and proudly served as a Cadet Warrant Officer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* NCC Journey */}
          <div>
            <h3 className="font-poppins font-semibold text-2xl text-white mb-8 text-center">
              My NCC Journey
            </h3>

            <div ref={nccTimelineRef} className="space-y-6 flex flex-col gap-1 !mt-2">
              {/* A Certificate */}
              <div className="flex items-center space-x-4 bg-gradient-to-r from-aviation-blue/20 to-transparent rounded-lg !p-4 border border-aviation-blue/30">
                <div className="w-12 h-12 bg-aviation-blue rounded-full flex items-center justify-center text-2xl">🎖️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">NCC A Certificate</h4>
                  <p className="text-gray-300 text-sm">
                    Introduced to NCC culture, drill basics, and foundational physical training.
                  </p>
                </div>
                <div className="text-aviation-gold font-bold">Level 1</div>
              </div>

              {/* B Certificate */}
              <div className="flex items-center space-x-4 bg-gradient-to-r from-aviation-blue/20 to-transparent rounded-lg !p-4 border border-aviation-blue/30">
                <div className="w-12 h-12 bg-aviation-blue rounded-full flex items-center justify-center text-2xl">🎖️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">NCC B Certificate</h4>
                  <p className="text-gray-300 text-sm">
                    Intermediate level: weapon handling, map reading, team leadership, and physical endurance.
                  </p>
                </div>
                <div className="text-aviation-gold font-bold">Level 2</div>
              </div>

              {/* C Certificate */}
              <div className="flex items-center space-x-4 bg-gradient-to-r from-aviation-gold/20 to-transparent rounded-lg !p-4 border border-aviation-gold/30">
                <div className="w-12 h-12 bg-aviation-gold rounded-full flex items-center justify-center text-2xl">🏅</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">NCC C Certificate</h4>
                  <p className="text-gray-300 text-sm">
                    Advanced command training, drill commanding, and national-level preparation.
                  </p>
                </div>
                <div className="text-aviation-gold font-bold">Level 3</div>
              </div>

              {/* Camps Attended */}
              <div className="flex items-center space-x-4 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-lg !p-4 border border-yellow-500/30">
                <div className="w-12 h-12 flex items-center justify-center text-2xl">🏕️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Camps Attended</h4>
                  <p className="text-gray-300 text-sm">
                    Participated in <strong>4 Camps</strong>: 1 National Camp and 3 Annual Training Camps across India.
                  </p>
                </div>
                <div className="text-yellow-400 font-bold">Field</div>
              </div>

              {/* Cadet Warrant Officer */}
              <div className="flex items-center space-x-4 bg-gradient-to-r from-tech-neon/20 to-transparent rounded-lg !p-4 border border-tech-neon/30">
                <div className="w-12 h-12 bg-tech-neon rounded-full flex items-center justify-center text-2xl text-tech-midnight">👨‍✈️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Cadet Warrant Officer</h4>
                  <p className="text-gray-300 text-sm">
                    Cadet rank. Led parades, mentored juniors, and coordinated inter-unit operations.
                  </p>
                </div>
                <div className="text-tech-neon font-bold">Leadership</div>
              </div>

              {/* Air Force Training */}
              <div className="flex items-center space-x-4 bg-gradient-to-r from-red-500/20 to-transparent rounded-lg !p-4 border border-red-500/30">
                <div className="w-12 h-12  rounded-full flex items-center justify-center text-2xl">✈️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Air Force Training</h4>
                  <p className="text-gray-300 text-sm">
                    Underwent ground training and safety drills with Indian Air Force personnel.
                  </p>
                </div>
                <div className="text-red-400 font-bold">Elite</div>
              </div>

              {/* SW-80 Aircraft Experience */}
              <div className="flex items-center space-x-4 bg-gradient-to-r from-purple-500/20 to-transparent rounded-lg !p-4 border border-purple-500/30">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">🛩️</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">SW-80 Virus Aircraft</h4>
                  <p className="text-gray-300 text-sm">
                    Completed 7 training sorties in the co-pilot seat — first taste of aviation in action.
                  </p>
                </div>
                <div className="text-purple-400 font-bold">Flight</div>
              </div>
            </div>

          </div>


          <div className="relative flex items-center justify-center">
            <Image src={banner} alt="Characters" width={400} height={500} className="object-contain drop-shadow-2xl" priority />
          </div>

        </div>

        {/* NCC Achievements Grid */}
        <div className="mt-16">
          <h3 className="font-poppins font-semibold text-2xl text-white text-center !mb-2">
            What NCC Gave Me
          </h3>

          <div ref={achievementsRef} className="grid md:grid-cols-4 gap-6">
            <div className="text-center bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-3">⏰</div>
              <h4 className="font-semibold text-aviation-gold mb-2">Discipline</h4>
              <p className="text-gray-300 text-sm">4 AM wake-ups became a lifestyle</p>
            </div>

            <div className="text-center bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-3">👥</div>
              <h4 className="font-semibold text-tech-neon mb-2">Leadership</h4>
              <p className="text-gray-300 text-sm">Leading teams under pressure</p>
            </div>

            <div className="text-center bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-3">💪</div>
              <h4 className="font-semibold text-earth-wheat mb-2">Resilience</h4>
              <p className="text-gray-300 text-sm">Mental and physical toughness</p>
            </div>

            <div className="text-center bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-semibold text-tech-cyan mb-2">Precision</h4>
              <p className="text-gray-300 text-sm">Attention to detail and excellence</p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center w-full !mt-4">
          <blockquote className="text-xl md:text-2xl font-medium text-white italic w-full ">
            &quot;NCC didn&apos;t just teach me to fly aircraft. It taught me to soar above limitations,
            to lead with purpose, and to serve with honor.&quot;
          </blockquote>
          <p className="text-aviation-gold !mt-2 text-lg font-semibold">
            — From cadet to leader, from ground to sky
          </p>
        </div>
      </div>
    </section>
  );
}
