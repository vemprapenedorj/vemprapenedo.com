import { DetailItem } from '../types';

/**
 * LocalBusiness Schema Generator
 * Generates tailored LocalBusiness schemas (Restaurant, Hotel, TouristAttraction) based on the business category.
 */
export const getLocalBusinessSchema = (item: DetailItem) => {
  const baseSchema: any = {
    "@context": "https://schema.org",
    "@id": `https://vemprapenedo.com.br/detalhe/${item.slug || item.id}#business`,
    "name": item.title,
    "description": item.description || item.fullInfo,
    "url": `https://vemprapenedo.com.br/detalhe/${item.slug || item.id}`,
    "image": item.image ? (item.image.startsWith('http') ? item.image : `https://vemprapenedo.com.br${item.image.startsWith('/') ? '' : '/'}${item.image}`) : "https://vemprapenedo.com.br/assets/imagens/Logo.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": item.location || "Penedo",
      "addressLocality": "Itatiaia",
      "addressRegion": "RJ",
      "addressCountry": "BR",
      "postalCode": "27580-000"
    }
  };

  // Contact Info
  if (item.whatsapp) {
    baseSchema["telephone"] = item.whatsapp;
  }
  
  if (item.link_instagram) {
    baseSchema["sameAs"] = [item.link_instagram];
  }

  // Hours
  if (item.hours) {
    baseSchema["openingHours"] = item.hours;
  }

  // Aggregate Rating Mock
  baseSchema["aggregateRating"] = {
    "@type": "AggregateRating",
    "ratingValue": item.rating || 4.8,
    "reviewCount": item.isPremium || item.is_premium ? 24 : 8,
    "bestRating": 5,
    "worstRating": 1
  };

  // Category specific customizations
  const categoryLower = (item.category || '').toLowerCase();
  
  if (categoryLower === 'gastronomia' || categoryLower === 'restaurantes') {
    baseSchema["@type"] = "Restaurant";
    baseSchema["servesCuisine"] = item.tags && item.tags.length > 0 ? item.tags.join(', ') : "Variada";
    baseSchema["priceRange"] = item.isPremium || item.is_premium ? "$$$" : "$$";
    
    if (item.whatsapp) {
      baseSchema["acceptsReservations"] = "True";
    }
  } else if (categoryLower === 'onde-ficar' || categoryLower === 'hospedagem') {
    baseSchema["@type"] = "Hotel";
    
    const amenities: string[] = [];
    if (item.tags) {
      item.tags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes('piscina')) amenities.push('SwimmingPool');
        if (lowerTag.includes('wi-fi') || lowerTag.includes('wifi')) amenities.push('FreeWifi');
        if (lowerTag.includes('estacionamento')) amenities.push('FreeParking');
        if (lowerTag.includes('pet') || lowerTag.includes('animais')) amenities.push('PetFriendly');
      });
    }
    if (amenities.length > 0) {
      baseSchema["amenityFeature"] = amenities.map(name => ({
        "@type": "LocationFeatureSpecification",
        "name": name,
        "value": true
      }));
    }
  } else if (categoryLower === 'o-que-fazer' || categoryLower === 'turismo' || categoryLower === 'aventura') {
    baseSchema["@type"] = "TouristAttraction";
    baseSchema["touristType"] = item.tags && item.tags.length > 0 ? item.tags.join(', ') : "Lazer";
  } else {
    baseSchema["@type"] = "LocalBusiness";
  }

  return baseSchema;
};
