import { portraits } from '../../data/media';
import { personById, type PersonId } from '../../data/people';
import { Photo } from './Photo';

type Props = { id: PersonId; size?: number; className?: string; ring?: string };

export function Avatar({ id, size = 40, className = '', ring = 'ring-paper' }: Props) {
  const p = personById[id];
  return (
    <span className={`inline-block shrink-0 overflow-hidden rounded-full ring-2 ${ring} ${className}`} style={{ width: size, height: size }}>
      <Photo image={{ ...portraits[id], alt: p.name }} sizes={`${size * 2}px`} className="h-full w-full" fallbackLabel={p.name} minimal />
    </span>
  );
}
