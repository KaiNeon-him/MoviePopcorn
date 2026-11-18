// Video source providers — primary: VidSrc.sh (TMDB + IMDb)

export interface VideoSource {
  name: string;
  /** Prefer TMDB id — both providers accept TMDB for movies and TV */
  buildUrl: (id: string, type: 'movie' | 'tv', season?: number, episode?: number) => string;
}

/**
 * VidSrc.sh — primary embed
 * Accepts TMDB numeric IDs or IMDb tt… IDs
 */
const vidsrc: VideoSource = {
  name: 'VidSrc',
  buildUrl: (id, type, season, episode) => {
    const base =
      type === 'movie'
        ? `https://vidsrc.sh/embed/movie/${id}`
        : `https://vidsrc.sh/embed/tv/${id}/${season ?? 1}/${episode ?? 1}`;

    const url = new URL(base);
    url.searchParams.set('autoplay', '1');
    url.searchParams.set('ds_lang', 'en');
    return url.toString();
  },
};

/** Optional fallback if primary fails for a title */
const vidlinkFallback: VideoSource = {
  name: 'VidLink',
  buildUrl: (id, type, season, episode) => {
    const base =
      type === 'movie'
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidlink.pro/tv/${id}/${season ?? 1}/${episode ?? 1}`;

    const url = new URL(base);
    url.searchParams.set('primaryColor', 'e50914');
    url.searchParams.set('secondaryColor', '141414');
    url.searchParams.set('iconColor', 'ffffff');
    url.searchParams.set('title', 'false');
    url.searchParams.set('poster', 'true');
    url.searchParams.set('autoplay', 'true');
    return url.toString();
  },
};

export const DEFAULT_SOURCES: VideoSource[] = [vidsrc, vidlinkFallback];

export function getSourceByName(name: string): VideoSource | undefined {
  return DEFAULT_SOURCES.find((s) => s.name === name);
}
