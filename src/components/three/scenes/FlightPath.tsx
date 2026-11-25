'use client';

import { RefObject, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import Stage from '../Stage';
import { clamp01, makeCanvasTexture, makeGlowTexture, seeded, smoothstep } from '../utils';
import { MILESTONES } from '@/data/story';

/* ---------- the route: one beacon per chapter, climbing from the fields into the sky ---------- */

const BEACONS: [number, number, number][] = [
  [0, 1.4, 0],
  [-4.5, 1.7, -22],
  [3.5, 2.1, -44],
  [-3.5, 2.6, -66],
  [3, 1.5, -88],
  [-2.5, 4.2, -110],
  [3, 8, -132],
  [0, 12.5, -154],
];

const curve = new THREE.CatmullRomCurve3(
  [new THREE.Vector3(0, 1.2, 10), ...BEACONS.map((b) => new THREE.Vector3(...b)), new THREE.Vector3(0, 14.5, -168)],
  false,
  'catmullrom',
  0.4,
);

/** Arc-length position (0..1) of each beacon on the curve */
const beaconU = (() => {
  const samples = 2000;
  const pts = curve.getSpacedPoints(samples);
  return BEACONS.map((b) => {
    const target = new THREE.Vector3(...b);
    let best = 0;
    let bestD = Infinity;
    pts.forEach((p, i) => {
      const d = p.distanceToSquared(target);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best / samples;
  });
})();

const U_START = beaconU[0] - 0.012;

/** Scroll progress through the pinned section → position along the path (dwells near each beacon). */
export function progressToU(s: number) {
  const n = BEACONS.length - 1;
  const f = clamp01(s) * n;
  const i = Math.min(n - 1, Math.floor(f));
  const local = f - i;
  // ease so the plane slows down while passing each chapter
  const eased = local < 0.5 ? 4 * local ** 3 : 1 - Math.pow(-2 * local + 2, 3) / 2;
  const mix = 0.35 * local + 0.65 * eased;
  const a = i === 0 ? U_START : beaconU[i];
  return a + (beaconU[i + 1] - a) * mix;
}

/** Sample the route's x at a given z (used to carve a valley into the terrain). */
const pathXAtZ = (() => {
  // lookup table, one entry per world unit of z (from +40 down to -220)
  const pts = curve.getSpacedPoints(600);
  const table = new Float32Array(261);
  for (let k = 0; k < table.length; k++) {
    const z = 40 - k;
    let best = pts[0];
    let bestD = Infinity;
    for (const p of pts) {
      const d = Math.abs(p.z - z);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    table[k] = best.x;
  }
  return (z: number) => table[Math.min(table.length - 1, Math.max(0, Math.round(40 - z)))];
})();

/* ---------- scene pieces ---------- */

function SkyDome({ progress }: { progress: RefObject<number> }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const dome = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color('#050B1F') },
      uMid: { value: new THREE.Color('#0F2048') },
      uHorizon: { value: new THREE.Color('#1D2B5C') },
      uDawn: { value: 0 },
    }),
    [],
  );
  useFrame(({ camera }) => {
    if (mat.current) mat.current.uniforms.uDawn.value = smoothstep(0.35, 1, progress.current ?? 0);
    dome.current?.position.copy(camera.position);
  });
  return (
    <mesh ref={dome} scale={150} renderOrder={-10}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec3 vPos; void main(){ vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`
          uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uHorizon; uniform float uDawn;
          varying vec3 vPos;
          void main(){
            float h = vPos.y;
            vec3 dawnHorizon = mix(uHorizon, vec3(1.0,0.55,0.2), uDawn);
            vec3 dawnMid = mix(uMid, vec3(0.45,0.3,0.55), uDawn*0.8);
            vec3 col = h > 0.0 ? mix(dawnMid, uTop, smoothstep(0.0, 0.6, h)) : dawnMid * 0.6;
            col = mix(dawnHorizon, col, smoothstep(-0.02, 0.18, abs(h)));
            // sun glow towards the end of the route (-z)
            float d = max(dot(normalize(vPos), normalize(vec3(0.0,0.08,-1.0))), 0.0);
            col += vec3(1.0,0.62,0.3) * pow(d, 14.0) * (0.1 + uDawn*0.4);
            col += vec3(1.0,0.85,0.6) * pow(d, 260.0) * (0.4 + uDawn*1.3);
            gl_FragColor = vec4(col, 1.0);
          }`}
      />
    </mesh>
  );
}

function buildTerrain(zFrom: number, zTo: number, segZ: number) {
  const width = 90;
  const length = zFrom - zTo;
  const geo = new THREE.PlaneGeometry(width, length, 90, segZ);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, (zFrom + zTo) / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const field = new THREE.Color('#7CB342');
  const wheat = new THREE.Color('#C9A227');
  const soil = new THREE.Color('#5D3A00');
  const tech = new THREE.Color('#0F2B4C');
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const dx = Math.abs(x - pathXAtZ(z));
    const valley = smoothstep(2.5, 9, dx);
    let h = (Math.sin(x * 0.35) * Math.cos(z * 0.21) * 0.9 + Math.sin(x * 0.9 + z * 0.45) * 0.35) * valley;
    h += Math.max(0, dx - 12) * 0.32 * (0.6 + 0.4 * Math.sin(z * 0.1 + x * 0.05));
    pos.setY(i, h - 0.6);
    // journey colour: fields → soil → digital night
    const j = clamp01(-z / 140);
    if (j < 0.35) c.copy(field).lerp(wheat, (Math.sin(x * 1.3) * Math.sin(z * 0.9) + 1) * 0.35);
    else c.copy(wheat).lerp(soil, smoothstep(0.35, 0.5, j));
    c.lerp(tech, smoothstep(0.45, 0.75, j));
    c.multiplyScalar(0.42 + Math.min(0.5, Math.max(0, h) * 0.08));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

function Terrain() {
  const solid = useMemo(() => buildTerrain(30, -200, 150), []);
  const grid = useMemo(() => {
    const g = buildTerrain(-60, -200, 80);
    g.translate(0, 0.03, 0);
    return g;
  }, []);
  useEffect(
    () => () => {
      solid.dispose();
      grid.dispose();
    },
    [solid, grid],
  );
  return (
    <>
      <mesh geometry={solid}>
        <meshStandardMaterial vertexColors flatShading roughness={1} />
      </mesh>
      {/* from soil to server: the land turns into a glowing grid */}
      <mesh geometry={grid}>
        <meshBasicMaterial color="#64FFDA" wireframe transparent opacity={0.13} toneMapped={false} />
      </mesh>
    </>
  );
}

function Route({ progress }: { progress: RefObject<number> }) {
  const lit = useRef<THREE.Mesh>(null);
  const { faint, bright } = useMemo(() => {
    const make = () => {
      const g = new THREE.TubeGeometry(curve, 600, 0.045, 6, false);
      const colors: number[] = [];
      const a = new THREE.Color('#64FFDA');
      const b = new THREE.Color('#FFD700');
      const c = new THREE.Color();
      const ring = 7;
      for (let j = 0; j <= 600; j++) {
        c.copy(a).lerp(b, j / 600);
        for (let i = 0; i < ring; i++) colors.push(c.r, c.g, c.b);
      }
      g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      return g;
    };
    return { faint: make(), bright: make() };
  }, []);

  useFrame(() => {
    const g = lit.current?.geometry;
    if (!g || !g.index) return;
    const u = progressToU(progress.current ?? 0);
    g.setDrawRange(0, Math.floor((g.index.count / 6) * u) * 6);
  });

  return (
    <>
      <mesh geometry={faint}>
        <meshBasicMaterial vertexColors transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh ref={lit} geometry={bright} scale={1}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
    </>
  );
}

function Beacon({ index, progress }: { index: number; progress: RefObject<number> }) {
  const m = MILESTONES[index];
  const [rx, ry, z] = BEACONS[index];
  const side = rx === 0 ? (index % 2 ? 1 : -1) : Math.sign(rx);
  const x = rx + side * 2.6;
  const y = ry + 0.9;
  const gem = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);

  const label = useMemo(
    () =>
      makeCanvasTexture(256, 256, (ctx, w, h) => {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '96px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
        ctx.fillText(m.icon, w / 2, h / 2 - 30);
        ctx.font = '800 54px Poppins, sans-serif';
        ctx.fillStyle = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 16;
        ctx.fillText(index === MILESTONES.length - 1 ? 'NEXT' : String(index + 1).padStart(2, '0'), w / 2, h / 2 + 70);
      }).texture,
    [m, index],
  );
  const glow = useMemo(() => makeGlowTexture(m.color.length === 7 ? m.color : '#ffffff'), [m.color]);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const u = progressToU(progress.current ?? 0);
    const near = 1 - smoothstep(0.0, 0.05, Math.abs(u - beaconU[index]));
    const passed = u >= beaconU[index] - 0.01 ? 1 : 0;
    if (gem.current) {
      gem.current.rotation.y += dt * (0.8 + near * 2);
      gem.current.position.y = Math.sin(t * 1.5 + index) * 0.12;
    }
    if (ring.current) ring.current.rotation.x = t * 0.8 + index;
    if (group.current) group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, 1 + near * 0.6, 5, dt));
    if (beamMat.current) beamMat.current.opacity = 0.06 + passed * 0.08 + near * 0.12;
  });

  return (
    <group position={[x, 0, z]}>
      {/* light pillar from the ground */}
      <mesh position={[0, y / 2 - 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.22, y + 0.6, 16, 1, true]} />
        <meshBasicMaterial ref={beamMat} color={m.color} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <group ref={group} position={[0, y, 0]}>
        <mesh ref={gem}>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial color={m.color} emissive={m.color} emissiveIntensity={0.9} flatShading metalness={0.3} roughness={0.2} />
        </mesh>
        <mesh ref={ring}>
          <torusGeometry args={[0.75, 0.02, 8, 64]} />
          <meshBasicMaterial color={m.color} transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <sprite scale={[2.6, 2.6, 1]}>
          <spriteMaterial map={glow} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <sprite position={[0, 1.35, 0]} scale={[1.15, 1.15, 1]}>
          <spriteMaterial map={label} transparent depthWrite={false} toneMapped={false} />
        </sprite>
      </group>
    </group>
  );
}

function PaperPlane({ progress }: { progress: RefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  const u = useRef(progressToU(0));
  const look = useMemo(() => new THREE.Vector3(), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // nose at +z (Object3D.lookAt points +z at the target)
    const N = [0, 0, 0.6];
    const L = [-0.48, 0.06, -0.42];
    const R = [0.48, 0.06, -0.42];
    const C = [0, 0.02, -0.42];
    const K = [0, -0.16, -0.42];
    g.setAttribute('position', new THREE.Float32BufferAttribute([...N, ...L, ...C, ...N, ...C, ...R, ...N, ...C, ...K], 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    const target = progressToU(progress.current ?? 0);
    u.current = THREE.MathUtils.damp(u.current, target, 4, dt);
    const uu = clamp01(u.current);
    const p = curve.getPointAt(uu);
    const tan = curve.getTangentAt(uu);
    const ahead = curve.getTangentAt(Math.min(1, uu + 0.01));
    g.position.copy(p);
    g.position.y += Math.sin(clock.elapsedTime * 2) * 0.05;
    look.copy(p).add(tan);
    g.lookAt(look);
    const bank = THREE.MathUtils.clamp((ahead.x - tan.x) * -25, -0.7, 0.7);
    g.rotateZ(bank + Math.sin(clock.elapsedTime * 1.3) * 0.06);
  });

  return (
    <group ref={ref}>
      <Trail width={1.4} length={6} color="#64FFDA" attenuation={(w) => w * w} decay={1.2}>
        <mesh>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Trail>
      <mesh geometry={geo} scale={0.75}>
        <meshStandardMaterial color="#ffffff" emissive="#9fe8ff" emissiveIntensity={0.35} side={THREE.DoubleSide} flatShading roughness={0.5} />
      </mesh>
      <pointLight color="#64FFDA" intensity={6} distance={6} />
    </group>
  );
}

function ChaseCamera({ progress }: { progress: RefObject<number> }) {
  const camera = useThree((s) => s.camera);
  const u = useRef(progressToU(0));
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const wantPos = useMemo(() => new THREE.Vector3(), []);
  const wantLook = useMemo(() => new THREE.Vector3(), []);
  const finalePos = useMemo(() => new THREE.Vector3(2.5, 15.5, -138), []);
  const finaleLook = useMemo(() => new THREE.Vector3(0, 11, -205), []);
  const up = useMemo(() => new THREE.Vector3(0, 2.1, 0), []);
  const lift = useMemo(() => new THREE.Vector3(0, 0.4, 0), []);
  const first = useRef(true);

  useFrame((_, dt) => {
    const s = progress.current ?? 0;
    u.current = THREE.MathUtils.damp(u.current, progressToU(s), 4, dt);
    const uu = clamp01(u.current);
    const behind = curve.getPointAt(Math.max(0, uu - 0.034));
    const ahead = curve.getPointAt(Math.min(1, uu + 0.06));
    wantPos.copy(behind).add(up);
    wantLook.copy(ahead).add(lift);

    // finale: rise up and look back over the whole journey
    const f = smoothstep(0.9, 1, s);
    wantPos.lerp(finalePos, f);
    wantLook.lerp(finaleLook, f);

    if (first.current) {
      pos.copy(wantPos);
      look.copy(wantLook);
      first.current = false;
    }
    pos.x = THREE.MathUtils.damp(pos.x, wantPos.x, 3, dt);
    pos.y = THREE.MathUtils.damp(pos.y, wantPos.y, 3, dt);
    pos.z = THREE.MathUtils.damp(pos.z, wantPos.z, 3, dt);
    look.x = THREE.MathUtils.damp(look.x, wantLook.x, 3, dt);
    look.y = THREE.MathUtils.damp(look.y, wantLook.y, 3, dt);
    look.z = THREE.MathUtils.damp(look.z, wantLook.z, 3, dt);
    camera.position.copy(pos);
    camera.lookAt(look);
  });
  return null;
}

function Stars() {
  const geo = useMemo(() => {
    const rand = seeded(99);
    const arr = new Float32Array(1600 * 3);
    for (let i = 0; i < 1600; i++) {
      const a = rand() * Math.PI * 2;
      const y = 0.08 + rand() * 0.92;
      const r = Math.sqrt(1 - y * y);
      arr.set([Math.cos(a) * r * 120, y * 120, Math.sin(a) * r * 120], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ camera }) => ref.current?.position.copy(camera.position));
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#cfe8ff" size={0.35} sizeAttenuation transparent opacity={0.8} depthWrite={false} fog={false} />
    </points>
  );
}

function FogController({ progress }: { progress: RefObject<number> }) {
  const fog = useRef<THREE.Fog>(null);
  const night = useMemo(() => new THREE.Color('#0B1430'), []);
  const dawn = useMemo(() => new THREE.Color('#6B4A6E'), []);
  useFrame(() => {
    const s = progress.current ?? 0;
    if (!fog.current) return;
    fog.current.color.copy(night).lerp(dawn, smoothstep(0.5, 1, s));
    fog.current.far = 75 + smoothstep(0.85, 1, s) * 60;
  });
  return <fog ref={fog} attach="fog" args={['#0B1430', 12, 75]} />;
}

/** Reads the section's scroll progress once per frame. */
function ProgressReader({ section, progress }: { section: RefObject<HTMLElement | null>; progress: RefObject<number> }) {
  useFrame(() => {
    const el = section.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    progress.current = total > 0 ? clamp01(-r.top / total) : 0;
  }, -1);
  return null;
}

function World({ section }: { section: RefObject<HTMLElement | null> }) {
  const progress = useRef(0);
  return (
    <>
      <ProgressReader section={section} progress={progress} />
      <FogController progress={progress} />
      <SkyDome progress={progress} />
      <Stars />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#9fc4ff', '#2b1a0a', 0.8]} />
      <directionalLight position={[-10, 20, -60]} intensity={1.6} color="#FFD8A8" />
      <Terrain />
      <Route progress={progress} />
      {BEACONS.map((_, i) => (
        <Beacon key={i} index={i} progress={progress} />
      ))}
      <PaperPlane progress={progress} />
      <ChaseCamera progress={progress} />
    </>
  );
}

export default function FlightPath({ className, section }: { className?: string; section: RefObject<HTMLElement | null> }) {
  return (
    <Stage
      className={className}
      label="A 3D paper plane flying over a landscape that turns from farm fields into a glowing digital grid, passing a beacon for each chapter of the story"
      camera={{ position: [1.4, 2.7, 12], fov: 55, target: [0, 1.4, 0] }}
      lights={false}
      glow="transparent"
    >
      {() => <World section={section} />}
    </Stage>
  );
}
