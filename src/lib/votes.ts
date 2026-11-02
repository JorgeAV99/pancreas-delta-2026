import type { PersonId } from '../data/people';
import { deviceId } from './storage';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const sharedVotingEnabled = Boolean(url && key);

export type Totals = Record<string, Partial<Record<PersonId, number>>>;

async function rpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export async function castSharedVote(category: string, nominee: PersonId) {
  await rpc('cast_delta_vote', { p_category: category, p_nominee: nominee, p_voter: deviceId() });
}

export async function fetchSharedTotals(): Promise<Totals> {
  const rows = await rpc<{ category: string; nominee: PersonId; votes: number }[]>('delta_vote_totals', {});
  const totals: Totals = {};
  for (const row of rows ?? []) {
    totals[row.category] ??= {};
    totals[row.category][row.nominee] = Number(row.votes);
  }
  return totals;
}
