/**
 * Üretilen statik siteyi (dist/) sunan minimal HTTP sunucusu.
 *
 * Yalnızca Node.js yerleşik modüllerini kullanır — bağımlılık yok. Bu, 256 MB
 * bellekli bir konteynerde `npm install` adımını tamamen gereksiz kılar.
 *
 * Astro `format: 'directory'` ile ürettiği için /duyurular → dist/duyurular/index.html
 * eşlemesi burada çözülür.
 */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const ROOT = resolve(fileURLToPath(new URL('./dist', import.meta.url)));
// BasicDeploy ürettiği Dockerfile'da 8080'i EXPOSE eder ve PORT değişkeni
// tanımlamaz; bu yüzden varsayılan 8080. PORT verilirse o kullanılır.
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

/** Sıkıştırmadan fayda gören türler; görsel ve font zaten sıkıştırılmıştır. */
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

/** İçeriği hash'li olmayan dosyalar kısa, değişmeyenler uzun süre önbelleklenir. */
function cacheControl(pathname, ext) {
  if (pathname.startsWith('/_astro/') || pathname.startsWith('/fonts/')) {
    return 'public, max-age=31536000, immutable';
  }
  if (ext === '.html') return 'public, max-age=0, must-revalidate';
  return 'public, max-age=86400';
}

/** İstenen yolu dist/ içindeki gerçek bir dosyaya çözer. */
async function resolveFile(pathname) {
  // Dizin dışına çıkma denemelerini engelle
  const decoded = decodeURIComponent(pathname).split('?')[0];
  const target = resolve(join(ROOT, decoded));
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;

  const candidates = decoded.endsWith('/')
    ? [join(target, 'index.html')]
    : [target, join(target, 'index.html'), `${target}.html`];

  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (s.isFile()) return { path: c, size: s.size };
    } catch {
      /* sıradaki adaya geç */
    }
  }
  return null;
}

async function send(req, res, filePath, size, status = 200, pathname = '/') {
  const ext = extname(filePath).toLowerCase();
  const headers = {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': cacheControl(pathname, ext),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const wantsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  const useGzip = wantsGzip && COMPRESSIBLE.has(ext) && size > 1024;

  if (useGzip) {
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
  } else {
    headers['Content-Length'] = size;
  }

  res.writeHead(status, headers);
  if (req.method === 'HEAD') return res.end();

  const stream = createReadStream(filePath);
  try {
    await (useGzip ? pipeline(stream, createGzip(), res) : pipeline(stream, res));
  } catch {
    // İstemci bağlantıyı kesmiş olabilir; sunucuyu düşürmemek için yut
    stream.destroy();
  }
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Method Not Allowed');
  }

  const pathname = (req.url || '/').split('?')[0];

  // Sağlık kontrolü
  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  try {
    const found = await resolveFile(pathname);
    if (found) return await send(req, res, found.path, found.size, 200, pathname);

    const notFound = await resolveFile('/404.html');
    if (notFound) return await send(req, res, notFound.path, notFound.size, 404, pathname);

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — Sayfa bulunamadı');
  } catch (err) {
    console.error('İstek hatası:', pathname, err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('500 — Sunucu hatası');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`eryader.org statik sunucusu hazır: http://${HOST}:${PORT} (kök: ${ROOT})`);
});

// Konteyner yeniden başlatmalarında bağlantıların düzgün kapanması için
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
