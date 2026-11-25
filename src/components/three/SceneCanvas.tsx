'use client';

import { useEffect } from 'react';
import { Canvas, advance, useThree } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { gsap } from 'gsap';
import { trackPointer } from './pointer';

/**
 * Render on GSAP's ticker (right after Lenis moves the page) so the 3D views
 * never lag a frame behind the DOM slots they are drawn into.
 */
function TickerDriver() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const tick = (time: number) => advance(time, true, get());
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [get]);
  return null;
}

/**
 * One fixed, transparent, click-through WebGL canvas for the whole page.
 * Each <Stage> on the page tunnels its 3D scene into this canvas via drei's <View>.
 */
export default function SceneCanvas() {
  useEffect(() => trackPointer(), []);

  return (
    <Canvas
      frameloop="never"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
      aria-hidden
    >
      <TickerDriver />
      <View.Port />
    </Canvas>
  );
}
