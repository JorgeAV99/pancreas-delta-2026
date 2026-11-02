import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { shoeContexts, shoeGeneralRulings, shoeRulings, type ShoeContext, type ShoeMode } from '../../data/games';
import { useFeedback } from '../../lib/feedback';
import { useStored } from '../../lib/storage';
import { pickOther } from '../../lib/random';
import { Stamp } from '../ui/Stamp';

export function ShoeCourt({ compact }: { compact?: boolean }) {
  const [mode, setMode] = useStored<ShoeMode | null>('shoe-mode', null);
  const [ctx, setCtx] = useState<ShoeContext>('arrozales');
  const [general, setGeneral] = useState(shoeGeneralRulings[0]);
  const [ruling, setRuling] = useState(0);
  const { discover } = useFeedback();

  const choose = (m: ShoeMode) => {
    setMode(m);
    setGeneral((g) => pickOther(shoeGeneralRulings, g));
    setRuling((r) => r + 1);
    discover('calzado');
  };

  return (
    <div className={`border-2 border-wine bg-paper text-ink ${compact ? 'p-4' : 'p-5 sm:p-7'}`}>
      <p className="kicker text-wine">Tribunal Superior del Calzado · Sala de lo Contradictorio</p>
      {!compact && <h4 className="display-tight mt-2 text-5xl">Dictamen de protocolo</h4>}
      <label className="mt-4 block font-mono text-xs uppercase tracking-[0.12em] text-ink/70" htmlFor={`ctx-${compact ? 'c' : 'f'}`}>
        Contexto del litigio
      </label>
      <select
        id={`ctx-${compact ? 'c' : 'f'}`}
        value={ctx}
        onChange={(e) => {
          setCtx(e.target.value as ShoeContext);
          setRuling((r) => r + 1);
        }}
        className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2.5 font-semibold"
      >
        {shoeContexts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Uniforme">
        {(
          [
            ['manoletinas', 'Modo Manoletinas', 'Uniforme A'],
            ['airforce', 'Modo Air Force', 'Uniforme B'],
          ] as const
        ).map(([id, label, sub]) => (
          <button
            key={id}
            onClick={() => choose(id)}
            aria-pressed={mode === id}
            className={`border-2 px-3 py-3 text-left transition-colors ${mode === id ? 'border-wine bg-wine text-paper' : 'border-ink hover:bg-paper-2'}`}
          >
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">{sub}</span>
            <span className="block font-display text-2xl font-black uppercase leading-none">{label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="popLayout">
        {mode && (
          <motion.div key={`${mode}-${ctx}-${ruling}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 border-t-2 border-dashed border-ink/30 pt-4">
            <Stamp tone="wine" rotate={-4} animate>
              Dictamen nº {ruling}
            </Stamp>
            <p className="mt-3 font-serif text-xl leading-snug">{shoeRulings[mode][ctx]}</p>
            <p className="mt-2 text-sm text-ink/60">{general}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-4 border-l-2 border-rice pl-3 text-xs leading-relaxed text-ink/70">
        Nota del Ministerio de Sanidad: en arrozales, humedales y la ruta costera, calzado cerrado y con agarre. El Tribunal es humorístico; los resbalones, no.
      </p>
    </div>
  );
}
