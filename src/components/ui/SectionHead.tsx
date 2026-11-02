import type { ReactNode } from 'react';

type Props = {
  number: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
};

export function SectionHead({ number, kicker, title, intro, dark }: Props) {
  return (
    <header className="mb-10 sm:mb-14">
      <div className={`flex items-center gap-3 border-b pb-3 ${dark ? 'border-paper/30' : 'border-ink/25'}`}>
        <span className={`kicker ${dark ? 'text-gold' : 'text-terra'}`}>§ {number}</span>
        <span className={`kicker ${dark ? 'text-paper/60' : 'text-ink/60'}`}>{kicker}</span>
      </div>
      <h2 className="display-tight mt-5 text-[clamp(3rem,13vw,9rem)]">{title}</h2>
      {intro && <div className={`mt-5 max-w-2xl font-serif text-xl leading-snug sm:text-2xl ${dark ? 'text-paper/80' : 'text-ink/80'}`}>{intro}</div>}
    </header>
  );
}
