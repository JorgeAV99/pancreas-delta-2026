import { motion } from 'motion/react';
import { ExternalLink, MapPin } from 'lucide-react';
import { episodes, flagLabels, type Flag } from '../../data/itinerary';
import { reservationById, statusLabels, type ReservationStatus } from '../../data/reservations';
import { useStored } from '../../lib/storage';
import { phaseAt, useNow } from '../../lib/time';
import { SectionHead } from '../ui/SectionHead';
import { Avatar } from '../ui/Avatar';

const flagStyle: Record<Flag, string> = {
  gluten: 'border-gold text-ink bg-gold/25',
  conductores: 'border-wine text-wine',
  opcional: 'border-ink/40 text-ink/70',
  calzado: 'border-rice text-rice',
  fauna: 'border-rice text-rice',
  tiempo: 'border-petrol text-petrol',
  teletrabajo: 'border-ink/40 text-ink/70',
};

const statusStyle: Record<ReservationStatus, string> = {
  pendiente: 'bg-terra text-paper',
  solicitada: 'bg-gold text-ink',
  confirmada: 'bg-rice text-paper',
  descartada: 'bg-ink text-paper',
};

export const emptyStatuses: Record<string, ReservationStatus> = {};

export function Itinerary() {
  const [statuses] = useStored('reservas', emptyStatuses);
  const now = useNow(60000);
  const phase = phaseAt(now);
  const current = phase.kind === 'during' ? phase.episode : null;

  return (
    <section id="itinerario" className="bg-paper px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          number="05"
          kicker="Itinerario oficial · Cinco episodios"
          title={
            <>
              Orden <span className="text-terra">del día</span>
            </>
          }
          intro="Horarios orientativos en hora peninsular. Lo que no está confirmado aparece como pendiente hasta que alguien lo cambie en el Anexo."
        />

        <nav aria-label="Episodios" className="sticky top-14 z-30 -mx-4 mb-14 grid grid-cols-5 border-y-2 border-ink bg-paper/95 backdrop-blur sm:mx-0 sm:border-2">
          {episodes.map((ep) => (
            <a
              key={ep.id}
              href={`#${ep.id}`}
              className={`border-l-2 border-ink px-1 py-2 text-center first:border-l-0 hover:bg-paper-2 ${current === ep.id ? 'bg-ink text-paper hover:bg-ink' : ''}`}
            >
              <span className="block font-display text-2xl font-black leading-none sm:text-3xl">{ep.number}</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.1em]">{ep.weekday.slice(0, 3)}</span>
            </a>
          ))}
        </nav>

        <div className="space-y-24">
          {episodes.map((ep) => (
            <article key={ep.id} id={ep.id} className="scroll-mt-32">
              <header className="relative overflow-hidden p-5 text-paper sm:p-8" style={{ background: ep.color }}>
                <span className="pointer-events-none absolute -right-3 -top-8 font-display text-[11rem] font-black leading-none text-paper/10 sm:text-[16rem]">{ep.number}</span>
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="kicker">
                      Episodio {ep.number} · {ep.weekday} {ep.date}
                    </span>
                    {current === ep.id && <span className="kicker animate-pulse bg-paper px-2 py-0.5 text-ink">● En curso</span>}
                  </div>
                  <h3 className="display-tight mt-4 text-[clamp(2.8rem,11vw,6.5rem)]">{ep.title}</h3>
                  {ep.subtitle && <p className="mt-2 font-serif text-2xl italic">{ep.subtitle}</p>}
                  <p className="mt-5 max-w-2xl font-serif text-xl italic leading-snug text-paper/90">«{ep.narrative}»</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {ep.cast.map((id) => (
                        <Avatar key={id} id={id} size={38} ring="ring-paper" />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/70">Protagonistas del episodio</span>
                  </div>
                </div>
              </header>

              <ol className="border-x-2 border-b-2 border-ink">
                {ep.events.map((ev, i) => {
                  const res = ev.reservation ? reservationById[ev.reservation] : undefined;
                  const status = ev.reservation ? (statuses[ev.reservation] ?? 'pendiente') : undefined;
                  return (
                    <motion.li
                      key={ev.title}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ delay: Math.min(i * 0.04, 0.2) }}
                      className="grid grid-cols-[4.6rem_1fr] border-t border-ink/20 first:border-t-0 sm:grid-cols-[8rem_1fr]"
                    >
                      <div className="border-r border-ink/20 p-3 sm:p-5">
                        <span className="font-mono text-base font-semibold leading-none sm:text-xl">{ev.time}</span>
                      </div>
                      <div className="p-3 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h4 className="font-display text-[1.7rem] font-black uppercase leading-[0.95] sm:text-4xl">
                            {ev.anchor ? (
                              <a href={`#${ev.anchor}`} className="underline decoration-terra decoration-[3px] underline-offset-4">
                                {ev.title}
                              </a>
                            ) : (
                              ev.title
                            )}
                          </h4>
                          {status && (
                            <a href="#reservas" className={`px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${statusStyle[status]}`}>
                              {statusLabels[status]}
                            </a>
                          )}
                        </div>
                        {ev.place && (
                          <p className="mt-1 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.1em] text-ink/60">
                            <MapPin size={12} /> {ev.place}
                          </p>
                        )}
                        <p className="mt-2 max-w-2xl leading-relaxed text-ink/85">{ev.text}</p>
                        {ev.bullets && (
                          <ul className="mt-2 space-y-1">
                            {ev.bullets.map((b) => (
                              <li key={b} className="flex gap-2 text-ink/85">
                                <span className="text-terra">→</span>
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                        {ev.note && <p className="mt-3 border-l-4 border-gold bg-gold/15 px-3 py-2 text-sm leading-snug">{ev.note}</p>}
                        {(ev.flags?.length || ev.links?.length || res) && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {ev.flags?.map((f) => (
                              <span key={f} className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${flagStyle[f]}`}>
                                {flagLabels[f]}
                              </span>
                            ))}
                            {[...(ev.links ?? []), ...(res?.links ?? [])].map((l) => (
                              <a
                                key={l.href}
                                href={l.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 border border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] hover:bg-ink hover:text-paper"
                              >
                                {l.label} <ExternalLink size={10} />
                              </a>
                            ))}
                            {res?.phone?.map((ph) => (
                              <a key={ph} href={`tel:+34${ph.replace(/\s/g, '')}`} className="border border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] hover:bg-ink hover:text-paper">
                                ☎ {ph}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </ol>

              {(ep.challenge || ep.gags || ep.note) && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {ep.challenge && (
                    <div className="border-2 border-ink bg-paper-2 p-5">
                      <p className="kicker text-terra">Desafío oficial</p>
                      <h4 className="mt-1 font-display text-3xl font-black uppercase leading-none">{ep.challenge.title}</h4>
                      <ol className="mt-3 space-y-1">
                        {ep.challenge.items.map((c, i) => (
                          <li key={c} className="flex gap-2">
                            <span className="font-mono text-terra">{i + 1}.</span>
                            {c}
                          </li>
                        ))}
                      </ol>
                      <p className="mt-3 text-sm text-ink/70">{ep.challenge.note}</p>
                    </div>
                  )}
                  {ep.gags && (
                    <div className="border-2 border-ink p-5">
                      <p className="kicker text-terra">Parte de inteligencia</p>
                      <ul className="mt-2 space-y-2">
                        {ep.gags.map((g) => (
                          <li key={g} className="font-serif text-lg leading-snug">
                            — {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {ep.note && <p className="border-l-4 border-petrol bg-petrol/10 p-4 text-sm leading-relaxed md:col-span-2">{ep.note}</p>}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
