import { ExternalLink, Phone } from 'lucide-react';
import { episodes } from '../../data/itinerary';
import { events, reservations, statusLabels, type ReservationStatus } from '../../data/reservations';
import { checklist, glutenNotes, planB, safetyNotes } from '../../data/practical';
import { useStored } from '../../lib/storage';
import { SectionHead } from '../ui/SectionHead';
import { emptyStatuses } from './Itinerary';

const statusOrder: ReservationStatus[] = ['pendiente', 'solicitada', 'confirmada', 'descartada'];
const statusDot: Record<ReservationStatus, string> = {
  pendiente: 'bg-terra',
  solicitada: 'bg-gold',
  confirmada: 'bg-rice',
  descartada: 'bg-ink',
};
const noChecks: Record<string, boolean> = {};

export function Annex() {
  const [statuses, setStatuses] = useStored('reservas', emptyStatuses);
  const [checks, setChecks] = useStored('equipaje', noChecks);
  const confirmed = reservations.filter((r) => statuses[r.id] === 'confirmada').length;
  const packed = checklist.filter((c) => checks[c]).length;

  return (
    <section id="anexo" className="grain bg-paper px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead
          number="09"
          kicker="Anexo oficial · Información práctica"
          title={
            <>
              El plan, <span className="font-serif font-normal normal-case italic text-terra">en frío</span>
            </>
          }
          intro="Para quien necesite datos en vez de fe. Información consultada en las webs oficiales el 2 de noviembre de 2026; lo no verificado está marcado."
        />

        <div className="overflow-hidden border-2 border-ink">
          <p className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-paper">Itinerario resumido</p>
          <div className="divide-y divide-ink/20">
            {episodes.map((ep) => (
              <div key={ep.id} className="grid sm:grid-cols-[10rem_1fr]">
                <a href={`#${ep.id}`} className="flex items-baseline gap-2 border-b border-ink/20 bg-paper-2 p-3 sm:border-b-0 sm:border-r">
                  <span className="font-display text-2xl font-black uppercase">{ep.weekday}</span>
                  <span className="font-mono text-xs">{ep.date}</span>
                </a>
                <ul className="p-3 text-sm">
                  {ep.events.map((e) => (
                    <li key={e.title} className="flex gap-3 py-0.5">
                      <span className="w-16 shrink-0 font-mono text-xs leading-5 text-ink/60">{e.time}</span>
                      <span>{e.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div id="reservas" className="mt-16 scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="display-tight text-5xl sm:text-6xl">Reservas</h3>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink/60">
              {confirmed}/{reservations.length} confirmadas · estado guardado en este dispositivo
            </p>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-ink/70">
            Nada está confirmado hasta que alguien lo cambie aquí. Al confirmar una reserva, conviene avisar por el grupo: este estado no se sincroniza entre móviles.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {reservations.map((r) => {
              const st = statuses[r.id] ?? 'pendiente';
              return (
                <li key={r.id} className="flex flex-col border-2 border-ink bg-paper">
                  <div className="flex items-start justify-between gap-3 border-b-2 border-ink p-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-terra">{r.day}</p>
                      <h4 className="mt-1 font-display text-3xl font-black uppercase leading-none">{r.name}</h4>
                      <p className="mt-1 text-sm text-ink/75">{r.what}</p>
                    </div>
                    <span className={`mt-1 h-4 w-4 shrink-0 rounded-full ${statusDot[st]}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 p-4 text-sm">
                    <ul className="space-y-1">
                      {r.facts.map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="text-rice">✓</span>
                          {f}
                        </li>
                      ))}
                      {r.unverified?.map((f) => (
                        <li key={f} className="flex gap-2 text-ink/70">
                          <span className="text-terra">?</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.phone?.map((ph) => (
                        <a key={ph} href={`tel:+34${ph.replace(/\s/g, '')}`} className="inline-flex min-h-10 items-center gap-1 border-2 border-ink px-3 font-mono text-xs font-semibold hover:bg-ink hover:text-paper">
                          <Phone size={12} /> {ph}
                        </a>
                      ))}
                      {r.links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 border-2 border-ink/40 px-3 font-mono text-xs uppercase hover:border-ink">
                          {l.label} <ExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="border-t-2 border-ink p-3">
                    <label htmlFor={`st-${r.id}`} className="sr-only">
                      Estado de {r.name}
                    </label>
                    <select
                      id={`st-${r.id}`}
                      value={st}
                      onChange={(e) => setStatuses({ ...statuses, [r.id]: e.target.value as ReservationStatus })}
                      className="w-full border-2 border-ink bg-paper-2 px-3 py-2.5 font-semibold"
                    >
                      {statusOrder.map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <div key={e.name} className="border-2 border-ink p-4">
              <p className="kicker text-terra">Evento verificado</p>
              <h4 className="mt-1 font-display text-3xl font-black uppercase leading-none">{e.name}</h4>
              <ul className="mt-3 space-y-1 text-sm">
                {e.facts.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-rice">✓</span>
                    {f}
                  </li>
                ))}
                {e.unverified.map((f) => (
                  <li key={f} className="flex gap-2 text-ink/70">
                    <span className="text-terra">?</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={e.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 font-mono text-xs uppercase underline">
                Fuente oficial <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="border-2 border-gold bg-gold/15 p-5">
            <p className="kicker text-ink/70">Recordatorios alimentarios · Patri</p>
            <h4 className="mt-1 font-display text-4xl font-black uppercase leading-none">Sin gluten</h4>
            <ul className="mt-4 space-y-2">
              {glutenNotes.map((n) => (
                <li key={n} className="flex gap-2 leading-snug">
                  <span className="font-bold text-terra">!</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-wine p-5">
            <p className="kicker text-wine">Ministerio de Sanidad · Luz</p>
            <h4 className="mt-1 font-display text-4xl font-black uppercase leading-none">Seguridad</h4>
            <ul className="mt-4 space-y-2">
              {safetyNotes.map((n) => (
                <li key={n} className="flex gap-2 leading-snug">
                  <span className="font-bold text-wine">!</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-2 border-ink p-5">
            <div className="flex items-baseline justify-between">
              <h4 className="font-display text-4xl font-black uppercase leading-none">Equipaje</h4>
              <span className="font-mono text-sm">
                {packed}/{checklist.length}
              </span>
            </div>
            <ul className="mt-4 divide-y divide-ink/10">
              {checklist.map((c) => (
                <li key={c}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 py-1.5">
                    <input type="checkbox" checked={!!checks[c]} onChange={() => setChecks({ ...checks, [c]: !checks[c] })} className="h-5 w-5 shrink-0 accent-terra" />
                    <span className={checks[c] ? 'text-ink/40 line-through' : ''}>{c}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-petrol p-5">
            <p className="kicker text-petrol">Plan B · lluvia y viento</p>
            <h4 className="mt-1 font-display text-4xl font-black uppercase leading-none">Si el tiempo no acompaña</h4>
            <p className="mt-2 text-sm text-ink/60">Sin previsiones inventadas: consultar AEMET o Meteocat el día antes.</p>
            <ul className="mt-4 space-y-4">
              {planB.map((p) => (
                <li key={p.day}>
                  <p className="font-display text-2xl font-black uppercase">{p.day}</p>
                  <p className="leading-snug text-ink/80">{p.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="https://www.aemet.es/es/eltiempo/prediccion/municipios/ampolla-l-id43906" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 border-2 border-petrol px-3 font-mono text-xs uppercase">
                AEMET <ExternalLink size={11} />
              </a>
              <a href="https://www.meteo.cat/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 border-2 border-petrol px-3 font-mono text-xs uppercase">
                Meteocat <ExternalLink size={11} />
              </a>
              <a href="https://ampollaturisme.com/" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 border-2 border-petrol px-3 font-mono text-xs uppercase">
                Turismo L'Ampolla <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
