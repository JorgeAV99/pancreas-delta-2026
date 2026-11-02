import { useEffect, useState } from 'react';
import { episodeWindows, trip } from '../data/site';

export type Phase =
  | { kind: 'before'; ms: number }
  | { kind: 'during'; episode: string }
  | { kind: 'after' };

export function phaseAt(now: number): Phase {
  const start = Date.parse(trip.start);
  const end = Date.parse(trip.end);
  if (now < start) return { kind: 'before', ms: start - now };
  if (now >= end) return { kind: 'after' };
  const current = episodeWindows.find((w) => now >= Date.parse(w.from) && now < Date.parse(w.to));
  return { kind: 'during', episode: current?.id ?? 'ep5' };
}

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}

export function splitMs(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export const pad = (n: number) => String(n).padStart(2, '0');

export function formatStamp(ts: number) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: trip.timezone,
    weekday: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(ts);
}
