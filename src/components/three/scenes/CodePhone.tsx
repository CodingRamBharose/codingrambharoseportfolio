'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import Stage, { Reveal, Tilt, Track } from '../Stage';
import { makeCanvasTexture, roundRect, seeded, viewProgress } from '../utils';

const CODE_EXAMPLES = [
  {
    title: 'Hello World',
    code: `# My First Python Program
print("Hello, world!")`,
    output: 'Hello, world!',
  },
  {
    title: 'Simple Math Solver',
    code: `# Solves a basic math expression
expression = input("Enter math expression (e.g., 5 + 3): ")
result = eval(expression)
print("Result:", result)`,
    output: 'Enter math expression (e.g., 5 + 3): 5 + 3\nResult: 8',
  },
  {
    title: 'Guess the Number Game',
    code: `# Guess the Number Game
import random

number = random.randint(1, 100)
guess = int(input("Guess: "))

if guess == number:
    print("You won!")
else:
    print("Try again!")`,
    output: 'Guess: 42\nTry again!',
  },
  {
    title: 'Basic Calculator',
    code: `# Basic Calculator
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

num1 = float(input("First number: "))
num2 = float(input("Second number: "))
result = add(num1, num2)
print(f"Result: {result}")`,
    output: 'First number: 7\nSecond number: 5\nResult: 12.0',
  },
];

const W = 420;
const H = 860;
const KEYWORDS = /^(def|return|import|if|else|for|in|while)$/;
const BUILTINS = /^(print|input|int|float|eval|random|randint)$/;

type Glyph = { ch: string; color: string };

function colorize(line: string): Glyph[] {
  if (line.trimStart().startsWith('#')) return [...line].map((ch) => ({ ch, color: '#6A9955' }));
  const out: Glyph[] = [];
  const re = /(f?"[^"]*"|\d+(?:\.\d+)?|[A-Za-z_]\w*|\s+|.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const tok = m[0];
    let color = '#D4D4D4';
    if (tok.startsWith('"') || tok.startsWith('f"')) color = '#E9A178';
    else if (/^\d/.test(tok)) color = '#B5CEA8';
    else if (KEYWORDS.test(tok)) color = '#C586C0';
    else if (BUILTINS.test(tok)) color = '#64FFDA';
    else if (/^[A-Za-z_]/.test(tok)) color = '#9CDCFE';
    for (const ch of tok) out.push({ ch, color });
  }
  return out;
}

function drawPhone(ctx: CanvasRenderingContext2D, example: (typeof CODE_EXAMPLES)[number], typedChars: number, showOutput: boolean, cursorOn: boolean) {
  ctx.fillStyle = '#0B1220';
  ctx.fillRect(0, 0, W, H);

  // status bar
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, W, 54);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px Inter, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('6:00 AM', 26, 30);
  // signal bars
  for (let i = 0; i < 4; i++) ctx.fillRect(W - 110 + i * 8, 36 - i * 5, 5, 6 + i * 5);
  // battery
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  roundRect(ctx, W - 66, 21, 34, 18, 4);
  ctx.stroke();
  ctx.fillStyle = '#64FFDA';
  ctx.fillRect(W - 63, 24, 22, 12);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(W - 31, 26, 3, 8);

  // IDE header
  ctx.fillStyle = '#0A192F';
  ctx.fillRect(0, 54, W, 64);
  ctx.fillStyle = '#64FFDA';
  ctx.font = '700 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Python Mobile IDE', W / 2, 86);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, 117, W, 2);

  // file tab
  ctx.fillStyle = '#1E293B';
  roundRect(ctx, 16, 130, Math.min(W - 32, 40 + example.title.length * 11), 34, 8);
  ctx.fill();
  ctx.fillStyle = '#64FFDA';
  ctx.font = '600 17px Inter, sans-serif';
  ctx.fillText(example.title, 30, 148);

  // code with soft wrap
  ctx.font = '20px "Courier New", monospace';
  const cw = ctx.measureText('M').width;
  const lh = 28;
  const left = 46;
  const maxCols = Math.floor((W - left - 14) / cw);
  let y = 196;
  let remaining = typedChars;
  let cursorX = left;
  let cursorY = y;
  const lines = example.code.split('\n');

  for (let li = 0; li < lines.length && remaining >= 0; li++) {
    const glyphs = colorize(lines[li]);
    ctx.fillStyle = '#4B5563';
    ctx.fillText(String(li + 1).padStart(2, ' '), 8, y);
    let col = 0;
    let x = left;
    cursorX = x;
    cursorY = y;
    for (const g of glyphs) {
      if (remaining <= 0) break;
      if (col >= maxCols) {
        y += lh;
        col = 2;
        x = left + cw * 2;
      }
      ctx.fillStyle = g.color;
      ctx.fillText(g.ch, x, y);
      x += cw;
      col++;
      remaining--;
      cursorX = x;
      cursorY = y;
    }
    remaining--; // the newline
    y += lh;
  }

  if (cursorOn && !showOutput) {
    ctx.fillStyle = '#64FFDA';
    ctx.fillRect(cursorX + 1, cursorY - 10, 9, 20);
  }

  // output console
  const consoleTop = H - 230;
  ctx.fillStyle = '#060A12';
  ctx.fillRect(0, consoleTop, W, 230);
  ctx.fillStyle = 'rgba(100,255,218,0.25)';
  ctx.fillRect(0, consoleTop, W, 2);
  ctx.font = '600 15px Inter, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('OUTPUT', 18, consoleTop + 24);

  // run button
  ctx.fillStyle = showOutput ? '#22C55E' : '#64FFDA';
  roundRect(ctx, W - 104, consoleTop + 10, 86, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#0A192F';
  ctx.font = '700 15px Inter, sans-serif';
  ctx.fillText(showOutput ? '✓ Done' : '▶ Run', W - 88, consoleTop + 26);

  if (showOutput) {
    ctx.font = '16px "Courier New", monospace';
    ctx.fillStyle = '#E2E8F0';
    example.output.split('\n').forEach((line, i) => {
      const clipped = line.length > 38 ? line.slice(0, 37) + '…' : line;
      ctx.fillText(clipped, 18, consoleTop + 66 + i * 26);
    });
    ctx.fillStyle = '#64748B';
    ctx.fillText('>>> ', 18, consoleTop + 66 + example.output.split('\n').length * 26);
  }

  // home indicator
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  roundRect(ctx, W / 2 - 60, H - 18, 120, 6, 3);
  ctx.fill();
}

function Screen({ track }: { track: Track }) {
  const { texture, ctx } = useMemo(() => makeCanvasTexture(W, H, (c) => drawPhone(c, CODE_EXAMPLES[0], 0, false, true)), []);
  const st = useRef({ index: 0, chars: 0, hold: 0, drawnKey: '' });

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }, dt) => {
    const p = viewProgress(track.current);
    const s = st.current;
    const ex = CODE_EXAMPLES[s.index];
    const total = ex.code.length;

    if (p > 0.08 && p < 0.95) {
      if (s.chars < total) s.chars = Math.min(total, s.chars + dt * 32);
      else {
        s.hold += dt;
        if (s.hold > 2.6) {
          s.index = (s.index + 1) % CODE_EXAMPLES.length;
          s.chars = 0;
          s.hold = 0;
        }
      }
    }

    const typed = Math.floor(s.chars);
    const showOutput = typed >= total && s.hold > 0.5;
    const cursor = Math.floor(clock.elapsedTime * 2.4) % 2 === 0;
    const key = `${s.index}|${typed}|${showOutput}|${cursor}`;
    if (key !== s.drawnKey) {
      s.drawnKey = key;
      drawPhone(ctx, CODE_EXAMPLES[s.index], typed, showOutput, cursor);
      texture.needsUpdate = true;
    }
  });

  return (
    <mesh position={[0, 0, 0.083]}>
      <planeGeometry args={[1.36, 1.36 * (H / W)]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

const GLYPHS = ['{ }', '( )', '#', 'def', 'print()', '>>>', 'if', '==', 'import', ':'];

function FloatingGlyphs() {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    const rand = seeded(11);
    return GLYPHS.map((g, i) => {
      const color = i % 3 === 0 ? '#F9D342' : i % 3 === 1 ? '#64FFDA' : '#90CAF9';
      const tex = makeCanvasTexture(256, 96, (ctx, w, h) => {
        ctx.font = '700 56px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        ctx.fillStyle = color;
        ctx.fillText(g, w / 2, h / 2);
      }).texture;
      return { tex, angle: (i / GLYPHS.length) * Math.PI * 2, radius: 1.75 + rand() * 0.6, y: (rand() - 0.5) * 3.2, speed: 0.15 + rand() * 0.2, phase: rand() * 6 };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const it = items[i];
      const a = it.angle + t * it.speed;
      child.position.set(Math.cos(a) * it.radius, it.y + Math.sin(t + it.phase) * 0.15, Math.sin(a) * it.radius * 0.6);
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <sprite key={i} scale={[0.85, 0.32, 1]}>
          <spriteMaterial map={it.tex} transparent depthWrite={false} opacity={0.9} />
        </sprite>
      ))}
    </group>
  );
}

function Phone({ track }: { track: Track }) {
  return (
    <group>
      <RoundedBox args={[1.52, 3.1, 0.16]} radius={0.17} smoothness={6}>
        <meshStandardMaterial color="#1F2937" metalness={0.85} roughness={0.28} />
      </RoundedBox>
      <mesh position={[0, 0, 0.081]}>
        <planeGeometry args={[1.44, 2.98]} />
        <meshStandardMaterial color="#03050A" roughness={0.2} />
      </mesh>
      <Screen track={track} />
      {/* notch */}
      <mesh position={[0, 1.4, 0.086]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.035, 0.22, 4, 12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* side buttons */}
      <mesh position={[0.77, 0.6, 0]}>
        <boxGeometry args={[0.03, 0.35, 0.06]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.77, 0.75, 0]}>
        <boxGeometry args={[0.03, 0.22, 0.06]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* back camera */}
      <RoundedBox args={[0.5, 0.5, 0.05]} radius={0.08} position={[-0.42, 1.15, -0.1]}>
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      {[[-0.52, 1.25], [-0.32, 1.05]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 20]} />
          <meshStandardMaterial color="#0B1220" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function CodePhone({ className }: { className?: string }) {
  return (
    <Stage
      className={className}
      label="A 3D smartphone typing out Ram Avtar's first Python programs in a mobile IDE"
      camera={{ position: [0, 0, 6.3], fov: 38 }}
      env
      glow="rgba(66, 165, 245, 0.2)"
    >
      {(track) => (
        <Reveal track={track}>
          <Tilt strength={0.45} base={[0.06, -0.28, 0.04]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <Phone track={track} />
            </Float>
          </Tilt>
          <FloatingGlyphs />
        </Reveal>
      )}
    </Stage>
  );
}
