'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Linkedin, Github, Send, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ChapterHeader from '@/components/ChapterHeader';
import LeetCodeIcon from '@/components/LeetCodeIcon';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

const inputClass =
  'w-full px-4 py-3 mt-1.5 bg-white/[0.06] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-neon focus:bg-white/[0.09] focus:shadow-[0_0_0_4px_rgba(100,255,218,0.08)] transition-all';

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contactInfoRef.current?.children || [],
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: contactInfoRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        formRef.current,
        { y: 60, opacity: 0, rotateX: 8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name: formData.name, email: formData.email, title: formData.subject, message: formData.message },
        EMAILJS_PUBLIC_KEY,
      );
      if (response.status === 200) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('sent');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { href: 'https://www.linkedin.com/in/codingrambharose', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5 text-blue-300" /> },
    { href: 'https://github.com/CodingRamBharose', label: 'GitHub', icon: <Github className="w-5 h-5 text-gray-200" /> },
    { href: 'https://leetcode.com/u/CodingRamBharose/', label: 'LeetCode', icon: <LeetCodeIcon className="w-5 h-5" /> },
    { href: 'mailto:codingrambharose@gmail.com', label: 'Email', icon: <Mail className="w-5 h-5 text-red-300" /> },
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-screen section-padding bg-gradient-to-b from-[#192A52] via-[#0F2048] to-[#070d1f] flex items-center overflow-hidden">
      {/* sunrise glow: the story ends at dawn */}
      <div className="absolute left-1/2 -bottom-1/3 -translate-x-1/2 w-[70rem] h-[40rem] rounded-full bg-gradient-to-t from-orange-500/25 via-amber-400/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl w-full mx-auto flex flex-col gap-12 lg:gap-16">
        <ChapterHeader
          number="10"
          label="The Next Chapter"
          title="Let's Connect"
          from="#ffffff"
          to="#64FFDA"
          accent="#64FFDA"
          leadClassName="text-gray-300"
          lead="Thank you for walking through my journey. Whether you want to collaborate on a project, discuss opportunities, or just say hello - I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12" style={{ perspective: '1200px' }}>
          {/* Contact Information */}
          <div ref={contactInfoRef} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-poppins font-semibold text-2xl text-white">Get in Touch</h3>
              <p className="text-gray-300 leading-relaxed">
                I&apos;m always open to discussing new opportunities, interesting projects, or just having a conversation about technology and innovation. Feel free to reach out
                through any of the channels below.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a href="mailto:ramavtar.crb@gmail.com" className="flex items-center gap-4 glass-card p-4 hover:-translate-y-0.5">
                <div className="w-12 h-12 bg-tech-neon/15 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-tech-neon" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <p className="text-gray-300 text-sm sm:text-base">ramavtar.crb@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-4 glass-card p-4">
                <div className="w-12 h-12 bg-aviation-gold/15 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-aviation-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Location</h4>
                  <p className="text-gray-300 text-sm sm:text-base">Punjab, India</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white">Connect on Social</h4>
              <div className="flex items-center gap-3 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="h-11 w-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:-translate-y-1 hover:border-tech-neon/40"
                  >
                    {s.icon}
                  </a>
                ))}
                <a
                  href="/RamAvtar.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center gap-2 rounded-full px-6 bg-tech-neon/10 border border-tech-neon/30 hover:bg-tech-neon/20 text-tech-neon font-semibold hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="font-poppins font-semibold text-2xl text-white">Send a Message</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-300">
                Your Name
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={inputClass} placeholder="John Doe" />
              </label>
              <label className="block text-sm font-medium text-gray-300">
                Email Address
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClass} placeholder="john@example.com" />
              </label>
            </div>
            <label className="block text-sm font-medium text-gray-300">
              Subject
              <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className={inputClass} placeholder="Project Collaboration" />
            </label>
            <label className="block text-sm font-medium text-gray-300">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Tell me about your project or just say hello..."
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full overflow-hidden flex items-center justify-center gap-2 bg-amber-400 text-[#192A52] px-6 py-3.5 rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(251,191,36,0.45)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#192A52] border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
              )}
            </button>

            {status === 'sent' && (
              <p role="status" className="flex items-center gap-2 text-sm text-tech-neon animate-rise">
                <CheckCircle2 className="w-4 h-4" /> Thank you for your message! I&apos;ll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="flex items-center gap-2 text-sm text-red-300 animate-rise">
                <AlertCircle className="w-4 h-4" /> Failed to send message. Please try again later.
              </p>
            )}
          </form>
        </div>

        {/* Final Quote */}
        <div className="text-center max-w-4xl mx-auto">
          <blockquote className="text-xl md:text-3xl font-medium text-white italic leading-snug">
            &quot;This is my story — a story of roots, code, and resilience. Let&apos;s build something meaningful together.&quot;
          </blockquote>
          <p className="text-tech-neon mt-4 text-lg font-semibold">— Ready for the next chapter</p>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Ram Avtar. Designed & coded with 💛 and lots of ☕</p>
        </footer>
      </div>
    </section>
  );
}
