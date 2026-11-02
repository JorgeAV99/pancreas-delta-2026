import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  tone?: 'terra' | 'wine' | 'rice' | 'ink' | 'paper';
  rotate?: number;
  className?: string;
  animate?: boolean;
};

const tones = {
  terra: 'border-terra text-terra',
  wine: 'border-wine text-wine',
  rice: 'border-rice text-rice',
  ink: 'border-ink text-ink',
  paper: 'border-paper text-paper',
};

export function Stamp({ children, tone = 'terra', rotate = -6, className = '', animate = false }: Props) {
  const cls = `inline-block border-[3px] px-3 py-1 font-display text-xl font-black uppercase leading-none tracking-wide outline outline-1 outline-offset-2 ${tones[tone]} ${className}`;
  if (!animate) {
    return (
      <span className={cls} style={{ transform: `rotate(${rotate}deg)`, outlineColor: 'currentColor' }}>
        {children}
      </span>
    );
  }
  return (
    <motion.span
      className={cls}
      style={{ outlineColor: 'currentColor' }}
      initial={{ scale: 2.6, opacity: 0, rotate: rotate - 12 }}
      animate={{ scale: 1, opacity: 1, rotate }}
      transition={{ type: 'spring', stiffness: 520, damping: 18 }}
    >
      {children}
    </motion.span>
  );
}
