'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Stage, { Reveal, Tilt, Track } from '../Stage';
import { smoothstep, viewProgress } from '../utils';

const N = 9;
const SPACING = 0.42;
const BULGE = 6; // the disc between vertebra 6 and 7 (lower back)
const PAIN = new THREE.Color('#FF3B3B');
const HEAL = new THREE.Color('#64FFDA');
const DISC = new THREE.Color('#4FC3F7');

const baseY = (i: number) => (N - 1) * SPACING * 0.5 - i * SPACING;
const curveZ = (i: number) => 0.2 * Math.sin((i / (N - 1)) * Math.PI * 1.5);
const crookedX = (i: number) => Math.sin(i * 1.35) * 0.16 * Math.exp(-Math.pow(i - BULGE, 2) / 6);

function Vertebra({ scale }: { scale: number }) {
  return (
    <group scale={scale}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.43, 0.24, 24]} />
        <meshStandardMaterial color="#EFE6D2" roughness={0.55} />
      </mesh>
      {/* arch + spinous process */}
      <mesh position={[0, 0, -0.38]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.06, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#E6DCC4" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.06, -0.78]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.42]} />
        <meshStandardMaterial color="#E6DCC4" roughness={0.6} />
      </mesh>
      {/* transverse processes */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.5, 0, -0.32]} rotation={[0, s * 0.5, Math.PI / 2]}>
          <capsuleGeometry args={[0.055, 0.32, 4, 8]} />
          <meshStandardMaterial color="#E6DCC4" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Spine({ track }: { track: Track }) {
  const verts = useRef<(THREE.Group | null)[]>([]);
  const discs = useRef<(THREE.Mesh | null)[]>([]);
  const bulgeMat = useRef<THREE.MeshStandardMaterial>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const signal = useRef<THREE.Mesh>(null);
  const cordMat = useRef<THREE.MeshBasicMaterial>(null);
  const spin = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Color(), []);

  const cord = useMemo(() => {
    const pts = Array.from({ length: N }, (_, i) => new THREE.Vector3(0, baseY(i), curveZ(i) - 0.47));
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const h = smoothstep(0.3, 0.62, viewProgress(track.current)); // 0 = injured, 1 = healed

    if (spin.current) spin.current.rotation.y += dt * 0.35;

    for (let i = 0; i < N; i++) {
      const v = verts.current[i];
      if (v) v.position.set(crookedX(i) * (1 - h), baseY(i), curveZ(i));
    }
    for (let i = 0; i < N - 1; i++) {
      const d = discs.current[i];
      if (!d) continue;
      d.position.set(((crookedX(i) + crookedX(i + 1)) / 2) * (1 - h), (baseY(i) + baseY(i + 1)) / 2, (curveZ(i) + curveZ(i + 1)) / 2);
      if (i === BULGE) {
        const pulse = (1 - h) * (0.06 * Math.sin(t * 5));
        const swell = 1 + (1 - h) * 0.42 + pulse;
        d.scale.set(swell, 1 + (1 - h) * 0.25, swell);
        d.position.z -= (1 - h) * 0.12;
      }
    }

    if (bulgeMat.current) {
      tmp.copy(PAIN).lerp(HEAL, h);
      bulgeMat.current.color.copy(tmp);
      bulgeMat.current.emissive.copy(tmp);
      bulgeMat.current.emissiveIntensity = 0.5 + (1 - h) * (1.1 + Math.sin(t * 5) * 0.4);
    }

    rings.current.forEach((r, i) => {
      if (!r) return;
      const k = (t * 0.6 + i * 0.5) % 1;
      r.scale.setScalar(0.6 + k * 1.6);
      r.position.set(((crookedX(BULGE) + crookedX(BULGE + 1)) / 2) * (1 - h), (baseY(BULGE) + baseY(BULGE + 1)) / 2, 0);
      const m = r.material as THREE.MeshBasicMaterial;
      m.color.copy(PAIN).lerp(HEAL, h);
      m.opacity = (1 - k) * 0.55;
    });

    if (cordMat.current) cordMat.current.opacity = 0.25 + h * 0.6;
    if (signal.current) {
      const u = (t * 0.45) % 1;
      signal.current.position.copy(cord.getPointAt(u));
      signal.current.visible = h > 0.6;
    }
  });

  return (
    <group ref={spin}>
      {Array.from({ length: N }, (_, i) => (
        <group key={i} ref={(g) => { verts.current[i] = g; }}>
          <Vertebra scale={0.78 + (i / (N - 1)) * 0.32} />
        </group>
      ))}
      {Array.from({ length: N - 1 }, (_, i) => (
        <mesh key={i} ref={(m) => { discs.current[i] = m; }}>
          <cylinderGeometry args={[0.37 + i * 0.012, 0.37 + i * 0.012, 0.13, 28]} />
          {i === BULGE ? (
            <meshStandardMaterial ref={bulgeMat} color={PAIN} emissive={PAIN} emissiveIntensity={1.4} roughness={0.35} toneMapped={false} />
          ) : (
            <meshStandardMaterial color={DISC} emissive={DISC} emissiveIntensity={0.25} roughness={0.35} transparent opacity={0.85} />
          )}
        </mesh>
      ))}
      {[0, 1].map((i) => (
        <mesh key={i} ref={(m) => { rings.current[i] = m; }} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.015, 8, 64]} />
          <meshBasicMaterial transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
      {/* spinal cord + nerve signal */}
      <mesh>
        <tubeGeometry args={[cord, 64, 0.045, 8, false]} />
        <meshBasicMaterial ref={cordMat} color="#64FFDA" transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <mesh ref={signal}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function HealingSpine({ className }: { className?: string }) {
  return (
    <Stage
      className={className}
      label="A 3D spine with a glowing red bulged disc that heals to teal as you scroll, representing six months of recovery"
      camera={{ position: [0, 0, 7.2], fov: 38 }}
      glow="rgba(255, 107, 107, 0.18)"
    >
      {(track) => (
        <Reveal track={track} spin={0.6}>
          <Tilt strength={0.25} base={[0.12, 0, 0]}>
            <Spine track={track} />
          </Tilt>
          <Sparkles count={30} scale={[3, 4.5, 3]} size={2.5} speed={0.5} color="#64FFDA" opacity={0.7} />
        </Reveal>
      )}
    </Stage>
  );
}
