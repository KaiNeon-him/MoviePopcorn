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
  const [top10, setTop10] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTrending('all', 'day').then((data) => {
      setTop10(data.slice(0, 10));
    });
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
      <div className="-mt-16 sm:-mt-20 relative z-10 space-y-2 pb-8">
        <WatchedRecently />
        <MovieRow title="TOP 10 Today" movies={top10} showRank />
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Now Playing" movies={nowPlaying} mediaType="movie" />
        <MovieRow title="Top Rated" movies={topRated} mediaType="movie" />
        <MovieRow title="Popular TV Shows" movies={popularTV} mediaType="tv" />
        <MovieRow title="Popular Movies" movies={popular} mediaType="movie" />
        <MovieRow title="Coming Soon" movies={upcoming} mediaType="movie" />
      </div>
    </motion.div>
  );
}
