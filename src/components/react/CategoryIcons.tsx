import type { JSX } from 'react';

export type IconName =
  | 'database'
  | 'satellite'
  | 'shield-check'
  | 'flask'
  | 'laptop'
  | 'award'
  | 'trending-up'
  | 'truck'
  | 'helmet'
  | 'check-circle';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function CategoryIcon({ name, className = '' }: { name: IconName; className?: string }): JSX.Element {
  switch (name) {
    case 'database':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );
    case 'satellite':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M3 9l6-6 5 5-6 6z" />
          <path d="M9 14l1 1 4-4" />
          <path d="M14 14a4 4 0 0 1-4 4" />
          <path d="M17 17a7 7 0 0 1-7 7" />
          <circle cx="18.5" cy="5.5" r="1.5" />
        </svg>
      );
    case 'shield-check':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          <path d="M9 12l2.5 2.5L15.5 10" />
        </svg>
      );
    case 'flask':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M9 3h6" />
          <path d="M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3" />
          <path d="M8 14h8" />
        </svg>
      );
    case 'laptop':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <rect x="4" y="5" width="16" height="11" rx="2" />
          <path d="M2 19h20" />
          <path d="M8 19l1-3M16 19l-1-3" />
        </svg>
      );
    case 'award':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <circle cx="12" cy="9" r="6" />
          <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
        </svg>
      );
    case 'trending-up':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <polyline points="3 17 9 11 13 15 21 7" />
          <polyline points="15 7 21 7 21 13" />
        </svg>
      );
    case 'truck':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M3 7h11v9H3z" />
          <path d="M14 10h4l3 3v3h-7" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </svg>
      );
    case 'helmet':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <path d="M4 16a8 8 0 0 1 16 0" />
          <path d="M3 16h18v3H3z" />
          <path d="M12 8v4M9 9l1 3M15 9l-1 3" />
        </svg>
      );
    case 'check-circle':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className={className} {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
      );
  }
}

export interface Accent {
  text: string;       // tailwind text color class
  bg: string;         // soft tint bg class
  border: string;     // border class
  ring: string;       // bullet color class
  stripe: string;     // top stripe color class
}

export const accents: Accent[] = [
  { text: 'text-exec-blue', bg: 'bg-exec-blue/12', border: 'border-exec-blue/40', ring: 'bg-exec-blue', stripe: 'bg-exec-blue' },
  { text: 'text-gold-400',  bg: 'bg-gold-600/15',  border: 'border-gold-600/45',  ring: 'bg-gold-500',  stripe: 'bg-gold-500' },
  { text: 'text-exec-green',bg: 'bg-exec-green/15',border: 'border-exec-green/45',ring: 'bg-exec-green', stripe: 'bg-exec-green' },
  { text: 'text-[#3bbfd1]', bg: 'bg-[#0ea5b7]/15', border: 'border-[#0ea5b7]/45', ring: 'bg-[#3bbfd1]',  stripe: 'bg-[#3bbfd1]' },
  { text: 'text-[#e08a4f]', bg: 'bg-[#dd6e3a]/15', border: 'border-[#dd6e3a]/45', ring: 'bg-[#e08a4f]',  stripe: 'bg-[#e08a4f]' },
];

export const toolIcons: IconName[] = ['database', 'satellite', 'shield-check', 'flask', 'laptop'];
export const certIcons: IconName[] = ['award', 'trending-up', 'truck', 'helmet', 'check-circle'];
