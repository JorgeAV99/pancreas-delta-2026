import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { sections, trip } from '../../data/site';
import { eggs } from '../../data/games';
import { useIdentity } from '../../lib/identity';
import { useFeedback } from '../../lib/feedback';
import { personById } from '../../data/people';
import { Avatar } from '../ui/Avatar';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { me, ask } = useIdentity();
  const { found } = useFeedback();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'border-b border-ink/15 bg-paper/92 text-ink backdrop-blur' : 'bg-transparent text-paper'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#top" className="flex items-baseline gap-2" aria-label="Volver a la portada">
            <span className="font-display text-2xl font-black uppercase leading-none tracking-tight">Pancreas</span>
            <span className="kicker hidden sm:inline">Δ 2026 · Estado de excepción</span>
            <span className="kicker sm:hidden">Δ26</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={ask}
              className={`flex h-10 items-center gap-2 rounded-full border-2 pl-1 pr-3 text-sm font-semibold ${
                scrolled ? 'border-ink' : 'border-paper/80'
              }`}
            >
              {me ? <Avatar id={me} size={30} ring="ring-transparent" /> : <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-terra text-paper">?</span>}
              <span>{me ? personById[me].name : 'Credencial'}</span>
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir índice"
              aria-expanded={open}
              className={`grid h-10 w-10 place-items-center rounded-full border-2 ${scrolled ? 'border-ink' : 'border-paper/80'}`}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="grain fixed inset-0 z-[60] overflow-y-auto bg-ink text-paper"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Índice"
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          >
            <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 py-4 sm:px-6">
              <div className="flex h-12 items-center justify-between">
                <span className="kicker text-gold">Índice del Boletín · Edición extraordinaria</span>
                <button autoFocus onClick={() => setOpen(false)} aria-label="Cerrar índice" className="grid h-11 w-11 place-items-center rounded-full border-2 border-paper">
                  <X size={20} />
                </button>
              </div>
              <ol className="mt-6 flex-1">
                {sections.map((s, i) => (
                  <li key={s.id} className="border-b border-paper/15">
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-2 transition-colors hover:text-gold"
                    >
                      <span className="font-mono text-xs text-paper/50">{String(i + 1).padStart(2, '0')}</span>
                      <span className="display-tight text-[clamp(2.6rem,11vw,5.5rem)] transition-transform group-hover:translate-x-2">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-8 grid gap-2 pb-6 font-mono text-xs text-paper/60 sm:grid-cols-2">
                <p>
                  Secretos desclasificados en este dispositivo: {found.length}/{Object.keys(eggs).length}
                </p>
                <p className="sm:text-right">{trip.summary}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
