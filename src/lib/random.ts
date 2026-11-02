export function pickOther<T>(list: readonly T[], previous?: T): T {
  if (list.length < 2) return list[0];
  let next = list[Math.floor(Math.random() * list.length)];
  while (next === previous) next = list[Math.floor(Math.random() * list.length)];
  return next;
}

export function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(list: readonly T[], seed: string): T[] {
  const rand = seededRandom(seed);
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffle<T>(list: readonly T[]): T[] {
  return seededShuffle(list, String(Math.random()));
}
