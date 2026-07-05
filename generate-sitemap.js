import fs from 'fs';
import path from 'path';

// Define the core pages and routes of the ReneweA environmental platform
const pages = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: 'home', changefreq: 'daily', priority: '0.9' },
  { path: 'about', changefreq: 'weekly', priority: '0.9' },
  { path: 'methods', changefreq: 'weekly', priority: '0.8' },
  { path: 'toolkit', changefreq: 'weekly', priority: '0.8' },
  { path: 'volunteer', changefreq: 'monthly', priority: '0.8' },
  { path: 'login', changefreq: 'monthly', priority: '0.5' }
];

const domain = 'https://renewa.live';
const currentDate = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${domain}/${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapContent.trim() + '\n', 'utf8');

console.log('✅ Dynamic sitemap.xml successfully compiled at:', outputPath);
