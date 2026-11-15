// Video source providers — Netflix-inspired red/black theme for VidLink.pro

export interface VideoSource {
  name: string;
  /** Prefer TMDB id — VidLink requires TMDB for movies and TV */
  buildUrl: (id: string, type: 'movie' | 'tv', season?: number, episode?: number) => string;
}

/**
 * VidLink.pro — primary embed
 * Theme tuned to Netflix-like red / black chrome
 * Built-in captions live inside the player UI (CC button)
 */
const vidlink: VideoSource = {
  name: 'VidLink',
  buildUrl: (id, type, season, episode) => {
    const base =
      type === 'movie'
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidlink.pro/tv/${id}/${season ?? 1}/${episode ?? 1}`;

    const url = new URL(base);
    // Netflix-style colors (hex without #)
    url.searchParams.set('primaryColor', 'e50914');
    url.searchParams.set('secondaryColor', '141414');
    url.searchParams.set('iconColor', 'ffffff');
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
