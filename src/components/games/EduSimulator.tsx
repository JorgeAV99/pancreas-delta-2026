import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { eduProposals, eduRejections } from '../../data/games';
import { useStored } from '../../lib/storage';
import { pickOther } from '../../lib/random';
import { Avatar } from '../ui/Avatar';
import { Stamp } from '../ui/Stamp';

export function EduSimulator() {
  const [denied, setDenied] = useStored('edu-denied', 0);
  const [proposal, setProposal] = useState<string | null>(null);
  const [rejection, setRejection] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const propose = () => {
    window.clearTimeout(timer.current);
    setProposal((p) => pickOther(eduProposals, p ?? undefined));
    setRejection(null);
    setRound((r) => r + 1);
    timer.current = window.setTimeout(() => {
      setRejection((r) => pickOther(eduRejections, r ?? undefined));
      setDenied((d) => d + 1);
    }, 1100);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <div className="flex items-center gap-4">
          <Avatar id="edu" size={84} ring="ring-gold" />
          <div>
            <p className="kicker text-gold">Simulador de cambios de itinerario</p>
            <p className="font-serif text-2xl italic leading-tight">«He tenido una idea».</p>
          </div>
        </div>
        <button
          onClick={propose}
          className="mt-6 flex w-full items-center justify-center gap-3 bg-gold px-5 py-5 font-display text-3xl font-black uppercase tracking-wide text-ink transition-transform active:scale-[0.98]"
        >
          <Lightbulb /> Edu tiene una idea mejor
        </button>
        <div className="mt-6 grid grid-cols-2 border-2 border-paper/30">
          <div className="p-4">
            <p className="kicker text-[10px] text-paper/50">Propuestas denegadas</p>
            <p className="font-display text-6xl font-black tabular-nums leading-none">{denied}</p>
          </div>
          <div className="border-l-2 border-paper/30 p-4">
            <p className="kicker text-[10px] text-paper/50">Propuestas aprobadas</p>
            <p className="font-display text-6xl font-black leading-none text-paper/30">0</p>
          </div>
        </div>
        {denied > 0 && (
          <button onClick={() => setDenied(0)} className="mt-2 font-mono text-xs text-paper/40 underline">
            Reiniciar contador
          </button>
        )}
      </div>

      <div className="relative min-h-[260px] border-2 border-paper/30 bg-paper p-5 text-ink" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {proposal ? (
            <motion.div key={round} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="kicker text-ink/60">Solicitud de modificación nº {denied + (rejection ? 0 : 1)}</p>
              <p className="mt-3 font-serif text-[1.7rem] leading-tight">{proposal}</p>
              <p className="mt-2 font-mono text-xs text-ink/50">Remitente: Edu · Estado: {rejection ? 'resuelta' : 'en revisión por el comité…'}</p>
              {rejection && (
                <div className="mt-5">
                  <Stamp tone="terra" rotate={-7} animate>
                    Solicitud rechazada por Jorge
                  </Stamp>
                  <p className="mt-3 font-semibold">{rejection}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.p key="idle" className="font-serif text-2xl italic text-ink/50">
              Bandeja de entrada del comité presidido por Jorge: vacía. Por ahora.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
