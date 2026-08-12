/**
 * BasicDeploy için dağıtım paketi üretir.
 *
 * Paket bilerek bağımlılıksızdır: içine yalnızca `dist/`, `server.js` ve
 * dependencies'i boş bir package.json girer. Böylece 256 MB'lik konteynerde
 * `npm install` çalışmaz — astro/sharp kurulumu bellek sınırını zorlardı.
 *
 * Kullanım: npm run pack   →   .deploy/eryader-site.tar.gz
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stage = resolve(root, '.deploy/stage');
const out = resolve(root, '.deploy/eryader-site.tar.gz');

if (!existsSync(resolve(root, 'dist/index.html'))) {
  console.error('dist/ boş görünüyor. Önce `npm run build` çalıştırın.');
  process.exit(1);
}

rmSync(resolve(root, '.deploy'), { recursive: true, force: true });
mkdirSync(stage, { recursive: true });

// Çalışma zamanı için sıfır bağımlılıklı package.json
writeFileSync(
  resolve(stage, 'package.json'),
  JSON.stringify(
    {
      name: 'eryader-site',
      version: '1.0.0',
      private: true,
      type: 'module',
      description: 'Kapsayıcı ve Erişilebilir Yaşam Derneği — statik site sunucusu',
      main: 'server.js',
      scripts: { start: 'node server.js' },
      engines: { node: '>=18' },
    },
    null,
    2,
  ) + '\n',
);

execFileSync('cp', [resolve(root, 'server.js'), stage], { stdio: 'inherit' });
execFileSync('cp', ['-R', resolve(root, 'dist'), resolve(stage, 'dist')], { stdio: 'inherit' });

// macOS genişletilmiş niteliklerini temizle. Aksi hâlde tar'a com.apple.provenance
// gibi xattr'lar girer ve Linux konteynerde açılırken şu hatayı verir:
//   lsetxattr /workspace/dist: xattr "com.apple.provenance": operation not supported
if (process.platform === 'darwin') {
  execFileSync('xattr', ['-cr', stage], { stdio: 'inherit' });
}

execFileSync(
  'tar',
  [
    '--no-xattrs',
    '--no-mac-metadata',
    '--exclude', '.DS_Store',
    '-czf', out,
    '-C', stage,
    '.',
  ],
  { stdio: 'inherit', env: { ...process.env, COPYFILE_DISABLE: '1' } },
);

const mb = (statSync(out).size / 1048576).toFixed(1);
console.log(`\nPaket hazır: ${out}  (${mb} MB)`);
