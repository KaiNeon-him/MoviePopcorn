// Video source providers
// Each provider builds an embed URL from media IDs

export interface VideoSource {
  name: string;
  /** Prefer TMDB id — VidLink requires TMDB for movies and TV */
  buildUrl: (id: string, type: 'movie' | 'tv', season?: number, episode?: number) => string;
}

/**
 * VidLink.pro — primary embed provider
 * Docs: https://vidlink.pro/
 * Movies: /movie/{tmdbId}
 * TV:     /tv/{tmdbId}/{season}/{episode}
 */
const vidlink: VideoSource = {
  name: 'VidLink',
  buildUrl: (id, type, season, episode) => {
    const base =
      type === 'movie'
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidlink.pro/tv/${id}/${season ?? 1}/${episode ?? 1}`;

    const url = new URL(base);
    // Hex colors without leading #
    url.searchParams.set('primaryColor', 'e50914');
    url.searchParams.set('secondaryColor', '170000');
    url.searchParams.set('iconColor', 'e50914');
    url.searchParams.set('icons', 'default');
    url.searchParams.set('title', 'false');
    url.searchParams.set('poster', 'true');
    url.searchParams.set('autoplay', 'true');
    return url.toString();
  },
};

export const DEFAULT_SOURCES: VideoSource[] = [vidlink];

export function getSourceByName(name: string): VideoSource | undefined {
  return DEFAULT_SOURCES.find((s) => s.name === name);
}
