'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TRAIL_COUNT = 6;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const trails = trailRefs.current;

    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Animate trail dots with increasing delay
      trails.forEach((trail, i) => {
        if (!trail) return;
        gsap.to(trail, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3 + i * 0.08,
          ease: 'power2.out',
        });
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'power2.out' });
      gsap.to(follower, { scale: 1.8, opacity: 0.8, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', moveCursor);
    
    const interactiveElements = document.querySelectorAll('button, a, .cursor-hover, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-50 hidden lg:block"
          style={{
            transform: 'translate(-50%, -50%)',
            background: '#64FFDA',
            opacity: 0.4 - i * 0.06,
          }}
        />
      ))}

      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed w-2.5 h-2.5 bg-tech-neon rounded-full pointer-events-none z-50 mix-blend-difference hidden lg:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Follower circle */}
      <div
        ref={followerRef}
        className="fixed w-10 h-10 border-2 border-tech-neon/40 rounded-full pointer-events-none z-50 hidden lg:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
