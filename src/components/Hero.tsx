import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, Film, X, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Movie,
  getImageUrl,
  fetchTrending,
  fetchMovieTrailerKey,
  fetchMovieReviewSnippet,
  TmdbReview,
  GENRES,
} from '../api/tmdb';

export default function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [review, setReview] = useState<TmdbReview | null>(null);

  useEffect(() => {
    fetchTrending('movie', 'week').then((data) => {
      setMovies(data.slice(0, 5));
    });
  }, []);

  // Pause auto-rotate while trailer is open
  useEffect(() => {
    if (movies.length === 0 || trailerOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length, trailerOpen]);

  const movie = movies[currentIndex];

  // Prefetch trailer + review for active slide
  useEffect(() => {
    if (!movie) return;
    let cancelled = false;
    setTrailerKey(null);
    setReview(null);
    setTrailerLoading(true);

    Promise.all([fetchMovieTrailerKey(movie.id), fetchMovieReviewSnippet(movie.id)])
      .then(([key, rev]) => {
        if (cancelled) return;
        setTrailerKey(key);
        setReview(rev);
      })
      .finally(() => {
        if (!cancelled) setTrailerLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movie?.id]);

  const openTrailer = useCallback(() => {
    if (!trailerKey) return;
    setTrailerOpen(true);
  }, [trailerKey]);

  const closeTrailer = () => setTrailerOpen(false);

  useEffect(() => {
    if (!trailerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTrailer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [trailerOpen]);

  if (movies.length === 0) {
    return <div className="h-[80vh] shimmer" />;
  }

  const title = movie.title || movie.name || '';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const genreNames = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRES[id])
    .filter(Boolean);

  const reviewText = review
    ? review.content.replace(/\s+/g, ' ').trim().slice(0, 140) + (review.content.length > 140 ? '…' : '')
    : null;

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
          <div className="absolute inset-0 gradient-bottom" />
          <div className="absolute inset-0 gradient-left" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

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
              className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <span className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-xs font-bold uppercase tracking-wider text-white">
                Trending
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                <Star size={13} className="text-gold" fill="currentColor" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
                {movie.vote_count != null && movie.vote_count > 0 && (
                  <span className="text-white/40 text-xs">({movie.vote_count > 1000 ? `${(movie.vote_count / 1000).toFixed(1)}k` : movie.vote_count})</span>
                )}
              </span>
              {year && <span className="text-white/50 text-sm font-medium">{year}</span>}
              {genreNames.map((g) => (
                <span key={g} className="hidden sm:inline px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-white/60">
                  {g}
                </span>
              ))}
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="text-white/70 text-sm sm:text-base line-clamp-3 mb-4 max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {movie.overview}
            </motion.p>

            {/* Audience review snippet */}
            {reviewText && (
              <motion.blockquote
                className="mb-5 max-w-lg pl-3 border-l-2 border-primary/50"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs sm:text-sm text-white/55 italic leading-relaxed flex gap-2">
                  <MessageSquareQuote size={14} className="text-primary/70 shrink-0 mt-0.5" />
                  <span>
                    “{reviewText}”
                    <span className="not-italic text-white/35"> — {review?.author}</span>
                  </span>
                </p>
              </motion.blockquote>
            )}

            <motion.div
              className="flex flex-wrap items-center gap-2.5 sm:gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/movie/${movie.id}`}
                  className="group relative inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                >
                  <Play size={18} fill="white" strokeWidth={0} />
                  <span className="relative z-10">Watch Now</span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  type="button"
                  onClick={openTrailer}
                  disabled={!trailerKey || trailerLoading}
                  className={`inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border text-sm font-semibold transition-all duration-300 ${
                    trailerKey
                      ? 'bg-white text-dark hover:bg-white/90 border-white'
                      : 'bg-white/[0.04] text-white/40 border-white/10 cursor-not-allowed'
                  }`}
                  title={trailerKey ? 'Play trailer' : 'No trailer available'}
                >
                  <Film size={17} strokeWidth={2.25} />
                  <span>{trailerLoading ? 'Loading…' : 'Trailer'}</span>
                </button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/movie/${movie.id}`}
                  className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl text-white font-semibold text-sm hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
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
        className="absolute bottom-8 right-8 flex gap-2 z-10"
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
            animate={{ width: index === currentIndex ? 32 : 6 }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Trailer modal */}
      <AnimatePresence>
        {trailerOpen && trailerKey && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTrailer}
            />
            <motion.div
              className="fixed z-[81] left-1/2 top-1/2 w-[min(96vw,960px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              role="dialog"
              aria-label={`${title} trailer`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-dark-lighter/90">
                <p className="text-sm font-semibold text-white truncate pr-4">
                  {title} <span className="text-white/40 font-normal">· Trailer</span>
                </p>
                <button
                  onClick={closeTrailer}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                  aria-label="Close trailer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  title={`${title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
