import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { house } from '../../data/media';
import { trip } from '../../data/site';
import { episodes } from '../../data/itinerary';
import { pad, phaseAt, splitMs, useNow } from '../../lib/time';
import { Photo } from '../ui/Photo';
import { Seal } from '../ui/Seal';

function Status() {
  const now = useNow();
  const phase = phaseAt(now);
  if (phase.kind === 'during') {
    const ep = episodes.find((e) => e.id === phase.episode)!;
    return (
      <a href={`#${ep.id}`} className="block border-2 border-gold/80 bg-ink/50 p-4 backdrop-blur-sm">
        <p className="kicker text-gold">● Estado de Excepción en vigor</p>
        <p className="display-tight mt-2 text-4xl sm:text-5xl">
          Episodio {ep.number} · {ep.title}
        </p>
        <p className="mt-1 font-mono text-xs text-paper/70">
          {ep.weekday} {ep.date} · Ir al capítulo en curso →
        </p>
      </a>
    );
  }
  if (phase.kind === 'after') {
    return (
      <a href="#epilogo" className="block border-2 border-paper/60 bg-ink/50 p-4 backdrop-blur-sm">
        <p className="kicker text-gold">Expediente cerrado</p>
        <p className="display-tight mt-2 text-4xl">El Estado de Excepción ha concluido</p>
        <p className="mt-1 font-mono text-xs text-paper/70">Leer el epílogo →</p>
      </a>
    );
  }
  const t = splitMs(phase.ms);
  const cells = [
    { v: String(t.days), l: 'días' },
    { v: pad(t.hours), l: 'horas' },
    { v: pad(t.minutes), l: 'min' },
    { v: pad(t.seconds), l: 'seg' },
  ];
  return (
    <div>
      <p className="kicker text-paper/70">Suspensión de la democracia en</p>
      <div className="mt-2 grid grid-cols-4 border-2 border-paper/70 bg-ink/40 backdrop-blur-sm" role="timer" aria-label="Cuenta atrás hasta la salida">
        {cells.map((c, i) => (
          <div key={c.l} className={`px-2 py-2 text-center ${i ? 'border-l-2 border-paper/30' : ''}`}>
            <span className="block font-display text-4xl font-black tabular-nums leading-none sm:text-5xl">{c.v}</span>
            <span className="kicker text-[10px] text-paper/60">{c.l}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[11px] text-paper/60">Salida: jueves 5 de noviembre, 17:00 (hora peninsular)</p>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-ink text-paper lg:grid lg:grid-cols-[1.2fr_1fr]">
      <div className="absolute inset-0 lg:relative lg:order-2 lg:min-h-[100svh]">
        <Photo image={house.hero} eager sizes="(min-width: 1024px) 45vw, 100vw" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/10 to-ink lg:bg-gradient-to-r lg:from-ink/40 lg:via-transparent lg:to-transparent" />
        <p className="absolute bottom-4 right-4 hidden max-w-xs text-right font-serif text-sm italic text-paper/80 lg:block">{house.hero.caption}</p>
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-16 z-20 w-24 text-terra sm:w-36 lg:left-[54.5%] lg:right-auto lg:top-24 lg:w-44 lg:-translate-x-1/2"
        initial={{ scale: 2.4, opacity: 0, rotate: -40 }}
        animate={{ scale: 1, opacity: 1, rotate: -12 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 16 }}
      >
        <div className="rounded-full bg-paper/90 p-1">
          <Seal text="REPÚBLICA PANCREAS · ESTADO DE EXCEPCIÓN · DELTA DE L'EBRE · " center="5–9·XI" sub="2026" />
        </div>
      </motion.div>

      <div className="grain relative z-10 flex min-h-[100svh] flex-col justify-end px-4 pb-8 pt-24 sm:px-8 lg:order-1 lg:px-12 lg:pb-12">
        <p className="kicker text-paper/80">
          Boletín Oficial<span className="hidden sm:inline"> · Edición extraordinaria</span> · Núm. 01
        </p>
        <h1 className="mt-4" aria-label="PANCREAS DELTA 2026">
          <motion.span
            className="display-tight block text-[clamp(5rem,25vw,13.5rem)]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          >
            Pancreas
          </motion.span>
          <motion.span
            className="flex items-end gap-3"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <span className="display-tight text-outline text-[clamp(4.2rem,21vw,11.5rem)]">Delta</span>
            <span className="font-serif text-[clamp(2.6rem,11vw,6rem)] italic leading-[0.9] text-gold">2026</span>
          </motion.span>
        </h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-5">
          <span className="inline-block -rotate-2 bg-terra px-3 py-1.5 font-display text-2xl font-black uppercase tracking-wide text-paper shadow-[4px_4px_0_var(--color-ink)] sm:text-3xl">
            {trip.edition}
          </span>
        </motion.div>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-paper/30 py-3 font-mono text-[11px] uppercase tracking-[0.12em] sm:text-xs">
          <div>
            <dt className="text-paper/50">Fechas</dt>
            <dd className="mt-0.5 font-semibold">5–9 noviembre</dd>
          </div>
          <div>
            <dt className="text-paper/50">Sede</dt>
            <dd className="mt-0.5 font-semibold">L'Ampolla</dd>
          </div>
          <div>
            <dt className="text-paper/50">Población</dt>
            <dd className="mt-0.5 font-semibold">9 · 1 en sofá</dd>
          </div>
        </dl>

        <div className="mt-6 max-w-xl">
          <Status />
        </div>

        <a
          href="#decreto"
          className="group mt-6 flex items-center justify-between gap-4 bg-paper px-5 py-4 font-display text-xl font-black uppercase tracking-wide text-ink transition-colors hover:bg-gold sm:max-w-xl sm:text-2xl"
        >
          Entrar en territorio Pancreas
          <ArrowDown className="transition-transform group-hover:translate-y-1" />
        </a>
        <p className="mt-5 max-w-xl font-serif text-xl italic leading-snug text-paper/85">«{trip.summary}»</p>
      </div>
    </section>
  );
}

export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const line = items.join('  ✦  ') + '  ✦  ';
  return (
    <div className={`overflow-hidden whitespace-nowrap py-3 ${className}`} aria-hidden="true">
      <div className="marquee-track inline-block font-display text-2xl font-black uppercase tracking-wide">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}
