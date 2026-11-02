import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { eggs, type EggId } from '../data/games';
import { useStored } from './storage';

type Toast = { id: number; title: string; body?: string; tone?: 'stamp' | 'ink' | 'egg' };

type FeedbackApi = {
  toast: (t: Omit<Toast, 'id'>) => void;
  discover: (egg: EggId) => void;
  found: EggId[];
};

const FeedbackContext = createContext<FeedbackApi | null>(null);

const emptyEggs: EggId[] = [];

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [found, setFound] = useStored<EggId[]>('eggs', emptyEggs);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list.slice(-2), { ...t, id }]);
    window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4600);
  }, []);

  const discover = useCallback(
    (egg: EggId) => {
      if (found.includes(egg)) return;
      const next = [...found, egg];
      setFound(next);
      toast({
        tone: 'egg',
        title: `Secreto desclasificado ${next.length}/${Object.keys(eggs).length}`,
        body: eggs[egg],
      });
    },
    [found, setFound, toast],
  );

  const api = useMemo(() => ({ toast, discover, found }), [toast, discover, found]);

  return (
    <FeedbackContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className={`pointer-events-auto w-full max-w-md border-2 px-4 py-3 shadow-[6px_6px_0_rgba(0,0,0,.25)] ${
                t.tone === 'egg'
                  ? 'border-gold bg-ink text-paper'
                  : t.tone === 'stamp'
                    ? 'border-terra bg-paper text-ink'
                    : 'border-ink bg-paper text-ink'
              }`}
            >
              <p className={`font-mono text-[11px] uppercase tracking-[0.18em] ${t.tone === 'egg' ? 'text-gold' : 'text-terra'}`}>
                {t.title}
              </p>
              {t.body && <p className="mt-1 text-sm leading-snug">{t.body}</p>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('FeedbackProvider missing');
  return ctx;
}
