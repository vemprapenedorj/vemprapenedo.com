import { BASE_URL, DEFAULT_SEO } from '../constants/seoDefaults';

/**
 * Normalizes paths to ensure friendly, lowercase, hyphen-separated URLs.
 */
export const cleanPath = (path: string): string => {
  if (!path) return '/';
  let cleaned = path
    .toLowerCase()
    .replace(/\/+/g, '/') // remove duplicate slashes
    .replace(/\/$/, '');  // remove trailing slash

  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  return cleaned;
};

/**
 * Returns the full canonical URL.
 */
export const getCanonicalUrl = (path: string): string => {
  return `${BASE_URL}${cleanPath(path)}`;
};

/**
 * Generates an automatic SEO description if one is missing.
 */
export const generateFallbackDescription = (name: string, category: string, location?: string): string => {
  const cleanCategory = category || 'estabelecimento';
  const cleanLocation = location || 'Penedo RJ';
  return `Descubra mais sobre ${name}, um excelente ${cleanCategory.toLowerCase()} localizado em ${cleanLocation}. Encontre fotos, telefone, horário de funcionamento e avaliações no portal Vem Pra Penedo.`;
};

/**
 * Generates dynamic SEO keywords.
 */
export const generateKeywords = (name: string, category: string, location?: string, extraTags?: string[]): string => {
  const cleanLocation = location || 'Penedo RJ';
  const baseKeywords = [
    name.toLowerCase(),
    category.toLowerCase(),
    `${category.toLowerCase()} em penedo`,
    `${category.toLowerCase()} em penedo rj`,
    'penedo rj',
    'turismo penedo',
    'viagem penedo',
    cleanLocation.toLowerCase()
  ];

  if (extraTags) {
    extraTags.forEach(tag => {
      if (tag) baseKeywords.push(tag.toLowerCase());
    });
  }

  // Remove duplicates and join by comma
  return Array.from(new Set(baseKeywords)).join(', ');
};
