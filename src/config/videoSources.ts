// Multiple video source providers
// Each provider has a function to build the embed URL from media IDs

export interface VideoSource {
  name: string;
  buildUrl: (id: string, type: 'movie' | 'tv', season?: number, episode?: number) => string;
}

// VidAPI - Primary source (the one we've been using)
const vidapi: VideoSource = {
  name: 'VidAPI',
  buildUrl: (id, type, season, episode) => {
    const baseUrl = type === 'movie'
      ? `https://vaplayer.ru/embed/movie/${id}`
      : `https://vaplayer.ru/embed/tv/${id}/${season}/${episode}`;
    
    const url = new URL(baseUrl);
    url.searchParams.set('overlay', 'false');
    url.searchParams.set('primaryColor', '#e50914');
    return url.toString();
  }
};

// Default sources list - currently only VidAPI works reliably
// Other sources (VidSrc, 2Embed, SuperEmbed, MoviesAPI) are blocked by browsers
// Users can add more sources here if they find working alternatives
export const DEFAULT_SOURCES: VideoSource[] = [
  vidapi,
];

// Helper to get source by name
export function getSourceByName(name: string): VideoSource | undefined {
  return DEFAULT_SOURCES.find(s => s.name === name);
}
