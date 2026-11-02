import { useSyncExternalStore } from 'react';

type Flag = 'galicia' | 'emergency';

const state: Record<Flag, boolean> = { galicia: false, emergency: false };
const listeners = new Set<() => void>();

export function setFlag(flag: Flag, value: boolean) {
  state[flag] = value;
  listeners.forEach((fn) => fn());
}

export function useFlag(flag: Flag) {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state[flag],
    () => false,
  );
}
