import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages proje sayfasında yayınlanacaksa BASE_PATH="/repo-adi" verin.
// Özel alan adı (eryader.org) veya Vercel kullanılıyorsa boş bırakın.
const base = process.env.BASE_PATH || undefined;

export default defineConfig({
  site: 'https://eryader.org',
  base,
  trailingSlash: 'ignore',
  build: {
    // Her sayfa kendi klasöründe index.html olarak üretilir; hem Vercel hem
    // GitHub Pages temiz URL'leri sunucu ayarı olmadan çözer.
    format: 'directory',
  },
  integrations: [sitemap()],
});
