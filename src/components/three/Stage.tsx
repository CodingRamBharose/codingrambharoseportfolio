'use client';

import { ReactNode, RefObject, useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, PerspectiveCamera, View } from '@react-three/drei';
import * as THREE from 'three';
import { pointer } from './pointer';
import { easeOutBack, smoothstep, viewProgress } from './utils';

export type Track = RefObject<HTMLElement | null>;
type Vec3 = [number, number, number];

interface StageProps {
  className?: string;
  /** Accessible description of what the 3D scene shows */
  label: string;
  camera?: { position?: Vec3; fov?: number; target?: Vec3 };
  lights?: boolean;
  /** Reflection environment for metals and glass */
  env?: boolean;
  glow?: string;
  style?: React.CSSProperties;
  children: (track: Track) => ReactNode;
}

function StageCamera({ position = [0, 0, 7], fov = 38, target = [0, 0, 0] }: NonNullable<StageProps['camera']>) {
  const cam = useRef<THREE.PerspectiveCamera>(null);
  useLayoutEffect(() => {
    cam.current?.lookAt(target[0], target[1], target[2]);
  }, [target]);
  return <PerspectiveCamera ref={cam} makeDefault position={position} fov={fov} near={0.1} far={400} />;
}

export function StageLights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#cfe8ff', '#1b1033', 0.9]} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff4e0" />
      <pointLight position={[-5, 1, 3]} intensity={30} distance={25} color="#64FFDA" />
      <pointLight position={[5, -2, -3]} intensity={18} distance={25} color="#42A5F5" />
    </>
  );
}

/** Soft studio reflections without downloading an HDR file. */
export function StudioEnv() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[10, 3, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2} position={[-5, 1, 3]} scale={[3, 6, 1]} color="#64FFDA" />
      <Lightformer form="rect" intensity={2} position={[5, 1, 3]} scale={[3, 6, 1]} color="#FFD27A" />
      <Lightformer form="ring" intensity={1.5} position={[0, -4, 2]} scale={4} color="#42A5F5" />
    </Environment>
  );
}

/**
 * Reserves a box in the page layout and renders its 3D scene into the shared canvas.
 * Children receive the tracked DOM element so they can react to scroll position.
 */
export default function Stage({ className = '', label, camera, lights = true, env = false, glow, style, children }: StageProps) {
  const ref = useRef<HTMLElement>(null);

  return (
    <div role="img" aria-label={label} className={`stage-3d ${className}`} style={{ ...(glow ? ({ '--stage-glow': glow } as React.CSSProperties) : {}), ...style }}>
      <View ref={ref as React.Ref<HTMLElement>} className="absolute inset-0">
        <StageCamera {...camera} />
        {lights && <StageLights />}
        {env && <StudioEnv />}
        {children(ref)}
      </View>
    </div>
  );
}

/** Pops a model in (scale + spin) as its stage scrolls into view. */
export function Reveal({ track, children, spin = 1.2, from = 0.02, to = 0.28 }: { track: Track; children: ReactNode; spin?: number; from?: number; to?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const e = smoothstep(from, to, viewProgress(track.current));
    const s = Math.max(0.0001, easeOutBack(e));
    g.scale.setScalar(s);
    g.rotation.y = (1 - e) * -spin;
    g.visible = e > 0.001;
  });
  return <group ref={group}>{children}</group>;
}

/** Leans the model gently toward the mouse. */
export function Tilt({ children, strength = 0.25, base = [0, 0, 0] }: { children: ReactNode; strength?: number; base?: Vec3 }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, base[0] - pointer.y * strength * 0.6, 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, base[1] + pointer.x * strength, 3, dt);
    g.rotation.z = base[2];
  });
  return <group ref={group}>{children}</group>;
}
