'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter1Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);

  // 🟡 Sync background with Hero's scroll progress (with reversed gradient)
  useEffect(() => {
    const handleProgress = (e: CustomEvent<number>) => {
      const progress = e.detail;

      // Exact same colors as Hero section
      const nightTop = [15, 32, 72];
      const nightBottom = [25, 42, 82];
      const sunriseTop = [255, 179, 71];
      const sunriseBottom = [255, 140, 0];

      const topColor = nightTop.map((n, i) =>
        Math.round(n + (sunriseTop[i] - n) * progress)
      );
      const bottomColor = nightBottom.map((n, i) =>
        Math.round(n + (sunriseBottom[i] - n) * progress)
      );

      if (skyRef.current) {
        // Reverse the gradient for Chapter 1 - Hero's bottom color becomes Chapter 1's top
        gsap.to(skyRef.current, {
          background: `linear-gradient(to bottom, rgb(${bottomColor.join(',')}), rgb(${topColor.join(',')}))`,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('sunriseProgress', handleProgress as EventListener);
    return () => {
      window.removeEventListener('sunriseProgress', handleProgress as EventListener);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation on scroll
      gsap.fromTo(titleRef.current,
        {
          x: -100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Content animation
      gsap.fromTo(contentRef.current?.children || [],
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Farm tools animation
      gsap.fromTo(imageRef.current?.children || [],
        {
          scale: 0,
          rotation: -45,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 🟡 Chapter 1 to night blue transition - triggered when approaching Chapter 2
      gsap.to(skyRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom bottom",    // When Chapter 1 bottom reaches bottom of viewport
          end: "bottom top",         // When Chapter 1 bottom reaches top of viewport
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            // Current sunrise colors (what Chapter 1 has now)
            const currentTop = [255, 140, 0];    // Current yellow (Hero's bottom)
            const currentBottom = [255, 179, 71]; // Current orange (Hero's top)

            // Target night blue colors
            const nightTop = [25, 42, 82];       // Night blue (Hero's bottom)
            const nightBottom = [15, 32, 72];    // Night blue (Hero's top)

            // Interpolate from current sunrise to night blue
            const topColor = currentTop.map((c, i) =>
              Math.round(c + (nightTop[i] - c) * progress)
            );
            const bottomColor = currentBottom.map((c, i) =>
              Math.round(c + (nightBottom[i] - c) * progress)
            );

            // Apply the transition (keeping reversed gradient)
            if (skyRef.current) {
              skyRef.current.style.background = `linear-gradient(to bottom, rgb(${topColor.join(',')}), rgb(${bottomColor.join(',')}))`;
            }
          }
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="chapter-1"
      ref={sectionRef}
      className="relative min-h-screen section-padding overflow-hidden flex items-center justify-center"
    >
      <div
        ref={skyRef}
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: 'linear-gradient(to bottom, rgb(15, 42, 82), rgb(15, 32, 72))' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2
          ref={titleRef}
          className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8 w-full h-16"
        >
          <span className="gradient-text">Rooted in Discipline</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div ref={contentRef} className="space-y-6 flex flex-col gap-5">
              <p className="text-md md:text-lg text-gray-100 leading-relaxed">
                I come from a farming background where effort, not excuses, shaped my mindset. While others were still asleep,
                I was already up — helping on the farm and preparing for school. Not out of necessity, but out of choice.
              </p>

              <p className="text-md md:text-lg text-gray-100 leading-relaxed">
                That early exposure to discipline and responsibility gave me a head start. It wasn’t about hardship —
                it was about building character. From ploughing soil to solving problems, I’ve always worked with the same intention: to grow.
              </p>
            </div>

          <div ref={imageRef} className="relative">
            <div className="relative flex flex-col gap-5 bg-gradient-to-br from-earth-grass to-earth-wheat rounded-2xl p-8 h-[45vh] w-[45vw] shadow-2xl">

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-earth-soil/30 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🚜</div>
                  <p className="text-white font-medium">Farm Work</p>
                </div>

                <div className="bg-earth-soil/30 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-white font-medium">Studies</p>
                </div>

                <div className="bg-earth-soil/30 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🌾</div>
                  <p className="text-white font-medium">Harvest</p>
                </div>

                <div className="bg-earth-soil/30 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <p className="text-white font-medium">Excellence</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <blockquote className="text-xl font-medium text-white italic">
                  &quot;Discipline is not about punishment. <br />
                  It&apos;s about training yourself to do what needs to be done.&quot;
                </blockquote>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-8 h-8 bg-earth-wheat rounded-full animate-float opacity-70"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-aviation-gold rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
          </div>

        </div>
      </div>
    </section>
  );
}
