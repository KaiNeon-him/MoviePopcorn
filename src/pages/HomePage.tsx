import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import WatchedRecently from '../components/WatchedRecently';
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
    <motion.div
      className="min-h-screen bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <div className="-mt-20 relative z-10">
        <WatchedRecently />
        <MovieRow title="Trending Now" movies={trending} icon="🔥" />
        <MovieRow title="Now Playing" movies={nowPlaying} mediaType="movie" icon="🎬" />
        <MovieRow title="Top Rated Movies" movies={topRated} mediaType="movie" icon="⭐" />
        <MovieRow title="Popular TV Shows" movies={popularTV} mediaType="tv" icon="📺" />
        <MovieRow title="Popular Movies" movies={popular} mediaType="movie" icon="🍿" />
        <MovieRow title="Coming Soon" movies={upcoming} mediaType="movie" icon="🎭" />
      </div>
    </motion.div>
  );
}
