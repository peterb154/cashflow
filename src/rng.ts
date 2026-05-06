function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseSeedFromUrl(): number | null {
  if (typeof window === 'undefined') return null;
  const param = new URLSearchParams(window.location.search).get('seed');
  if (!param) return null;
  const n = Number(param);
  if (Number.isFinite(n)) return Math.floor(n) >>> 0;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < param.length; i += 1) {
    h ^= param.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

const seed = parseSeedFromUrl();
const rand: () => number = seed === null ? Math.random : mulberry32(seed);

export function random(): number {
  return rand();
}

export function randomFrom<T>(items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

export const seedInUse = seed;
