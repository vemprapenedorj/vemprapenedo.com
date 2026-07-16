/**
 * BlogPosting / Article Schema Generator
 * Targets article/blog content schemas dynamically
 */
export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  keywords?: string[];
}

export const getArticleSchema = (article: ArticleData) => {
  const publishedDate = article.datePublished || new Date().toISOString().split('T')[0];
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://vemprapenedo.com/blog/artigo/${article.slug}`
    },
    "headline": article.title,
    "description": article.description,
    "image": article.image.startsWith('http') ? article.image : `https://vemprapenedo.com${article.image.startsWith('/') ? '' : '/'}${article.image}`,
    "datePublished": publishedDate,
    "dateModified": article.dateModified || publishedDate,
    "author": {
      "@type": "Organization",
      "name": "Vem Pra Penedo",
      "url": "https://vemprapenedo.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vem Pra Penedo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vemprapenedo.com/assets/imagens/Logo.jpg"
      }
    },
    "keywords": article.keywords ? article.keywords.join(', ') : "penedo turismo, blog penedo"
  };
};
