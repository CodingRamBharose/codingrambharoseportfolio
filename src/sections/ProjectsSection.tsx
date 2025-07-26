'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Play, Code, Database, Globe } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState(0);

  const projects = [
    {
      id: 1,
      title: "Deepfake Detection System",
      category: "AI/ML Capstone Project",
      description: "Advanced machine learning system to detect deepfake videos using CNN and transfer learning. Achieved 94% accuracy on test dataset.",
      longDescription: "My capstone project that combines computer vision, deep learning, and web development. Built using TensorFlow, OpenCV, and deployed with Flask API.",
      technologies: ["Python", "TensorFlow", "OpenCV", "Flask", "React", "MongoDB"],
      features: [
        "Real-time video analysis",
        "94% detection accuracy",
        "Web-based interface",
        "Batch processing support",
        "Detailed analysis reports"
      ],
      status: "Completed",
      github: "#",
      demo: "#",
      image: "🤖",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "E-Commerce MERN App",
      category: "Full-Stack Development",
      description: "Complete e-commerce platform with user authentication, payment integration, and admin dashboard.",
      longDescription: "A comprehensive e-commerce solution built with MERN stack, featuring secure payments, inventory management, and responsive design.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT"],
      features: [
        "User authentication & authorization",
        "Shopping cart & wishlist",
        "Payment gateway integration",
        "Admin dashboard",
        "Order tracking system"
      ],
      status: "Completed",
      github: "#",
      demo: "#",
      image: "🛒",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Real-Time Chat Application",
      category: "WebSocket Development",
      description: "Real-time messaging app with rooms, file sharing, and online status indicators.",
      longDescription: "Built with Socket.io for real-time communication, featuring multiple chat rooms, file uploads, and user presence indicators.",
      technologies: ["React", "Node.js", "Socket.io", "Express", "MongoDB", "Cloudinary"],
      features: [
        "Real-time messaging",
        "Multiple chat rooms",
        "File & image sharing",
        "Online status indicators",
        "Message history"
      ],
      status: "Completed",
      github: "#",
      demo: "#",
      image: "💬",
      color: "from-green-500 to-teal-500"
    },
    {
      id: 4,
      title: "Task Management Dashboard",
      category: "Productivity App",
      description: "Kanban-style task management with drag-and-drop, deadlines, and team collaboration.",
      longDescription: "A productivity app inspired by Trello, featuring drag-and-drop functionality, deadline tracking, and team collaboration tools.",
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "Socket.io", "React DnD"],
      features: [
        "Drag & drop interface",
        "Team collaboration",
        "Deadline tracking",
        "Progress analytics",
        "Email notifications"
      ],
      status: "In Progress",
      github: "#",
      demo: "#",
      image: "📋",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      title: "Weather Forecast App",
      category: "API Integration",
      description: "Beautiful weather app with location-based forecasts, maps, and weather alerts.",
      longDescription: "A responsive weather application that provides detailed forecasts, interactive maps, and severe weather alerts using multiple APIs.",
      technologies: ["React", "OpenWeather API", "Mapbox", "Chart.js", "PWA"],
      features: [
        "Location-based forecasts",
        "Interactive weather maps",
        "7-day forecast",
        "Weather alerts",
        "Offline support (PWA)"
      ],
      status: "Completed",
      github: "#",
      demo: "#",
      image: "🌤️",
      color: "from-sky-500 to-blue-500"
    },
    {
      id: 6,
      title: "Portfolio Website",
      category: "Personal Branding",
      description: "This very portfolio you're viewing - a cinematic journey through my story.",
      longDescription: "A storytelling portfolio built with Next.js, featuring GSAP animations, 3D elements, and responsive design to showcase my journey.",
      technologies: ["Next.js", "TypeScript", "Tailwind", "GSAP", "Three.js", "Framer Motion"],
      features: [
        "Cinematic storytelling",
        "3D animations",
        "Smooth scroll effects",
        "Responsive design",
        "Performance optimized"
      ],
      status: "Completed",
      github: "#",
      demo: "#",
      image: "🎨",
      color: "from-tech-neon to-tech-cyan"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Projects grid animation
      gsap.fromTo(projectsRef.current?.children || [],
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getTechIcon = (tech: string) => {
    const icons: { [key: string]: string } = {
      'React': '⚛️',
      'Node.js': '🟢',
      'Python': '🐍',
      'MongoDB': '🍃',
      'Express': '🚀',
      'TensorFlow': '🧠',
      'Next.js': '▲',
      'TypeScript': '📘',
      'Tailwind': '🎨',
      'GSAP': '✨',
      'Three.js': '🎲',
      'Socket.io': '🔌',
      'PostgreSQL': '🐘',
      'JWT': '🔐',
      'Stripe': '💳',
      'OpenCV': '👁️',
      'Flask': '🌶️',
      'Cloudinary': '☁️',
      'OpenWeather API': '🌤️',
      'Framer Motion': '🎥',
      'shadcn/ui': '🧩',
      'MySQL': '🗃️',
      'Git': '📝',
      'VS Code': '💻',
      'Jenkins': '🔧',
      'AWS': '☁️',
      'AWS EC2': '📦',
      'Grafana': '📊',
      'Docker': '🐳'
    };
    return icons[tech] || '⚡';
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b from-[#192A52] to-[#0F2048] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-6xl text-white mb-8">
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 mx-auto">
            From AI-powered deepfake detection to full-stack web applications,
            here's what I've built with passion and precision.
          </p>
        </div>
      </div>
    </section>
  );
}
