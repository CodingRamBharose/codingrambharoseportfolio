'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Stage, { Reveal, Tilt, Track } from '../Stage';
import { edgeFade, seeded } from '../utils';

const WHITE = '#F4F6F8';
const BLUE = '#1976D2';

/** A slender high-wing motor glider in the spirit of the SW-80 trainer. Nose points along +x. */
function Aircraft() {
  const prop = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (prop.current) prop.current.rotation.x += dt * 40;
  });

  const fuselage = useMemo(
    () =>
      [
        [0.0, -2.45], [0.04, -2.4], [0.07, -1.7], [0.12, -0.9], [0.21, -0.2], [0.25, 0.35], [0.24, 0.8], [0.18, 1.1], [0.1, 1.24], [0.0, 1.27],
      ].map(([r, y]) => new THREE.Vector2(r, y)),
    [],
  );

  const fin = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.55, 0);
    s.lineTo(0.28, 0.62);
    s.lineTo(0.06, 0.64);
    s.closePath();
    return s;
  }, []);

  const wing = (side: 1 | -1) => (
    <group position={[0.15, 0.24, 0]} key={side}>
      <mesh position={[0, 0, side * 0.9]}>
        <boxGeometry args={[0.56, 0.05, 1.5]} />
        <meshStandardMaterial color={WHITE} roughness={0.35} />
      </mesh>
      <group position={[0.03, 0.05, side * 1.65]} rotation={[side * -0.07, 0, 0]}>
        <mesh position={[0, 0, side * 0.8]}>
          <boxGeometry args={[0.42, 0.045, 1.6]} />
          <meshStandardMaterial color={WHITE} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.001, side * 1.52]}>
          <boxGeometry args={[0.42, 0.05, 0.16]} />
          <meshStandardMaterial color="#FF9933" roughness={0.4} />
        </mesh>
      </group>
      {/* blue leading-edge stripe */}
      <mesh position={[0.2, 0.027, side * 0.9]}>
        <boxGeometry args={[0.1, 0.005, 1.5]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>
    </group>
  );

  return (
    <group>
      {/* fuselage */}
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <latheGeometry args={[fuselage, 32]} />
        <meshStandardMaterial color={WHITE} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* canopy */}
      <mesh position={[0.5, 0.18, 0]} scale={[0.58, 0.2, 0.2]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#7FB8FF" metalness={0.6} roughness={0.05} transparent opacity={0.75} />
      </mesh>
      {wing(1)}
      {wing(-1)}
      {/* tail fin with tricolour band */}
      <group position={[-2.35, 0.05, -0.02]}>
        <mesh>
          <extrudeGeometry args={[fin, { depth: 0.04, bevelEnabled: false }]} />
          <meshStandardMaterial color={WHITE} roughness={0.35} />
        </mesh>
        {['#FF9933', '#FFFFFF', '#138808'].map((c, i) => (
          <mesh key={c} position={[0.2, 0.42 - i * 0.07, 0.02]}>
            <boxGeometry args={[0.24, 0.07, 0.05]} />
            <meshStandardMaterial color={c} roughness={0.5} />
          </mesh>
        ))}
        {/* T-tail stabiliser */}
        <mesh position={[0.15, 0.64, 0.02]}>
          <boxGeometry args={[0.32, 0.035, 1.15]} />
          <meshStandardMaterial color={WHITE} roughness={0.35} />
        </mesh>
      </group>
      {/* landing gear */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0.35, -0.3, s * 0.22]}>
          <mesh position={[0, 0.08, 0]} rotation={[s * 0.4, 0, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.03]} />
            <meshStandardMaterial color="#9E9E9E" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshStandardMaterial color="#212121" />
          </mesh>
        </group>
      ))}
      {/* propeller */}
      <group position={[1.3, 0, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.18, 16]} />
          <meshStandardMaterial color={BLUE} metalness={0.5} roughness={0.3} />
        </mesh>
        <group ref={prop}>
          <mesh>
            <boxGeometry args={[0.03, 0.8, 0.06]} />
            <meshStandardMaterial color="#263238" />
          </mesh>
        </group>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.42, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function Sky() {
  const clouds = useRef<THREE.Group>(null);
  const lines = useRef<THREE.Group>(null);

  const cloudData = useMemo(() => {
    const rand = seeded(3);
    return Array.from({ length: 7 }, (_, i) => ({
      x: -9 + i * 2.8 + rand(),
      y: (rand() - 0.5) * 3.5,
      z: -2.5 - rand() * 3,
      s: 0.5 + rand() * 0.7,
      speed: 2.2 + rand(),
      puffs: Array.from({ length: 4 }, () => [(rand() - 0.5) * 1.2, (rand() - 0.5) * 0.3, (rand() - 0.5) * 0.6, 0.35 + rand() * 0.3]),
    }));
  }, []);

  const lineData = useMemo(() => {
    const rand = seeded(9);
    return Array.from({ length: 18 }, () => ({ x: (rand() - 0.5) * 16, y: (rand() - 0.5) * 4, z: (rand() - 0.5) * 4, speed: 8 + rand() * 6, len: 0.6 + rand() * 1.4 }));
  }, []);

  useFrame(({ camera }, dt) => {
    clouds.current?.children.forEach((c, i) => {
      c.position.x -= dt * cloudData[i].speed;
      if (c.position.x < -10) c.position.x = 10;
      c.scale.setScalar(Math.max(0.0001, cloudData[i].s * edgeFade(c, camera, 0.45)));
    });
    lines.current?.children.forEach((l, i) => {
      l.position.x -= dt * lineData[i].speed;
      if (l.position.x < -8) l.position.x = 8;
      ((l as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.35 * edgeFade(l, camera, 0.35);
    });
  });

  return (
    <>
      <group ref={clouds}>
        {cloudData.map((c, i) => (
          <group key={i} position={[c.x, c.y, c.z]} scale={c.s}>
            {c.puffs.map(([x, y, z, r], j) => (
              <mesh key={j} position={[x, y, z]}>
                <icosahedronGeometry args={[r, 1]} />
                <meshStandardMaterial color="#ffffff" flatShading roughness={1} transparent opacity={0.85} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <group ref={lines}>
        {lineData.map((l, i) => (
          <mesh key={i} position={[l.x, l.y, l.z]}>
            <boxGeometry args={[l.len, 0.012, 0.012]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function Flight() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const g = ref.current;
    if (!g) return;
    g.position.y = Math.sin(t * 0.8) * 0.18;
    g.position.z = Math.sin(t * 0.4) * 0.3;
    g.rotation.x = Math.sin(t * 0.6) * 0.22; // roll
    g.rotation.z = Math.sin(t * 0.8 + 1) * 0.05; // pitch
  });
  return (
    <group ref={ref}>
      <Aircraft />
    </group>
  );
}

export default function Glider({ className }: { className?: string }) {
  return (
    <Stage
      className={className}
      label="A 3D white motor glider with a tricolour tail flying through clouds, for NCC air wing training sorties"
      camera={{ position: [0, 1.1, 8.5], fov: 38, target: [0, 0, 0] }}
      env
      glow="rgba(144, 202, 249, 0.2)"
    >
      {(track: Track) => (
        <Reveal track={track} spin={0.8}>
          <group rotation={[0, -0.55, 0]}>
            <Sky />
            <Tilt strength={0.25}>
              <group scale={0.68}>
                <Flight />
              </group>
            </Tilt>
          </group>
        </Reveal>
      )}
    </Stage>
  );
}
