export const INSTITUTION_SLUGS = ['unab', 'unap', 'ejercito-chile'] as const;

export type InstitutionSlug = (typeof INSTITUTION_SLUGS)[number];

export interface InstitutionLogo {
  src: string;
  srcDark?: string;
  label: string;
  wide?: boolean;
  shield?: boolean;
}

export const INSTITUTION_LOGOS: Record<InstitutionSlug, InstitutionLogo> = {
  unab: { src: '/logos/unab.png', label: 'Universidad Andrés Bello', wide: true },
  unap: { src: '/logos/unap.png', label: 'Universidad Estatal Arturo Prat', wide: true },
  'ejercito-chile': { src: '/logos/ejercito-chile.png', label: 'Ejército de Chile', shield: true },
};

export function getInstitutionLogo(slug: InstitutionSlug): InstitutionLogo {
  const logo = INSTITUTION_LOGOS[slug];
  return {
    ...logo,
    srcDark: logo.srcDark ?? `/logos/dark/${slug}.png`,
  };
}
