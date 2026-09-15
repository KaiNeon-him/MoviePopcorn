import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Movie, fetchTrending } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

type TimeWindow = 'day' | 'week';

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTrending('all', timeWindow).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [timeWindow]);

  return (
    <motion.div
      className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-white mb-6"
          style={{ fontFamily: "'Outfit', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔥 Trending
        </motion.h1>

        {/* Time window tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'day' as TimeWindow, label: 'Today' },
            { key: 'week' as TimeWindow, label: 'This Week' },
          ].map((option, index) => (
            <motion.button
              key={option.key}
              onClick={() => setTimeWindow(option.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                timeWindow === option.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] shimmer rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            key={timeWindow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {movies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
