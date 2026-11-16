import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, X, MessageSquareQuote } from 'lucide-react';
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
  const [infoOpen, setInfoOpen] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [review, setReview] = useState<TmdbReview | null>(null);

  useEffect(() => {
    fetchTrending('movie', 'week').then((data) => {
      setMovies(data.slice(0, 5));
    });
  }, []);

  // Pause auto-rotate while info modal is open
  useEffect(() => {
    if (movies.length === 0 || infoOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length, infoOpen]);

  const movie = movies[currentIndex];

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

  const closeInfo = () => setInfoOpen(false);

  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeInfo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [infoOpen]);

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
    ? review.content.replace(/\s+/g, ' ').trim().slice(0, 160) + (review.content.length > 160 ? '…' : '')
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
                  <span className="text-white/40 text-xs">
                    ({movie.vote_count > 1000 ? `${(movie.vote_count / 1000).toFixed(1)}k` : movie.vote_count})
                  </span>
                )}
              </span>
              {year && <span className="text-white/50 text-sm font-medium">{year}</span>}
              {genreNames.map((g) => (
                <span
                  key={g}
                  className="hidden sm:inline px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-white/60"
                >
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
              className="text-white/70 text-sm sm:text-base line-clamp-3 mb-6 max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {movie.overview}
            </motion.p>

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
                  onClick={() => setInfoOpen(true)}
                  className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-xl text-white font-semibold text-sm hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
                >
                  <Info size={18} strokeWidth={2.25} className="text-white/80 group-hover:text-white transition-colors" />
                  <span>More Info</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

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

      {/* More Info modal — trailer embed + details */}
      <AnimatePresence>
        {infoOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeInfo}
            />
            <motion.div
              className="fixed z-[81] left-1/2 top-1/2 w-[min(96vw,920px)] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dark-lighter flex flex-col"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              role="dialog"
              aria-label={`${title} details`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                <p className="text-sm font-semibold text-white truncate pr-4">{title}</p>
                <button
                  onClick={closeInfo}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto">
                {/* Embedded trailer */}
                <div className="relative w-full aspect-video bg-black">
                  {trailerKey ? (
                    <iframe
                      key={trailerKey}
                      src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
                      title={`${title} trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {trailerLoading ? (
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="text-center px-6">
                          <p className="text-white/50 text-sm mb-3">No trailer available for this title</p>
                          <img
                            src={getImageUrl(movie.backdrop_path, 'w780')}
                            alt=""
                            className="max-h-48 mx-auto rounded-lg opacity-60 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-white font-semibold">
                      <Star size={14} className="text-gold" fill="currentColor" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                    {year && <span className="text-white/50">{year}</span>}
                    {genreNames.map((g) => (
                      <span key={g} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed">{movie.overview}</p>

                  {reviewText && (
                    <blockquote className="pl-3 border-l-2 border-primary/40">
                      <p className="text-xs sm:text-sm text-white/55 italic leading-relaxed flex gap-2">
                        <MessageSquareQuote size={14} className="text-primary/70 shrink-0 mt-0.5" />
                        <span>
                          “{reviewText}”
                          <span className="not-italic text-white/35"> — {review?.author}</span>
                        </span>
                      </p>
                    </blockquote>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to={`/movie/${movie.id}`}
                      onClick={closeInfo}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold shadow-lg shadow-primary/25"
                    >
                      <Play size={16} fill="white" strokeWidth={0} /> Watch Now
                    </Link>
                    <button
                      type="button"
                      onClick={closeInfo}
                      className="px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-white/80 text-sm font-medium hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
