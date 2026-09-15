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
            className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
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
              className="w-48 sm:w-64 rounded-xl shadow-2xl mx-auto md:mx-0"
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
              className="flex flex-wrap items-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center gap-1 text-gold">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
              </span>
              {movie.release_date && (
                <span className="flex items-center gap-1 text-white/60">
                  <Calendar size={16} />
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1 text-white/60">
                  <Clock size={16} />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              <span className="text-white/60 text-sm uppercase">
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
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 border border-white/10"
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
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                onClick={handleWatch}
                className="flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={24} fill="white" />
                {showPlayer ? 'Hide Player' : 'Watch Now'}
              </motion.button>

              <motion.button
                onClick={handleWatchlistToggle}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                  inWatchlist
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {inWatchlist ? <BookmarkCheck size={20} /> : <BookmarkPlus size={20} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </motion.button>

              {movie.imdb_id && (
                <motion.a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <ExternalLink size={16} />
                  IMDB
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
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
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
              <p className="text-white/40 text-xs mt-2 text-center">
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
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((person, index) => (
                <motion.div
                  key={person.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <img
                    src={getImageUrl(person.profile_path, 'w185')}
                    alt={person.name}
                    className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-white/10"
                    loading="lazy"
                  />
                  <p className="text-sm font-medium text-white truncate">{person.name}</p>
                  <p className="text-xs text-white/50 truncate">{person.character}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
