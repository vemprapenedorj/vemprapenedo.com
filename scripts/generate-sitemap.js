import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://vemprapenedo.com.br')
  .replace(/\/$/, '');

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/o-que-fazer', priority: '0.9', changefreq: 'weekly' },
  { url: '/onde-ficar', priority: '0.9', changefreq: 'weekly' },
  { url: '/gastronomia', priority: '0.9', changefreq: 'weekly' },
  { url: '/compras', priority: '0.9', changefreq: 'weekly' },
  { url: '/blog', priority: '0.7', changefreq: 'daily' },
  { url: '/contato', priority: '0.5', changefreq: 'monthly' },
  { url: '/politica-de-privacidade', priority: '0.3', changefreq: 'yearly' },
  { url: '/politica-de-cookies', priority: '0.3', changefreq: 'yearly' }
];

const blogArticles = [
  { slug: 'cachoeiras-penedo', priority: '0.7', changefreq: 'weekly' },
  { slug: 'penedo-guia', priority: '0.7', changefreq: 'weekly' },
  { slug: 'restaurantes', priority: '0.7', changefreq: 'weekly' },
  { slug: 'melhores-hospedagens', priority: '0.7', changefreq: 'weekly' }
];

// Load the canonical content source.
const detailsPath = path.resolve(__dirname, '../src/data/detailsData.ts');
let detailsData = {};
try {
  const source = fs.readFileSync(detailsPath, 'utf8');
  detailsData = JSON.parse(source.slice(source.indexOf('=') + 1, source.lastIndexOf(';')));
} catch (error) {
  console.error('Error loading detailsData.ts:', error);
  process.exit(1);
}

const dynamicUrls = [];
const categories = ['o-que-fazer', 'onde-ficar', 'gastronomia', 'compras'];

categories.forEach(cat => {
  if (detailsData[cat]) {
    detailsData[cat].forEach(item => {
      if (item.isPremium) {
        const slug = item.slug || item.id;
        dynamicUrls.push({
          url: `/${cat}/${slug}`,
          priority: '0.8',
          changefreq: 'weekly'
        });
      }
    });
  }
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Static Pages
staticPages.forEach(page => {
  xml += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
});

// Blog Articles
blogArticles.forEach(art => {
  xml += `
  <url>
    <loc>${BASE_URL}/blog/artigo/${art.slug}</loc>
    <changefreq>${art.changefreq}</changefreq>
    <priority>${art.priority}</priority>
  </url>`;
});

// Dynamic Detail Pages
dynamicUrls.forEach(dyn => {
  xml += `
  <url>
    <loc>${BASE_URL}${dyn.url}</loc>
    <changefreq>${dyn.changefreq}</changefreq>
    <priority>${dyn.priority}</priority>
  </url>`;
});

xml += '\n</urlset>\n';

// Ensure public directory exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
console.log('sitemap.xml generated successfully in public/sitemap.xml!');

const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
  console.log('sitemap.xml generated successfully in dist/sitemap.xml!');
}
