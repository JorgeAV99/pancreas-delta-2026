import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Car, Undo2 } from 'lucide-react';
import { useStored } from '../../lib/storage';
import { formatStamp } from '../../lib/time';
import { Avatar } from '../ui/Avatar';
import { Seal } from '../ui/Seal';

const noMentions: number[] = [];

export function BmwCounter() {
  const [mentions, setMentions] = useStored('bmw', noMentions);
  const [diploma, setDiploma] = useState(false);
  const n = mentions.length;

  const add = () => {
    const next = [...mentions, Date.now()];
    setMentions(next);
    if (next.length === 4) setDiploma(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="flex items-center gap-3">
          <Avatar id="david" size={64} ring="ring-gold" />
          <p className="font-serif text-xl italic leading-snug">
            Pronóstico oficial de David: Jorge presumirá <strong className="not-italic">cuatro veces</strong> del consumo de su BMW durante el viaje.
          </p>
        </div>

        <div className="mt-6 border-2 border-paper/40 p-5">
          <p className="kicker text-paper/60">Menciones registradas</p>
          <p className="font-display text-[7rem] font-black leading-none tabular-nums">
            {n}
            <span className="text-paper/30"> / 4</span>
          </p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div key={i} className="h-3" animate={{ backgroundColor: i < n ? '#D8A23A' : 'rgba(242,234,219,.15)' }} />
            ))}
          </div>
          {n > 4 && <p className="mt-3 font-mono text-xs text-gold">+{n - 4} menciones fuera de previsión. David pide revisar el modelo al alza.</p>}
        </div>

        <button onClick={add} className="mt-4 flex w-full items-center justify-center gap-3 bg-gold px-5 py-5 text-center font-display text-2xl font-black uppercase leading-tight tracking-wide text-ink active:scale-[0.98] sm:text-3xl">
          <Car className="shrink-0" /> «Jorge ha vuelto a hablar del consumo»
        </button>
        <div className="mt-3 flex flex-wrap gap-4">
          <button disabled={!n} onClick={() => setMentions(mentions.slice(0, -1))} className="flex items-center gap-1 font-mono text-xs uppercase text-paper/70 underline disabled:opacity-30">
            <Undo2 size={14} /> Deshacer última
          </button>
          {n > 0 && (
            <button onClick={() => setMentions([])} className="font-mono text-xs uppercase text-paper/40 underline">
              Poner a cero
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-paper/50">Contador de este dispositivo. No incluye cifras de consumo: esas las dará Jorge.</p>
      </div>

      <div className="border-2 border-paper/20 p-5">
        <p className="kicker text-gold">Registro de menciones</p>
        {n === 0 ? (
          <p className="mt-3 font-serif text-xl italic text-paper/60">Sin menciones todavía. El silencio no durará.</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {mentions.map((t, i) => (
              <li key={t} className="flex justify-between border-b border-paper/15 pb-2 font-mono text-sm">
                <span>Mención nº {i + 1}</span>
                <span className="text-paper/60">{formatStamp(t)}</span>
              </li>
            ))}
          </ol>
        )}
        {n >= 4 && (
          <button onClick={() => setDiploma(true)} className="mt-4 font-mono text-xs uppercase text-gold underline">
            Ver diploma
          </button>
        )}
      </div>

      <AnimatePresence>
        {diploma && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink/85 p-4" role="alertdialog" aria-label="Diploma">
            <motion.div
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className="grain relative w-full max-w-lg border-[6px] border-double border-ink bg-paper p-6 text-center text-ink sm:p-10"
            >
              <p className="kicker text-terra">Diploma de acierto predictivo</p>
              <p className="display-tight mt-4 text-5xl sm:text-6xl">David tenía razón</p>
              <p className="mt-3 font-display text-2xl font-black uppercase text-wine">Cuarta mención homologada</p>
              <div className="mx-auto mt-5 w-28 text-wine">
                <Seal text="HACIENDA PANCREAS · AUDITORÍA DE MOTOR · " center="4/4" sub="BMW" />
              </div>
              <p className="mt-4 font-serif text-lg italic leading-snug">Se certifica que Jorge ha presumido del consumo de un vehículo de empresa mientras proponía comidas que triplican el presupuesto.</p>
              <button autoFocus onClick={() => setDiploma(false)} className="mt-6 bg-ink px-6 py-3 font-display text-xl font-black uppercase text-paper">
                Archivar diploma
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
