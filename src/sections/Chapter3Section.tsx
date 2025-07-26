'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter3Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const computerRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');

  const textToType = "Student Name: Ram Avtar\nClass: 8th\nMarks: 97/100\nStatus: Updated Successfully";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(computerRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: computerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      ScrollTrigger.create({
        trigger: typingRef.current,
        start: "top 80%",
        onEnter: () => {
          let i = 0;
          const typeInterval = setInterval(() => {
            if (i < textToType.length) {
              setTypedText(textToType.slice(0, i + 1));
              i++;
            } else {
              clearInterval(typeInterval);
            }
          }, 50);
        },
        onLeave: () => setTypedText(''),
        onEnterBack: () => {
          let i = 0;
          const typeInterval = setInterval(() => {
            if (i < textToType.length) {
              setTypedText(textToType.slice(0, i + 1));
              i++;
            } else {
              clearInterval(typeInterval);
            }
          }, 50);
        },
        onLeaveBack: () => setTypedText('')
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="chapter-3"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white">
            <span className="gradient-text">The Computer Spark</span>
          </h2>
            <p className="text-lg w-full">
              In 6th standard, computer science was introduced as a subject. The first time I touched a keyboard, I felt a strange excitement.
              But things really changed in 8th grade...
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="flex flex-col gap-8 text-gray-200 w-full">
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                I was known for being good at studies, and one day our class teacher called me and said,
                “You’re sharp — can you help enter some student data into the system?”
              </p>
              <p>
                I had no idea what a database was, but I eagerly agreed. I skipped regular classes just to sit at that
                big old desktop and type in roll numbers, marks, and names.
              </p>
              <p>
                Within days, my typing speed reached 30 words per minute. I started participating in typing competitions — and won many!
              </p>
              <p className="text-tech-neon font-semibold">
                I didn’t even realize it, but the computer had become my favorite place to be.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-block bg-tech-cyan text-tech-midnight px-6 py-3 rounded-full font-semibold">
                💡 The Spark Was Lit
              </div>
            </div>
          </div>


          <div className="flex w-full h-full items-center justify-center">
            <div ref={computerRef} className="relative w-[80%]">
              <div className="bg-gray-800 rounded-lg p-6 shadow-2xl border-4 border-gray-600">
                <div className="bg-black rounded p-4 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent"></div>
                  <div className="text-green-400 font-mono text-sm mb-4 border-b border-green-400/30 pb-2">
                    SCHOOL MANAGEMENT SYSTEM v1.0
                  </div>
                  <div ref={typingRef} className="text-green-400 font-mono text-sm min-h-[120px] whitespace-pre-line">
                    <div className="mb-2">Updating Student Records...</div>
                    {typedText}
                    <span className="animate-pulse">|</span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-gray-700 rounded p-2 text-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2 animate-pulse"></div>
                  <span className="text-gray-300 text-xs font-mono">POWER ON</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-tech-neon rounded-full animate-float opacity-70 flex items-center justify-center text-tech-midnight font-bold"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-tech-cyan rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-earth-wheat rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
