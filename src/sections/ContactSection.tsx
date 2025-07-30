'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Linkedin, Github, Send, Download } from 'lucide-react';
import emailjs from '@emailjs/browser';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Contact info animation
      gsap.fromTo(contactInfoRef.current?.children || [],
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
            trigger: contactInfoRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Form animation
      gsap.fromTo(formRef.current,
        {
          x: 100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        name: formData.name,       
        email: formData.email,     
        title: formData.subject,   
        message: formData.message,
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert('Thank you for your message! I\'ll get back to you soon.');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="min-h-screen section-padding bg-gradient-to-b to-[#192A52] from-[#0F2048] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className='w-full flex flex-col gap-6'>
          <h2 className="font-poppins font-bold text-4xl md:text-6xl text-white mb-8">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-xl text-gray-300 mx-auto">
            Thank you for walking through my journey. Whether you want to collaborate on a project,
            discuss opportunities, or just say hello - I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Information */}
          <div ref={contactInfoRef} className="space-y-8 flex flex-col gap-4">
            <div className='flex flex-col gap-2'>
              <h3 className="font-poppins font-semibold text-2xl text-white mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                I&apos;m always open to discussing new opportunities, interesting projects,
                or just having a conversation about technology and innovation.
                Feel free to reach out through any of the channels below.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="!space-y-3">
              <div className="flex items-center space-x-4 bg-white/5 rounded-lg !p-2 border border-white/10 hover:border-tech-neon/50 transition-colors">
                <div className="w-12 h-12 bg-tech-neon/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-tech-neon" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <p className="text-gray-300">ramavtar.crb@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/5 rounded-lg !p-2 border border-white/10 hover:border-aviation-gold/50 transition-colors">
                <div className="w-12 h-12 bg-aviation-gold/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-aviation-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Location</h4>
                  <p className="text-gray-300">Punjab, India</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 !mt-4">Connect on Social</h4>
              <div className="flex items-center gap-2 md:gap-4 mb-8 justify-center lg:justify-start !mt-2">
                <a href="https://www.linkedin.com/in/codingrambharose" target="_blank" className='p-3 h-10 w-10 flex items-center justify-center rounded-full bg-trasparent hover:bg-white/10 transition-colors duration-300'>
                  <Linkedin className="w-6 h-6 text-blue-300" />
                </a>

                <a href="https://github.com/CodingRamBharose" target="_blank" className="p-3 h-10 w-10 flex items-center justify-center rounded-full bg-trasparent hover:bg-white/10 transition-colors duration-300">
                  <Github className="w-6 h-6 text-gray-200" />
                </a>

                <a href="mailto:codingrambharose@gmail.com" target="_blank" className="p-3 h-10 w-10 flex items-center justify-center rounded-full bg-trasparent hover:bg-white/10 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-red-300" />
                </a>

                {/* Resume Button with Icon */}
                <a
                  href="/Ram_Avtar.pdf"
                  target="_blank"
                  className="flex h-10 w-28 justify-center items-center gap-2 rounded-full bg-transparent hover:bg-white/10 text-gray-200 font-semibold px-4 py-3 transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="bg-white/5 rounded-lg !p-2 border border-white/10 backdrop-blur-sm">
              <h3 className="font-poppins font-semibold text-2xl text-white !mb-2">
                Send a Message
              </h3>

              <div className="!space-y-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full !px-4 !py-2 !mt-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-tech-neon transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full !px-4 !py-2 !mt-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-tech-neon transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full !px-4 !py-2 !mt-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-tech-neon transition-colors"
                    placeholder="Project Collaboration"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full !px-4 !py-2 !mt-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-tech-neon transition-colors resize-none"
                    placeholder="Tell me about your project or just say hello..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-tech-neon text-tech-midnight px-6 py-3 rounded-lg font-semibold hover:bg-tech-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-tech-midnight border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <div className='flex items-center justify-center gap-2 bg-amber-400 w-full !px-4 !py-2 rounded-md text-[#192A52] cursor-pointer'>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Final Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-xl md:text-2xl font-medium text-white italic">
            &quot;This is my story — a story of roots, code, and resilience.
            Let&apos;s build something meaningful together.&quot;
          </blockquote>
          <p className="text-tech-neon !mt-2 text-lg font-semibold">
            — Ready for the next chapter
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 !p-2">
           © 2025 Ram Avtar. Designed & coded with 💛 and lots of ☕
          </p>
        </div>
      </div>
    </section>
  );
}



