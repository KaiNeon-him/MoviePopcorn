import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Movie, fetchPopularTV, fetchTopRatedTV } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

type Category = 'popular' | 'top_rated';

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'popular', label: 'Popular', emoji: '📺' },
  { key: 'top_rated', label: 'Top Rated', emoji: '⭐' },
];

export default function TVShowsPage() {
  const [category, setCategory] = useState<Category>('popular');
  const [shows, setShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchFn = {
      popular: fetchPopularTV,
      top_rated: fetchTopRatedTV,
    }[category];
    fetchFn().then((data) => {
      setShows(data);
      setLoading(false);
    });
  }, [category]);

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
          📺 TV Shows
        </motion.h1>

        {/* Category tabs - modern pill style */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
          {CATEGORIES.map((cat, index) => (
            <motion.button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${
                category === cat.key
                  ? 'text-white shadow-lg shadow-primary/30'
                  : 'bg-white/[0.06] border border-white/[0.08] text-white/60 hover:bg-white/[0.1] hover:text-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category === cat.key && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark"
                  layoutId="tv-category-bg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] shimmer rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {shows.map((show, index) => (
              <MovieCard key={show.id} movie={show} mediaType="tv" index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
