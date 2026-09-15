import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, ExternalLink, ArrowLeft, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieDetails, CastMember, fetchMovieDetails, fetchMovieCredits, getImageUrl, getVidApiMovieUrl } from '../api/tmdb';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useWatchlist } from '../hooks/useWatchlist';

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const { addToHistory } = useWatchHistory();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetchMovieDetails(Number(id)),
      fetchMovieCredits(Number(id)),
    ]).then(([details, credits]) => {
      setMovie(details);
      setCast(credits.slice(0, 12));
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="shimmer h-[60vh] rounded-2xl mb-8" />
          <div className="shimmer h-8 w-64 rounded mb-4" />
          <div className="shimmer h-4 w-full rounded mb-2" />
          <div className="shimmer h-4 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60 text-xl">Movie not found</p>
      </div>
    );
  }

  const embedUrl = movie.imdb_id ? getVidApiMovieUrl(movie.imdb_id) : getVidApiMovieUrl(`tt${movie.id}`);
  const inWatchlist = isInWatchlist(movie.id, 'movie');

  const handleWatch = () => {
    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      addToHistory({
        id: movie.id,
        title: movie.title || '',
        poster_path: movie.poster_path,
        media_type: 'movie',
        progress: 0,
      });
    }
  };

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie');
    } else {
      addToWatchlist({
        id: movie.id,
        title: movie.title || '',
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        media_type: 'movie',
        vote_average: movie.vote_average,
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="relative h-[60vh] sm:h-[70vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title || ''}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/"
            className="absolute top-20 left-4 sm:left-8 group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
          >
            <ArrowLeft size={16} strokeWidth={2.5} className="text-white/70 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Back</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative -mt-48 sm:-mt-64 z-10 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title || ''}
              className="w-48 sm:w-64 rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/[0.1] mx-auto md:mx-0"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {movie.title}
            </h1>
            {movie.tagline && (
              <motion.p
                className="text-white/50 italic text-lg mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "{movie.tagline}"
              </motion.p>
            )}

            <motion.div
              className="flex flex-wrap items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                <Star size={14} className="text-gold" fill="currentColor" strokeWidth={2.5} />
                <span className="font-bold text-white text-sm">{movie.vote_average.toFixed(1)}</span>
              </span>
              {movie.release_date && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                  <Calendar size={14} strokeWidth={2.25} className="text-white/60" />
                  <span className="text-white/70 text-sm">{new Date(movie.release_date).getFullYear()}</span>
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                  <Clock size={14} strokeWidth={2.25} className="text-white/60" />
                  <span className="text-white/70 text-sm">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm text-white/60 text-sm uppercase font-medium">
                {movie.original_language}
              </span>
            </motion.div>

            {/* Genres */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {movie.genres.map((genre, index) => (
                <motion.span
                  key={genre.id}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 font-medium hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  {genre.name}
                </motion.span>
              ))}
            </motion.div>

            {/* Overview */}
            <motion.p
              className="text-white/70 text-base sm:text-lg leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {movie.overview}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                onClick={handleWatch}
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Play size={18} fill="white" strokeWidth={2.5} className="relative z-10" />
                <span className="relative z-10">{showPlayer ? 'Hide Player' : 'Watch Now'}</span>
              </motion.button>

              <motion.button
                onClick={handleWatchlistToggle}
                className={`group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  inWatchlist
                    ? 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20'
                    : 'bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.1] hover:border-white/[0.2]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {inWatchlist ? (
                  <BookmarkCheck size={18} strokeWidth={2.5} />
                ) : (
                  <BookmarkPlus size={18} strokeWidth={2.5} />
                )}
                <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </motion.button>

              {movie.imdb_id && (
                <motion.a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-gold hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <ExternalLink size={16} strokeWidth={2.25} />
                  <span className="text-sm font-medium">IMDB</span>
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Video Player */}
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              className="mt-8 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/[0.1]">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                  className="w-full h-full"
                  title={movie.title}
                />
              </div>
              <p className="text-white/40 text-xs mt-3 text-center font-medium">
                Powered by VidAPI • If the player doesn't load, try refreshing
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cast */}
        {cast.length > 0 && (
          <motion.section
            className="mt-12 mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((person, index) => (
                <motion.div
                  key={person.id}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <img
                      src={getImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-full h-full rounded-full object-cover ring-2 ring-white/[0.08] group-hover:ring-primary/30 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">{person.name}</p>
                  <p className="text-xs text-white/50 truncate mt-0.5">{person.character}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
