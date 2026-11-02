import { people, type PersonId } from '../../data/people';
import { portraits } from '../../data/media';
import { Modal } from './Modal';
import { Photo } from './Photo';

type Props = { open: boolean; current: PersonId | null; onClose: () => void; onPick: (id: PersonId) => void };

export function IdentityPicker({ open, current, onClose, onPick }: Props) {
  return (
    <Modal open={open} onClose={onClose} label="Elegir credencial">
      <div className="p-6 sm:p-8">
        <p className="kicker text-terra">Control de acceso · Credencial PANCREAS</p>
        <h3 className="display-tight mt-3 text-5xl">¿Quién eres?</h3>
        <p className="mt-3 max-w-md font-serif text-lg leading-snug text-ink/75">
          Tu credencial se guarda solo en este dispositivo. Sirve para el Bingo, la firma de la Constitución, las misiones y las porras.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {people.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              aria-pressed={current === p.id}
              className={`group text-left ${current === p.id ? 'outline outline-3 outline-offset-2 outline-terra' : ''}`}
            >
              <Photo image={portraits[p.id]} sizes="160px" className="aspect-[4/5] w-full bg-paper-2" imgClassName="transition-transform duration-300 group-hover:scale-105" fallbackLabel={p.name} minimal />
              <span className="mt-1 block font-display text-xl font-black uppercase leading-none">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
