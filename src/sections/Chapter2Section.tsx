'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter2Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blurredTextRef = useRef<HTMLDivElement>(null);
  const clearTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Blurred text animation
      gsap.fromTo(blurredTextRef.current,
        {
          filter: 'blur(10px)',
          opacity: 0.3
        },
        {
          filter: 'blur(0px)',
          opacity: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: blurredTextRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Clear text reveal
      gsap.fromTo(clearTextRef.current,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: clearTextRef.current,
            start: "top 85%",
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
      id="chapter-2"
      ref={sectionRef}
      className="min-h-screen section-padding flex items-center justify-center"
      style={{ background: 'linear-gradient(to bottom, rgb(15, 32, 72), rgb(25, 42, 82))' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white">
            <span className="gradient-text">Lost in Translation</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 flex flex-col gap-6">
            <div
              ref={blurredTextRef}
              className="backdrop-blur-sm rounded-lg p-8"
            >
              <h3 className="font-poppins font-semibold text-xl text-white mb-4 underline">
                How I Felt in Class 11
              </h3>
              <div className="text-md text-gray-200 leading-relaxed">
                <p className="mb-4">
                  I studied in Punjabi medium till class 10, and my native language is Punjabi. Suddenly switching to English medium in class 11 felt like being thrown into a foreign world.
                </p>
                <p className="mb-4">
                  "The teacher is explaining something about physics, but I can't understand. Everyone around me is nodding, taking notes. I'm just sitting there, feeling invisible."
                </p>
              </div>
            </div>

            <div
              ref={clearTextRef}
              className=''
            >
              <h3 className="font-poppins font-semibold text-2xl text-yellow-300 mb-4">
                Small Steps, Big Changes
              </h3>
              <div className="text-md text-white leading-relaxed">
                <p className="mb-4">
                  I started watching simple English cartoons, using Google Translate for everything, and asking friends for help. I didn’t magically become fluent, but I learned to survive, step by step.
                </p>
                <p className="font-semibold text-yellow-300">
                  "Hard work beats talent when talent doesn't work hard."
                </p>
              </div>
            </div>
          </div>

          <div className="text-center flex flex-col justify-center gap-4">
            <blockquote className="text-2xl md:text-2xl font-medium text-white italic max-w-2xl mx-auto">
              "I didn't just learn English. I learned that any barrier can be broken with enough determination and the right approach."
            </blockquote>
            <p className="text-gray-400 mt-4 text-lg">
              — The moment I realized I could learn anything
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
