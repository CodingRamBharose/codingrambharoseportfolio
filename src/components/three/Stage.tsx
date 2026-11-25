'use client';

import { ReactNode, RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerspectiveCamera, View } from '@react-three/drei';
import * as THREE from 'three';
import { pointer } from './pointer';
import { easeOutBack, smoothstep, viewProgress } from './utils';
import { trackWarmup } from '@/lib/reveal';

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
 * Compiles every shader in this view off the main thread (KHR_parallel_shader_compile)
 * before the view is first drawn. Without this, the first draw compiles synchronously,
 * which on Windows (ANGLE / Direct3D) can freeze the page for a second or more.
 * Placed last inside the View so its effect runs after the scene has been built.
 */
function Precompile({ onReady }: { onReady: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const get = useThree((s) => s.get);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onReady();
    };

    /**
     * ANGLE (Chrome on Windows) finishes a shader's Direct3D variant on its first real draw.
     * Draw the whole scene once into a single pixel while the loader still covers the page,
     * so the first time a visitor scrolls to it, it is already warm.
     */
    const warmDraw = () => {
      try {
        const hidden: THREE.Object3D[] = [];
        scene.traverse((o) => {
          if (!o.visible) {
            hidden.push(o);
            o.visible = true;
          }
        });
        const viewport = gl.getViewport(new THREE.Vector4());
        const scissor = gl.getScissor(new THREE.Vector4());
        const scissorTest = gl.getScissorTest();
        const autoClear = gl.autoClear;
        gl.autoClear = false;
        gl.setViewport(0, 0, 1, 1);
        gl.setScissor(0, 0, 1, 1);
        gl.setScissorTest(true);
        gl.render(scene, get().camera);
        gl.clear();
        gl.setViewport(viewport);
        gl.setScissor(scissor);
        gl.setScissorTest(scissorTest);
        gl.autoClear = autoClear;
        hidden.forEach((o) => (o.visible = false));
      } catch {
        // warming is only an optimisation
      }
      finish();
    };

    const safety = window.setTimeout(finish, 6000);
    trackWarmup(gl.compileAsync(scene, get().camera).then(warmDraw, warmDraw));
    return () => window.clearTimeout(safety);
  }, [gl, scene, get, onReady]);

  return null;
}

/**
 * Reserves a box in the page layout and renders its 3D scene into the shared canvas.
 * Children receive the tracked DOM element so they can react to scroll position.
 */
export default function Stage({ className = '', label, camera, lights = true, env = false, glow, style, children }: StageProps) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  return (
    <div role="img" aria-label={label} className={`stage-3d ${className}`} style={{ ...(glow ? ({ '--stage-glow': glow } as React.CSSProperties) : {}), ...style }}>
      <View ref={ref as React.Ref<HTMLElement>} className="absolute inset-0" visible={ready}>
        <StageCamera {...camera} />
        {lights && <StageLights />}
        {env && <StudioEnv />}
        {children(ref)}
        <Precompile onReady={markReady} />
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
