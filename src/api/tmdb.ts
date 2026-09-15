const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = '2dca580c2a14b55200e784d157207b4d';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: string;
  original_language: string;
  popularity: number;
}

export interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  imdb_id?: string;
  tagline?: string;
  status: string;
  original_language: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  seasons?: Season[];
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  runtime?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export async function fetchTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchPopularMovies(page: number = 1): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchTopRatedMovies(page: number = 1): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchPopularTV(page: number = 1): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchTopRatedTV(page: number = 1): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchNowPlaying(): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchUpcoming(): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`);
  const data = await res.json();
  return data;
}

export async function fetchTVDetails(id: number): Promise<MovieDetails> {
  const res = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits`);
  const data = await res.json();
  return data;
}

export async function fetchMovieCredits(id: number): Promise<CastMember[]> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  const data = await res.json();
  return data.cast || [];
}

export async function fetchTVCredits(id: number): Promise<CastMember[]> {
  const res = await fetch(`${TMDB_BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
  const data = await res.json();
  return data.cast || [];
}

export async function fetchSeasonEpisodes(tvId: number, seasonNumber: number): Promise<Episode[]> {
  const res = await fetch(`${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
  const data = await res.json();
  return data.episodes || [];
}

export async function searchMulti(query: string, page: number = 1): Promise<Movie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  const data = await res.json();
  return (data.results || []).filter((item: Movie) => item.media_type === 'movie' || item.media_type === 'tv');
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a2e/666?text=No+Image';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getVidApiMovieUrl(imdbId: string): string {
  return `https://vaplayer.ru/embed/movie/${imdbId}`;
}

export function getVidApiTVUrl(tmdbId: number, season: number, episode: number): string {
  return `https://vaplayer.ru/embed/tv/${tmdbId}/${season}/${episode}`;
}

export const GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};
