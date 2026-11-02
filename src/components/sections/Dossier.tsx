import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Car, CloudRain, Cpu, Megaphone, CalendarPlus, FileSearch, Sparkles } from 'lucide-react';
import { personById, type PersonId } from '../../data/people';
import { portraits } from '../../data/media';
import { millaComplaints } from '../../data/games';
import { useFeedback } from '../../lib/feedback';
import { useStored } from '../../lib/storage';
import { setFlag } from '../../lib/flags';
import { pickOther } from '../../lib/random';
import { Modal } from '../ui/Modal';
import { Photo } from '../ui/Photo';
import { Stamp } from '../ui/Stamp';
import { ShoeCourt } from '../games/ShoeCourt';

type Props = { id: PersonId | null; onClose: () => void; onOpen: (id: PersonId) => void };

export function Dossier({ id, onClose, onOpen }: Props) {
  const p = id ? personById[id] : null;
  return (
    <Modal open={!!p} onClose={onClose} label={p ? `Expediente de ${p.name}` : 'Expediente'} wide>
      {p && (
        <div key={p.id} className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative md:sticky md:top-0 md:h-[88dvh]">
            <Photo image={portraits[p.id]} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5] w-full bg-ink md:aspect-auto md:h-full" fallbackLabel={p.name} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-20 text-paper">
              <p className="kicker text-gold">Expediente nº {p.number}/2026 · Clasificado</p>
              <h3 className="display-tight mt-2 text-7xl sm:text-8xl">{p.name}</h3>
            </div>
            <div className="absolute left-4 top-4">
              <Stamp tone="paper" rotate={-8}>
                Confidencial
              </Stamp>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-terra">{p.role}</p>
            {p.roleSecondary && <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-ink/60">y {p.roleSecondary}</p>}

            <dl className="mt-5 grid grid-cols-2 gap-px border-2 border-ink bg-ink text-sm">
              <div className="bg-paper p-3">
                <dt className="kicker text-[10px] text-ink/50">Procedencia</dt>
                <dd className="mt-1 font-semibold">{p.origin}</dd>
                {p.originNote && <dd className="text-xs text-ink/60">{p.originNote}</dd>}
              </div>
              <div className="bg-paper p-3">
                <dt className="kicker text-[10px] text-ink/50">Situación</dt>
                <dd className="mt-1 font-semibold">
                  {p.partner ? (
                    <button onClick={() => onOpen(p.partner!)} className="underline decoration-terra decoration-2 underline-offset-4">
                      Pareja de {personById[p.partner].name}
                    </button>
                  ) : (
                    p.relationshipNote
                  )}
                </dd>
              </div>
              <div className="bg-paper p-3">
                <dt className="kicker text-[10px] text-ink/50">Habilidad especial</dt>
                <dd className="mt-1 font-semibold leading-snug">{p.skill}</dd>
              </div>
              <div className="bg-paper p-3">
                <dt className="kicker text-[10px] text-ink/50">Debilidad conocida</dt>
                <dd className="mt-1 font-semibold leading-snug">{p.weakness}</dd>
              </div>
            </dl>

            <p className="mt-6 font-serif text-xl leading-snug">{p.bio}</p>

            <div className="mt-7">
              <p className="kicker text-ink/60">Estadísticas oficiales (no auditadas)</p>
              <ul className="mt-3 space-y-3">
                {p.stats.map((s, i) => (
                  <li key={s.label}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span>{s.label}</span>
                      <span className="font-mono font-semibold">{s.display ?? `${s.value}%`}</span>
                    </div>
                    <div className="mt-1 h-2.5 border border-ink bg-paper-2">
                      <motion.div
                        className="h-full"
                        style={{ background: p.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7">
              <p className="kicker text-ink/60">Frases recurrentes</p>
              <ul className="mt-2 space-y-1">
                {p.quotes.map((q) => (
                  <li key={q} className="font-serif text-2xl italic leading-tight text-terra">
                    «{q}»
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7">
              <p className="kicker text-ink/60">Informes de inteligencia</p>
              <ul className="mt-2 divide-y divide-ink/15 border-y border-ink/15">
                {p.jokes.map((j) => (
                  <li key={j} className="py-2 leading-snug">
                    {j}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Special id={p.id} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Special({ id }: { id: PersonId }) {
  const { toast, discover } = useFeedback();
  const [bmwClicks, setBmwClicks] = useState(0);
  const [luzMode, setLuzMode] = useStored<'pija' | 'hippie'>('luz-mode', 'pija');
  const [audit, setAudit] = useState(false);
  const [complaint, setComplaint] = useState<string>();
  const [anaFile, setAnaFile] = useState(false);

  const btn = 'inline-flex items-center gap-2 border-2 border-ink bg-ink px-4 py-3 font-display text-xl font-black uppercase tracking-wide text-paper transition-colors hover:bg-terra hover:border-terra';

  if (id === 'patri')
    return (
      <button
        className={btn}
        onClick={() =>
          toast({ tone: 'stamp', title: 'Invitación de Google Calendar enviada', body: '«Sync rápido sobre la sobremesa» · 8 invitados · Asistencia obligatoria · Registrar en Strava.' })
        }
      >
        <CalendarPlus size={20} /> Convocar reunión
      </button>
    );

  if (id === 'froiz')
    return (
      <button
        className={btn}
        onClick={() => {
          setFlag('galicia', true);
          discover('galicia');
        }}
      >
        <CloudRain size={20} /> Activar Modo Galicia
      </button>
    );

  if (id === 'milla')
    return (
      <div>
        <button
          className={btn}
          onClick={() => {
            setComplaint((c) => pickOther(millaComplaints, c));
            discover('sofa');
          }}
        >
          <Megaphone size={20} /> Escuchar reclamación
        </button>
        <AnimatePresence mode="popLayout">
          {complaint && (
            <motion.p key={complaint} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 border-l-4 border-terra pl-4 font-serif text-2xl italic">
              {complaint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );

  if (id === 'david')
    return (
      <div>
        <button
          className={btn}
          onClick={() => {
            setAudit(true);
            discover('patrimonio');
          }}
        >
          <FileSearch size={20} /> Auditoría patrimonial
        </button>
        {audit && (
          <motion.table initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 w-full border-2 border-ink text-left text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="p-2 font-mono text-[11px] uppercase">Activo</th>
                <th className="p-2 font-mono text-[11px] uppercase">Declarado por David</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/20">
              <tr>
                <td className="p-2 font-semibold">Audi</td>
                <td className="p-2">«Un coche normal, para ir tirando»</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Piso en propiedad</td>
                <td className="p-2">«Bueno, es del banco, en realidad»</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Premio del Gordo</td>
                <td className="p-2">«Eso ya ni me acuerdo»</td>
              </tr>
              <tr className="bg-paper-2">
                <td className="p-2 font-semibold">Saldo emocional</td>
                <td className="p-2 font-mono font-semibold">2,37 €</td>
              </tr>
            </tbody>
            <caption className="caption-bottom pt-2 text-left text-xs text-ink/60">Conclusión: patrimonio evidente, pobreza declarada, bondad intacta.</caption>
          </motion.table>
        )}
      </div>
    );

  if (id === 'angela') return <ShoeCourt compact />;

  if (id === 'edu')
    return (
      <button
        className={btn}
        onClick={() => {
          setFlag('emergency', true);
          discover('ia');
        }}
      >
        <Cpu size={20} /> Optimizar con IA
      </button>
    );

  if (id === 'ana')
    return (
      <div>
        <button className={btn} onClick={() => setAnaFile(true)}>
          <Sparkles size={20} /> Verificar existencia
        </button>
        {anaFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 border-2 border-dashed border-ink p-4">
            <Stamp tone="rice" rotate={-3} animate>
              Existencia confirmada
            </Stamp>
            <p className="mt-3 leading-snug">Tras diez años de rumores, menciones indirectas y una foto borrosa, la organización certifica que Ana existe. Investigación cerrada. Bienvenida a PANCREAS.</p>
          </motion.div>
        )}
      </div>
    );

  if (id === 'luz')
    return (
      <div className="border-2 border-ink p-4">
        <p className="kicker text-ink/60">Selector de identidad pihippie</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(['pija', 'hippie'] as const).map((m) => (
            <button
              key={m}
              aria-pressed={luzMode === m}
              onClick={() => {
                setLuzMode(m);
                discover('luz');
              }}
              className={`border-2 px-3 py-2 font-display text-2xl font-black uppercase ${luzMode === m ? 'border-terra bg-terra text-paper' : 'border-ink'}`}
            >
              Modo {m}
            </button>
          ))}
        </div>
        <p className="mt-3 font-serif text-xl italic leading-snug">
          {luzMode === 'pija'
            ? '«Lo importante es la paz interior. Y una terraza con vistas al mar. Y que la casa sea de los yayos, claro».'
            : '«Todo fluye, todo es energía. Pero no me pongas en un alojamiento sin encanto, que me bloquea el chakra».'}
        </p>
      </div>
    );

  return (
    <div>
      <button
        className={btn}
        onClick={() => {
          const n = bmwClicks + 1;
          setBmwClicks(n);
          if (n >= 5) discover('bmw');
        }}
        aria-label="Inspeccionar el BMW"
      >
        <Car size={20} /> Inspeccionar BMW {bmwClicks > 0 && bmwClicks < 5 && `(${bmwClicks})`}
      </button>
      <AnimatePresence>
        {bmwClicks >= 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
            <Stamp tone="wine" rotate={-5} animate>
              Vehículo propiedad de la empresa
            </Stamp>
            <p className="mt-3 text-sm text-ink/70">Asientos calefactables: sí. Lucha obrera: archivada. Consumo: lo contará él, cuatro veces.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
