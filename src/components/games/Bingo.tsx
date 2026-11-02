import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { bingoCenter, bingoSituations } from '../../data/games';
import { people, personById, type PersonId } from '../../data/people';
import { useIdentity } from '../../lib/identity';
import { useFeedback } from '../../lib/feedback';
import { useStored } from '../../lib/storage';
import { seededShuffle } from '../../lib/random';
import { Avatar } from '../ui/Avatar';

const lines: number[][] = [
  ...[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => r * 5 + c)),
  ...[0, 1, 2, 3, 4].map((c) => [0, 1, 2, 3, 4].map((r) => r * 5 + c)),
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const noMarks: Record<string, number[]> = {};

export function Bingo() {
  const { me } = useIdentity();
  const [owner, setOwner] = useState<PersonId | null>(null);
  const cardOwner = owner ?? me ?? 'milla';
  const [marks, setMarks] = useStored('bingo', noMarks);
  const [bingo, setBingo] = useState(false);
  const { toast } = useFeedback();

  const card = useMemo(() => {
    const cells = seededShuffle(bingoSituations, `pancreas-delta-${cardOwner}`).slice(0, 24);
    cells.splice(12, 0, bingoCenter);
    return cells;
  }, [cardOwner]);

  const marked = new Set([12, ...(marks[cardOwner] ?? [])]);
  const completed = lines.filter((l) => l.every((i) => marked.has(i)));
  const winning = new Set(completed.flat());

  const toggle = (i: number) => {
    if (i === 12) return;
    const next = new Set(marked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    next.delete(12);
    const prevLines = completed.length;
    const all = new Set([12, ...next]);
    const nowLines = lines.filter((l) => l.every((x) => all.has(x))).length;
    setMarks({ ...marks, [cardOwner]: [...next] });
    if (all.size === 25) setBingo(true);
    else if (nowLines > prevLines) toast({ tone: 'stamp', title: '¡Línea!', body: `${personById[cardOwner].name} canta línea. Jorge exige revisión del cartón.` });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="kicker mr-1 text-paper/60">Cartón de</span>
        {people.map((p) => (
          <button key={p.id} onClick={() => setOwner(p.id)} aria-pressed={cardOwner === p.id} aria-label={`Cartón de ${p.name}`} className={`rounded-full ${cardOwner === p.id ? 'outline outline-3 outline-offset-2 outline-gold' : 'opacity-60 hover:opacity-100'}`}>
            <Avatar id={p.id} size={36} ring="ring-ink" />
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-xs text-paper/60">
        Cartón nº {people.findIndex((p) => p.id === cardOwner) + 1}/9 de {personById[cardOwner].name} · siempre el mismo para cada integrante · {marked.size - 1}/24 casillas · {completed.length} líneas
      </p>

      <div className="mt-4 grid grid-cols-5 gap-1 bg-paper/20 p-1 sm:gap-1.5 sm:p-1.5" role="grid" aria-label="Cartón de bingo">
        {card.map((text, i) => {
          const on = marked.has(i);
          return (
            <button
              key={`${cardOwner}-${i}`}
              role="gridcell"
              aria-pressed={on}
              onClick={() => toggle(i)}
              className={`relative flex min-h-[86px] items-center justify-center p-1 text-center text-[10.5px] font-semibold leading-tight transition-colors sm:min-h-[110px] sm:p-2 sm:text-sm ${
                i === 12 ? 'bg-gold text-ink' : on ? (winning.has(i) ? 'bg-terra text-paper' : 'bg-wine text-paper') : 'bg-paper text-ink hover:bg-paper-2'
              }`}
            >
              {text}
              {on && i !== 12 && (
                <motion.span initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 0.35 }} className="pointer-events-none absolute inset-0 grid place-items-center font-display text-6xl font-black">
                  ✕
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
      <button onClick={() => setMarks({ ...marks, [cardOwner]: [] })} className="mt-3 font-mono text-xs text-paper/50 underline hover:text-paper">
        Vaciar este cartón
      </button>

      <AnimatePresence>
        {bingo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center bg-terra p-6 text-paper" role="alertdialog" aria-label="Bingo">
            <div className="text-center">
              <motion.p initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }} className="display-tight text-[clamp(6rem,30vw,16rem)]">
                ¡Bingo!
              </motion.p>
              <p className="mt-4 font-serif text-2xl italic">{personById[cardOwner].name} ha completado el cartón. Premio: absolutamente nada, pero con mucho prestigio.</p>
              <button autoFocus onClick={() => setBingo(false)} className="mt-8 bg-paper px-6 py-3 font-display text-2xl font-black uppercase text-terra">
                Aceptar la gloria
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
