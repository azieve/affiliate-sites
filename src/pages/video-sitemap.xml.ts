import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/data/site';
import { getCanonicalUrl } from '@/utils/seo';
import { isoDurationToSeconds, youtubeEmbedUrl } from '@/utils/video';

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.video != null);

  const urls = posts
    .map((entry) => {
      const video = entry.data.video!;
      const loc = getCanonicalUrl(`/blog/${entry.id}`);
      const thumbnail = video.thumbnail.startsWith('http')
        ? video.thumbnail
        : `${siteConfig.url}${video.thumbnail}`;

      return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <video:video>
      <video:thumbnail_loc>${xmlEscape(thumbnail)}</video:thumbnail_loc>
      <video:title>${xmlEscape(video.name)}</video:title>
      <video:description>${xmlEscape(video.description)}</video:description>
      <video:player_loc>${xmlEscape(youtubeEmbedUrl(video.youtubeId))}</video:player_loc>
      <video:duration>${isoDurationToSeconds(video.duration)}</video:duration>
      <video:publication_date>${xmlEscape(video.uploadDate)}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
    </video:video>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
