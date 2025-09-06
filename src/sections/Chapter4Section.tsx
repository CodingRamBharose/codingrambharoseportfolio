'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Chapter4Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const [currentCode, setCurrentCode] = useState(0);

  const codeExamples = [
    {
      title: "Hello World",
      code: `# My First Python Program
print("Hello, world!")`,
      language: "Python"
    },
    {
      title: "Simple Math Solver",
      code: `# Solves a basic math expression
expression = input("Enter math expression (e.g., 5 + 3): ")
result = eval(expression)
print("Result:", result)`,
      language: "Python"
    },
    {
      title: "Guess the Number Game",
      code: `# Guess the Number Game
import random

number = random.randint(1, 100)
guess = int(input("Guess: "))

if guess == number:
    print("You won!")
else:
    print("Try again!")`,
      language: "Python"
    },
    {
      title: "Basic Calculator",
      code: `# Basic Calculator
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

num1 = float(input("First number: "))
num2 = float(input("Second number: "))
result = add(num1, num2)
print(f"Result: {result}")`,
      language: "Python"
    }
  ];


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Phone animation
      gsap.fromTo(phoneRef.current,
        {
          y: 100,
          opacity: 0,
          rotationY: -15
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: phoneRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Code cycling animation
      ScrollTrigger.create({
        trigger: codeRef.current,
        start: "top 80%",
        onEnter: () => {
          const interval = setInterval(() => {
            setCurrentCode((prev) => (prev + 1) % codeExamples.length);
          }, 3000);

          return () => clearInterval(interval);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [codeExamples.length]);

  return (
    <section
      id="chapter-4"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#0F2048] to-[#192A52] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="w-full flex flex-col gap-6">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8">
            <span className="gradient-text">Code on a Phone</span>
          </h2>
          <p className="text-lg w-full">
            After 12th, I couldn&apos;t join B.Tech. Everyone pushed me toward B.Sc.,
            but I chose BCA. I started learning Python on my phone and wrote mini games and calculators —
            all on a 5-inch screen.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="flex flex-col gap-8 text-gray-200 w-full">
            <div className="">
              <h3 className="font-poppins font-semibold text-2xl text-tech-neon mb-6">
                The Phone Programmer
              </h3>

              <div className="space-y-4 text-md text-gray-200 leading-relaxed">
                <p>
                  &quot;I didn&apos;t have a laptop. I didn&apos;t have a computer. But I had a smartphone
                  and an unstoppable desire to learn coding.&quot;
                </p>

                <p>
                  I downloaded Python apps, watched YouTube tutorials, and typed code
                  with my thumbs. My friends thought I was crazy — who codes on a phone?
                </p>

                <p className="text-tech-neon font-semibold">
                  &quot;Limitation breeds creativity. I learned to think in code before
                  I could type it comfortably.&quot;
                </p>
              </div>
            </div>

            <div className="bg-earth-wheat/10 backdrop-blur-sm rounded-lg p-6 border border-earth-wheat/30 w-full">
              <h4 className="font-semibold text-earth-wheat mb-4 h-8 flex items-center justify-center">What I Built on My Phone:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded p-3 text-center">
                  <div className="text-2xl mb-2">👋</div>
                  <p className="text-sm text-gray-300">Hello World</p>
                </div>

                <div className="bg-white/5 rounded p-3 text-center">
                  <div className="text-2xl mb-2">🔢</div>
                  <p className="text-sm text-gray-300">Math Solvers</p>
                </div>

                <div className="bg-white/5 rounded p-3 text-center">
                  <div className="text-2xl mb-2">🎮</div>
                  <p className="text-sm text-gray-300">Number Guessing Game</p>
                </div>

                <div className="bg-white/5 rounded p-3 text-center">
                  <div className="text-2xl mb-2">🧮</div>
                  <p className="text-sm text-gray-300">Basic Calculator</p>
                </div>
              </div>

            </div>
          </div>

          <div ref={phoneRef} className="relative flex items-center justify-center">
            <div className="relative mx-auto w-80 h-[450px]">
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-800">
                <div className="absolute inset-4 rounded-[2rem] overflow-hidden flex flex-col gap-4">
                  <div className="bg-gray-900 px-4 py-2 flex justify-between items-center text-white text-xs">
                    <span className='w-24 flex justify-center'>6:00 AM</span>
                    <span>📶 🔋</span>
                  </div>

                  <div className="bg-tech-midnight px-4 py-3 border-b w-full text-center border-gray-700">
                    <h4 className="text-tech-neon font-semibold">Python Mobile IDE</h4>
                  </div>

                  <div
                    ref={codeRef}
                    className="p-4 h-full bg-gray-900 font-mono text-sm overflow-hidden"
                  >
                    <div className="text-tech-neon mb-2 text-xs">
                      {codeExamples[currentCode].title}
                    </div>
                    <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap">
                      {codeExamples[currentCode].code}
                    </pre>

                    <span className="inline-block w-2 h-4 bg-tech-neon animate-pulse ml-1"></span>
                  </div>
                </div>

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-700 rounded-full"></div>
              </div>

              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-earth-wheat rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 -left-8 w-4 h-4 bg-tech-cyan rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
