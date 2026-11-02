import { motion } from 'motion/react';
import { Sofa } from 'lucide-react';
import { house } from '../../data/media';
import { millaComplaints } from '../../data/games';
import { couples, personById } from '../../data/people';
import { useFeedback } from '../../lib/feedback';
import { pickOther } from '../../lib/random';
import { Photo } from '../ui/Photo';
import { Seal } from '../ui/Seal';
import { Avatar } from '../ui/Avatar';
import { Stamp } from '../ui/Stamp';
import { useRef } from 'react';

const specs = [
  ['Distancia al mar', '≈ 30 metros'],
  ['Ocupantes', '9 (nueve)'],
  ['Parejas alojadas en cama', '4'],
  ['Solteros alojados en cama', '0'],
  ['Vistas', 'Mediterráneo, sin filtro'],
  ['Régimen', 'Gobierno provisional'],
  ['Dirección exacta', 'Clasificada'],
  ['Precio', 'Incalculable · cortesía de los yayos'],
];

export function Palace() {
  const { toast, discover } = useFeedback();
  const last = useRef<string | undefined>(undefined);

  return (
    <section id="palacio" className="relative overflow-hidden bg-petrol text-paper">
      <div className="relative h-[78svh] min-h-[520px]">
        <Photo image={{ ...house.hero, position: "50% 12%" }} sizes="100vw" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/30 to-ink/30" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-8">
          <p className="kicker text-gold">§ 04 · Exclusiva inmobiliaria · Obra singular frente al mar</p>
          <h2 className="display-tight mt-4 text-[clamp(3.2rem,13vw,9.5rem)]">
            Palacio Presidencial <span className="font-serif font-normal normal-case italic text-gold">de los Yayos</span>
          </h2>
          <p className="mt-4 max-w-2xl font-serif text-2xl italic leading-snug text-paper/90">
            «Sede del Gobierno provisional. Financiación: cortesía de la familia de Luz».
          </p>
        </div>
        <div className="absolute right-4 top-20 w-28 rotate-12 text-gold sm:right-10 sm:w-40">
          <Seal text="RESIDENCIA OFICIAL · NO SE ADMITEN PROPUESTAS DE EDU · " center="30 m" sub="DEL MAR" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="kicker text-gold">Ficha técnica</p>
            <dl className="mt-4 divide-y divide-paper/20 border-y border-paper/20">
              {specs.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-[0.12em] text-paper/60">{k}</dt>
                  <dd className="text-right font-display text-2xl font-black uppercase leading-none">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-serif text-xl leading-snug text-paper/85">
              Situado en el propio pueblo de L'Ampolla, a unos treinta metros del Mediterráneo, el Palacio ofrece amaneceres que Froiz considera excesivos, una terraza que Luz considera imprescindible y un sofá que Milla considera inconstitucional.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <figure className="col-span-2">
              <Photo image={house.sea} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/10] w-full" />
              <figcaption className="mt-2 font-serif text-base italic text-paper/70">{house.sea.caption}</figcaption>
            </figure>
            {house.gallery.map((g) => (
              <figure key={g.alt}>
                <Photo image={g} className="aspect-square w-full" fallbackLabel={g.alt} />
                <figcaption className="mt-2 text-sm text-paper/60">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <p className="kicker text-gold">Plano de distribución habitacional</p>
          <h3 className="display-tight mt-2 text-5xl sm:text-7xl">Reparto oficial de estancias</h3>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {couples.map(([a, b], i) => (
              <div key={a} className="border-2 border-paper/40 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper/60">Estancia de pareja {i + 1}</p>
                <div className="mt-3 flex -space-x-3">
                  <Avatar id={a} size={52} ring="ring-petrol" />
                  <Avatar id={b} size={52} ring="ring-petrol" />
                </div>
                <p className="mt-2 font-display text-2xl font-black uppercase leading-none">
                  {personById[a].name} & {personById[b].name}
                </p>
                <p className="mt-1 text-sm text-paper/60">Cama. Con colchón. Y almohadas.</p>
              </div>
            ))}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                last.current = pickOther(millaComplaints, last.current);
                toast({ tone: 'stamp', title: 'Reclamación nº ' + (millaComplaints.indexOf(last.current) + 101), body: last.current });
                discover('sofa');
              }}
              className="relative border-2 border-terra bg-terra p-4 text-left"
            >
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper/80">Estancia 5 · Salón</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar id="milla" size={52} ring="ring-terra" />
                <Sofa size={40} />
              </div>
              <p className="mt-2 font-display text-2xl font-black uppercase leading-none">Milla</p>
              <p className="mt-1 text-sm text-paper/85">Sofá. Adjudicado por mayoría absoluta. Toca para oír la reclamación.</p>
              <span className="absolute -right-2 -top-3">
                <Stamp tone="paper" rotate={8}>
                  Adjudicado
                </Stamp>
              </span>
            </motion.button>
          </div>
        </div>

        <div className="mt-20 grid items-center gap-8 border-2 border-gold p-6 sm:p-10 lg:grid-cols-[auto_1fr]">
          <div className="w-32 text-gold sm:w-44">
            <Seal text="CON GRATITUD ETERNA · GOBIERNO PANCREAS · " center="YAYOS" sub="L'AMPOLLA" />
          </div>
          <div>
            <p className="kicker text-gold">Homenaje institucional</p>
            <p className="mt-3 font-serif text-[clamp(1.6rem,4.5vw,2.8rem)] leading-[1.1]">
              Este Gobierno no tendría sede, ni terraza, ni vistas, ni ceremonia, sin la generosidad de los yayos de Luz. Se decreta su <em className="text-gold">reconocimiento perpetuo</em> y el compromiso de devolver el Palacio mejor de lo que estaba.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
