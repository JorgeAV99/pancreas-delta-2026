import { useId } from 'react';

type Props = {
  text: string;
  center: string;
  sub?: string;
  className?: string;
  color?: string;
};

export function Seal({ text, center, sub, className = '', color = 'currentColor' }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <path id={`c-${id}`} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="100" cy="100" r="86" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="54" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 4" />
      <text fill={color} fontFamily="IBM Plex Mono, monospace" fontSize="13.5" fontWeight="600" letterSpacing="3.2">
        <textPath href={`#c-${id}`} startOffset="0">
          {text}
        </textPath>
      </text>
      <text
        x="100"
        y={sub ? 104 : 114}
        textAnchor="middle"
        fill={color}
        fontFamily="Big Shoulders Display, Impact, sans-serif"
        fontWeight="900"
        fontSize="40"
      >
        {center}
      </text>
      {sub && (
        <text x="100" y="128" textAnchor="middle" fill={color} fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="2">
          {sub}
        </text>
      )}
    </svg>
  );
}
