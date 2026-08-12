import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

/** Duyuru, haber ve basın içerikleri tek şemayı paylaşır; `category` yolu belirler. */
const posts = defineCollection({
  loader: md('posts'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['duyurular', 'haberler', 'basinda-biz']),
    cover: z.string().optional(),
    summary: z.string().optional(),
    /** İçeriğin kaynağı olan dış bağlantı (basın haberi, form vb.). */
    sourceUrl: z.string().url().optional(),
  }),
});

const kurumsal = defineCollection({
  loader: md('kurumsal'),
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    summary: z.string().optional(),
  }),
});

const etkinlikler = defineCollection({
  loader: md('etkinlikler'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    summary: z.string().optional(),
    location: z.string().optional(),
  }),
});

const webinarlar = defineCollection({
  loader: md('webinarlar'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    youtubeId: z.string(),
    cover: z.string().optional(),
    summary: z.string().optional(),
  }),
});

const videolar = defineCollection({
  loader: md('videolar'),
  schema: z.object({
    title: z.string(),
    youtubeId: z.string(),
    cover: z.string().optional(),
    summary: z.string().optional(),
    order: z.number().default(99),
  }),
});

const galeriler = defineCollection({
  loader: md('galeriler'),
  schema: z.object({
    title: z.string(),
    cover: z.string(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })),
    order: z.number().default(99),
  }),
});

export const collections = { posts, kurumsal, etkinlikler, webinarlar, videolar, galeriler };
