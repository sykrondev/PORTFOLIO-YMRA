export const COMPANY_SLUGS = [
  'albemarle',
  'antofagasta-minerals',
  'ati',
  'bechtel',
  'bhp',
  'bureau-veritas',
  'cademartori',
  'cesmec',
  'codelco',
  'copec',
  'enaex',
  'enex',
  'engie',
  'epa',
  'ejercito-chile',
  'fcab',
  'finning',
  'hualpen',
  'komatsu',
  'maxam',
  'michelin',
  'orica',
  'puerto-angamos',
  'rcl',
  'sqm',
  'teck',
  'transportes-cinco',
  'tur-bus',
  'tuv-rheinland',
  'viggo',
  'vinara',
] as const;

export type CompanySlug = (typeof COMPANY_SLUGS)[number];

export interface CompanyLogo {
  src?: string;
  /** Dark-theme asset — defaults to `/logos/dark/{slug}.png` when omitted. */
  srcDark?: string;
  /** Optional dark-site override for the light marquee band. */
  srcBandDark?: string;
  label: string;
  textOnly?: true;
  /** Wordmark logos need a wider chip/box to stay legible. */
  wide?: boolean;
  /** Processed asset reads smaller than peers in the marquee. */
  marqueeLarge?: boolean;
  /** When marqueeLarge is still too small (e.g. Bureau Veritas wordmark). */
  marqueeExtraLarge?: boolean;
}

export const COMPANY_LOGOS: Record<CompanySlug, CompanyLogo> = {
  albemarle: { src: '/logos/albemarle.png', label: 'Albemarle' },
  'antofagasta-minerals': { src: '/logos/antofagasta-minerals.png', label: 'AMSA · Antofagasta Minerals', wide: true, marqueeLarge: true },
  ati: { src: '/logos/ati.png', label: 'ATI' },
  bechtel: { src: '/logos/bechtel.png', label: 'Bechtel' },
  bhp: { src: '/logos/bhp.png', label: 'BHP' },
  'bureau-veritas': { src: '/logos/bureau-veritas.png', label: 'Bureau Veritas', wide: true, marqueeExtraLarge: true },
  cademartori: { src: '/logos/cademartori.png', label: 'Cademartori', wide: true, marqueeLarge: true },
  cesmec: { src: '/logos/cesmec.png', label: 'CESMEC', wide: true, marqueeLarge: true },
  codelco: { src: '/logos/codelco.png', label: 'Codelco', marqueeLarge: true },
  copec: { src: '/logos/copec.png', label: 'Copec' },
  enaex: { src: '/logos/enaex.png', label: 'Enaex' },
  enex: { src: '/logos/enex.png', label: 'ENEX' },
  engie: { src: '/logos/engie.png', label: 'Engie' },
  'ejercito-chile': { src: '/logos/ejercito-chile.png', label: 'Ejército de Chile' },
  epa: { src: '/logos/epa.png', label: 'EPA' },
  fcab: { src: '/logos/fcab.png', label: 'FCAB' },
  finning: { src: '/logos/finning.png', label: 'Finning' },
  hualpen: { src: '/logos/hualpen.png', label: 'Hualpén' },
  komatsu: { src: '/logos/komatsu.png', label: 'Komatsu', wide: true, marqueeLarge: true },
  maxam: { src: '/logos/maxam.png', label: 'Maxam' },
  michelin: { src: '/logos/michelin.png', label: 'Michelin' },
  orica: { src: '/logos/orica.png', label: 'Orica' },
  'puerto-angamos': { src: '/logos/puerto-angamos.png', label: 'Puerto Angamos', wide: true },
  rcl: { src: '/logos/rcl.png', label: 'RCL', marqueeLarge: true },
  sqm: { src: '/logos/sqm.png', label: 'SQM', marqueeLarge: true },
  teck: { src: '/logos/teck.png', label: 'Teck' },
  'transportes-cinco': { src: '/logos/transportes-cinco.png', label: 'Transportes 5' },
  'tur-bus': { src: '/logos/tur-bus.png', label: 'Tur Bus' },
  'tuv-rheinland': { src: '/logos/tuv-rheinland.png', label: 'TÜV Rheinland', wide: true },
  viggo: { src: '/logos/viggo.png', label: 'Viggo' },
  vinara: {
    src: '/logos/vinara.png',
    srcBandDark: '/logos/band-dark/vinara.png',
    label: 'Vinara',
  },
};

export function getCompanyLogo(slug: CompanySlug): CompanyLogo {
  const logo = COMPANY_LOGOS[slug];
  if (!logo.src || logo.textOnly) return logo;
  return {
    ...logo,
    srcDark: logo.srcDark ?? `/logos/dark/${slug}.png`,
  };
}

export function isCompanySlug(value: string): value is CompanySlug {
  return (COMPANY_SLUGS as readonly string[]).includes(value);
}
