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

// VidSrc.to - Alternative source
const vidsrcTo: VideoSource = {
  name: 'VidSrc',
  buildUrl: (id, type, season, episode) => {
    if (type === 'movie') {
      return `https://vidsrc.to/embed/movie/${id}`;
    }
    return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
  }
};

// 2Embed - Another alternative
const twoEmbed: VideoSource = {
  name: '2Embed',
  buildUrl: (id, type, season, episode) => {
    if (type === 'movie') {
      return `https://www.2embed.cc/embed/${id}`;
    }
    return `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`;
  }
};

// SuperEmbed - High quality alternative
const superEmbed: VideoSource = {
  name: 'SuperEmbed',
  buildUrl: (id, type, season, episode) => {
    if (type === 'movie') {
      return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
    }
    return `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
  }
};

// MoviesAPI - Another source
const moviesApi: VideoSource = {
  name: 'MoviesAPI',
  buildUrl: (id, type, season, episode) => {
    if (type === 'movie') {
      return `https://moviesapi.club/movie/${id}`;
    }
    return `https://moviesapi.club/tv/${id}-${season}-${episode}`;
  }
};

// Default sources list - ordered by reliability
// Users can switch between these if one is down or buffering
export const DEFAULT_SOURCES: VideoSource[] = [
  vidapi,
  vidsrcTo,
  twoEmbed,
  superEmbed,
  moviesApi,
];

// Helper to get source by name
export function getSourceByName(name: string): VideoSource | undefined {
  return DEFAULT_SOURCES.find(s => s.name === name);
}
