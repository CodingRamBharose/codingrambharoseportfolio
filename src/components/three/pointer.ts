/** Page-wide pointer in normalised device coords (-1..1). The canvas itself ignores pointer events. */
export const pointer = { x: 0, y: 0 };

let listeners = 0;

const onMove = (e: PointerEvent) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
};

export function trackPointer() {
  if (listeners++ === 0) window.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    if (--listeners === 0) window.removeEventListener('pointermove', onMove);
  };
}
