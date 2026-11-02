import { useState } from 'react';
import { motion } from 'motion/react';
import { people, personById, relations, type PersonId } from '../../data/people';
import { portraits } from '../../data/media';
import { Photo } from '../ui/Photo';
import { SectionHead } from '../ui/SectionHead';
import { Avatar } from '../ui/Avatar';
import { Dossier } from './Dossier';

export function Cast() {
  const [open, setOpen] = useState<PersonId | null>(null);

  return (
    <section id="gobierno" className="bg-paper-2 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          number="02"
          kicker="El Gobierno · Nueve expedientes"
          title={
            <>
              El <span className="text-terra">Gobierno</span>
            </>
          }
          intro="Nueve ministerios, cuatro parejas, un soltero y ninguna separación de poderes. Toca un expediente para abrirlo."
        />

        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          {people.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
              className={i % 3 === 1 ? 'md:mt-16' : ''}
            >
              <button onClick={() => setOpen(p.id)} className="group block w-full text-left" aria-label={`Abrir expediente de ${p.name}`}>
                <div className="relative">
                  <Photo
                    image={portraits[p.id]}
                    sizes="(min-width: 768px) 30vw, 48vw"
                    className="aspect-[4/5] w-full bg-ink"
                    imgClassName="grayscale-[35%] transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                    fallbackLabel={p.name}
                  />
                  <span className="absolute left-2 top-1 font-display text-5xl font-black text-paper mix-blend-difference sm:text-7xl">{p.number}</span>
                  <span
                    className="absolute -right-1 bottom-3 rotate-3 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-paper shadow-md sm:text-xs"
                    style={{ background: p.accent }}
                  >
                    {p.tag}
                  </span>
                </div>
                <h3 className="display-tight mt-3 text-[clamp(2.4rem,9vw,4.5rem)] transition-colors group-hover:text-terra">{p.name}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase leading-snug tracking-[0.12em] text-ink/70 sm:text-xs">{p.role}</p>
                <p className="mt-1 font-serif text-base italic text-ink/60">{p.origin}</p>
              </button>
            </motion.li>
          ))}
        </ul>

        <div className="mt-28">
          <p className="kicker text-terra">Anexo II · Pactos, alianzas y guerras frías</p>
          <h3 className="display-tight mt-3 text-[clamp(2.6rem,9vw,6rem)]">Relaciones de Estado</h3>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relations.map((r) => (
              <article key={r.title} className={`border-2 p-5 ${r.kind === 'guerra' ? 'border-wine bg-wine text-paper' : 'border-ink bg-paper'}`}>
                <div className="flex items-center">
                  <Avatar id={r.a} size={64} ring={r.kind === 'guerra' ? 'ring-wine' : 'ring-paper'} />
                  <span className={`z-10 -mx-3 grid h-9 w-9 place-items-center rounded-full font-display text-lg font-black ${r.kind === 'guerra' ? 'bg-paper text-wine' : 'bg-terra text-paper'}`}>
                    {r.kind === 'guerra' ? 'VS' : '+'}
                  </span>
                  <Avatar id={r.b} size={64} ring={r.kind === 'guerra' ? 'ring-wine' : 'ring-paper'} />
                </div>
                <p className={`kicker mt-4 ${r.kind === 'guerra' ? 'text-gold' : 'text-terra'}`}>
                  {personById[r.a].name} {r.kind === 'guerra' ? 'vs.' : '+'} {personById[r.b].name}
                </p>
                <h4 className="mt-1 font-display text-3xl font-black uppercase leading-none">{r.title}</h4>
                <p className={`mt-3 font-serif text-lg leading-snug ${r.kind === 'guerra' ? 'text-paper/85' : 'text-ink/75'}`}>{r.text}</p>
              </article>
            ))}
            <article className="border-2 border-terra bg-terra p-5 text-paper md:col-span-2 lg:col-span-3">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar id="milla" size={76} ring="ring-paper" />
                <span className="font-display text-4xl font-black">VS</span>
                <div className="flex -space-x-3">
                  {(['patri', 'froiz', 'david', 'angela', 'edu', 'ana', 'luz', 'jorge'] as PersonId[]).map((id) => (
                    <Avatar key={id} id={id} size={44} ring="ring-terra" />
                  ))}
                </div>
              </div>
              <h4 className="mt-4 font-display text-4xl font-black uppercase leading-none sm:text-5xl">Milla contra el sistema</h4>
              <p className="mt-3 max-w-3xl font-serif text-xl leading-snug text-paper/90">
                Ocho personas tienen pareja. Una no. Hay cuatro camas y un sofá. La organización lo considera una consecuencia inevitable; Milla, una vulneración de derechos fundamentales. Ambas partes tienen razón, pero solo una duerme en cama.
              </p>
            </article>
          </div>
        </div>
      </div>

      <Dossier id={open} onClose={() => setOpen(null)} onOpen={setOpen} />
    </section>
  );
}
