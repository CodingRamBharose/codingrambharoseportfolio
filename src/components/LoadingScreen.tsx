'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Handle progress simulation and animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);

          setTimeout(() => {
            const tl = gsap.timeline({
              onComplete: () => {
                setIsLoading(false);
                document.body.style.overflow = 'auto';
                onLoadingComplete?.();
              },
            });

            tl.to('.loading-screen', {
              y: '-100%',
              duration: 1.2,
              ease: 'power2.inOut',
            });
          }, 1000); // Pause briefly at 100%

          return 100;
        }
        return Math.min(prev + Math.random() * 10, 100);
      });
    }, 150);

    // Disable scrolling during loading
    document.body.style.overflow = 'hidden';

    // Animate emoji float
    gsap.fromTo(
      '.emoji',
      { y: 0 },
      {
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: 1.2,
      }
    );

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
    };
  }, [onLoadingComplete]);

  const getLoadingMessage = () => {
    if (progress < 20) return '🌾 Preparing the village fields...';
    if (progress < 40) return '📚 Loading the learning journey...';
    if (progress < 60) return '💻 Setting up coding animations...';
    if (progress < 80) return '✈️ Preparing aviation experience...';
    if (progress < 100) return '🌅 Almost ready for sunrise...';
    if (isComplete) {
      return (
        <span className="text-tech-neon font-semibold animate-pulse">
          🎉 Welcome to my story!
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className="loading-screen fixed inset-0 bg-tech-midnight z-50 flex items-center justify-center"
      role="alert"
      aria-label="Loading screen"
    >
      <div className="text-center flex items-center justify-center flex-col gap-5">
        <div className="mb-8">
          <div className="text-6xl mb-4 emoji drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            🌾
          </div>
          <h1 className="font-poppins font-bold text-3xl text-white mb-2">
            From Fields to <span className="gradient-text">Frameworks</span>
          </h1>
          <p className="text-gray-400">Loading my journey...</p>
        </div>

        <div className="w-80 mx-auto" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-tech-neon !mt-2 font-semibold">{Math.round(progress)}%</p>
        </div>

        {/* Loading Messages */}
        <div className="mt-8 text-gray-400 text-sm transition-all duration-500">
          {getLoadingMessage()}
        </div>
      </div>
    </div>
  );
}
 