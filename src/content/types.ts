import type { CompanySlug } from '../config/companyLogos';
import type { InstitutionSlug } from '../config/institutionLogos';

export type Lang = 'es' | 'en';

export interface CompanyRef {
  slug: CompanySlug;
  name: string;
  textOnly?: true;
}

export interface UICopy {
  nav: {
    home: string;
    profile: string;
    propositions: string;
    results: string;
    experience: string;
    gallery: string;
    education: string;
    licenses: string;
    certs: string;
    tools: string;
    contact: string;
  };
  navShort: {
    home: string;
    profile: string;
    propositions: string;
    results: string;
    experience: string;
    gallery: string;
    education: string;
    licenses: string;
    certs: string;
    tools: string;
    contact: string;
  };
  cta: {
    viewCv: string;
    downloadCv: string;
    contact: string;
    whatsapp: string;
    linkedin: string;
    seeMore: string;
    seeLess: string;
    backToTop: string;
    closeViewer: string;
  };
  hero: {
    availability: string;
    role: string;
    industries: string;
    portraitLabels: [string, string, string];
    metrics: Array<{ value: number; suffix?: string; prefix?: string; label: string }>;
    summary: string;
  };
  sections: {
    profileTitle: string;
    profileEyebrow: string;
    companiesTitle: string;
    propositionsTitle: string;
    propositionsEyebrow: string;
    resultsTitle: string;
    resultsEyebrow: string;
    experienceTitle: string;
    experienceEyebrow: string;
    galleryTitle: string;
    galleryEyebrow: string;
    galleryIntro: string;
    educationTitle: string;
    educationEyebrow: string;
    licensesTitle: string;
    licensesEyebrow: string;
    certsTitle: string;
    certsEyebrow: string;
    toolsTitle: string;
    toolsEyebrow: string;
    languagesTitle: string;
    contactTitle: string;
    contactEyebrow: string;
  };
  labels: {
    titled: string;
    inProgress: string;
    completed: string;
    magna: string;
    references: string;
    availability: string;
    languagesIntro: string;
    based: string;
    born: string;
    yearsOld: string;
    privateContact: string;
  };
  footer: {
    rights: string;
    keywordsLabel: string;
  };
  gallery: {
    filterAll: string;
    filterLiderazgo: string;
    filterSeguridad: string;
    filterAuditoria: string;
    filterCapacitacion: string;
    filterOperaciones: string;
    filterProyectos: string;
    filterAcademia: string;
    filterMilitar: string;
    filterReconocimiento: string;
    filterReuniones: string;
    photoCount: string;
    closeLightbox: string;
    prevPhoto: string;
    nextPhoto: string;
    carouselHint: string;
  };
}

export interface FactItem {
  label: string;
  value: string;
}

export interface DetailItem {
  title: string;
  detail: string;
}

export interface FeaturedResult {
  index: number;
  tag: string;
}

export interface PhotoLabel {
  eyebrow: string;
  detail: string;
}

export interface ReaderContext {
  quickFactsTitle: string;
  quickFacts: FactItem[];
  executiveSummaryEyebrow: string;
  executiveSummaryTitle: string;
  executiveSummaryIntro: string;
  executiveSummaryPoints: DetailItem[];
  featuredResultsEyebrow: string;
  featuredResultsTitle: string;
  featuredResultsIntro: string;
  featuredResults: FeaturedResult[];
  availabilityTitle: string;
  availabilityIntro: string;
  availabilityItems: DetailItem[];
  photoLabels: {
    hero: [PhotoLabel, PhotoLabel, PhotoLabel];
    profile: PhotoLabel;
    education: PhotoLabel;
  };
}

export interface Proposition {
  title: string;
  description: string;
  icon: string;
}

export interface Result {
  metric: string;
  label: string;
  featured?: boolean;
}

export interface DrivingLicense {
  license: string;
  description: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  scope: string;
  highlights: string[];
  extended?: string[];
  logos?: CompanySlug[];
  /** Gold-rail badge when there is no year in `period` (e.g. military formation). */
  timelineMark?: string;
}

export interface EducationItem {
  title: string;
  institution: string;
  period?: string;
  status: 'titled' | 'in_progress' | 'completed';
  magna?: boolean;
  detail?: string;
  recognition?: string;
  recognitionDetail?: string;
  logo?: InstitutionSlug;
}

export interface AccordionGroup {
  category: string;
  items: string[];
}

export type GalleryCategory =
  | 'liderazgo'
  | 'seguridad'
  | 'auditoria'
  | 'capacitacion'
  | 'operaciones'
  | 'proyectos'
  | 'academia'
  | 'militar'
  | 'reconocimiento'
  | 'reuniones';

export interface GalleryItem {
  id: string;
  src: string;
  thumbSrc?: string;
  caption: string;
  alt: string;
  categories: GalleryCategory[];
}

export interface Content {
  ui: UICopy;
  reader: ReaderContext;
  profile: string[];
  companies: CompanyRef[];
  propositions: Proposition[];
  results: Result[];
  experience: ExperienceItem[];
  gallery: GalleryItem[];
  education: EducationItem[];
  drivingLicenses: DrivingLicense[];
  certifications: AccordionGroup[];
  tools: AccordionGroup[];
  languages: string[];
}
