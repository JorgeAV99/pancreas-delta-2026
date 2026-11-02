import { motion } from 'motion/react';
import { trip } from '../../data/site';
import { Avatar } from '../ui/Avatar';
import type { PersonId } from '../../data/people';
import { Stamp } from '../ui/Stamp';

const chain: { id: PersonId; verb: string; rest: string }[] = [
  { id: 'patri', verb: 'Organiza', rest: 'Patri' },
  { id: 'jorge', verb: 'Gobierna', rest: 'Jorge' },
  { id: 'luz', verb: 'Hospeda', rest: 'Luz' },
  { id: 'edu', verb: 'Cuestiona', rest: 'Edu' },
  { id: 'david', verb: 'Fiscaliza', rest: 'David' },
  { id: 'milla', verb: 'Duerme en el sofá', rest: 'Milla' },
];

export function Decree() {
  return (
    <section id="decreto" className="grain relative bg-paper px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="rule-double border-ink pt-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
            <span>Boletín Oficial del Estado de Excepción</span>
            <span>Núm. 1 · Jueves 5 de noviembre de 2026 · Sec. I</span>
          </div>
          <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.3em] text-terra">I. Disposiciones generales</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-center font-serif text-[clamp(2rem,6vw,4rem)] leading-[1.02]">
            Real Decreto-ley 1/2026, por el que se suspende temporalmente la democracia en el municipio de L'Ampolla
            <em className="text-terra"> y se declara el Estado de Excepción durante cinco días.</em>
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="columns-1 gap-10 font-serif text-[1.3rem] leading-[1.45] sm:columns-2">
            <p className="first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[5.2rem] first-letter:font-black first-letter:leading-[0.8] first-letter:text-terra">
              PANCREAS es una organización de nueve integrantes que, cada cierto tiempo, se desplaza a un territorio desprevenido para llevar a cabo una expedición gastronómica, cultural y social. Oficialmente funciona como una democracia.
            </p>
            <p className="mt-4">
              En la práctica, Jorge concentra el poder ejecutivo y ejerce el veto absoluto; Patri controla la organización real; Luz aporta la sede gracias a la generosidad de sus yayos; Edu ejerce la oposición permanente; Froiz supervisa la gastronomía comparándola con Galicia; David fiscaliza cada gasto mientras niega su propia riqueza; Ángela dirige las comunicaciones con dos uniformes oficiales; Ana se incorpora tras una década de leyenda; y Milla, único soltero, sufre una discriminación habitacional estructural.
            </p>
            <p className="mt-4">
              Por todo ello, y ante la imposibilidad material de que nueve personas se pongan de acuerdo en un restaurante, se declara el <strong>Estado de Excepción</strong> desde el jueves 5 hasta el lunes 9 de noviembre de 2026. Las excursiones serán operaciones oficiales. Los restaurantes, instituciones de interés nacional. Los cambios de itinerario requerirán aprobación presidencial y las discrepancias se tramitarán mediante recursos que nunca prosperarán.
            </p>
            <p className="mt-4">
              Queda constatada, además, una contradicción económica fundamental que este Gobierno no pretende resolver: <em>David tiene dinero, pero quiere ahorrarlo. Jorge necesita gastarlo para ser feliz.</em>
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-ink/60">Dado en Madrid, en algún grupo de WhatsApp. — El Líder Supremo del Itinerario.</p>
          </div>

          <aside className="relative">
            <div className="sticky top-24 border-2 border-ink bg-paper-2 p-5 shadow-[8px_8px_0_var(--color-ink)]">
              <p className="kicker text-terra">Organigrama real del Estado</p>
              <ul className="mt-4 divide-y divide-ink/15">
                {chain.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <Avatar id={c.id} size={44} ring="ring-ink" />
                    <p className="leading-tight">
                      <span className="block font-display text-2xl font-black uppercase">{c.rest}</span>
                      <span className="font-serif text-lg italic text-ink/70">{c.verb}</span>
                    </p>
                  </motion.li>
                ))}
              </ul>
              <div className="absolute -bottom-6 -right-3">
                <Stamp tone="wine" rotate={-9}>
                  Aprobado por Jorge
                </Stamp>
              </div>
            </div>
          </aside>
        </div>

        <blockquote className="mt-24 border-l-4 border-terra pl-5 sm:pl-8">
          <p className="kicker text-ink/60">Lema oficial</p>
          <p className="mt-3 font-serif text-[clamp(2rem,6.5vw,4.6rem)] leading-[1.02]">
            «{trip.motto.split('. Y ')[0]}. <em className="text-terra">Y {trip.motto.split('. Y ')[1]}</em>»
          </p>
        </blockquote>
      </div>
    </section>
  );
}
