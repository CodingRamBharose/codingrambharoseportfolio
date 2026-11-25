/**
 * Tiny signal for "the loading curtain is lifting", so entrance animations start
 * when visitors can actually see them instead of playing hidden under the loader.
 */
let revealed = false;
const listeners = new Set<() => void>();

export function resetReveal() {
  revealed = false;
  finishedWarmups = 0;
}

export function markRevealed() {
  if (revealed) return;
  revealed = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** 3D scenes compiling and warming their shaders in the background. */
let pendingWarmups = 0;
let finishedWarmups = 0;

export function trackWarmup<T>(work: Promise<T>) {
  pendingWarmups += 1;
  const done = () => {
    pendingWarmups -= 1;
    finishedWarmups += 1;
  };
  work.then(done, done);
  return work;
}

export const warmupsPending = () => pendingWarmups;
export const warmupsFinished = () => finishedWarmups;

/** Runs `fn` once the site is revealed (right away if it already is). Returns an unsubscribe. */
export function whenRevealed(fn: () => void) {
  if (revealed) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
