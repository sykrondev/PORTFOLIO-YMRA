import manifest from './gallery.manifest.json';
import { galleryCaptionsEn } from './gallery.en';
import type { GalleryCategory, GalleryItem } from './types';

type ManifestRow = {
  id: string;
  src: string;
  thumbSrc: string;
  captionEs: string;
  alt: string;
  categories: string[];
};

export function getGalleryItemById(id: string, lang: 'es' | 'en'): GalleryItem | undefined {
  return getGalleryItems(lang).find((item) => item.id === id);
}

export function getGalleryItems(lang: 'es' | 'en'): GalleryItem[] {
  const rows = manifest as ManifestRow[];
  return rows.map((row, index) => {
    const caption =
      lang === 'es' ? row.captionEs : (galleryCaptionsEn[index] ?? row.captionEs);
    return {
      id: row.id,
      src: row.src,
      thumbSrc: row.thumbSrc,
      caption,
      alt: caption,
      categories: row.categories as GalleryCategory[],
    };
  });
}

export const GALLERY_CATEGORY_ORDER: GalleryCategory[] = [
  'liderazgo',
  'seguridad',
  'auditoria',
  'capacitacion',
  'operaciones',
  'proyectos',
  'academia',
  'militar',
  'reconocimiento',
  'reuniones',
];
