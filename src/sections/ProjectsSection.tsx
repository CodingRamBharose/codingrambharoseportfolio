'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image, { StaticImageData } from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
import TiltCard from '@/components/TiltCard';
import soilsocial from '../assets/projects/soilsocial.png';
import triloq from '../assets/projects/triloq.png';
import aiquizapp from '../assets/projects/aiquizapp.png';
import spotify from '../assets/projects/spotify.png';


gsap.registerPlugin(ScrollTrigger);

// ... (Interface and project data remains the same)

interface Project {
  isFeatured?: boolean;
  title: string;
  description: string;
  image: StaticImageData;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}

const featuredProject: Project = {
  "title": "Soil Social: A Collaborative Network for Farmers",
  "description": "An innovative digital platform designed to connect farmers, share knowledge, and foster collaboration. Features topic-based forums, real-time weather alerts, and a dedicated space to create groups and events, bridging the digital divide between agriculture and modern technology.",
  "image": soilsocial,
  "technologies": ["Next.js", "React", "TypeScript", "MongoDB", "Socket.io", "NextAuth.js", "Tailwind CSS", "Cloudinary"],
  "liveUrl": "#",
  "githubUrl": "https://github.com/CodingRamBharose/Soil-Social"
}

const scrollingProjects: Project[] = [
  {
    "title": "Spotify Clone - A MERN-Stack Spotify Clone",
    "description": "A feature-rich music streaming platform built from the ground up using the MERN stack. Users can browse albums, play songs, and enjoy a seamless listening experience with a modern UI crafted with Tailwind CSS. The application includes a dedicated admin panel, allowing administrators to manage the music library by uploading new songs and album art directly to Cloudinary via a custom backend API.",
    "image": spotify,
    "technologies": ["React", "Vite", "Node.js", "Express", "MongoDB", "Cloudinary", "Multer", "Tailwind CSS"],
    "liveUrl": "#",
    "githubUrl": "https://github.com/CodingRamBharose/spotify-clone"
  },
  {
    "title": "Triloq - A Modern Real-Time Chat Application",
    "description": "A full-stack, real-time chat application built on the MERN stack, enabling users to engage in seamless one-on-one and group conversations. It leverages Socket.io for instant messaging, with secure JWT and bcrypt authentication. The frontend features efficient global state management with Zustand and a sleek, responsive UI crafted with Tailwind CSS and Shadcn/ui. The application also supports file and image sharing.",
    "image": triloq,
    "technologies": ["React", "Node.js", "MongoDB", "Socket.io", "Zustand", "JWT", "Tailwind CSS", "Shadcn/ui"],
    "liveUrl": "#",
    "githubUrl": "https://github.com/CodingRamBharose/Triloq"
  },
  {
    "title": "AI Quiz Generator with Automated CI/CD & Cloud Monitoring",
    "description": "A full-stack, AI-powered quiz platform that generates custom tests from user prompts using the Google Gemini API. The project's core achievement is its robust end-to-end DevOps pipeline. The MERN stack application was containerized using Docker and deployed to AWS EC2 through a fully automated CI/CD workflow managed by Jenkins. Real-time system health and container performance are tracked on a custom monitoring dashboard built with Prometheus and Grafana.",
    "image": aiquizapp,
    "technologies": ["Docker", "Jenkins", "AWS EC2", "Prometheus", "Grafana", "Node.js", "Express", "MongoDB", "React", "Tailwind CSS"],
    "liveUrl": "#",
    "githubUrl": "https://github.com/CodingRamBharose/QuizApp"
  }
];


export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run the split/pin animation on desktop (768px+)
    if (window.innerWidth < 768) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        if (!sectionRef.current || !containerRef.current || !featuredRef.current || !scrollingRef.current) return;

        gsap.set(featuredRef.current, { width: '100%' });
        gsap.set(scrollingRef.current, { width: '100%', x: '100%' });

        const layoutTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 0%',
            end: 'top top',
            scrub: 1,
          },
        });

        layoutTl
          .to(featuredRef.current, { width: '50%', ease: 'none' })
          .to(scrollingRef.current, { width: '50%', x: '0%', ease: 'none' }, '<');

        const scrollDistance = scrollingRef.current.offsetHeight - featuredRef.current.offsetHeight;

        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: containerRef.current,
            start: 'top top',
            end: `+=${scrollDistance}`,
            pinSpacing: true,
            pinReparent: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        pinTl.to(scrollingRef.current, {
          y: -scrollDistance,
          ease: 'none',
        });

      }, sectionRef);

      return () => {
        ctx.revert();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // All projects combined for mobile view
  const allProjects = [featuredProject, ...scrollingProjects];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative flex flex-col gap-5 section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048]"
    >
      <div className='w-full flex flex-col gap-6'>
        <h2 className="font-poppins font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-base sm:text-lg w-full text-gray-300">
          Innovative solutions built with cutting-edge technologies
        </p>
      </div>

      {/* ===== MOBILE: Simple stacked cards (visible < md) ===== */}
      <div className="flex flex-col gap-6 md:hidden mt-4">
        {allProjects.map((project, index) => (
          <TiltCard
            key={index}
            className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-tech-neon/50 transition-all duration-300 backdrop-blur-sm w-full group"
          >
            <div className="relative h-48 sm:h-56 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 text-[11px] bg-white/5 rounded-md text-gray-400 border border-white/10">
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-tech-neon transition-colors w-fit"
            >
              <Github className="w-4 h-4" /> View Code
            </a>
          </TiltCard>
        ))}
      </div>

      {/* ===== DESKTOP: Split pin-scroll layout (visible md+) ===== */}
      <div
        ref={containerRef}
        className="h-screen w-full hidden md:flex flex-row overflow-hidden mt-4"
      >
        {/* Left Featured Project */}
        <div ref={featuredRef} className="h-full w-1/2 flex-shrink-0 flex flex-col items-center justify-center p-8 relative">
          <TiltCard className="bg-white/5 rounded-2xl flex flex-col gap-1 !px-4 !py-2 border border-white/10 max-w-4xl w-full backdrop-blur-sm mt-24 hover:border-tech-neon/40 transition-colors duration-300">
            <div className="relative h-60 md:h-96 mb-6 rounded-lg overflow-hidden min-w-[300px]">
              <Image
                src={featuredProject.image}
                alt={featuredProject.title}
                className="object-contain w-full h-full"
                fill
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            <h3 className="text-xl font-bold text-white">{featuredProject.title}</h3>
            <p className="text-gray-300 mb-6 text-md leading-snug">{featuredProject.description}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {featuredProject.technologies.map((tech) => (
                <span key={tech} className="px-4 py-2 text-[12px]">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <a href={featuredProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 text-sm py-3 text-white rounded-lg transition-all duration-300 font-semibold">
                <Github className="w-3 h-3" /> View Code
              </a>
            </div>
          </TiltCard>
        </div>

        {/* Right Scrolling Projects */}
        <div
          ref={scrollingRef}
          className="w-1/2 flex-shrink-0 relative"
          style={{ height: `${scrollingProjects.length * 100}vh` }}
        >
          {scrollingProjects.map((project, index) => (
            <div key={index} className="h-screen flex items-center justify-center p-8">
              <TiltCard className="bg-white/5 rounded-xl !p-2 border flex gap-2 flex-col border-white/10 hover:border-tech-neon/50 transition-all duration-300 backdrop-blur-sm max-w-lg w-full group">
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <h4 className="text-sm font-bold text-white mb-4">{project.title}</h4>
                <p className="text-gray-300 mb-6 leading-tight text-[12px]">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 text-[12px]">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a href={project.githubUrl} className="flex items-center gap-2 px-4 py-2 text-gray-300 transition-all duration-300">
                    <Github className="w-4 h-4" /> Code
                  </a>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}