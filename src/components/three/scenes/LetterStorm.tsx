'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Stage, { Tilt, Track } from '../Stage';
import { makeCanvasTexture, seeded, smoothstep, viewProgress } from '../utils';

const GURMUKHI = ['ੳ', 'ਅ', 'ੲ', 'ਸ', 'ਹ', 'ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਙ', 'ਚ', 'ਛ', 'ਜ', 'ਝ', 'ਞ', 'ਟ', 'ਠ', 'ਡ', 'ਢ', 'ਣ', 'ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ', 'ਪ'];
const ENGLISH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const FONT_GURMUKHI = '"Noto Sans Gurmukhi", "Raavi", "Gurmukhi MN", "Mukta Mahee", sans-serif';
const RING_RADIUS = 2.05;

function letterTexture(char: string, font: string, color: string, glow: string) {
  return makeCanvasTexture(128, 128, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `700 84px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = glow;
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    ctx.fillText(char, w / 2, h / 2 + 4);
  }).texture;
}

interface LetterData {
  chaos: THREE.Vector3;
  order: THREE.Vector3;
  spin: THREE.Vector3;
  phase: number;
}

function Letters({ track, fontsReady }: { track: Track; fontsReady: boolean }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<{ g: THREE.Group; pa: THREE.MeshBasicMaterial; en: THREE.MeshBasicMaterial }[]>([]);
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const ring = useRef<THREE.MeshBasicMaterial>(null);
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);
  const tmpE = useMemo(() => new THREE.Euler(), []);
  const ident = useMemo(() => new THREE.Quaternion(), []);
  const warm = useMemo(() => new THREE.Color('#FF7043'), []);
  const cool = useMemo(() => new THREE.Color('#64FFDA'), []);

  const textures = useMemo(() => {
    if (!fontsReady) return null;
    return {
      pa: GURMUKHI.map((c) => letterTexture(c, FONT_GURMUKHI, '#FFB347', '#FF7043')),
      en: ENGLISH.map((c) => letterTexture(c, 'Poppins, Inter, sans-serif', '#ffffff', '#64FFDA')),
    };
  }, [fontsReady]);

  useEffect(
    () => () => {
      textures?.pa.forEach((t) => t.dispose());
      textures?.en.forEach((t) => t.dispose());
    },
    [textures],
  );

  const data = useMemo<LetterData[]>(() => {
    const rand = seeded(42);
    return ENGLISH.map((_, i) => {
      const u = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const r = 1.2 + rand() * 1.5;
      const s = Math.sqrt(1 - u * u);
      const angle = Math.PI / 2 - (i / ENGLISH.length) * Math.PI * 2;
      return {
        chaos: new THREE.Vector3(Math.cos(a) * s * r * 1.2, u * r * 0.8, Math.sin(a) * s * r),
        order: new THREE.Vector3(Math.cos(angle) * RING_RADIUS, Math.sin(angle) * RING_RADIUS, 0),
        spin: new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1),
        phase: rand() * Math.PI * 2,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const m = smoothstep(0.22, 0.52, viewProgress(track.current));

    data.forEach((d, i) => {
      const item = meshes.current[i];
      if (!item) return;
      const stagger = (i / data.length) * 0.35;
      const mi = smoothstep(stagger, stagger + 0.65, m);

      // drifting chaos position
      const cx = d.chaos.x + Math.sin(t * 0.6 + d.phase) * 0.25;
      const cy = d.chaos.y + Math.cos(t * 0.5 + d.phase) * 0.25;
      const cz = d.chaos.z + Math.sin(t * 0.4 + d.phase * 2) * 0.25;
      item.g.position.set(
        THREE.MathUtils.lerp(cx, d.order.x, mi),
        THREE.MathUtils.lerp(cy, d.order.y, mi),
        THREE.MathUtils.lerp(cz, d.order.z, mi),
      );

      tmpE.set(d.spin.x * t * 0.8, d.spin.y * t * 0.8, d.spin.z * t * 0.5);
      tmpQ.setFromEuler(tmpE);
      item.g.quaternion.slerpQuaternions(tmpQ, ident, mi);

      const scale = 0.55 + mi * 0.1 + (1 - mi) * Math.sin(t * 2 + d.phase) * 0.04;
      item.g.scale.setScalar(scale);
      item.pa.opacity = (1 - mi) * 0.95;
      item.en.opacity = mi;
    });

    if (core.current && coreMat.current) {
      core.current.rotation.x = t * 0.3;
      core.current.rotation.y = t * 0.45;
      core.current.scale.setScalar(0.9 + Math.sin(t * 2) * 0.04 + m * 0.1);
      coreMat.current.color.copy(warm).lerp(cool, m);
    }
    if (ring.current) ring.current.opacity = m * 0.45;
    if (group.current) group.current.rotation.z = Math.sin(t * 0.25) * 0.05 * m;
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshBasicMaterial ref={coreMat} wireframe transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[RING_RADIUS, 0.012, 8, 128]} />
        <meshBasicMaterial ref={ring} color="#64FFDA" transparent opacity={0} toneMapped={false} />
      </mesh>

      {textures &&
        data.map((_, i) => (
          <group
            key={i}
            ref={(g) => {
              if (!g) return;
              const pa = (g.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
              const en = (g.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial;
              meshes.current[i] = { g, pa, en };
            }}
          >
            <mesh>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={textures.pa[i]} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
            <mesh>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={textures.en[i]} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          </group>
        ))}
    </group>
  );
}

export default function LetterStorm({ className }: { className?: string }) {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const fonts = document.fonts;
    Promise.all([
      fonts.load(`700 84px "Noto Sans Gurmukhi"`, GURMUKHI.join('')),
      fonts.load('700 84px Poppins', 'ABC'),
    ])
      .catch(() => undefined)
      .finally(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Stage
      className={className}
      label="Swirling Gurmukhi letters that untangle into an orderly ring of English letters as you scroll"
      camera={{ position: [0, 0, 7.2], fov: 40 }}
      lights={false}
      glow="rgba(255, 179, 71, 0.18)"
    >
      {(track) => (
        <>
          <Tilt strength={0.35}>
            <Letters track={track} fontsReady={fontsReady} />
          </Tilt>
          <Sparkles count={35} scale={[6, 5, 3]} size={2} speed={0.3} color="#64FFDA" opacity={0.6} />
        </>
      )}
    </Stage>
  );
}
