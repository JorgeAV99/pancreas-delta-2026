import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Trophy, Wifi, WifiOff } from 'lucide-react';
import { awards } from '../../data/games';
import { people, personById, type PersonId } from '../../data/people';
import { useStored } from '../../lib/storage';
import { castSharedVote, fetchSharedTotals, sharedVotingEnabled, type Totals } from '../../lib/votes';
import { SectionHead } from '../ui/SectionHead';
import { Avatar } from '../ui/Avatar';

const noVotes: Record<string, PersonId> = {};

export function Awards() {
  const [votes, setVotes] = useStored('votos', noVotes);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const refresh = useCallback(async () => {
    if (!sharedVotingEnabled) return;
    try {
      setTotals(await fetchSharedTotals());
      setError(null);
    } catch {
      setError('No se ha podido conectar con el recuento compartido. Tus votos se guardan en este dispositivo.');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const vote = async (category: string, nominee: PersonId) => {
    setVotes({ ...votes, [category]: nominee });
    if (!sharedVotingEnabled) return;
    try {
      await castSharedVote(category, nominee);
      await refresh();
    } catch {
      setError('El voto se ha guardado en este dispositivo, pero no se ha podido enviar al recuento compartido.');
    }
  };

  return (
    <section id="premios" className="relative overflow-hidden bg-wine px-4 py-20 text-paper sm:px-8 sm:py-28">
      <div className="pointer-events-none absolute -right-24 top-10 opacity-10">
        <Trophy size={420} strokeWidth={0.8} />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <SectionHead
          dark
          number="08"
          kicker="I Gala de los Premios Delta · Sábado 7 · 23:30"
          title={
            <>
              Premios <span className="font-serif font-normal normal-case italic text-gold">Delta</span>
            </>
          }
          intro="Once categorías, nueve candidatos y ninguna estatuilla física. Vota en cada categoría; puedes cambiar el voto hasta que se abra el sobre."
        />

        <div className={`mb-10 flex items-start gap-3 border-2 p-4 ${sharedVotingEnabled ? 'border-gold' : 'border-paper/40'}`} role="status">
          {sharedVotingEnabled ? <Wifi className="mt-0.5 shrink-0 text-gold" /> : <WifiOff className="mt-0.5 shrink-0" />}
          <p className="text-sm leading-relaxed">
            {sharedVotingEnabled ? (
              <>
                <strong>Recuento compartido activo.</strong> Los votos se envían a una base de datos común y el recuento muestra los votos de todos los dispositivos. Cada dispositivo cuenta como un votante: no hay protección absoluta contra quien vote desde varios móviles.
              </>
            ) : (
              <>
                <strong>Modo local.</strong> Tus votos se guardan solo en este dispositivo y no se comparten con nadie. Para la gala, cada uno vota en su móvil y se cuenta a mano, o se configura el recuento compartido (ver README).
              </>
            )}
          </p>
        </div>
        {error && <p className="mb-6 border-l-4 border-gold pl-3 text-sm">{error}</p>}

        <ol className="grid gap-5 md:grid-cols-2">
          {awards.map((a, i) => {
            const mine = votes[a.id];
            const catTotals = totals?.[a.id] ?? {};
            const sum = Object.values(catTotals).reduce((s, n) => s + (n ?? 0), 0);
            const winner = (Object.entries(catTotals) as [PersonId, number][]).sort((x, y) => y[1] - x[1])[0];
            return (
              <li key={a.id} className="border-2 border-paper/25 bg-ink/20 p-4 sm:p-5">
                <p className="font-mono text-xs text-gold">Categoría {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-display text-3xl font-black uppercase leading-[0.95]">{a.name}</h3>
                <div className="mt-4 grid grid-cols-5 gap-x-1 gap-y-2 sm:grid-cols-9" role="radiogroup" aria-label={a.name}>
                  {people.map((p) => (
                    <button
                      key={p.id}
                      role="radio"
                      aria-checked={mine === p.id}
                      aria-label={`Votar a ${p.name}`}
                      onClick={() => vote(a.id, p.id)}
                      className={`flex flex-col items-center gap-1 transition ${mine && mine !== p.id ? 'opacity-45 hover:opacity-100' : ''}`}
                    >
                      <span className={`block w-full max-w-[52px] rounded-full ${mine === p.id ? 'outline outline-[3px] outline-offset-2 outline-gold' : ''}`}>
                        <Avatar id={p.id} size={34} ring="ring-wine" className="!h-auto !w-full aspect-square" />
                      </span>
                      <span className="text-[11px] font-semibold leading-none">{p.name}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex min-h-8 flex-wrap items-center justify-between gap-2 text-sm">
                  <span>{mine ? <>Tu voto: <strong>{personById[mine].name}</strong></> : <span className="text-paper/60">Sin votar</span>}</span>
                  {(mine || sum > 0) && (
                    <button onClick={() => setRevealed({ ...revealed, [a.id]: !revealed[a.id] })} className="border border-paper/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-paper hover:text-wine">
                      {revealed[a.id] ? 'Cerrar sobre' : 'Abrir sobre'}
                    </button>
                  )}
                </div>
                <AnimatePresence>
                  {revealed[a.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="mt-3 flex items-center gap-3 bg-gold p-3 text-ink">
                        <Trophy className="shrink-0" />
                        {sharedVotingEnabled && winner ? (
                          <p className="text-sm">
                            <strong className="font-display text-xl uppercase">{personById[winner[0]].name}</strong> lidera con {winner[1]} de {sum} votos.
                          </p>
                        ) : (
                          <p className="text-sm">
                            En este dispositivo: <strong className="font-display text-xl uppercase">{mine ? personById[mine].name : '—'}</strong>. Resultado global: se cuenta en la gala.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
