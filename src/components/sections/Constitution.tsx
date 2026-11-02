import { AnimatePresence, motion } from 'motion/react';
import { constitution } from '../../data/games';
import { people, personById, type PersonId } from '../../data/people';
import { useIdentity } from '../../lib/identity';
import { useStored } from '../../lib/storage';
import { formatStamp } from '../../lib/time';
import { Modal } from '../ui/Modal';
import { Seal } from '../ui/Seal';
import { Avatar } from '../ui/Avatar';

type Signatures = Partial<Record<PersonId, number>>;
const noSignatures: Signatures = {};

export function useSignatures() {
  return useStored<Signatures>('firmas', noSignatures);
}

export function Constitution({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [signatures, setSignatures] = useSignatures();
  const { me, setMe } = useIdentity();
  const signed = me ? signatures[me] : undefined;

  return (
    <Modal open={open} onClose={onClose} label="Constitución PANCREAS" wide>
      <div className="px-5 pb-10 pt-6 sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto w-28 text-wine">
            <Seal text="CONSTITUCIÓN · REPÚBLICA PANCREAS · " center="MMXXVI" />
          </div>
          <p className="kicker mt-4 text-terra">Texto refundido · Promulgado en la terraza</p>
          <h3 className="display-tight mt-3 text-[clamp(2.6rem,9vw,5rem)]">Constitución PANCREAS Delta</h3>
          <p className="mt-3 font-serif text-xl italic text-ink/70">Aprobada por aclamación, con un voto particular en contra procedente del sofá.</p>
        </div>

        <ol className="mx-auto mt-10 max-w-3xl divide-y divide-ink/15 border-y-2 border-ink">
          {constitution.map((a, i) => (
            <motion.li
              key={a}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="grid grid-cols-[3.6rem_1fr] gap-2 py-3"
            >
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-terra">Art. {i + 1}</span>
              <span className="font-serif text-xl leading-snug">{a}</span>
            </motion.li>
          ))}
        </ol>

        <div className="mx-auto mt-10 max-w-3xl">
          <p className="kicker text-ink/60">Firma simbólica · se guarda en este dispositivo</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-9">
            {people.map((p) => (
              <button
                key={p.id}
                onClick={() => setMe(p.id)}
                aria-pressed={me === p.id}
                className={`flex flex-col items-center gap-1 border-2 p-2 ${me === p.id ? 'border-terra bg-terra/10' : 'border-transparent'}`}
              >
                <Avatar id={p.id} size={44} ring={signatures[p.id] ? 'ring-rice' : 'ring-paper-3'} />
                <span className="text-xs font-semibold">{p.name}</span>
              </button>
            ))}
          </div>
          <div className="relative mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              disabled={!me || !!signed}
              onClick={() => me && setSignatures({ ...signatures, [me]: Date.now() })}
              className="bg-ink px-6 py-4 font-display text-2xl font-black uppercase tracking-wide text-paper transition-colors enabled:hover:bg-terra disabled:opacity-40"
            >
              {!me ? 'Elige quién firma' : signed ? 'Ya has firmado' : `Firmar como ${personById[me].name}`}
            </button>
            <AnimatePresence>
              {signed && me && (
                <motion.div
                  key={me}
                  initial={{ scale: 3, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: -10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                  className="w-32 text-wine"
                >
                  <Seal text={`FIRMADO · ${personById[me].name.toUpperCase()} · `} center="OK" sub={formatStamp(signed)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <ul className="mt-6 space-y-1 font-mono text-xs text-ink/70">
            {people
              .filter((p) => signatures[p.id])
              .map((p) => (
                <li key={p.id}>
                  ✓ {p.name} — {formatStamp(signatures[p.id]!)}
                </li>
              ))}
          </ul>
          {Object.keys(signatures).length > 0 && (
            <button onClick={() => setSignatures({})} className="mt-4 font-mono text-xs underline text-ink/50">
              Anular todas las firmas de este dispositivo
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
