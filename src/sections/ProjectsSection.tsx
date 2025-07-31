'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const featuredProject = {
  title: "AI Deepfake Detection System",
  description: "Advanced machine learning system that detects deepfake videos using CNN and RNN architectures. Built with Python, TensorFlow, and React for real-time analysis.",
  image: "/assets/featured-project.jpg",
  technologies: ["Python", "TensorFlow", "React", "Node.js", "MongoDB"],
  liveUrl: "https://your-project.com",
  githubUrl: "https://github.com/your-username/project"
};

const scrollingProjects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack MERN application with payment integration",
    image: "/assets/project1.jpg",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Weather App",
    description: "Real-time weather application with location services",
    image: "/assets/project2.jpg",
    technologies: ["React", "API Integration"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Task Manager",
    description: "Productivity app with drag-and-drop functionality",
    image: "/assets/project3.jpg",
    technologies: ["React", "Firebase"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Portfolio Website",
    description: "Responsive portfolio with smooth animations",
    image: "/assets/project4.jpg",
    technologies: ["Next.js", "GSAP"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Chat Application",
    description: "Real-time messaging app with Socket.io",
    image: "/assets/project5.jpg",
    technologies: ["React", "Socket.io", "Express"],
    liveUrl: "#",
    githubUrl: "#"
  }
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const rightPanel = rightRef.current;
      const content = contentRef.current;

      if (!container || !rightPanel || !content) return;

      // Measure content height
      const contentHeight = content.scrollHeight;
      const containerHeight = container.offsetHeight;

      // Pin the section and animate inner scroll on right panel
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${contentHeight - containerHeight}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const scrollY = self.progress * (contentHeight - containerHeight);
          gsap.to(rightPanel, {
            y: -scrollY,
            duration: 0.1,
            ease: 'none',
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
        className="relative w-full bg-gradient-to-b from-[#192A52] to-[#0F2048] text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl md:text-6xl mb-8">
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From AI-powered deepfake detection to full-stack web applications,
            here's what I've built with passion and precision.
          </p>
        </div>

        {/* Sticky + Scroll Container */}
        <div
          ref={containerRef}
          className="relative flex flex-col lg:flex-row gap-10 min-h-[600px] lg:min-h-[700px]"
        >
          {/* Left: Static Featured */}
          <div ref={leftRef} className="lg:w-1/2 w-full">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 h-full flex flex-col sticky top-32">
              <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                {featuredProject.title}
              </h3>

              <p className="text-gray-300 mb-6 flex-grow">
                {featuredProject.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {featuredProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-tech-neon/20 text-tech-neon rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href={featuredProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-tech-neon text-tech-midnight rounded-lg hover:bg-tech-cyan transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
                <a
                  href={featuredProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Code
                </a>
              </div>
            </div>
          </div>

          {/* Right: Scrollable List */}
          <div className="lg:w-1/2 w-full overflow-hidden relative">
            <div ref={rightRef} className="absolute top-0 left-0 w-full will-change-transform">
              <div ref={contentRef} className="space-y-6 pb-12">
                {scrollingProjects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-tech-neon/50 transition-all duration-300"
                  >
                    <div className="relative h-32 mb-4 rounded overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-2">
                      {project.title}
                    </h4>

                    <p className="text-gray-400 text-sm mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-tech-neon/10 text-tech-neon rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={project.liveUrl}
                        className="flex items-center gap-1 text-tech-neon hover:text-tech-cyan transition-colors text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </a>
                      <a
                        href={project.githubUrl}
                        className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        <Github className="w-3 h-3" />
                        Code
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
