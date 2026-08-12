# eryader.org

Kapsayıcı ve Erişilebilir Yaşam Derneği (Eryader) resmî web sitesi.

Dernekweb CMS'inden çıkarılıp **Astro** ile yeniden yazılmış, tamamen statik
üretilen bir site. İçerik veritabanında değil, bu depodaki Markdown ve TypeScript
dosyalarında durur.

---

## Hızlı başlangıç

```bash
npm install
npm run dev      # http://localhost:4321
```

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu (canlı yenileme) |
| `npm run build` | Statik siteyi `dist/` altına üretir |
| `npm run preview` | Üretilen `dist/` çıktısını yerelde sunar |

Gereksinim: Node.js 20+.

---

## Yayınlama

Çıktı tamamen statiktir; hem Vercel hem GitHub Pages ek yapılandırma
gerektirmeden çalışır.

### Vercel

1. Vercel'de **Add New → Project** ile bu depoyu içe aktarın.
2. Framework otomatik olarak Astro algılanır (`vercel.json` zaten mevcut).
3. **Deploy**. Özel alan adı için Vercel panelinden `eryader.org` ekleyin.

### GitHub Pages

`.github/workflows/deploy.yml` hazırdır. `main` dalına her push'ta çalışır.

1. Depo ayarlarında **Settings → Pages → Build and deployment → Source**'u
   **GitHub Actions** yapın.
2. `main` dalına push edin.
3. Özel alan adı: `public/CNAME` dosyası `eryader.org` içerir; DNS'te
   `eryader.org` kaydını GitHub Pages'e yönlendirin.

> **Alt dizinde yayınlıyorsanız** (ör. `kullanici.github.io/eryader.org`),
> workflow'daki `BASE_PATH` değerini `/eryader.org` yapın ve `public/CNAME`
> dosyasını silin.

---

## İçerik nasıl güncellenir?

Tüm içerik `src/content/` altındadır. Dosya eklemek yeni sayfa oluşturur;
build sırasında rota otomatik üretilir.

```
src/content/
├── posts/        Duyuru, haber ve basın içerikleri (kategori frontmatter'da)
├── kurumsal/     Hakkımızda, misyon, vizyon, tüzük, KVKK
├── etkinlikler/  Etkinlikler
├── webinarlar/   Webinar kayıtları
├── videolar/     Video kayıtları
└── galeriler/    Foto galeriler
```

### Yeni duyuru eklemek

`src/content/posts/yeni-duyuru.md` oluşturun:

```markdown
---
title: "Duyuru Başlığı"
date: 2026-03-15
category: "duyurular"        # duyurular | haberler | basinda-biz
cover: "/images/gorsel.jpg"  # public/images/ altındaki dosya (isteğe bağlı)
summary: "Kart ve arama sonuçlarında görünecek kısa özet."
sourceUrl: "https://..."     # dış kaynak varsa (isteğe bağlı)
---

<p>İçerik. HTML veya Markdown kullanabilirsiniz.</p>
```

Sayfa `/duyurular/yeni-duyuru` adresinde yayınlanır; anasayfa, kategori
listesi, site haritası ve `sitemap.xml` otomatik güncellenir.

### Yeni foto galeri eklemek

`src/content/galeriler/yeni-galeri.md`:

```markdown
---
title: "Galeri Adı"
order: 7
cover: "/images/kapak.jpg"
images:
  - src: "/images/foto-1.jpg"
    alt: "Fotoğrafı görmeyen biri için açıklama"
  - src: "/images/foto-2.jpg"
    alt: "Açıklama"
---
```

> `alt` metnini boş bırakmayın. Ekran okuyucu kullanan üyelerimiz için
> görselin ne anlattığını yazın.

Galeri klasörü şu an **boş**: eski sitedeki fotoğrafların bir kısmı CMS'in
stok görselleriydi, gerçek fotoğraflar henüz eklenmedi. `/foto-galeriler` sayfası bu durumda
"Henüz galeri eklenmedi" ekranını gösterir; ilk `.md` dosyasını
eklediğinizde otomatik olarak normal galeri listesine döner. Anasayfadaki
multimedya bölümü de aynı şekilde kendini ayarlar (galeri yokken videolara
odaklanır).

> **İçerik sildiğinizde `npm run rebuild` kullanın.** Astro'nun içerik
> önbelleği (`node_modules/.astro/data-store.json`) silinen kayıtları tutar ve
> düz `npm run build` onları üretmeye devam eder.

### Görsel eklemek

Dosyaları `public/images/` altına koyun, içerikte `/images/dosya-adi.jpg`
şeklinde referans verin.

### Kurum bilgilerini güncellemek

`src/data/site.ts` tek kaynaktır — iletişim bilgisi, IBAN, yönetim kurulu,
sosyal medya hesapları, menü yapısı ve anasayfa sayaçları buradadır.
Yönetim kurulu değiştiğinde yalnızca `board` dizisini düzenlemeniz yeterlidir.

---

## Erişilebilirlik

Erişilebilirlik bu sitede sonradan eklenen bir katman değil, tasarımın
çıkış noktasıdır.

- **Atkinson Hyperlegible** — gövde yazı tipi, Braille Institute tarafından az
  gören okurlar için tasarlandı; benzeşen harfleri (I / l / 1, O / 0) ayırır.
- **Görünüm araç çubuğu** — yazı boyutu (3 kademe), yüksek kontrast, koyu tema
  ve hareket kapatma. Tercihler `localStorage`'da saklanır ve ilk boyamadan
  önce uygulanır.
- **Klavye** — tüm etkileşimli öğeler klavyeyle erişilebilir; odak halkası
  belirgin ve hiçbir yerde gizlenmez. `Esc` menüyü ve galeri görüntüleyiciyi
  kapatır; `←`/`→` galeride gezinir.
- **"İçeriğe geç"** bağlantısı ilk `Tab` ile belirir.
- **Anlamsal işaretleme** — sıralı başlık hiyerarşisi (46 sayfada doğrulandı),
  etiketli form alanları, `alt` metinli görseller, adlandırılmış landmark'lar.
- **Hareket** — `prefers-reduced-motion` sistem ayarına uyulur.
- **Yazdırma** — menü/footer gizlenir, dış bağlantı adresleri metne eklenir.

Yeni sayfa eklerken başlık sırasını atlamayın (h1 → h2 → h3) ve her görsele
`alt` yazın.

---

## Formlar

İletişim ve üyelik başvuru formları, statik barındırmada sunucu gerektirmemesi
için girilen bilgileri kullanıcının e-posta uygulamasında hazır mesaj olarak
açar (`mailto:`). Her iki sayfada doğrudan `info@eryader.org` bağlantısı da
sunulur.

Formların doğrudan e-posta göndermesini isterseniz Formspree/Netlify Forms gibi
bir servise geçebilirsiniz: `src/pages/iletisim.astro` ve
`src/pages/uyelik-basvurusu.astro` içindeki `submit` işleyicisini servis
uç noktasına `fetch` ile POST edecek şekilde değiştirmek yeterlidir.

---

## Teknik notlar

- **Astro 5**, Content Layer API (`src/content.config.ts`)
- Yazı tipleri `public/fonts/` altında **self-hosted** — harici font CDN'ine
  istek gitmez (gizlilik ve hız)
- İkonlar `src/components/Icon.astro` içinde satır içi SVG — ikon kütüphanesi yok
- YouTube gömmeleri `youtube-nocookie.com` üzerinden
- `sitemap-index.xml` ve `robots.txt` otomatik üretilir
- JavaScript yalnızca gerektiği yerde (menü, tema, galeri, form) — sayfa
  içerikleri JS olmadan da tam okunur

---

## Eski siteden taşınırken yapılan içerik düzeltmeleri

Aşağıdakiler CMS artığıydı ve kasıtlı olarak taşınmadı; gözden geçirmek
isteyebilirsiniz:

- **Bağış sayfası** eski sitede Dernekweb'in demo içeriğini gösteriyordu
  (Lösev, TEMA, "Tanıtım Amaçlıdır", "150 Yıldır"). Yerine derneğin gerçek
  Ziraat Bankası hesap bilgileri konuldu.
- **Anasayfa "Hakkımızda" metni** CMS yer tutucusuydu ("Bu Alana Derneğiniz
  Hakkında Detaylı Bilgi Girilecektir"). Tüzükteki amaç maddesi ve
  çalışmalardan gerçek bir metin yazıldı.
- **İletişim haritası** eski sitede başka bir derneğin (Altı Nokta Körler
  Derneği) adresini gösteriyordu. Derneğin kendi adresine çevrildi.
- **Cloudflare e-posta gizleme bağlantıları** ve **CMS paylaş butonları**
  içerikten temizlendi.
- **`/vekalet-formu`** bağlantısı eski sitede de 404 veriyor; genel kurul
  duyurusunda düz metin bırakıldı. Formu ekleyip bağlantıyı canlandırabilirsiniz.
- **Yönetim kurulu** eski sitede iki farklı sayfada çelişkiliydi;
  `/kurumsal/hakkimizda` listesi esas alındı (`src/data/site.ts` → `board`).
- Bazı galeri görselleri (özellikle *Toplantı* ve *Yönetim Kurulu*) eski
  sitedeki stok/demo fotoğraflardır. Gerçek fotoğraflarla değiştirmek
  isteyebilirsiniz.


---

## BasicDeploy ile yayınlama

Site şu an BasicDeploy'da yayında: **https://z3cghxah.basicdeploy.com**

Statik çıktı, bağımlılığı olmayan küçük bir Node sunucusuyla (`server.js`)
servis edilir. Sunucu yalnızca Node yerleşik modüllerini kullanır; böylece
256 MB'lik ücretsiz konteynerde `npm install` adımı hiç çalışmaz.

### Güncelleme akışı

```bash
npm run build   # dist/ üret
npm run pack    # .deploy/eryader-site.tar.gz paketle
```

Sonra MCP üzerinden mevcut konteynere deploy edin:

```
deploy_app(containerId: "27f8db49-92c6-4f32-9ba9-ab5b2e56e317",
           tarballPath: "<repo>/.deploy/eryader-site.tar.gz")
```

### Bu kurulumda dikkat edilecek iki nokta

- **Port 8080.** BasicDeploy'un ürettiği Dockerfile 8080'i `EXPOSE` eder ve
  `PORT` değişkeni tanımlamaz. `server.js` bu yüzden 8080'e düşer; değiştirmeyin.
- **macOS xattr.** Paket macOS'ta üretiliyorsa genişletilmiş nitelikler
  temizlenmelidir, aksi hâlde deploy şu hatayla düşer:
  `lsetxattr /workspace/dist: xattr "com.apple.provenance": operation not supported`
  `npm run pack` bunu (`xattr -cr` + `tar --no-xattrs --no-mac-metadata`) zaten
  hallediyor; elle `tar` çekmeyin.

### Silinen dosyalar ve önbellek

İki nokta güncellemelerde şaşırtabilir:

- **Deploy dosyaları üzerine yazar, silmez.** Bir sayfayı veya görseli
  kaldırdıysanız konteynerde eskisi kalmaya devam eder. Temiz sonuç için önce
  `exec_command` ile `rm -rf /workspace/dist` çalıştırıp sonra deploy edin.
- **Cloudflare önbelleği.** Görseller `max-age=86400` ile sunulur; silinen ya
  da aynı adla değiştirilen bir görsel edge önbelleğinde 24 saate kadar
  yaşayabilir. `?v=...` sorgusuyla doğrulayabilirsiniz.

### Ücretsiz plan sınırları

3 konteyner, konteyner başına 256 MB bellek ve 1 GB depolama, özel alan adı yok.
`eryader.org` alan adını bağlamak için Vercel ya da GitHub Pages yolunu
kullanın (yukarıdaki bölümler) veya BasicDeploy'da ücretli plana geçin.
Ücretsiz planda sayfaların altında BasicDeploy'un kendi bilgi şeridi görünür.

---

## Lisans

İçerik ve görseller © Kapsayıcı ve Erişilebilir Yaşam Derneği.
