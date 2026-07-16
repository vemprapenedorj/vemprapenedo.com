/**
 * WebSite Schema Generator
 * Targets WebSite metadata with SearchAction for Vem Pra Penedo portal
 */
export const getWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://vemprapenedo.com/#website",
    "name": "Vem Pra Penedo",
    "url": "https://vemprapenedo.com",
    "description": "Guia completo de Penedo RJ - Pousadas, Restaurantes e Passeios",
    "publisher": {
      "@id": "https://vemprapenedo.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://vemprapenedo.com/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};
