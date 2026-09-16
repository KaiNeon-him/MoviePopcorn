import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie, getImageUrl, fetchTrending } from '../api/tmdb';

export default function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTrending('movie', 'week').then((data) => {
      setMovies(data.slice(0, 5));
    });
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <div className="h-[80vh] shimmer" />
    );
  }

  const movie = movies[currentIndex];
  const title = movie.title || movie.name || '';

  return (
    <div className="relative h-[85vh] sm:h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
        >
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 gradient-bottom" />
          <div className="absolute inset-0 gradient-left" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full flex items-end pb-20 sm:pb-32 px-4 sm:px-8 lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-white">Trending</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                <Star size={13} className="text-gold" fill="currentColor" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
              </span>
              {movie.release_date && (
                <span className="text-white/50 text-sm font-medium">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="text-white/70 text-sm sm:text-base line-clamp-3 mb-6 max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {movie.overview}
            </motion.p>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/movie/${movie.id}`}
                  className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <Play size={18} fill="white" strokeWidth={2.5} className="relative z-10" />
                  <span className="relative z-10">Watch Now</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/movie/${movie.id}`}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl text-white font-semibold text-sm hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
                >
                  <Info size={18} strokeWidth={2.25} className="text-white/80 group-hover:text-white transition-colors" />
                  <span>More Info</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <motion.div
        className="absolute bottom-8 right-8 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {movies.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'bg-gradient-to-r from-primary to-gold' : 'bg-white/30 hover:bg-white/50'
            }`}
            animate={{
              width: index === currentIndex ? 32 : 6,
            }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
        ))}
      </motion.div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full blur-sm"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
