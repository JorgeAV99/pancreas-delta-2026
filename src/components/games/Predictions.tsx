import { predictions } from '../../data/games';
import { people, personById, type PersonId } from '../../data/people';
import { useIdentity } from '../../lib/identity';
import { useStored } from '../../lib/storage';
import { Avatar } from '../ui/Avatar';

type Picks = Partial<Record<PersonId, Record<string, string>>>;
const noPicks: Picks = {};
const noOutcomes: Record<string, string> = {};

export function Predictions() {
  const { me, ask } = useIdentity();
  const [picks, setPicks] = useStored('porra', noPicks);
  const [outcomes, setOutcomes] = useStored('porra-real', noOutcomes);

  const mine = me ? (picks[me] ?? {}) : {};
  const score = (id: PersonId) => predictions.reduce((s, q) => s + (outcomes[q.id] && picks[id]?.[q.id] === outcomes[q.id] ? 100 : 0), 0);
  const players = people.filter((p) => picks[p.id] && Object.keys(picks[p.id]!).length);

  return (
    <div>
      {!me ? (
        <div className="border-2 border-gold p-5">
          <p className="font-serif text-2xl italic">Para guardar pronósticos necesitas una credencial.</p>
          <button onClick={ask} className="mt-4 bg-gold px-5 py-3 font-display text-xl font-black uppercase text-ink">
            Elegir credencial
          </button>
        </div>
      ) : (
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-paper/60">
          Pronosticando como {personById[me].name} · 100 puntos ficticios por acierto · guardado en este dispositivo
        </p>
      )}

      <ol className="mt-6 space-y-6">
        {predictions.map((q, i) => (
          <li key={q.id} className="border-2 border-paper/25 p-4 sm:p-5">
            <p className="font-display text-2xl font-black uppercase leading-tight sm:text-3xl">
              <span className="text-gold">{i + 1}.</span> {q.q}
            </p>
            <div className="mt-3">
              <p className="kicker text-[10px] text-paper/50">Tu pronóstico</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {q.options.map((o) => (
                  <button
                    key={o}
                    disabled={!me}
                    aria-pressed={mine[q.id] === o}
                    onClick={() => me && setPicks({ ...picks, [me]: { ...mine, [q.id]: o } })}
                    className={`min-h-11 border-2 px-2 py-2 text-sm font-semibold leading-tight disabled:opacity-40 ${mine[q.id] === o ? 'border-gold bg-gold text-ink' : 'border-paper/40 hover:border-paper'}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 border-t border-dashed border-paper/25 pt-3">
              <label htmlFor={`real-${q.id}`} className="kicker text-[10px] text-rice brightness-200">
                Lo que realmente ha ocurrido (registrar durante el viaje)
              </label>
              <select
                id={`real-${q.id}`}
                value={outcomes[q.id] ?? ''}
                onChange={(e) => {
                  const next = { ...outcomes };
                  if (e.target.value) next[q.id] = e.target.value;
                  else delete next[q.id];
                  setOutcomes(next);
                }}
                className="mt-1 w-full border-2 border-paper/40 bg-ink px-3 py-2.5 text-sm text-paper"
              >
                <option value="">Sin registrar todavía</option>
                {q.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ol>

      {players.length > 0 && (
        <div className="mt-8 bg-paper p-4 text-ink sm:p-5">
          <p className="kicker text-terra">Clasificación (solo pronósticos guardados en este dispositivo)</p>
          <ul className="mt-3 divide-y divide-ink/15">
            {players
              .sort((a, b) => score(b.id) - score(a.id))
              .map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2">
                  <Avatar id={p.id} size={32} ring="ring-ink" />
                  <span className="flex-1 font-semibold">{p.name}</span>
                  <span className="font-mono text-sm">{score(p.id)} pts</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
