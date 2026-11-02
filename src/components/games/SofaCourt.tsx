import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Gavel, Shuffle, Sofa } from 'lucide-react';
import { sofaAppealGrounds, sofaAppealResponses, sofaReasons } from '../../data/games';
import { couples, personById, type PersonId } from '../../data/people';
import { useStored } from '../../lib/storage';
import { pickOther, shuffle } from '../../lib/random';
import { Avatar } from '../ui/Avatar';
import { Stamp } from '../ui/Stamp';

type Occupant = PersonId[];
const slots = ['Estancia 1', 'Estancia 2', 'Estancia 3', 'Estancia 4', 'Sofá del salón'];

function finalDraw(): Occupant[] {
  return [...shuffle(couples).map((c) => [...c]), ['milla']];
}

function chaos(): Occupant[] {
  return shuffle([...couples.map((c) => [...c]), ['milla'] as PersonId[]]);
}

export function SofaCourt() {
  const [draws, setDraws] = useStored('sofa-draws', 0);
  const [appeals, setAppeals] = useStored('sofa-appeals', 0);
  const [layout, setLayout] = useState<Occupant[] | null>(null);
  const [rolling, setRolling] = useState(false);
  const [reason, setReason] = useState<string>();
  const [ground, setGround] = useState(sofaAppealGrounds[0]);
  const [verdict, setVerdict] = useState<string>();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const draw = () => {
    if (rolling) return;
    setRolling(true);
    setVerdict(undefined);
    let ticks = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setInterval(() => {
      ticks++;
      setLayout(chaos());
      if (ticks > (reduced ? 1 : 11)) {
        window.clearInterval(timer.current);
        setLayout(finalDraw());
        setReason((r) => pickOther(sofaReasons, r));
        setDraws((d) => d + 1);
        setRolling(false);
      }
    }, 110);
  };

  const appeal = () => {
    setVerdict((v) => pickOther(sofaAppealResponses, v));
    setAppeals((a) => a + 1);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar id="milla" size={84} ring="ring-terra" />
        <div className="flex-1">
          <p className="kicker text-gold">Tribunal Constitucional del Sofá</p>
          <p className="font-serif text-2xl italic leading-tight">Sorteo de camas deliberadamente amañado. Milla no lo ha elegido y no le gusta.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {slots.map((s, i) => {
          const occ = layout?.[i];
          const sofa = i === 4;
          return (
            <div key={s} className={`min-h-[118px] border-2 p-3 ${sofa ? 'col-span-2 border-terra bg-terra/15 sm:col-span-1' : 'border-paper/30'}`}>
              <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60">
                {sofa && <Sofa size={12} />} {s}
              </p>
              <AnimatePresence mode="popLayout">
                {occ && (
                  <motion.div key={occ.join('-')} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2">
                    <div className="flex -space-x-2">
                      {occ.map((id) => (
                        <Avatar key={id} id={id} size={40} ring="ring-ink" />
                      ))}
                    </div>
                    <p className="mt-1 font-display text-lg font-black uppercase leading-tight">{occ.map((id) => personById[id].name).join(' & ')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={draw} disabled={rolling} className="flex items-center gap-2 bg-paper px-5 py-3 font-display text-2xl font-black uppercase text-ink disabled:opacity-60">
          <Shuffle size={20} /> {draws ? 'Repetir sorteo' : 'Sortear camas'}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {layout && !rolling && reason && (
          <motion.div key={draws} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 border-2 border-paper/30 bg-paper p-5 text-ink">
            <p className="kicker text-terra">Resolución nº {draws}/2026 · Consultar resolución</p>
            <p className="mt-2 font-serif text-2xl leading-snug">Se adjudica el sofá del salón a Milla. {reason}</p>
            <div className="mt-3">
              <Stamp tone="terra" rotate={-5} animate>
                Sofá adjudicado
              </Stamp>
            </div>

            <div className="mt-6 border-t-2 border-dashed border-ink/25 pt-5">
              <label htmlFor="ground" className="kicker text-ink/60">
                Presentar recurso · Motivo alegado
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <select id="ground" value={ground} onChange={(e) => setGround(e.target.value)} className="flex-1 border-2 border-ink bg-paper px-3 py-3 font-semibold">
                  {sofaAppealGrounds.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <button onClick={appeal} className="flex items-center justify-center gap-2 bg-ink px-5 py-3 font-display text-xl font-black uppercase text-paper">
                  <Gavel size={18} /> Presentar recurso
                </button>
              </div>
              <AnimatePresence mode="popLayout">
                {verdict && (
                  <motion.div key={verdict + appeals} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <Stamp tone="wine" rotate={-3} animate>
                      Desestimado
                    </Stamp>
                    <p className="mt-2 leading-snug">
                      Motivo alegado: «{ground}». {verdict}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 font-mono text-xs text-paper/60">
        Sorteos celebrados: {draws} · Veces que Milla ha ganado una cama: 0 · Recursos desestimados: {appeals}
      </p>
    </div>
  );
}
