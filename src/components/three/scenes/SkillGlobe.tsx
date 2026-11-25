'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Stage, { Reveal, Tilt } from '../Stage';
import { makeCanvasTexture, roundRect, seeded } from '../utils';
import { SKILLS } from '@/data/skills';

const R = 2.1;
const LABEL_H = 128;
const LABEL_FONT = '600 44px Poppins, Inter, sans-serif';
/** Fewer, bigger labels for a short list; smaller ones as the list grows, so they never pile up. */
const LABEL_SCALE = Math.min(1, Math.sqrt(18 / SKILLS.length) * 1.12);

let measureCtx: CanvasRenderingContext2D | null = null;
function labelWidth(name: string) {
  measureCtx ??= document.createElement('canvas').getContext('2d');
  if (!measureCtx) return 480;
  measureCtx.font = LABEL_FONT;
  return Math.ceil(98 + measureCtx.measureText(name).width + 36);
}

/** A pill label sized to its text, so long names like "Test Framework Architecture" fit. */
function skillTexture(name: string, icon: string, hex: string) {
  const width = labelWidth(name);
  const texture = makeCanvasTexture(width, LABEL_H, (ctx, w, h) => {
    roundRect(ctx, 4, 8, w - 8, h - 16, (h - 16) / 2);
    ctx.fillStyle = 'rgba(10, 25, 47, 0.82)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = hex;
    ctx.stroke();
    ctx.textBaseline = 'middle';
    ctx.font = '46px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillText(icon, 30, h / 2 + 3);
    ctx.font = LABEL_FONT;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name, 98, h / 2 + 3);
  }).texture;
  return { texture, aspect: width / LABEL_H };
}

function Globe() {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const world = useMemo(() => new THREE.Vector3(), []);

  const nodes = useMemo(() => {
    const n = SKILLS.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return SKILLS.map((s, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const { texture, aspect } = skillTexture(s.name, s.icon, s.hex);
      return {
        skill: s,
        pos: new THREE.Vector3(Math.cos(theta) * r * R, y * R, Math.sin(theta) * r * R),
        tex: texture,
        aspect,
        // label height; stronger skills read a little larger
        size: (0.31 + (s.level / 100) * 0.13) * LABEL_SCALE,
      };
    });
  }, []);

  useEffect(() => () => nodes.forEach((n) => n.tex.dispose()), [nodes]);

  const links = useMemo(() => {
    const pts: number[] = [];
    nodes.forEach((a, i) => {
      const nearest = nodes
        .map((b, j) => ({ j, d: a.pos.distanceTo(b.pos) }))
        .filter((x) => x.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);
      nearest.forEach(({ j }) => {
        if (j > i) pts.push(a.pos.x, a.pos.y, a.pos.z, nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [nodes]);

  const dust = useMemo(() => {
    const rand = seeded(77);
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      const u = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const rr = R * (1.15 + rand() * 0.5);
      const s = Math.sqrt(1 - u * u);
      arr.set([Math.cos(a) * s * rr, u * rr, Math.sin(a) * s * rr], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame(({ camera, size }, dt) => {
    // on narrow (portrait) stages, shrink the globe so the wide labels on its edges stay inside
    if (root.current && size.width && size.height) root.current.scale.setScalar(Math.min(1, size.width / size.height / 1.2));
    if (spin.current) spin.current.rotation.y += dt * 0.18;
    if (ringA.current) ringA.current.rotation.z += dt * 0.3;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.22;
    // fade nodes on the far side of the globe
    sprites.current.forEach((sp, i) => {
      if (!sp) return;
      sp.getWorldPosition(world);
      const facing = world.clone().normalize().dot(camera.position.clone().normalize());
      const mat = sp.material as THREE.SpriteMaterial;
      mat.opacity = THREE.MathUtils.lerp(0.18, 1, (facing + 1) / 2);
      const h = nodes[i].size * (0.85 + ((facing + 1) / 2) * 0.25);
      sp.scale.set(h * nodes[i].aspect, h, 1);
    });
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        <mesh>
          <icosahedronGeometry args={[R * 0.78, 2]} />
          <meshBasicMaterial color="#64FFDA" wireframe transparent opacity={0.12} />
        </mesh>
        <lineSegments geometry={links}>
          <lineBasicMaterial color="#64FFDA" transparent opacity={0.3} />
        </lineSegments>
        <points geometry={dust}>
          <pointsMaterial color="#90CAF9" size={0.025} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
        </points>
        {nodes.map((n, i) => (
          <sprite key={n.skill.name} ref={(s) => { sprites.current[i] = s; }} position={n.pos}>
            <spriteMaterial map={n.tex} transparent depthWrite={false} toneMapped={false} />
          </sprite>
        ))}
      </group>
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#0A192F" emissive="#00BCD4" emissiveIntensity={0.35} roughness={0.3} flatShading />
      </mesh>
      <mesh ref={ringA} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[R * 1.12, 0.008, 8, 160]} />
        <meshBasicMaterial color="#64FFDA" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[1.9, -0.4, 0]}>
        <torusGeometry args={[R * 1.2, 0.006, 8, 160]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function SkillGlobe({ className }: { className?: string }) {
  return (
    <Stage
      className={className}
      label="A rotating 3D globe of Ram Avtar's technical skills, from JavaScript, React and Salesforce LWC to Playwright, RAG pipelines and Docker"
      camera={{ position: [0, 0, 7.6], fov: 40 }}
      glow="rgba(100, 255, 218, 0.18)"
    >
      {(track) => (
        <Reveal track={track} spin={1.6}>
          <Tilt strength={0.5}>
            <Globe />
          </Tilt>
        </Reveal>
      )}
    </Stage>
  );
}
