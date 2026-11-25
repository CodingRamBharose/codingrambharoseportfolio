'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Stage, { Tilt, Track } from '../Stage';
import { easeOutBack, makeCanvasTexture, seeded, smoothstep, viewProgress } from '../utils';

const GOLD = '#FFC93C';

function Cup() {
  const profile = useMemo(
    () =>
      [
        [0.0, 0.0], [0.3, 0.0], [0.3, 0.06], [0.12, 0.12], [0.07, 0.3], [0.07, 0.42], [0.13, 0.48], [0.08, 0.54],
        [0.12, 0.6], [0.38, 0.72], [0.5, 0.95], [0.56, 1.25], [0.6, 1.42], [0.62, 1.47], [0.58, 1.47], [0.53, 1.25],
        [0.46, 0.98], [0.3, 0.8], [0.0, 0.74],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );

  return (
    <group>
      <mesh>
        <latheGeometry args={[profile, 64]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.55, 1.08, 0]} rotation={[0, 0, (s * -Math.PI) / 2]}>
          <torusGeometry args={[0.24, 0.045, 12, 32, Math.PI]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
        </mesh>
      ))}
      {/* star on top */}
      <mesh position={[0, 1.95, 0]} rotation={[0, 0, Math.PI / 10]}>
        <extrudeGeometry
          args={[
            (() => {
              const s = new THREE.Shape();
              for (let i = 0; i < 10; i++) {
                const r = i % 2 === 0 ? 0.22 : 0.09;
                const a = (i / 10) * Math.PI * 2;
                if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
                else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
              }
              s.closePath();
              return s;
            })(),
            { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 },
          ]}
        />
        <meshStandardMaterial color="#FFE082" emissive="#FFB300" emissiveIntensity={0.6} metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Medal({ label, sub, color, ribbon, radius, height, speed, offset }: { label: string; sub: string; color: string; ribbon: string; radius: number; height: number; speed: number; offset: number }) {
  const ref = useRef<THREE.Group>(null);
  const face = useMemo(
    () =>
      makeCanvasTexture(256, 256, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.15, color);
        g.addColorStop(1, '#5c4300');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w / 2 - 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#0A192F';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 92px Poppins, sans-serif';
        ctx.fillText(label, w / 2, h / 2 - 12);
        ctx.font = '700 30px Poppins, sans-serif';
        ctx.fillText(sub, w / 2, h / 2 + 62);
      }).texture,
    [label, sub, color],
  );

  useFrame(({ clock, camera }) => {
    const g = ref.current;
    if (!g) return;
    const a = clock.elapsedTime * speed + offset;
    g.position.set(Math.cos(a) * radius, height + Math.sin(a * 2) * 0.12, Math.sin(a) * radius * 0.7);
    g.lookAt(camera.position);
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.5, -0.02]}>
        <planeGeometry args={[0.22, 0.55]} />
        <meshStandardMaterial color={ribbon} side={THREE.DoubleSide} roughness={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.05, 40]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.028]}>
        <circleGeometry args={[0.32, 40]} />
        <meshBasicMaterial map={face} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Confetti({ track }: { track: Track }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const COUNT = 90;
  const bits = useMemo(() => {
    const rand = seeded(5);
    return Array.from({ length: COUNT }, () => ({
      x: (rand() - 0.5) * 6,
      z: (rand() - 0.5) * 3,
      y: rand() * 6,
      speed: 0.5 + rand() * 0.8,
      spin: rand() * 6,
      phase: rand() * 10,
    }));
  }, []);
  const colors = useMemo(() => {
    const palette = ['#FFD700', '#64FFDA', '#42A5F5', '#FF6B6B', '#F9D342', '#ffffff'].map((c) => new THREE.Color(c));
    return bits.map((_, i) => palette[i % palette.length]);
  }, [bits]);

  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const on = smoothstep(0.3, 0.45, viewProgress(track.current));
    bits.forEach((b, i) => {
      const y = 3.2 - ((b.y + t * b.speed) % 6);
      dummy.position.set(b.x + Math.sin(t + b.phase) * 0.3, y, b.z);
      dummy.rotation.set(t * b.spin, t * b.spin * 0.7, b.phase);
      dummy.scale.setScalar(on);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    colors.forEach((c, i) => m.setColorAt(i, c));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [colors]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <planeGeometry args={[0.08, 0.14]} />
      <meshStandardMaterial side={THREE.DoubleSide} roughness={0.5} metalness={0.3} />
    </instancedMesh>
  );
}

function Trophy({ track }: { track: Track }) {
  const rise = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const e = smoothstep(0.05, 0.35, viewProgress(track.current));
    if (rise.current) {
      rise.current.position.y = -1.4 * (1 - e);
      rise.current.scale.setScalar(Math.max(0.0001, easeOutBack(e)));
    }
    if (spin.current) spin.current.rotation.y += dt * 0.5;
  });

  return (
    <group>
      {/* pedestal */}
      <mesh position={[0, -1.55, 0]}>
        <cylinderGeometry args={[1.05, 1.2, 0.6, 6]} />
        <meshStandardMaterial color="#0F2048" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, -1.24, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[1.06, 0.035, 8, 6]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} />
      </mesh>
      <group ref={rise}>
        <group ref={spin} position={[0, -1.25, 0]}>
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[0.85, 0.18, 0.85]} />
            <meshStandardMaterial color="#3B2A1A" roughness={0.6} />
          </mesh>
          <group position={[0, 0.18, 0]}>
            <Cup />
          </group>
        </group>
      </group>
    </group>
  );
}

export default function TrophyPodium({ className }: { className?: string }) {
  return (
    <Stage
      className={className}
      label="A spinning 3D gold trophy with orbiting medals for 2nd position in BCA and 3rd overall in MCA"
      camera={{ position: [0, 0.4, 7.4], fov: 38, target: [0, -0.1, 0] }}
      env
      glow="rgba(255, 215, 0, 0.22)"
    >
      {(track) => (
        <>
          <pointLight position={[0, 4, 2]} intensity={40} distance={12} color="#FFE7A3" />
          <Tilt strength={0.25}>
            <Trophy track={track} />
            <Medal label="#2" sub="BCA" color="#FFD700" ribbon="#1976D2" radius={1.7} height={0.5} speed={0.45} offset={0} />
            <Medal label="#3" sub="MCA" color="#CFD8DC" ribbon="#00BCD4" radius={1.7} height={0.1} speed={0.45} offset={Math.PI} />
          </Tilt>
          <Confetti track={track} />
          <Sparkles count={40} scale={[4, 4, 3]} size={3} speed={0.4} color="#FFD700" />
        </>
      )}
    </Stage>
  );
}
