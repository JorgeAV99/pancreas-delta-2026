import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, RotateCcw } from 'lucide-react';
import { house, officialPhoto } from '../../data/media';
import { personById, type PersonId } from '../../data/people';
import { useStored } from '../../lib/storage';
import { Photo } from '../ui/Photo';
import { Avatar } from '../ui/Avatar';
import { Stamp } from '../ui/Stamp';
import { Seal } from '../ui/Seal';
import { Constitution } from './Constitution';

type Step = { n: string; title: string; who?: PersonId[]; text: string; action: string; result: ReactNode; go?: string };

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

export function goToGame(tab: string) {
  window.dispatchEvent(new CustomEvent('pd26:game', { detail: tab }));
  document.getElementById('ministerios')?.scrollIntoView({ behavior: 'smooth' });
}

const steps: Omit<Step, 'n'>[] = [
  {
    title: 'Brindis oficial',
    text: 'Nueve copas, una terraza y el Mediterráneo como testigo. Cada uno brinda con lo que quiera; el protocolo solo exige levantar el vaso.',
    action: 'Brindar',
    result: <p className="font-display text-5xl font-black uppercase text-gold">¡Chin chin! 🥂</p>,
  },
  {
    title: 'Proclamación de Jorge',
    who: ['jorge'],
    text: 'Jorge es proclamado Líder Supremo del Itinerario, pese a haber declarado que esta vez no organizaba nada.',
    action: 'Proclamar',
    result: (
      <Stamp tone="paper" animate>
        Proclamado · Veto absoluto
      </Stamp>
    ),
  },
  {
    title: 'Nombramiento de Patri',
    who: ['patri'],
    text: 'Reconocimiento formal de lo evidente: Patri es la responsable real de operaciones. Ya lo era; ahora consta en acta.',
    action: 'Nombrar',
    result: (
      <Stamp tone="paper" animate>
        Directora real de operaciones
      </Stamp>
    ),
  },
  {
    title: 'Ciudadanía PANCREAS para Ana',
    who: ['ana'],
    text: 'Tras diez años de evaluación, la Invitada Legendaria recibe la nacionalidad PANCREAS con todos sus derechos y ninguna escapatoria.',
    action: 'Conceder ciudadanía',
    result: (
      <div className="border-2 border-gold p-3 font-serif text-lg italic">
        Certificado nº 1/2026 · Ana, de Mallorca, es ciudadana PANCREAS de pleno derecho. Edu queda como responsable subsidiario.
      </div>
    ),
  },
  {
    title: 'Adjudicación formal del sofá',
    who: ['milla'],
    text: 'Por mayoría absoluta (ocho a favor, uno en contra), el sofá del salón queda adjudicado a Milla. Su protesta consta en acta.',
    action: 'Adjudicar',
    result: (
      <Stamp tone="paper" animate>
        Sofá adjudicado · Recurso desestimado
      </Stamp>
    ),
  },
  {
    title: 'Lectura de la Constitución',
    text: 'Doce artículos. Ninguno favorable a Milla, a Edu ni al presupuesto de David.',
    action: 'Abrir la Constitución',
    result: <p className="font-serif text-lg italic">Constitución leída. Firmas abiertas.</p>,
    go: 'constitution',
  },
  {
    title: 'Activación del Bingo',
    text: 'Cada integrante recibe su cartón. Casilla central gratuita: «Edu ha tenido una idea».',
    action: 'Ir al Bingo',
    result: <p className="font-serif text-lg italic">Bingo activado.</p>,
    go: 'bingo',
  },
  {
    title: 'Presentación de la porra del BMW',
    who: ['david', 'jorge'],
    text: 'David pronostica cuatro menciones del consumo del BMW. El contador arranca a cero.',
    action: 'Ir al contador',
    result: <p className="font-serif text-lg italic">Porra abierta.</p>,
    go: 'bmw',
  },
  {
    title: 'Fotografía oficial del grupo',
    who: ['luz'],
    text: 'Nueve personas, un temporizador y la misión de Luz: conseguir la foto perfecta.',
    action: 'Registrar foto',
    result: <p className="font-serif text-lg italic">Foto oficial tomada. Pendiente de subir al archivo.</p>,
  },
];

const noDone: Record<number, boolean> = {};

export function Ceremony() {
  const [done, setDone] = useStored('ceremonia', noDone);
  const [constitution, setConstitution] = useState(false);
  const count = Object.values(done).filter(Boolean).length;

  const run = (i: number) => {
    const s = steps[i];
    setDone({ ...done, [i]: true });
    if (s.go === 'constitution') setConstitution(true);
    else if (s.go) goToGame(s.go);
  };

  return (
    <section id="ceremonia" className="grain relative overflow-hidden bg-ink text-paper">
      <div className="relative h-[46svh] min-h-[320px]">
        <Photo image={house.sea} sizes="100vw" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 to-ink" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-end px-4 pb-6 text-center">
          <p className="kicker text-gold">§ 06 · Acto solemne de Estado</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/80">Viernes 6 de noviembre · 18:30 · Terraza del Palacio</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
        <div className="text-center">
          <h2 className="display-tight text-[clamp(3.4rem,15vw,10rem)]">
            Ceremonia <span className="text-gold">inaugural</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-2xl italic leading-snug text-paper/80">
            Un acto de una solemnidad completamente desproporcionada para lo que es: nueve amigos en una terraza con vistas al mar.
          </p>
          <button
            onClick={() => setConstitution(true)}
            className="mt-8 border-2 border-gold bg-gold px-6 py-4 font-display text-2xl font-black uppercase tracking-wide text-ink transition-colors hover:bg-paper"
          >
            Constituir oficialmente PANCREAS Delta
          </button>
        </div>

        <div className="mt-16 flex items-center justify-between border-b border-paper/20 pb-3">
          <p className="kicker text-gold">Orden del día · {count}/9 puntos ejecutados</p>
          {count > 0 && (
            <button onClick={() => setDone({})} className="flex items-center gap-1 font-mono text-xs text-paper/50 hover:text-paper">
              <RotateCcw size={12} /> Reiniciar
            </button>
          )}
        </div>
        <div className="mt-1 h-1 bg-paper/10">
          <motion.div className="h-full bg-gold" animate={{ width: `${(count / 9) * 100}%` }} />
        </div>

        <ol className="mt-6 divide-y divide-paper/15">
          {steps.map((s, i) => (
            <li key={s.title} className="grid gap-4 py-6 sm:grid-cols-[5rem_1fr_auto] sm:items-start">
              <span className={`font-serif text-5xl italic leading-none ${done[i] ? 'text-gold' : 'text-paper/40'}`}>{roman[i]}</span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-3xl font-black uppercase leading-none sm:text-4xl">{s.title}</h3>
                  {s.who && (
                    <div className="flex -space-x-2">
                      {s.who.map((id) => (
                        <Avatar key={id} id={id} size={34} ring="ring-ink" />
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-2 max-w-2xl leading-relaxed text-paper/75">{s.text}</p>
                <AnimatePresence>
                  {done[i] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 overflow-hidden">
                      {s.result}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => run(i)}
                className={`flex min-h-11 items-center justify-center gap-2 border-2 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                  done[i] && !s.go ? 'border-gold text-gold' : 'border-paper hover:bg-paper hover:text-ink'
                }`}
              >
                {done[i] && !s.go ? (
                  <>
                    <Check size={14} /> Ejecutado
                  </>
                ) : (
                  s.action
                )}
              </button>
            </li>
          ))}
        </ol>

        <figure className="mt-16 grid items-center gap-6 border-2 border-paper/30 p-4 sm:grid-cols-[1.4fr_1fr] sm:p-6">
          <Photo image={officialPhoto} className="aspect-[3/2] w-full" fallbackLabel="Fotografía oficial · viernes 6, 18:30" />
          <figcaption>
            <div className="w-24 text-gold">
              <Seal text="ARCHIVO OFICIAL · FOTOGRAFÍA DE ESTADO · " center="9" sub="INTEGRANTES" />
            </div>
            <p className="kicker mt-4 text-gold">Fotografía oficial del Gobierno</p>
            <p className="mt-2 font-serif text-xl leading-snug text-paper/85">{officialPhoto.caption}</p>
            <p className="mt-3 text-sm text-paper/55">
              Responsable: {personById.luz.name}, Ministra de Sanidad y de la Foto Perfecta. Se añadirá al archivo después del viaje.
            </p>
          </figcaption>
        </figure>
      </div>

      <Constitution open={constitution} onClose={() => setConstitution(false)} />
    </section>
  );
}
