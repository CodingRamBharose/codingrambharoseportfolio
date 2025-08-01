'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const circularSkillsRef = useRef<HTMLDivElement>(null);

  const skills = useMemo(() => [
    { name: 'JavaScript', level: 80, category: 'Frontend', icon: '⚡', color: 'text-yellow-400' },
    { name: 'React', level: 75, category: 'Frontend', icon: '⚛️', color: 'text-cyan-400' },
    { name: 'Next.js', level: 75, category: 'Frontend', icon: '▲', color: 'text-white' },
    { name: 'TypeScript', level: 65, category: 'Frontend', icon: '📘', color: 'text-blue-500' },
    { name: 'Tailwind CSS', level: 85, category: 'Frontend', icon: '🎨', color: 'text-sky-400' },
    { name: 'shadcn/ui', level: 70, category: 'Frontend', icon: '🧩', color: 'text-violet-400' },

    { name: 'Node.js', level: 75, category: 'Backend', icon: '🟢', color: 'text-green-400' },
    { name: 'Python', level: 60, category: 'Backend', icon: '🐍', color: 'text-blue-400' },
    { name: 'Express.js', level: 70, category: 'Backend', icon: '🚀', color: 'text-gray-400' },

    { name: 'MongoDB', level: 70, category: 'Database', icon: '🍃', color: 'text-green-500' },
    { name: 'MySQL', level: 60, category: 'Database', icon: '🗄️', color: 'text-blue-600' },

    { name: 'TensorFlow', level: 10, category: 'AI/ML', icon: '🧠', color: 'text-orange-400' },

    { name: 'Git', level: 80, category: 'Tools', icon: '📝', color: 'text-red-400' },
    { name: 'VS Code', level: 85, category: 'Tools', icon: '🧰', color: 'text-blue-500' },

    { name: 'Docker', level: 65, category: 'DevOps', icon: '🐳', color: 'text-blue-600' },
    { name: 'Jenkins', level: 50, category: 'DevOps', icon: '🧪', color: 'text-rose-400' },
    { name: 'Grafana', level: 45, category: 'DevOps', icon: '📊', color: 'text-amber-400' },

    { name: 'AWS', level: 40, category: 'Cloud', icon: '☁️', color: 'text-orange-500' }
  ], []);

  const circularSkills = useMemo(() => [
    { name: 'Problem Solving', level: 80, color: 'tech-neon' },
    { name: 'Team Leadership', level: 85, color: 'aviation-gold' },
    { name: 'Communication', level: 80, color: 'tech-cyan' },
    { name: 'Adaptability', level: 92, color: 'earth-wheat' }
  ], []);

  const categories = useMemo(() => ['Frontend', 'Backend', 'Database', 'AI/ML', 'Tools', 'DevOps', 'Cloud'], []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Skills bars animation
      gsap.fromTo(skillsRef.current?.querySelectorAll('.skill-bar') || [],
        {
          width: '0%'
        },
        {
          width: (i, target) => target.dataset.level + '%',
          duration: 1.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Circular skills animation - no spinning, just fade in
      gsap.fromTo(circularSkillsRef.current?.children || [],
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: circularSkillsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate circular progress bars
      gsap.fromTo(circularSkillsRef.current?.querySelectorAll('.circular-progress') || [],
        {
          strokeDasharray: "0 283"
        },
        {
          strokeDasharray: (i, target) => {
            const level = parseInt(target.dataset.level || '0');
            const circumference = 283;
            const progress = (level / 100) * circumference;
            return `${progress} ${circumference}`;
          },
          duration: 2,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: circularSkillsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate numbers for circular skills
      circularSkills.forEach((skill, index) => {
        gsap.fromTo(circularSkillsRef.current?.querySelectorAll('.skill-number')[index] || {},
          {
            textContent: 0
          },
          {
            textContent: skill.level,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 0.2,
            scrollTrigger: {
              trigger: circularSkillsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate numbers for technical skills
      skills.forEach((skill, index) => {
        gsap.fromTo(skillsRef.current?.querySelectorAll('.tech-skill-number')[index] || {},
          {
            textContent: 0
          },
          {
            textContent: skill.level,
            duration: 1.5,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 0.1,
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [skills, circularSkills, sectionRef, skillsRef, circularSkillsRef]);

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#0F2048] to-[#192A52] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-white mb-8">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-xl w-full">
            Adaptable. Self-taught. Consistently learning. Every skill reflects a chapter of growth, from learning the basics to tackling real-world challenges in tech.

          </p>

        </div>

        {/* Soft Skills - Circular Display */}
        <div className="mb-16">
          <h3 className="font-poppins font-semibold text-2xl text-white !mb-8 text-center">
            Core Strengths
          </h3>

          <div ref={circularSkillsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full items-center justify-between">
            {circularSkills.map((skill) => (
              <div key={skill.name} className="text-center flex items-center justify-center flex-col">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={`var(--color-${skill.color})`}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="0 283"
                      className="circular-progress transition-all duration-1000 ease-out"
                      data-level={skill.level}
                      style={{
                        stroke: skill.color === 'tech-neon' ? '#64FFDA' :
                          skill.color === 'aviation-gold' ? '#FFD700' :
                            skill.color === 'tech-cyan' ? '#00BCD4' :
                              '#F9D342'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      <span className="skill-number">0</span>%
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-white">{skill.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills by Category */}
        <div ref={skillsRef}>
          <h3 className="font-poppins font-semibold text-2xl text-white !mb-4 !mt-4 text-center">
            Technical Expertise
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category) => {
              const categorySkills = getSkillsByCategory(category);
              if (categorySkills.length === 0) return null;

              return (
                <div key={category} className="bg-white/5 rounded-lg !p-6 border border-white/10">
                  <h4 className="font-semibold text-tech-neon !mb-4 text-lg">{category}</h4>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between !mb-2 !mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{skill.icon}</span>
                            <span className={`font-medium ${skill.color}`}>{skill.name}</span>
                          </div>
                          <span className="text-white font-semibold">
                            <span className="tech-skill-number">0</span>%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="skill-bar h-2 rounded-full transition-all duration-1000 ease-out"
                            data-level={skill.level}
                            style={{
                              background: `linear-gradient(to right, ${skill.color.includes('yellow') ? '#facc15' :
                                  skill.color.includes('cyan') ? '#22d3ee' :
                                    skill.color.includes('green') ? '#4ade80' :
                                      skill.color.includes('blue') ? '#60a5fa' :
                                        skill.color.includes('red') ? '#f87171' :
                                          skill.color.includes('orange') ? '#fb923c' :
                                            skill.color.includes('gray') ? '#9ca3af' :
                                              '#64FFDA'
                                }, ${skill.color.includes('yellow') ? '#eab308' :
                                  skill.color.includes('cyan') ? '#0891b2' :
                                    skill.color.includes('green') ? '#16a34a' :
                                      skill.color.includes('blue') ? '#2563eb' :
                                        skill.color.includes('red') ? '#dc2626' :
                                          skill.color.includes('orange') ? '#ea580c' :
                                            skill.color.includes('gray') ? '#6b7280' :
                                              '#42A5F5'
                                })`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Quote */}
        <div className="mt-16 text-center w-full">
          <blockquote className="text-xl md:text-2xl font-medium text-white italic w-full">
            &quot;Every skill I&apos;ve learned started with curiosity and was mastered through persistence.
            From coding on a phone to building complex systems - the journey never stops.&quot;
          </blockquote>
          <p className="text-tech-neon text-lg font-semibold !mt-2">
            — Continuous learning, continuous growth
          </p>
        </div>
      </div>
    </section>
  );
}
