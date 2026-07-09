/**
 * Organization Schema Generator
 * Targets Organization metadata for Vem Pra Penedo portal
 */
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://vemprapenedo.com.br/#organization",
    "name": "Vem Pra Penedo",
    "url": "https://vemprapenedo.com.br",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vemprapenedo.com.br/assets/imagens/Logo.jpg",
      "caption": "Vem Pra Penedo Logo"
    },
    "image": "https://vemprapenedo.com.br/assets/imagens/Logo.jpg",
    "description": "O portal oficial de turismo de Penedo RJ. Encontre os melhores hotéis, pousadas, restaurantes, passeios, eventos e atrações na Finlândia Brasileira.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-24-99208-7767",
      "contactType": "customer service",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.instagram.com/vemprapenedo/",
      "https://www.tiktok.com/@vemprapenedo",
      "https://www.facebook.com/vemprapenedo"
    ]
  };
};

export const getPortalLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristInformationCenter",
    "@id": "https://vemprapenedo.com.br/#portalbusiness",
    "name": "Vem Pra Penedo",
    "url": "https://vemprapenedo.com.br",
    "logo": "https://vemprapenedo.com.br/assets/imagens/Logo.jpg",
    "image": "https://vemprapenedo.com.br/assets/imagens/Logo.jpg",
    "description": "O portal oficial de turismo de Penedo RJ. Informações sobre hotéis, pousadas, restaurantes, passeios e eventos na Serra da Mantiqueira.",
    "telephone": "+55-24-99208-7767",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Penedo, Itatiaia, RJ"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. das Mangueiras, Centro",
      "addressLocality": "Penedo, Itatiaia",
      "addressRegion": "RJ",
      "addressCountry": "BR",
      "postalCode": "27580-000"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-22.4344",
      "longitude": "-44.5298"
    },
    "sameAs": [
      "https://www.instagram.com/vemprapenedo/",
      "https://www.tiktok.com/@vemprapenedo",
      "https://www.facebook.com/vemprapenedo"
    ]
  };
};
