/** Privacy-enhanced player URL. The iframe, VideoObject.embedUrl, and video sitemap all use this. */
export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}

/** ISO 8601 duration (PT1M10S) to whole seconds for a video sitemap. */
export function isoDurationToSeconds(duration: string): number {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return 0;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}
