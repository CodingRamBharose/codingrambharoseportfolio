'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Stage, { Reveal, Tilt, Track } from '../Stage';
import { makeGlowTexture, seeded, smoothstep, viewProgress } from '../utils';

const SOIL = '#5D3A00';
const GRASS = '#7CB342';
const WHEAT = '#F9D342';

function Wheat() {
  const stems = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const stalks = useMemo(() => {
    const rand = seeded(7);
    const out: { x: number; z: number; h: number; phase: number }[] = [];
    for (let x = -1.4; x <= 0.3; x += 0.16) {
      for (let z = -1.15; z <= 1.15; z += 0.15) {
        out.push({ x: x + (rand() - 0.5) * 0.05, z: z + (rand() - 0.5) * 0.05, h: 0.3 + rand() * 0.16, phase: rand() * Math.PI * 2 });
      }
    }
    return out;
  }, []);

  useFrame(({ clock }) => {
    if (!stems.current || !heads.current) return;
    const t = clock.elapsedTime;
    stalks.forEach((s, i) => {
      const sway = Math.sin(t * 1.7 + s.phase * 0.4 + s.x * 2.2) * 0.16;
      dummy.rotation.set(0, 0, -sway);
      dummy.position.set(s.x + Math.sin(sway) * s.h * 0.5, 0.2 + Math.cos(sway) * s.h * 0.5, s.z);
      dummy.scale.set(1, s.h / 0.4, 1);
      dummy.updateMatrix();
      stems.current!.setMatrixAt(i, dummy.matrix);

      dummy.position.set(s.x + Math.sin(sway) * (s.h + 0.07), 0.2 + Math.cos(sway) * (s.h + 0.07), s.z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      heads.current!.setMatrixAt(i, dummy.matrix);
    });
    stems.current.instanceMatrix.needsUpdate = true;
    heads.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={stems} args={[undefined, undefined, stalks.length]}>
        <cylinderGeometry args={[0.008, 0.012, 0.4, 4]} />
        <meshStandardMaterial color="#C9A227" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, stalks.length]}>
        <capsuleGeometry args={[0.032, 0.12, 2, 6]} />
        <meshStandardMaterial color={WHEAT} roughness={0.6} emissive="#8a6a00" emissiveIntensity={0.25} flatShading />
      </instancedMesh>
    </group>
  );
}

function House() {
  return (
    <group position={[1.15, 0.2, -0.75]} rotation={[0, -0.5, 0]}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.6, 0.44, 0.5]} />
        <meshStandardMaterial color="#F5E6C8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.5, 0.36, 4]} />
        <meshStandardMaterial color="#B23A2B" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0.05, 0.13, 0.252]}>
        <planeGeometry args={[0.13, 0.24]} />
        <meshStandardMaterial color="#5D3A00" />
      </mesh>
      <mesh position={[-0.17, 0.27, 0.252]}>
        <planeGeometry args={[0.12, 0.1]} />
        <meshBasicMaterial color="#FFD27A" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.07, 0.4, 6]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#558B2F" flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.78, 0.05]}>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#689F38" flatShading roughness={0.8} />
      </mesh>
    </group>
  );
}

function Tractor() {
  const wheels = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (body.current) body.current.position.y = 0.2 + Math.abs(Math.sin(t * 6)) * 0.008;
    wheels.current?.children.forEach((w) => (w.rotation.y = t * 1.5));
  });
  const wheel = (x: number, z: number, r: number) => (
    <group position={[x, r, z]} rotation={[Math.PI / 2, 0, 0]} key={`${x}${z}`}>
      <mesh>
        <cylinderGeometry args={[r, r, 0.07, 14]} />
        <meshStandardMaterial color="#212121" roughness={0.9} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r * 0.5, r * 0.5, 0.075, 10]} />
        <meshStandardMaterial color="#F9D342" />
      </mesh>
    </group>
  );
  return (
    <group ref={body} position={[0.85, 0.2, 0.85]} rotation={[0, -0.7, 0]}>
      <mesh position={[0.06, 0.2, 0]}>
        <boxGeometry args={[0.46, 0.16, 0.24]} />
        <meshStandardMaterial color="#D84315" roughness={0.5} />
      </mesh>
      <mesh position={[-0.11, 0.38, 0]}>
        <boxGeometry args={[0.2, 0.22, 0.24]} />
        <meshStandardMaterial color="#BF360C" roughness={0.5} />
      </mesh>
      <mesh position={[-0.11, 0.42, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.245]} />
        <meshStandardMaterial color="#90CAF9" roughness={0.1} metalness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.36, 0.06]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      <group ref={wheels}>
        {wheel(-0.12, 0.15, 0.15)}
        {wheel(-0.12, -0.15, 0.15)}
        {wheel(0.2, 0.14, 0.08)}
        {wheel(0.2, -0.14, 0.08)}
      </group>
    </group>
  );
}

function Cloud({ position, speed, scale = 1 }: { position: [number, number, number]; speed: number; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.position.x += dt * speed;
    if (ref.current.position.x > 4) ref.current.position.x = -4;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {[[0, 0, 0, 0.35], [0.35, -0.05, 0, 0.26], [-0.33, -0.06, 0, 0.24], [0.1, 0.15, 0, 0.25]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color="#ffffff" flatShading roughness={1} transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Sun({ track }: { track: Track }) {
  const group = useRef<THREE.Group>(null);
  const glow = useMemo(() => makeGlowTexture('#FFB347'), []);
  useFrame(() => {
    if (!group.current) return;
    const p = smoothstep(0.1, 0.6, viewProgress(track.current));
    group.current.position.y = -0.7 + p * 2.2;
  });
  return (
    <group ref={group} position={[-1.9, 0, -4]}>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#FFC857" toneMapped={false} />
      </mesh>
      <sprite scale={[3, 3, 1]}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

function Island() {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.12;
  });

  const rocks = useMemo(() => {
    const rand = seeded(21);
    return Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 + rand() * 0.4;
      const r = 1.2 + rand() * 0.5;
      return { pos: [Math.cos(a) * r, -0.7 - rand() * 0.9, Math.sin(a) * r] as [number, number, number], s: 0.18 + rand() * 0.2 };
    });
  }, []);

  return (
    <group ref={spin}>
      {/* grass top */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.15, 2.05, 0.2, 9]} />
        <meshStandardMaterial color={GRASS} flatShading roughness={0.9} />
      </mesh>
      {/* ploughed field */}
      <mesh position={[-0.55, 0.205, 0]}>
        <boxGeometry args={[1.85, 0.03, 2.45]} />
        <meshStandardMaterial color="#8D6E3F" roughness={1} />
      </mesh>
      {/* soil layers */}
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[2.05, 1.9, 0.36, 9]} />
        <meshStandardMaterial color="#7A4E12" flatShading roughness={1} />
      </mesh>
      <mesh position={[0, -1.45, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.9, 2.2, 9]} />
        <meshStandardMaterial color={SOIL} flatShading roughness={1} />
      </mesh>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} scale={r.s}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 2 ? '#6D4C41' : '#4E342E'} flatShading />
        </mesh>
      ))}
      <Wheat />
      <House />
      <Tree position={[1.45, 0.2, 0.25]} />
      <Tree position={[0.75, 0.2, -1.45]} scale={0.8} />
      <Tractor />
    </group>
  );
}

export default function FarmIsland({ className }: { className?: string }) {
  return (
    <Stage
      className={className}
      label="A 3D floating farm island with swaying wheat, a farmhouse and a tractor as the sun rises"
      camera={{ position: [0, 2.3, 8.2], fov: 38, target: [0, -0.2, 0] }}
      glow="rgba(249, 211, 66, 0.22)"
    >
      {(track) => (
        <>
          <Sun track={track} />
          <Reveal track={track}>
            <Tilt strength={0.3}>
              <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
                <group scale={0.92}>
                  <Island />
                </group>
              </Float>
            </Tilt>
            <Cloud position={[-2.5, 1.7, -0.5]} speed={0.25} scale={0.8} />
            <Cloud position={[1.5, 2.1, -1.5]} speed={0.18} scale={0.6} />
            <Sparkles count={40} scale={[5, 3, 5]} position={[0, 0.9, 0]} size={2.5} speed={0.4} color={WHEAT} />
          </Reveal>
        </>
      )}
    </Stage>
  );
}
