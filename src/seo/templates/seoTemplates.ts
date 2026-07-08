import { DEFAULT_SEO, CATEGORY_METADATA } from '../constants/seoDefaults';
import { getCanonicalUrl, generateFallbackDescription, generateKeywords } from '../utils/seoUtils';
import { getOrganizationSchema, getWebSiteSchema, getBreadcrumbSchema, getLocalBusinessSchema, getArticleSchema } from '../../schema';
import { DetailItem } from '../../types';

export const getHomeSEOTemplate = () => {
  return {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    canonical: getCanonicalUrl('/'),
    image: DEFAULT_SEO.image,
    type: 'website',
    keywords: DEFAULT_SEO.keywords,
    robots: DEFAULT_SEO.robots,
    schema: [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getBreadcrumbSchema([{ name: 'Início', item: getCanonicalUrl('/') }])
    ]
  };
};

export const getCategorySEOTemplate = (category: string) => {
  const meta = CATEGORY_METADATA[category] || {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} em Penedo RJ | Vem Pra Penedo`,
    description: `Descubra as melhores opções de ${category} em Penedo RJ.`
  };
  return {
    title: meta.title,
    description: meta.description,
    canonical: getCanonicalUrl(`/${category}`),
    image: DEFAULT_SEO.image,
    type: 'website',
    keywords: generateKeywords(category, 'categoria', 'Penedo RJ'),
    robots: DEFAULT_SEO.robots,
    schema: getBreadcrumbSchema([
      { name: 'Início', item: getCanonicalUrl('/') },
      { name: category, item: getCanonicalUrl(`/${category}`) }
    ])
  };
};

export const getBusinessSEOTemplate = (item: DetailItem) => {
  const categoryCleanPath = item.category?.toLowerCase() === 'hospedagem' ? 'onde-ficar' : item.category?.toLowerCase() === 'gastronomia' ? 'gastronomia' : 'o-que-fazer';
  const name = item.title;
  const rawImage = item.image || '/assets/imagens/Logo.jpg';
  const image = rawImage.startsWith('http') ? rawImage : getCanonicalUrl(rawImage);
  
  const title = `${name} | ${item.category || 'Local'} em Penedo RJ | Vem Pra Penedo`;
  const description = item.description || generateFallbackDescription(name, item.category || 'Local', item.location);
  const keywords = generateKeywords(name, item.category || 'Local', item.location, item.tags);

  const businessSchema = getLocalBusinessSchema(item);
  const detailSchemas = [
    businessSchema,
    getBreadcrumbSchema([
      { name: 'Início', item: getCanonicalUrl('/') },
      { name: item.category || 'Empresas', item: getCanonicalUrl(`/${categoryCleanPath}`) },
      { name: name, item: getCanonicalUrl(`/${categoryCleanPath}/${item.slug || item.id}`) }
    ])
  ];

  return {
    title,
    description,
    canonical: getCanonicalUrl(`/${categoryCleanPath}/${item.slug || item.id}`),
    image,
    type: 'website',
    keywords,
    robots: DEFAULT_SEO.robots,
    schema: detailSchemas
  };
};

export const getArticleSEOTemplate = (article: { slug: string; title: string; description: string; image: string; datePublished: string; keywords?: string[] }) => {
  const rawImage = article.image || '/assets/imagens/blog/penedo_blog_header.jpg';
  const image = rawImage.startsWith('http') ? rawImage : getCanonicalUrl(rawImage);
  const keywordsStr = article.keywords ? article.keywords.join(', ') : 'blog penedo, turismo penedo';

  return {
    title: `${article.title} - Vem Pra Penedo`,
    description: article.description,
    canonical: getCanonicalUrl(`/blog/artigo/${article.slug}`),
    image,
    type: 'article',
    keywords: keywordsStr,
    robots: DEFAULT_SEO.robots,
    schema: [
      getArticleSchema(article),
      getBreadcrumbSchema([
        { name: 'Início', item: getCanonicalUrl('/') },
        { name: 'Blog', item: getCanonicalUrl('/blog') },
        { name: article.title, item: getCanonicalUrl(`/blog/artigo/${article.slug}`) }
      ])
    ]
  };
};
