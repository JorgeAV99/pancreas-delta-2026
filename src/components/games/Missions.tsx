import { AnimatePresence, motion } from 'motion/react';
import { Check, Lock } from 'lucide-react';
import { missions } from '../../data/games';
import { personById, type PersonId } from '../../data/people';
import { useStored } from '../../lib/storage';
import { Avatar } from '../ui/Avatar';

const none: Partial<Record<PersonId, boolean>> = {};

export function Missions() {
  const [done, setDone] = useStored('misiones', none);
  const [seen, setSeen] = useStored('misiones-vistas', none);
  const count = missions.filter((m) => done[m.who]).length;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <p className="font-serif text-xl italic leading-snug text-paper/80">Una misión por integrante. Desclasifícala solo si es la tuya (o si no tienes ética).</p>
        <p className="shrink-0 font-display text-5xl font-black tabular-nums">
          {count}
          <span className="text-paper/30">/9</span>
        </p>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {missions.map((m) => {
          const open = seen[m.who];
          const ok = done[m.who];
          return (
            <li key={m.who} className={`border-2 p-4 ${ok ? 'border-gold bg-gold/10' : 'border-paper/25'}`}>
              <div className="flex items-center gap-3">
                <Avatar id={m.who} size={44} ring="ring-ink" />
                <div>
                  <p className="kicker text-[10px] text-paper/50">Misión secreta</p>
                  <p className="font-display text-2xl font-black uppercase leading-none">{personById[m.who].name}</p>
                </div>
              </div>
              <AnimatePresence mode="popLayout">
                {open ? (
                  <motion.p key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 min-h-[3.5rem] font-serif text-lg leading-snug">
                    {m.text}
                  </motion.p>
                ) : (
                  <motion.button key="b" onClick={() => setSeen({ ...seen, [m.who]: true })} className="mt-3 flex min-h-[3.5rem] w-full items-center justify-center gap-2 bg-paper/10 font-mono text-xs uppercase tracking-[0.12em] hover:bg-paper/20">
                    <Lock size={14} /> Desclasificar
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                onClick={() => setDone({ ...done, [m.who]: !ok })}
                aria-pressed={!!ok}
                className={`mt-3 flex w-full items-center justify-center gap-2 border-2 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] ${ok ? 'border-gold bg-gold text-ink' : 'border-paper/40'}`}
              >
                {ok ? (
                  <>
                    <Check size={14} /> Misión cumplida
                  </>
                ) : (
                  'Marcar como cumplida'
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
