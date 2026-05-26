import type { HTMLAttributes } from 'react';
import { resolveLogoSrc } from '../../lib/logoSrc';
import { useTheme } from '../../lib/useTheme';
import type { Theme } from '../../lib/theme';

type LogoPlaqueProps = {
  src: string;
  srcDark?: string;
  alt: string;
  variant?: 'default' | 'band';
  assetTheme?: Theme | 'auto';
  className?: string;
  imgClassName?: string;
} & HTMLAttributes<HTMLSpanElement>;

export function LogoPlaque({
  src,
  srcDark,
  alt,
  variant = 'default',
  assetTheme = 'auto',
  className = '',
  imgClassName = '',
  ...rest
}: LogoPlaqueProps) {
  const theme = useTheme();
  const resolvedSrc = resolveLogoSrc(
    { src, srcDark },
    assetTheme === 'auto' ? theme : assetTheme,
  );

  return (
    <span
      className={`logo-plaque ${variant === 'band' ? 'logo-plaque-band' : ''} ${className}`.trim()}
      {...rest}
    >
      <img
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`logo-plaque-img ${imgClassName}`.trim()}
      />
    </span>
  );
}
