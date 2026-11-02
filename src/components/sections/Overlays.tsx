import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { setFlag, useFlag } from '../../lib/flags';
import { Avatar } from '../ui/Avatar';
import { Stamp } from '../ui/Stamp';

export function GaliciaMode() {
  const on = useFlag('galicia');
  useEffect(() => {
    if (on) document.documentElement.dataset.mode = 'galicia';
    else delete document.documentElement.dataset.mode;
  }, [on]);
  return (
    <AnimatePresence>
      {on && (
        <>
          <div className="rain" aria-hidden="true" />
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            exit={{ y: -80 }}
            className="fixed inset-x-0 top-14 z-[75] flex items-center gap-3 bg-petrol px-4 py-3 text-paper shadow-lg"
            role="status"
          >
            <Avatar id="froiz" size={40} />
            <p className="flex-1 text-sm leading-snug">
              <strong className="font-display text-lg uppercase">Modo Galicia activado.</strong> Chove. 13 °C. Por fin una temperatura razonable. El Mediterráneo queda en revisión.
            </p>
            <button onClick={() => setFlag('galicia', false)} className="border-2 border-paper px-3 py-2 font-mono text-xs uppercase">
              Volver al Mediterráneo
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AIEmergency() {
  const on = useFlag('emergency');
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFlag('emergency', false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [on]);
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto bg-wine p-5 text-paper"
          role="alertdialog"
          aria-modal="true"
          aria-label="Emergencia constitucional"
        >
          {!reduce && <motion.div className="pointer-events-none absolute inset-0 bg-terra" animate={{ opacity: [0, 0.5, 0] }} transition={{ repeat: Infinity, duration: 1.1 }} />}
          <div className="relative max-w-2xl text-center">
            <p className="kicker text-gold">Alerta · Nivel máximo · Artículo 3</p>
            <h2 className="display-tight mt-4 text-[clamp(3.4rem,15vw,8rem)]">Emergencia constitucional</h2>
            <p className="mx-auto mt-5 max-w-lg font-serif text-2xl leading-snug">
              Edu ha pulsado «Optimizar con IA». Un agente autónomo ha reorganizado el itinerario, ha cancelado Casa Nuri y ha programado un daily a las 07:00.
            </p>
            <div className="mt-8 flex flex-col items-center gap-5">
              <div className="flex items-center gap-3">
                <Avatar id="edu" size={56} />
                <span className="font-display text-3xl font-black">→</span>
                <Avatar id="jorge" size={72} />
              </div>
              <Stamp tone="paper" rotate={-4} animate>
                Veto presidencial disponible
              </Stamp>
              <button
                autoFocus
                onClick={() => setFlag('emergency', false)}
                className="bg-paper px-6 py-4 font-display text-2xl font-black uppercase tracking-wide text-wine transition-transform hover:scale-105"
              >
                Ejercer el veto y restaurar el orden
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
