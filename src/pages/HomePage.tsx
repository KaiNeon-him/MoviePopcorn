import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { Movie, fetchPopularMovies, fetchTopRatedMovies, fetchPopularTV, fetchNowPlaying, fetchUpcoming, fetchTrending } from '../api/tmdb';

export default function HomePage() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTrending('all', 'week').then(setTrending);
    fetchPopularMovies().then(setPopular);
    fetchTopRatedMovies().then(setTopRated);
    fetchNowPlaying().then(setNowPlaying);
    fetchUpcoming().then(setUpcoming);
    fetchPopularTV().then(setPopularTV);
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <Hero />
      <div className="-mt-20 relative z-10">
        <MovieRow title="🔥 Trending Now" movies={trending} />
        <MovieRow title="🎬 Now Playing" movies={nowPlaying} mediaType="movie" />
        <MovieRow title="⭐ Top Rated Movies" movies={topRated} mediaType="movie" />
        <MovieRow title="📺 Popular TV Shows" movies={popularTV} mediaType="tv" />
        <MovieRow title="🍿 Popular Movies" movies={popular} mediaType="movie" />
        <MovieRow title="🎭 Coming Soon" movies={upcoming} mediaType="movie" />
      </div>
    </div>
  );
}
