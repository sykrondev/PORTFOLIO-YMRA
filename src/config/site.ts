export const site = {
  name: 'Yamir Moisés Rojo Andrade',
  shortName: 'Yamir Rojo',
  title:
    'Yamir Moisés Rojo Andrade | Gerente de Operaciones, Logística y Supply Chain',
  description:
    'Gerente de Operaciones, Logística y Supply Chain con más de 25 años en minería, transporte crítico, combustibles y centros de distribución para BHP, AMSA, ENEX, SQM, Komatsu y más.',
  email: 'yamir@yamirrojo.com',
  phone: '+56 9 9691 0700',
  phoneRaw: '+56996910700',
  whatsappUrl:
    'https://wa.me/56996910700?text=Hola%20Yamir%2C%20me%20contacto%20desde%20su%20portafolio%20profesional.',
  linkedinUrl: 'https://www.linkedin.com/in/yamirrojo/',
  location: 'Antofagasta, Chile',
  birthDate: '1982-01-29',
  cvPdf: '/documents/cv-yamir-moises-rojo-andrade-maestro.pdf',
  cvPdfDownloadName: 'CV Yamir Moises Rojo Andrade Maestro.pdf',
  ogImage: '/og-image.jpg',
  keywords: [
    'Gerente de Operaciones',
    'Supply Chain',
    'Logística minera',
    'Transporte crítico',
    'Combustibles',
    'Centros de distribución',
    'BHP',
    'AMSA',
    'Antofagasta',
    'Chile',
    'Codelco',
    'SQM',
    'Komatsu',
    'ENEX',
    'Seguridad operacional',
    'Administración de contratos mineros',
  ],
} as const;

export function calcAge(birth = site.birthDate): number {
  const b = new Date(birth);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}
