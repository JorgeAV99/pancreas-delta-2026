import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { personById, type PersonId } from '../../data/people';
import { useFeedback } from '../../lib/feedback';
import { SectionHead } from '../ui/SectionHead';
import { Avatar } from '../ui/Avatar';

type LonLat = [number, number];

const peninsula: LonLat[] = [
  [-8.87, 41.87], [-8.82, 42.2], [-8.95, 42.55], [-9.27, 42.9], [-9.2, 43.18], [-8.4, 43.38], [-7.68, 43.78], [-7.04, 43.55],
  [-5.85, 43.65], [-4.5, 43.4], [-3.8, 43.47], [-2.95, 43.42], [-1.79, 43.38], [-1.4, 43.05], [-0.7, 42.85], [0.7, 42.86],
  [1.45, 42.6], [2.2, 42.43], [3.17, 42.43], [3.32, 42.32], [3.18, 42.1], [2.8, 41.65], [2.17, 41.38], [1.25, 41.1],
  [0.95, 40.92], [0.72, 40.82], [0.88, 40.72], [0.62, 40.6], [0.35, 40.38], [0.0, 39.95], [-0.33, 39.45], [-0.2, 39.05],
  [0.23, 38.73], [-0.48, 38.34], [-0.7, 37.63], [-0.98, 37.58], [-1.65, 37.38], [-2.19, 36.72], [-2.46, 36.83], [-3.52, 36.72],
  [-4.42, 36.72], [-5.15, 36.43], [-5.35, 36.15], [-5.6, 36.01], [-6.03, 36.2], [-6.29, 36.53], [-6.4, 36.8], [-6.9, 37.18],
  [-7.4, 37.17], [-7.5, 37.6], [-7.0, 38.2], [-7.3, 38.8], [-7.0, 39.0], [-7.53, 39.66], [-6.9, 40.25], [-6.85, 41.0],
  [-6.2, 41.6], [-6.6, 41.95], [-7.2, 41.88], [-8.1, 42.05],
];

const islands: LonLat[][] = [
  [[2.35, 39.58], [2.7, 39.92], [3.2, 39.96], [3.47, 39.72], [3.25, 39.35], [2.95, 39.37], [2.6, 39.48]],
  [[3.8, 40.05], [4.3, 40.08], [4.32, 39.86], [3.85, 39.93]],
  [[1.2, 38.98], [1.55, 39.1], [1.6, 38.95], [1.4, 38.84]],
];

const project = ([lon, lat]: LonLat): [number, number] => [(lon + 9.6) * 46, (44 - lat) * 60];
const toPath = (pts: LonLat[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${project(p).map((n) => n.toFixed(1)).join(',')}`).join(' ') + ' Z';

type Place = { id: string; name: string; at: LonLat; people: PersonId[]; color: string; label: 'left' | 'right' | 'top' | 'bottom' };

const places: Place[] = [
  { id: 'santander', name: 'Santander', at: [-3.8, 43.46], people: ['patri'], color: '#0E4552', label: 'bottom' },
  { id: 'vigo', name: 'Vigo', at: [-8.72, 42.24], people: ['froiz'], color: '#0E4552', label: 'right' },
  { id: 'valladolid', name: 'Valladolid', at: [-4.72, 41.65], people: ['angela'], color: '#1E4A36', label: 'left' },
  { id: 'madrid', name: 'Comunidad de Madrid', at: [-3.7, 40.42], people: ['luz', 'jorge', 'david'], color: '#6B1C28', label: 'left' },
  { id: 'mora', name: 'Mora, Toledo', at: [-3.77, 39.68], people: ['edu'], color: '#1E4A36', label: 'left' },
  { id: 'estepona', name: 'Estepona', at: [-5.15, 36.43], people: ['milla'], color: '#C2532B', label: 'top' },
  { id: 'mallorca', name: 'Mallorca', at: [2.95, 39.62], people: ['ana'], color: '#B07A2A', label: 'bottom' },
];

const destination: LonLat = [0.71, 40.81];

const alliances = [
  { name: 'Alianza Atlántica', people: ['patri', 'froiz'] as PersonId[], color: '#0E4552' },
  { name: 'Confederación de los Perjudicados', people: ['milla'] as PersonId[], color: '#C2532B' },
  { name: 'Eje de las Dos Castillas', people: ['david', 'angela', 'edu'] as PersonId[], color: '#1E4A36' },
  { name: 'Potencia Insular', people: ['ana'] as PersonId[], color: '#B07A2A' },
  { name: 'Monarquía del Noroeste Madrileño', people: ['luz', 'jorge'] as PersonId[], color: '#6B1C28' },
];

const madridPoints: { id: string; name: string; at: LonLat; who: PersonId; note: string }[] = [
  { id: 'lasmatas', name: 'Las Matas', at: [-3.93, 40.55], who: 'luz', note: 'Sede natal de la Presidenta Honorífica.' },
  { id: 'lasrozas', name: 'Las Rozas', at: [-3.87, 40.49], who: 'jorge', note: 'Residencia actual del Líder Supremo. Asientos calefactables incluidos.' },
  { id: 'vallecas', name: 'Vallecas', at: [-3.65, 40.38], who: 'jorge', note: 'Origen obrero del Líder Supremo.' },
  { id: 'brea', name: 'Brea de Tajo', at: [-3.1, 40.24], who: 'david', note: 'Cuna del Ministro de Hacienda y, al menos, de un Gordo.' },
];

const projectMadrid = ([lon, lat]: LonLat): [number, number] => [(lon + 4.1) * 0.766 * 330 + 120, (40.66 - lat) * 330 + 30];

export function Origins() {
  const [selected, setSelected] = useState<string | null>(null);
  const [migration, setMigration] = useState(false);
  const { discover } = useFeedback();
  const reduce = useReducedMotion();
  const place = places.find((p) => p.id === selected);
  const [dx, dy] = project(destination);

  const select = (id: string) => setSelected((s) => (s === id ? null : id));

  return (
    <section id="nacion" className="grain bg-paper px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          number="03"
          kicker="Mapa de procedencias"
          title={
            <>
              Nueve personas. <span className="text-terra">Una nación ingobernable.</span>
            </>
          }
          intro="Siete territorios de origen, cinco alianzas ficticias y un solo destino. Toca una procedencia para ver a su representante."
        />

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="border-2 border-ink bg-paper-2 p-2 sm:p-4">
            <svg viewBox="0 0 680 500" className="w-full" role="group" aria-label="Mapa de España con las procedencias del grupo">
              <defs>
                <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#17140F" strokeOpacity=".12" strokeWidth="2" />
                </pattern>
              </defs>
              <text x="40" y="260" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="18" fill="#17140F" fillOpacity=".4" transform="rotate(-90 40 260)">
                Océano Atlántico
              </text>
              <text x="180" y="22" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="18" fill="#17140F" fillOpacity=".4">
                Mar Cantábrico
              </text>
              <text x="520" y="330" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="18" fill="#17140F" fillOpacity=".4">
                Mediterráneo
              </text>
              <path d={toPath(peninsula)} fill="#F2EADB" stroke="#17140F" strokeWidth="2" strokeLinejoin="round" />
              <path d={toPath(peninsula)} fill="url(#hatch)" />
              {islands.map((isl, i) => (
                <path key={i} d={toPath(isl)} fill="#F2EADB" stroke="#17140F" strokeWidth="1.6" />
              ))}

              {places.map((p, i) => {
                const [x, y] = project(p.at);
                const active = selected === p.id;
                const mx = (x + dx) / 2;
                const my = Math.min(y, dy) - 40 - i * 6;
                return (
                  <motion.path
                    key={`l-${p.id}`}
                    d={`M${x},${y} Q${mx},${my} ${dx},${dy}`}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={active ? 3 : 1.6}
                    strokeDasharray="5 5"
                    strokeOpacity={selected && !active ? 0.2 : 0.85}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2 + i * 0.12 }}
                  />
                );
              })}

              <g transform={`translate(${dx},${dy})`}>
                <motion.circle r="16" fill="#C2532B" fillOpacity=".25" animate={reduce ? undefined : { r: [12, 22, 12] }} transition={{ repeat: Infinity, duration: 2.4 }} />
                <path d="M0,-11 L3,-3 L11,-3 L5,2 L7,10 L0,5 L-7,10 L-5,2 L-11,-3 L-3,-3 Z" fill="#C2532B" stroke="#17140F" strokeWidth="1.2" />
                <text x="-14" y="-18" textAnchor="end" fontFamily="Big Shoulders Display, sans-serif" fontWeight="900" fontSize="27" fill="#17140F">
                  L'AMPOLLA
                </text>
              </g>

              {places.map((p) => {
                const [x, y] = project(p.at);
                const active = selected === p.id;
                const lx = p.label === 'left' ? -17 : p.label === 'right' ? 17 : 0;
                const ly = p.label === 'top' ? -18 : p.label === 'bottom' ? 32 : 8;
                const anchor = p.label === 'left' ? 'end' : p.label === 'right' ? 'start' : 'middle';
                return (
                  <g
                    key={p.id}
                    transform={`translate(${x},${y})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${p.name}: ${p.people.map((id) => personById[id].name).join(', ')}`}
                    aria-pressed={active}
                    onClick={() => select(p.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), select(p.id))}
                    className="cursor-pointer outline-none [&:focus-visible>circle:nth-child(2)]:stroke-[#C2532B]"
                  >
                    <circle r="30" fill="transparent" />
                    <circle r={active ? 13 : 10} fill={p.color} stroke="#F2EADB" strokeWidth="3" />
                    {p.people.length > 1 && (
                      <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#F2EADB" fontFamily="IBM Plex Mono">
                        {p.people.length}
                      </text>
                    )}
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={anchor}
                      fontFamily="Big Shoulders Display, sans-serif"
                      fontWeight="800"
                      fontSize="24"
                      fill="#17140F"
                      stroke="#F2EADB"
                      strokeWidth="4"
                      paintOrder="stroke"
                    >
                      {p.id === 'madrid' ? 'MADRID ×3' : p.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-3 flex flex-wrap gap-2">
              {places.map((p) => (
                <button
                  key={p.id}
                  onClick={() => select(p.id)}
                  aria-pressed={selected === p.id}
                  className={`flex min-h-11 items-center gap-2 border-2 px-2 py-1 text-sm font-semibold ${selected === p.id ? 'border-ink bg-ink text-paper' : 'border-ink/40 bg-paper'}`}
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="min-h-[220px] border-2 border-ink bg-ink p-5 text-paper" aria-live="polite">
              <AnimatePresence mode="popLayout">
                {place ? (
                  <motion.div key={place.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p className="kicker text-gold">Delegación territorial</p>
                    <h3 className="display-tight mt-2 text-5xl">{place.name}</h3>
                    <ul className="mt-4 space-y-4">
                      {place.people.map((id) => (
                        <li key={id} className="flex items-start gap-3">
                          <Avatar id={id} size={64} ring="ring-gold" />
                          <div>
                            <p className="font-display text-2xl font-black uppercase leading-none">{personById[id].name}</p>
                            <p className="kicker mt-1 text-[10px] text-paper/60">{personById[id].alliance}</p>
                            <p className="mt-1 font-serif text-lg italic leading-snug text-paper/85">{personById[id].mapLine}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="kicker text-gold">Delegación territorial</p>
                    <p className="mt-3 font-serif text-2xl italic leading-snug text-paper/80">
                      Selecciona un punto del mapa. Todos los caminos llevan a L'Ampolla; algunos, con escala gastronómica.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-2 border-ink bg-paper p-4">
              <p className="kicker text-terra">Detalle · Comunidad de Madrid</p>
              <svg viewBox="0 0 400 230" className="mt-2 w-full" role="group" aria-label="Detalle de Madrid: Las Matas, Las Rozas, Vallecas y Brea de Tajo">
                <rect x="4" y="4" width="392" height="222" fill="url(#hatch)" stroke="#17140F" strokeOpacity=".3" />
                {(() => {
                  const [vx, vy] = projectMadrid([-3.65, 40.38]);
                  const [rx, ry] = projectMadrid([-3.87, 40.49]);
                  return (
                    <motion.path
                      d={`M${vx},${vy - 8} Q${vx + 2},${ry} ${rx + 10},${ry}`}
                      fill="none"
                      stroke="#6B1C28"
                      strokeWidth={migration ? 3.5 : 2}
                      strokeDasharray={migration ? '0' : '4 4'}
                      markerEnd="url(#arrow)"
                      animate={{ pathLength: migration ? [0, 1] : 1 }}
                      transition={{ duration: 1.2 }}
                    />
                  );
                })()}
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 Z" fill="#6B1C28" />
                  </marker>
                </defs>
                {madridPoints.map((m) => {
                  const [x, y] = projectMadrid(m.at);
                  const right = m.id === 'vallecas';
                  return (
                    <g
                      key={m.id}
                      transform={`translate(${x},${y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${m.name}: ${m.note}`}
                      className="cursor-pointer"
                      onClick={() => {
                        if (m.id === 'vallecas' || m.id === 'lasrozas') {
                          setMigration(true);
                          discover('vallecas');
                        }
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && (m.id === 'vallecas' || m.id === 'lasrozas')) {
                          e.preventDefault();
                          setMigration(true);
                          discover('vallecas');
                        }
                      }}
                    >
                      <circle r="24" fill="transparent" />
                      <circle r="7" fill={m.who === 'david' ? '#1E4A36' : '#6B1C28'} stroke="#F2EADB" strokeWidth="2.5" />
                      <text
                        x={right ? 12 : -12}
                        y={5}
                        textAnchor={right ? 'start' : 'end'}
                        fontFamily="Big Shoulders Display, sans-serif"
                        fontWeight="800"
                        fontSize="16"
                        fill="#17140F"
                      >
                        {m.name.toUpperCase()} · {personById[m.who].name}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <AnimatePresence mode="popLayout">
                {migration ? (
                  <motion.p key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 font-serif text-lg italic leading-snug">
                    <strong className="not-italic">Migración presidencial:</strong> de Vallecas a Las Rozas. De la lucha obrera a los asientos calefactables. La revolución terminó al descubrir el BMW corporativo.
                  </motion.p>
                ) : (
                  <motion.p key="n" className="mt-2 text-sm text-ink/60">
                    Toca Vallecas para trazar la migración presidencial.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {alliances.map((a) => (
            <div key={a.name} className="border-t-4 bg-paper-2 p-4" style={{ borderColor: a.color }}>
              <p className="font-display text-xl font-black uppercase leading-tight">{a.name}</p>
              <div className="mt-3 flex -space-x-2">
                {a.people.map((id) => (
                  <Avatar key={id} id={id} size={40} />
                ))}
              </div>
              <p className="mt-2 text-sm text-ink/70">{a.people.map((id) => personById[id].name).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
