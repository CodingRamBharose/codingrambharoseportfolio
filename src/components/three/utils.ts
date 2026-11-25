import * as THREE from 'three';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * 0 when the element's top touches the bottom of the viewport,
 * 1 when its bottom leaves the top of the viewport.
 */
export function viewProgress(el: Element | null | undefined) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return clamp01((vh - r.top) / (vh + r.height));
}

const _ndc = new THREE.Vector3();
/** 1 in the middle of the view, easing to 0 at the edges, so objects never get cut by a stage's hard border. */
export function edgeFade(obj: THREE.Object3D, camera: THREE.Camera, margin = 0.3) {
  obj.getWorldPosition(_ndc).project(camera);
  const fx = smoothstep(1, 1 - margin, Math.abs(_ndc.x));
  const fy = smoothstep(1, 1 - margin, Math.abs(_ndc.y));
  return fx * fy;
}

/** Deterministic pseudo random, so layouts are stable between renders. */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Draw onto a 2D canvas and wrap it as a texture. */
export function makeCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, canvas, ctx };
}

/** A soft radial glow, handy for suns, halos and beacons. */
export function makeGlowTexture(color = '#ffffff') {
  return makeCanvasTexture(128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, color);
    g.addColorStop(0.25, color + 'aa');
    g.addColorStop(1, color + '00');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }).texture;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
