import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { audits, budgetDialogues, davidReplies, jorgeRequests, reservedFile, wasteAlerts } from '../../data/games';
import { personById, type PersonId } from '../../data/people';
import { useFeedback } from '../../lib/feedback';
import { useStored } from '../../lib/storage';
import { pickOther } from '../../lib/random';
import { Avatar } from '../ui/Avatar';
import { Stamp } from '../ui/Stamp';

type Entry = { id: number; kind: 'request' | 'audit' | 'alert'; title: string; body?: string };
type Ledger = { tension: number; requests: number; audits: number; alerts: number };
type Bet = { id: number; text: string; stake: number; status: 'abierta' | 'ganada' | 'perdida' };

const initialLedger: Ledger = { tension: 35, requests: 0, audits: 0, alerts: 0 };
const noBets: Bet[] = [];

const betIdeas = [
  'Froiz dirá que el arroz está «bien» y nada más',
  'Edu propondrá un cambio antes del primer café',
  'Patri sacará Strava en el Delta antes de las 10:00',
  'Milla presentará un recurso antes de dormir',
  'Luz y Ángela hablarán más de 40 minutos seguidos',
  'David calculará el precio por cabeza antes del postre',
  'Ángela cambiará de uniforme el mismo día',
  'Alguien verá un flamenco antes que Edu lo detecte con IA',
];

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function Derroche() {
  const [ledger, setLedger] = useStored<Ledger>('derroche', initialLedger);
  const [bets, setBets] = useStored<Bet[]>('apuestas', noBets);
  const [log, setLog] = useState<Entry[]>([]);
  const [dialogue, setDialogue] = useState(0);
  const [line, setLine] = useState(1);
  const [reserved, setReserved] = useState(false);
  const [idea, setIdea] = useState(betIdeas[0]);
  const { discover } = useFeedback();

  const push = (e: Omit<Entry, 'id'>) => setLog((l) => [{ ...e, id: Date.now() + Math.random() }, ...l].slice(0, 5));

  const request = () => {
    const r = pickOther(jorgeRequests);
    push({ kind: 'request', title: `Solicitud: ${r.concept}`, body: `Justificación: «${r.why}» · Respuesta de David: ${pickOther(davidReplies)}` });
    setLedger({ ...ledger, tension: clamp(ledger.tension + 12), requests: ledger.requests + 1 });
  };
  const audit = () => {
    push({ kind: 'audit', title: 'Informe de auditoría', body: pickOther(audits) });
    setLedger({ ...ledger, tension: clamp(ledger.tension - 9), audits: ledger.audits + 1 });
  };
  const alert = () => {
    push({ kind: 'alert', title: 'David ha detectado un despilfarro', body: pickOther(wasteAlerts) });
    setLedger({ ...ledger, tension: clamp(ledger.tension + 5), alerts: ledger.alerts + 1 });
  };

  const lines = budgetDialogues[dialogue];
  const points = 1000 + bets.reduce((s, b) => s + (b.status === 'ganada' ? b.stake : b.status === 'perdida' ? -b.stake : 0), 0);

  return (
    <div className="space-y-10">
      <div className="border-2 border-paper/30 bg-paper p-4 text-ink sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-2">
          <p className="font-display text-2xl font-black uppercase">Tribunal de Cuentas PANCREAS</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/60">Informe de fiscalización · Ejercicio Delta 2026</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(['jorge', 'david'] as PersonId[]).map((id) => (
            <div key={id} className={`flex items-center gap-3 p-3 ${id === 'jorge' ? 'bg-wine text-paper' : 'bg-rice text-paper'}`}>
              <Avatar id={id} size={60} ring="ring-paper" />
              <div>
                <p className="font-display text-3xl font-black uppercase leading-none">{personById[id].name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] opacity-80">
                  {id === 'jorge' ? 'Ministro del Derroche · quiere gastar' : 'Ministro de Hacienda · quiere ahorrar'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.1em]">
            <span className="text-rice">Austeridad</span>
            <span>Tensión presupuestaria: {ledger.tension}%</span>
            <span className="text-wine">Mariscada</span>
          </div>
          <div className="mt-1 h-4 border-2 border-ink bg-gradient-to-r from-rice via-gold to-wine">
            <motion.div className="relative h-full" animate={{ width: `${ledger.tension}%` }}>
              <span className="absolute -right-1.5 -top-2 h-7 w-3 border-2 border-ink bg-paper" />
            </motion.div>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <button onClick={request} className="bg-wine px-3 py-4 font-display text-xl font-black uppercase leading-tight text-paper active:scale-[0.98]">
            Solicitar gasto extraordinario
          </button>
          <button onClick={audit} className="bg-rice px-3 py-4 font-display text-xl font-black uppercase leading-tight text-paper active:scale-[0.98]">
            Auditar a Jorge
          </button>
          <button onClick={alert} className="bg-ink px-3 py-4 font-display text-xl font-black uppercase leading-tight text-paper active:scale-[0.98]">
            David ha detectado un despilfarro
          </button>
        </div>

        <ul className="mt-5 space-y-2" aria-live="polite">
          <AnimatePresence initial={false}>
            {log.map((e) => (
              <motion.li key={e.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} className="overflow-hidden">
                <div className={`border-l-4 bg-paper-2 p-3 ${e.kind === 'request' ? 'border-wine' : e.kind === 'audit' ? 'border-rice' : 'border-ink'}`}>
                  <p className="text-sm font-semibold">{e.title}</p>
                  {e.body && <p className="mt-1 text-sm text-ink/75">{e.body}</p>}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <p className="mt-4 font-mono text-[11px] text-ink/60">
          Solicitudes de Jorge: {ledger.requests} · Auditorías: {ledger.audits} · Alertas: {ledger.alerts} · Todas las solicitudes son ficticias: ningún gasto aquí ha ocurrido.
        </p>

        {ledger.audits >= 2 && (
          <div className="mt-5 border-t-2 border-dashed border-ink/30 pt-4">
            {!reserved ? (
              <button
                onClick={() => {
                  setReserved(true);
                  discover('expediente');
                }}
                className="border-2 border-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] hover:bg-ink hover:text-paper"
              >
                Abrir expediente reservado
              </button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Stamp tone="wine" rotate={-3} animate>
                  Reservado
                </Stamp>
                <p className="mt-3 font-serif text-lg leading-snug">{reservedFile}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border-2 border-paper/30 p-4 sm:p-6">
          <p className="kicker text-gold">Conflicto presupuestario · Diálogo {dialogue + 1}/{budgetDialogues.length}</p>
          <ul className="mt-4 space-y-3" aria-live="polite">
            {lines.slice(0, line).map((l, i) => (
              <motion.li
                key={`${dialogue}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${l.who === 'david' ? 'flex-row-reverse text-right' : ''}`}
              >
                <Avatar id={l.who as PersonId} size={32} ring="ring-ink" />
                <p className={`max-w-[80%] px-3 py-2 text-[15px] leading-snug ${l.who === 'jorge' ? 'bg-wine text-paper' : 'bg-rice text-paper'}`}>{l.text}</p>
              </motion.li>
            ))}
          </ul>
          <button
            onClick={() => {
              if (line < lines.length) setLine(line + 1);
              else {
                setDialogue((dialogue + 1) % budgetDialogues.length);
                setLine(1);
              }
            }}
            className="mt-5 w-full border-2 border-paper px-4 py-3 font-display text-xl font-black uppercase hover:bg-paper hover:text-ink"
          >
            {line < lines.length ? 'Siguiente réplica' : 'Otro conflicto'}
          </button>
        </div>

        <div className="border-2 border-paper/30 p-4 sm:p-6">
          <p className="kicker text-gold">Modo apostador · Puntos PANCREAS sin valor monetario</p>
          <p className="mt-2 font-display text-5xl font-black tabular-nums">{points.toLocaleString('es-ES')} pts</p>
          <p className="text-xs text-paper/50">Saldo ficticio de Jorge en este dispositivo. Sin dinero real, sin pagos y sin premios.</p>
          <div className="mt-4 bg-paper/10 p-3">
            <p className="font-serif text-lg italic leading-snug">Jorge apuesta 250 puntos a que {idea.charAt(0).toLowerCase() + idea.slice(1)}.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setBets([{ id: Date.now(), text: idea, stake: 250, status: 'abierta' as const }, ...bets].slice(0, 8))}
                className="bg-gold px-3 py-2 font-mono text-xs font-semibold uppercase text-ink"
              >
                Registrar apuesta
              </button>
              <button onClick={() => setIdea((i) => pickOther(betIdeas, i))} className="border border-paper px-3 py-2 font-mono text-xs uppercase">
                Otra apuesta absurda
              </button>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {bets.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-paper/15 pb-2 text-sm">
                <span className="flex-1">{b.text}</span>
                {b.status === 'abierta' ? (
                  <span className="flex gap-1">
                    <button onClick={() => setBets(bets.map((x): Bet => (x.id === b.id ? { ...x, status: 'ganada' } : x)))} className="border border-rice bg-rice px-2 py-1 font-mono text-[10px] uppercase">
                      Ocurrió
                    </button>
                    <button onClick={() => setBets(bets.map((x): Bet => (x.id === b.id ? { ...x, status: 'perdida' } : x)))} className="border border-paper/40 px-2 py-1 font-mono text-[10px] uppercase">
                      No ocurrió
                    </button>
                  </span>
                ) : (
                  <span className={`font-mono text-[10px] uppercase ${b.status === 'ganada' ? 'text-gold' : 'text-paper/50'}`}>
                    {b.status === 'ganada' ? '+250' : '−250'} · {b.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
