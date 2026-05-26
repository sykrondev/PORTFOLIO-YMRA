import type { Theme } from './theme';

export interface ThemeLogoAsset {
  src: string;
  srcDark?: string;
}

export function resolveLogoSrc(logo: ThemeLogoAsset, theme: Theme): string {
  if (theme === 'dark' && logo.srcDark) return logo.srcDark;
  return logo.src;
}

export function darkLogoPath(slug: string): string {
  return `/logos/dark/${slug}.png`;
}
