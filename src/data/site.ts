/**
 * Site geneli sabitler. CMS yerine tek kaynak burasıdır —
 * iletişim bilgisi, menü, yönetim kurulu ve banka bilgileri burada güncellenir.
 */

export const site = {
  name: 'Eryader',
  fullName: 'Kapsayıcı ve Erişilebilir Yaşam Derneği',
  shortDesc:
    'Görme engelli bireylerin eğitimde ve toplumsal yaşamda tam ve eşit katılımı için çalışan dernek.',
  url: 'https://eryader.org',
  locale: 'tr-TR',
  lang: 'tr',
  foundedCity: 'Ankara',
} as const;

export const contact = {
  address:
    'Erzurum Mh. Dumlupınar Cad. Geçim Sokak No:21/5, 06590 Kurtuluş / Çankaya / Ankara',
  addressShort: 'Kurtuluş, Çankaya / Ankara',
  email: 'info@eryader.org',
  mapsEmbed:
    'https://www.google.com/maps?q=Erzurum+Mh.+Dumlup%C4%B1nar+Cad.+Ge%C3%A7im+Sokak+No:21/5+%C3%87ankaya+Ankara&output=embed',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Erzurum+Mh.+Dumlup%C4%B1nar+Cad.+Ge%C3%A7im+Sokak+No%3A21%2F5+%C3%87ankaya+Ankara',
} as const;

export const social = [
  { name: 'Facebook', url: 'https://www.facebook.com/eryader.ankara' },
  { name: 'X', url: 'https://x.com/EryaderAnkara' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/eryader' },
  { name: 'Instagram', url: 'https://www.instagram.com/eryaderankara/' },
] as const;

/** Ziraat Bankası TL hesabı — bağış ve aidat tahsilatı için. */
export const bank = {
  bankName: 'Ziraat Bankası',
  accountType: 'TL Hesabı',
  accountName: 'Kapsayıcı ve Erişilebilir Yaşam Derneği',
  iban: 'TR33 0001 0008 4797 6916 4850 01',
} as const;

/**
 * Yönetim Kurulu. Kaynak: eryader.org/kurumsal/hakkimizda (2025).
 * Değişiklik olduğunda yalnızca bu dizi güncellenir.
 */
export const board = [
  { name: 'Hale Uçuş', role: 'Başkan', type: 'asil' },
  { name: 'Esra', role: 'Başkan Yardımcısı', type: 'asil' },
  { name: 'Sümeyye Damat', role: 'Sekreter', type: 'asil' },
  { name: 'Haydar Külekci', role: 'Sayman', type: 'asil' },
  { name: 'Mehtap Demirtaş', role: 'Asil Üye', type: 'asil' },
  { name: 'Olcay Aşcı', role: 'Yedek Üye', type: 'yedek' },
  { name: 'Zeynep Barak', role: 'Yedek Üye', type: 'yedek' },
  { name: 'Saime Çiloğlu Akdan', role: 'Yedek Üye', type: 'yedek' },
  { name: 'Gönül Moroğlu', role: 'Yedek Üye', type: 'yedek' },
  { name: 'Sevgi Kırboyun Tipi', role: 'Yedek Üye', type: 'yedek' },
] as const;

/**
 * Anasayfada gösterilen sayaçlar.
 * "Fotoğraf" sayacı, foto galeri bölümü boşaltıldığı için kaldırıldı —
 * galeriler yeniden doldurulduğunda geri eklenebilir.
 */
export const stats = [
  { value: 325, label: 'Faal Üye' },
  { value: 22, label: 'Etkinlik' },
  { value: 250, label: 'Ulaşılan Görme Engelli', suffix: '+' },
  { value: 30, label: 'Ulaşılan Öğretmen', suffix: '+' },
] as const;

/** Ana gezinme. `children` varsa açılır menü olarak sunulur. */
export const nav = [
  { label: 'Anasayfa', href: '/' },
  {
    label: 'Derneğimiz',
    href: '/kurumsal/hakkimizda',
    children: [
      { label: 'Hakkımızda', href: '/kurumsal/hakkimizda' },
      { label: 'Misyonumuz', href: '/kurumsal/misyonumuz' },
      { label: 'Vizyonumuz', href: '/kurumsal/vizyonumuz' },
      { label: 'Yönetim Kurulu', href: '/kurullar/yonetim-kurulu' },
      { label: 'Dernek Tüzüğü', href: '/kurumsal/dernek-tuzugu' },
      { label: 'Üyelik Başvuru Şartları', href: '/kurumsal/uyelik-basvuru-sartlari' },
    ],
  },
  {
    label: 'Etkinlikler',
    href: '/etkinlikler',
    children: [
      { label: 'Etkinlikler', href: '/etkinlikler' },
      { label: 'Webinarlar', href: '/webinarlar' },
    ],
  },
  {
    label: 'Multimedya',
    href: '/foto-galeriler',
    children: [
      { label: 'Foto Galeriler', href: '/foto-galeriler' },
      { label: 'Videolar', href: '/videolar' },
      { label: 'Basında Biz', href: '/basinda-biz' },
    ],
  },
  { label: 'Duyurular', href: '/duyurular' },
  { label: 'Haberler', href: '/haberler' },
  {
    label: 'İletişim',
    href: '/iletisim',
    children: [
      { label: 'İletişim Bilgileri', href: '/iletisim' },
      { label: 'Hesap Numaraları', href: '/hesap-numaralari' },
    ],
  },
] as const;

export const footerNav = [
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '/kurumsal/hakkimizda' },
      { label: 'Misyonumuz', href: '/kurumsal/misyonumuz' },
      { label: 'Vizyonumuz', href: '/kurumsal/vizyonumuz' },
      { label: 'Dernek Tüzüğü', href: '/kurumsal/dernek-tuzugu' },
      { label: 'Yönetim Kurulu', href: '/kurullar/yonetim-kurulu' },
      { label: 'KVKK Aydınlatma Metni', href: '/kurumsal/genel-aydinlatma-metni' },
    ],
  },
  {
    title: 'Multimedya',
    links: [
      { label: 'Duyurular', href: '/duyurular' },
      { label: 'Haberler', href: '/haberler' },
      { label: 'Foto Galeriler', href: '/foto-galeriler' },
      { label: 'Videolar', href: '/videolar' },
      { label: 'Basında Biz', href: '/basinda-biz' },
      { label: 'Webinarlar', href: '/webinarlar' },
    ],
  },
  {
    title: 'Katılım',
    links: [
      { label: 'Üyelik Başvurusu', href: '/uyelik-basvurusu' },
      { label: 'Üyelik Başvuru Şartları', href: '/kurumsal/uyelik-basvuru-sartlari' },
      { label: 'Bağış Yap', href: '/bagis-yap' },
      { label: 'Hesap Numaraları', href: '/hesap-numaralari' },
      { label: 'İletişim', href: '/iletisim' },
      { label: 'Site Haritası', href: '/site-haritasi' },
    ],
  },
] as const;

/** Kategori slug'ı → görünen ad ve kök yol. */
export const categories = {
  duyurular: { label: 'Duyuru', plural: 'Duyurular', base: '/duyurular' },
  haberler: { label: 'Haber', plural: 'Haberler', base: '/haberler' },
  'basinda-biz': { label: 'Basında Biz', plural: 'Basında Biz', base: '/basinda-biz' },
} as const;

export type CategoryKey = keyof typeof categories;
