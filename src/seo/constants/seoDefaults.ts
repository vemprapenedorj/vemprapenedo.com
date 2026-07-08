export const BASE_URL = 'https://vemprapenedo.com.br';

export const DEFAULT_SEO = {
  title: 'Vem Pra Penedo | Guia Completo de Penedo RJ - Hotéis, Restaurantes, Passeios e Eventos',
  description: 'Descubra tudo sobre Penedo RJ. Encontre hotéis, pousadas, restaurantes, cafeterias, atrações, eventos e dicas de viagem.',
  image: `${BASE_URL}/assets/imagens/Logo.jpg`,
  type: 'website',
  robots: 'index, follow',
  keywords: 'penedo, penedo rj, guia penedo, hoteis penedo, pousadas penedo, restaurantes penedo, turismo penedo, penedo turismo, o que fazer em penedo, onde ficar em penedo'
};

export const CATEGORY_METADATA: Record<string, { title: string; description: string }> = {
  'o-que-fazer': {
    title: 'O Que Fazer em Penedo RJ | Atrações e Passeios Turísticos | Vem Pra Penedo',
    description: 'Encontre as melhores cachoeiras, passeios de quadriciclo, trilhas e pontos turísticos em Penedo RJ. Viva momentos incríveis!'
  },
  'onde-ficar': {
    title: 'Onde Ficar em Penedo RJ | Hotéis, Pousadas e Chalés Aconchegantes | Vem Pra Penedo',
    description: 'Guia completo de hospedagem em Penedo RJ. Encontre os melhores hotéis e pousadas no centro e na montanha para casais e famílias.'
  },
  'gastronomia': {
    title: 'Gastronomia em Penedo RJ | Restaurantes, Pizzarias e Chocolates | Vem Pra Penedo',
    description: 'Saboreie o melhor da culinária de Penedo RJ. Onde comer truta, fondue, chocolates artesanais e pratos escandinavos típicos.'
  },
  'compras': {
    title: 'Compras em Penedo RJ | Lojas, Artesanato e Chocolates | Vem Pra Penedo',
    description: 'Guia de compras na Pequena Finlândia e arredores. Encontre chocolates artesanais, malhas, artesanato local e lembranças de Penedo RJ.'
  },
  'contato': {
    title: 'Contato | Vem Pra Penedo',
    description: 'Entre em contato com a equipe do portal Vem Pra Penedo. Dúvidas, parcerias e sugestões sobre o turismo em Penedo RJ.'
  },
  'blog': {
    title: 'Blog Penedo RJ - Dicas e Roteiros | Vem Pra Penedo',
    description: 'Acompanhe o blog Vem Pra Penedo. Dicas exclusivas, roteiros completos, os melhores restaurantes e onde se hospedar na Finlândia Brasileira.'
  }
};
