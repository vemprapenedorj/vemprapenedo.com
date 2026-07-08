import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import net from 'net';
import zlib from 'zlib';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const PRODUCTION_URL = 'https://vemprapenedo.com.br';
const DIST_DIR = path.resolve(__dirname, '../dist');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// --- 1. PORT POLLING HELPER ---
const waitPort = async (port, timeout = 15000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.createConnection(port, 'localhost');
        socket.on('connect', () => { socket.end(); resolve(); });
        socket.on('error', reject);
      });
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error(`Timeout waiting for port ${port}`);
};

// --- 2. ROUTE DISCOVERY ---
const discoverRoutes = () => {
  console.log('🔍 Iniciando descoberta automática de rotas...');
  const routes = new Set(['/', '/o-que-fazer', '/onde-ficar', '/gastronomia', '/compras', '/blog', '/contato']);

  // Load locais.json
  const locaisPath = path.resolve(__dirname, '../src/locais.json');
  if (fs.existsSync(locaisPath)) {
    try {
      const locaisData = JSON.parse(fs.readFileSync(locaisPath, 'utf8'));
      Object.keys(locaisData).forEach(cat => {
        locaisData[cat].forEach(item => {
          const slug = item.slug || item.id;
          const isPremium = item.isPremium || item.is_premium;
          if (slug && isPremium) {
            routes.add(`/${cat}/${slug}`);
          }
        });
      });
    } catch (err) {
      console.error('⚠️ Erro ao ler locais.json para rotas:', err);
    }
  }

  // Load DETAILS_DATA from detailsData.ts programmatically
  const detailsDataPath = path.resolve(__dirname, '../src/data/detailsData.ts');
  if (fs.existsSync(detailsDataPath)) {
    try {
      const tsContent = fs.readFileSync(detailsDataPath, 'utf8');
      // Clean TypeScript types to eval clean JS object
      const jsContent = tsContent
        .replace(/import\s+.*;/g, '')
        .replace(/export\s+/g, '')
        .replace(/: Record<string, DetailItem\[\]>/g, '');
      
      const context = {};
      const runContext = new Function('exports', `${jsContent}\nexports.DETAILS_DATA = DETAILS_DATA;`);
      runContext(context);
      
      const DETAILS_DATA = context.DETAILS_DATA;
      if (DETAILS_DATA) {
        Object.keys(DETAILS_DATA).forEach(cat => {
          if (cat === 'blog') {
            DETAILS_DATA[cat].forEach(item => {
              const slug = item.slug || item.id;
              if (slug) {
                routes.add(`/blog/artigo/${slug}`);
                routes.add(`/blog/${slug}`);
              }
            });
          } else {
            DETAILS_DATA[cat].forEach(item => {
              const slug = item.slug || item.id;
              const isPremium = item.isPremium || item.is_premium;
              if (slug && isPremium) {
                routes.add(`/${cat}/${slug}`);
              }
            });
          }
        });
      }
    } catch (err) {
      console.error('⚠️ Erro ao ler detailsData.ts para rotas:', err);
    }
  }

  console.log(`✅ Descobertas ${routes.size} rotas únicas.`);
  return Array.from(routes);
};

// --- 3. COMPRESSION HELPER ---
const compressFile = (filePath) => {
  const content = fs.readFileSync(filePath);
  
  // Gzip
  const gzip = zlib.gzipSync(content);
  fs.writeFileSync(`${filePath}.gz`, gzip);
  
  // Brotli
  const brotli = zlib.brotliCompressSync(content);
  fs.writeFileSync(`${filePath}.br`, brotli);
};

// --- 4. PRE-RENDERING AND VALIDATION ---
const prerenderAndValidate = async (routes) => {
  console.log('🚀 Iniciando pré-renderização com Puppeteer...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const validationReport = [];
  let hasFailed = false;

  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    console.log(`🔹 Processando rota: ${route}`);
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Wait for App to render
    await page.waitForSelector('#root');
    
    // Extract metadata and content
    const pageSEO = await page.evaluate(() => {
      const getMeta = (name) => {
        const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return el ? el.getAttribute('content') : null;
      };
      
      const getCanonical = () => {
        const el = document.querySelector('link[rel="canonical"]');
        return el ? el.getAttribute('href') : null;
      };
      
      const getJsonLd = () => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        return scripts.length > 0;
      };

      return {
        title: document.title,
        description: getMeta('description') || getMeta('og:description'),
        canonical: getCanonical(),
        ogTitle: getMeta('og:title'),
        hasJsonLd: getJsonLd()
      };
    });

    // Validate SEO Requirements
    const errors = [];
    if (!pageSEO.title || pageSEO.title.trim() === '') errors.push('Title ausente ou vazio');
    if (!pageSEO.description || pageSEO.description.trim() === '') errors.push('Meta Description ausente');
    if (!pageSEO.canonical) errors.push('Canonical Link ausente');
    if (!pageSEO.ogTitle) errors.push('Open Graph Title (og:title) ausente');
    if (!pageSEO.hasJsonLd) errors.push('Structured Data JSON-LD Schema.org ausente');

    if (errors.length > 0) {
      console.error(`❌ Falha de Validação SEO na rota [${route}]:`, errors.join(', '));
      validationReport.push({ route, errors });
      hasFailed = true;
    }

    // Save physical HTML
    const htmlContent = await page.content();
    const routeDir = path.join(DIST_DIR, route);
    fs.mkdirSync(routeDir, { recursive: true });
    
    const outputPath = path.join(routeDir, 'index.html');
    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    
    // Compress index.html to .gz and .br
    compressFile(outputPath);
  }

  await browser.close();

  if (hasFailed) {
    console.error('\n🚨 ALERTA: O build falhou devido a erros críticos de SEO!');
    console.error('Relatório de erros:');
    console.error(JSON.stringify(validationReport, null, 2));
    process.exit(1);
  }
  
  console.log('✅ Todas as páginas pré-renderizadas, validadas e comprimidas com sucesso!');
};

// --- 5. SITEMAP GENERATION ---
const generateSitemap = (routes) => {
  console.log('xml 🗺️ Gerando sitemap.xml baseado nas páginas geradas...');
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  routes.forEach(route => {
    let priority = '0.6';
    let changefreq = 'weekly';
    
    if (route === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (['/o-que-fazer', '/onde-ficar', '/gastronomia', '/compras'].includes(route)) {
      priority = '0.9';
    } else if (route === '/blog') {
      priority = '0.8';
      changefreq = 'daily';
    } else if (route.startsWith('/blog/')) {
      priority = '0.7';
    } else if (route === '/contato') {
      priority = '0.5';
      changefreq = 'monthly';
    }

    xml += `
  <url>
    <loc>${PRODUCTION_URL}${route === '/' ? '' : route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  xml += '\n</urlset>';
  
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log('✅ sitemap.xml gerado em public/ e dist/!');
};

// --- MAIN RUNNER ---
const main = async () => {
  console.log('🏁 Iniciando pipeline de Pré-renderização e Otimização SEO...');
  
  // 1. Discover all routes
  const routes = discoverRoutes();
  
  // 2. Start Vite Preview server helper
  console.log('🔌 Iniciando servidor de preview do Vite...');
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', PORT.toString()], {
    shell: true,
    stdio: 'ignore'
  });
  
  try {
    // 3. Poll server until active
    await waitPort(PORT);
    console.log(`🔌 Servidor de preview ativo em localhost:${PORT}.`);
    
    // 4. Prerender routes and validate
    await prerenderAndValidate(routes);
    
    // 5. Generate sitemap
    generateSitemap(routes);
    
    console.log('🎉 Pipeline finalizado com sucesso absoluto!');
  } catch (error) {
    console.error('🚨 Erro crítico na pipeline de pré-renderização:', error);
    previewProcess.kill();
    process.exit(1);
  } finally {
    console.log('🔌 Encerrando servidor de preview do Vite...');
    previewProcess.kill();
  }
};

main();
