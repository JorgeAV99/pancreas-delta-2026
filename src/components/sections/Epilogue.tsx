import { motion } from 'motion/react';
import { people } from '../../data/people';
import { portraits } from '../../data/media';
import { eggs } from '../../data/games';
import { trip } from '../../data/site';
import { useFeedback } from '../../lib/feedback';
import { Photo } from '../ui/Photo';

const truths = [
  { n: 'Primera', text: 'Milla es víctima de un sistema habitacional profundamente injusto.' },
  { n: 'Segunda', text: 'David tiene dinero, Jorge quiere gastarlo y ninguno de los dos está dispuesto a reconocer que el otro tiene razón.' },
  { n: 'Tercera', text: 'Jorge puede presumir cuatro veces del consumo de su BMW mientras propone una comida que triplica el presupuesto.' },
  { n: 'Cuarta', text: 'Ángela dispone de dos uniformes oficiales, manoletinas y Air Force, y ninguno responde necesariamente a las exigencias del entorno.' },
];

export function Epilogue() {
  const { found } = useFeedback();
  return (
    <section id="epilogo" className="bg-paper-2 px-4 pt-20 sm:px-8 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <p className="kicker text-terra">§ 10 · Epílogo · Disposiciones finales</p>
        <h2 className="display-tight mt-4 text-[clamp(3rem,12vw,8rem)]">Cuatro verdades fundamentales</h2>
        <ol className="mt-12 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2">
          {truths.map((t, i) => (
            <motion.li
              key={t.n}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-paper p-6"
            >
              <p className="font-serif text-3xl italic text-terra">{t.n}</p>
              <p className="mt-2 font-serif text-2xl leading-snug">{t.text}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-20 grid grid-cols-9 gap-0.5" aria-hidden="true">
          {people.map((p) => (
            <Photo key={p.id} image={portraits[p.id]} sizes="12vw" className="aspect-[3/5] w-full bg-ink" imgClassName="grayscale" fallbackLabel={p.name} minimal />
          ))}
        </div>
      </div>

      <div className="-mx-4 mt-0 bg-ink px-4 py-16 text-center text-paper sm:-mx-8 sm:px-8">
        <p className="mx-auto max-w-5xl font-display text-[clamp(2.2rem,7.5vw,5.6rem)] font-black uppercase leading-[0.9]">
          {trip.closing.split('. ').map((s, i, arr) => (
            <span key={s} className={i === 1 ? 'block text-terra' : i === 2 ? 'block text-gold' : 'block'}>
              {s}
              {i < arr.length - 1 ? '.' : ''}
            </span>
          ))}
        </p>
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 border-t border-paper/20 pt-6 text-left font-mono text-[11px] leading-relaxed text-paper/60 sm:grid-cols-3">
          <p>
            PANCREAS DELTA 2026 · Estado de Excepción. Hecho desde dentro. Cualquier parecido con la realidad es completamente intencionado.
          </p>
          <p>
            Dirección de operaciones: Patri · Veto: Jorge · Sede: los yayos de Luz · Auditoría: David · Gastronomía: Froiz · Oposición: Edu · Comunicaciones: Ángela · Diplomacia: Ana · Sofá: Milla.
          </p>
          <p className="sm:text-right">
            Secretos desclasificados en este dispositivo: {found.length}/{Object.keys(eggs).length}.
            <br />
            Edición anterior:{' '}
            <a href={trip.previous} target="_blank" rel="noreferrer" className="underline hover:text-paper">
              PANCREAS26
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
