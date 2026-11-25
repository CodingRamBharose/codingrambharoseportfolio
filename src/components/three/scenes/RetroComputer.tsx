'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import Stage, { Reveal, Tilt, Track } from '../Stage';
import { makeCanvasTexture, viewProgress } from '../utils';

const TEXT_TO_TYPE = 'Student Name: Ram Avtar\nClass: 8th\nMarks: 97/100\nStatus: Updated Successfully';
const CASE = '#DCD3BC';
const CASE_DARK = '#C9BEA3';
const GREEN = '#39FF88';

function drawTerminal(ctx: CanvasRenderingContext2D, w: number, h: number, typed: string, cursor: boolean) {
  const bg = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.75);
  bg.addColorStop(0, '#062b14');
  bg.addColorStop(1, '#010a05');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.shadowColor = GREEN;
  ctx.shadowBlur = 8;
  ctx.fillStyle = GREEN;
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillText('SCHOOL MANAGEMENT SYSTEM v1.0', 28, 48);
  ctx.globalAlpha = 0.4;
  ctx.fillRect(28, 62, w - 56, 2);
  ctx.globalAlpha = 1;

  ctx.font = '21px "Courier New", monospace';
  ctx.fillText('Updating Student Records...', 28, 104);

  const lines = typed.split('\n');
  let x = 28;
  let y = 146;
  lines.forEach((line, i) => {
    ctx.fillText(line, 28, y);
    if (i === lines.length - 1) x = 28 + ctx.measureText(line).width;
    if (i < lines.length - 1) y += 34;
  });
  if (cursor) ctx.fillRect(x + 3, y - 18, 12, 22);
  ctx.shadowBlur = 0;

  // scanlines + vignette
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let sy = 0; sy < h; sy += 3) ctx.fillRect(0, sy, w, 1);
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.72);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

function Screen({ track, onTyping }: { track: Track; onTyping: (active: boolean) => void }) {
  const { texture, ctx, canvas } = useMemo(() => makeCanvasTexture(512, 400, (c, w, h) => drawTerminal(c, w, h, '', true)), []);
  const state = useRef({ startedAt: -1, shown: -1, cursor: true });
  const light = useRef<THREE.PointLight>(null);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = viewProgress(track.current);
    const s = state.current;

    // Type once the monitor is well in view, reset when it leaves (like the original)
    if (p > 0.22 && p < 0.92 && s.startedAt < 0) s.startedAt = t;
    if ((p <= 0.05 || p >= 0.98) && s.startedAt >= 0) s.startedAt = -1;

    const count = s.startedAt < 0 ? 0 : Math.min(TEXT_TO_TYPE.length, Math.floor((t - s.startedAt) * 20));
    const cursor = Math.floor(t * 2.2) % 2 === 0;
    onTyping(count > 0 && count < TEXT_TO_TYPE.length);

    if (count !== s.shown || cursor !== s.cursor) {
      s.shown = count;
      s.cursor = cursor;
      drawTerminal(ctx, canvas.width, canvas.height, TEXT_TO_TYPE.slice(0, count), cursor);
      texture.needsUpdate = true;
    }
    if (light.current) light.current.intensity = 6 + Math.sin(t * 30) * 0.3 + Math.sin(t * 3) * 0.6;
  });

  return (
    <>
      <mesh position={[0, 0.08, 0.572]}>
        <planeGeometry args={[1.76, 1.37]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0.1, 1.6]} color={GREEN} intensity={6} distance={5} />
    </>
  );
}

function Keyboard({ typing }: { typing: React.RefObject<boolean> }) {
  const keys = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const layout = useMemo(() => {
    const out: { x: number; z: number; w: number }[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) out.push({ x: -1.04 + col * 0.16 + (row % 2) * 0.04, z: -0.25 + row * 0.15, w: 0.12 });
    }
    out.push({ x: 0, z: 0.37, w: 0.9 });
    return out;
  }, []);
  const pressed = useRef<number[]>(layout.map(() => 0));

  useFrame((_, dt) => {
    if (!keys.current) return;
    if (typing.current && Math.random() < 0.35) pressed.current[Math.floor(Math.random() * layout.length)] = 1;
    layout.forEach((k, i) => {
      pressed.current[i] = Math.max(0, pressed.current[i] - dt * 6);
      dummy.position.set(k.x, 0.085 - pressed.current[i] * 0.035, k.z);
      dummy.scale.set(k.w / 0.12, 1, 1);
      dummy.updateMatrix();
      keys.current!.setMatrixAt(i, dummy.matrix);
    });
    keys.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, -1.28, 1.35]} rotation={[0.1, 0, 0]}>
      <RoundedBox args={[2.45, 0.12, 0.95]} radius={0.04} smoothness={3}>
        <meshStandardMaterial color={CASE} roughness={0.7} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, layout.length]}>
        <boxGeometry args={[0.12, 0.06, 0.12]} />
        <meshStandardMaterial color="#B7AC90" roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

function Computer({ track }: { track: Track }) {
  const typing = useRef(false);
  const led = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (led.current) led.current.color.setRGB(0.55 + Math.sin(clock.elapsedTime * 3) * 0.45, 0.05, 0.05);
  });

  const chin = useMemo(
    () =>
      makeCanvasTexture(256, 32, (ctx, w, h) => {
        ctx.fillStyle = '#8c8470';
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText('POWER ON', w - 110, h / 2);
        ctx.fillText('CRT-1998', 8, h / 2);
      }).texture,
    [],
  );

  return (
    <group>
      {/* front case */}
      <RoundedBox args={[2.3, 1.95, 0.5]} radius={0.09} smoothness={4} position={[0, 0.05, 0.3]}>
        <meshStandardMaterial color={CASE} roughness={0.65} />
      </RoundedBox>
      {/* back hood */}
      <RoundedBox args={[1.85, 1.55, 1.0]} radius={0.12} smoothness={3} position={[0, 0.02, -0.4]}>
        <meshStandardMaterial color={CASE_DARK} roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.25, 1.0, 0.6]} radius={0.1} smoothness={3} position={[0, 0, -1.05]}>
        <meshStandardMaterial color={CASE_DARK} roughness={0.7} />
      </RoundedBox>
      {/* bezel */}
      <mesh position={[0, 0.08, 0.556]}>
        <planeGeometry args={[1.98, 1.58]} />
        <meshStandardMaterial color="#2B2A26" roughness={0.4} />
      </mesh>
      <Screen track={track} onTyping={(a) => (typing.current = a)} />
      {/* chin label + LED */}
      <mesh position={[-0.05, -0.81, 0.556]}>
        <planeGeometry args={[1.6, 0.2]} />
        <meshBasicMaterial map={chin} transparent />
      </mesh>
      <mesh position={[0.95, -0.81, 0.56]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial ref={led} color="#ff2d2d" toneMapped={false} />
      </mesh>
      {/* stand */}
      <mesh position={[0, -1.02, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.1, 24]} />
        <meshStandardMaterial color={CASE_DARK} roughness={0.7} />
      </mesh>
      <Keyboard typing={typing} />
      {/* mouse */}
      <mesh position={[1.55, -1.28, 1.45]} scale={[1, 0.55, 1.4]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color={CASE} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function RetroComputer({ className }: { className?: string }) {
  return (
    <Stage
      className={className}
      label="A 3D retro school computer that types out Ram Avtar's class 8 student record"
      camera={{ position: [0, 0.6, 7.6], fov: 36, target: [0, -0.35, 0] }}
      glow="rgba(57, 255, 136, 0.16)"
    >
      {(track) => (
        <Reveal track={track}>
          <Tilt strength={0.3} base={[0, -0.32, 0]}>
            <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.35}>
              <Computer track={track} />
            </Float>
          </Tilt>
          <Sparkles count={28} scale={[5, 3.5, 3]} size={3} speed={0.6} color="#64FFDA" />
          <Sparkles count={14} scale={[4, 3, 3]} size={4} speed={0.9} color="#F9D342" />
        </Reveal>
      )}
    </Stage>
  );
}
