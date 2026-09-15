import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Play, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Movie, getImageUrl } from '../api/tmdb';
import { useWatchlist } from '../hooks/useWatchlist';

interface MovieCardProps {
  movie: Movie;
  mediaType?: 'movie' | 'tv';
  index?: number;
}

export default function MovieCard({ movie, mediaType, index = 0 }: MovieCardProps) {
  const type = mediaType || movie.media_type || 'movie';
  const title = movie.title || movie.name || 'Untitled';
  const date = movie.release_date || movie.first_air_date || '';
  const year = date ? new Date(date).getFullYear() : '';
  const linkTo = type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id, type as 'movie' | 'tv');

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id, type as 'movie' | 'tv');
    } else {
      addToWatchlist({
        id: movie.id,
        title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        media_type: type as 'movie' | 'tv',
        vote_average: movie.vote_average,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.2 }}>
        <Link
          to={linkTo}
          className="block group relative rounded-xl overflow-hidden bg-dark-card shadow-lg"
        >
          {/* Poster */}
          <div className="aspect-[2/3] relative overflow-hidden">
            <motion.img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                <Play size={24} className="text-white ml-1" fill="white" />
              </motion.div>
            </motion.div>
            {/* Rating badge */}
            <motion.div
              className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star size={12} className="text-gold" fill="currentColor" />
              <span className="text-xs font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
            </motion.div>
            {/* Type badge */}
            {type === 'tv' && (
              <div className="absolute top-2 left-2 bg-primary/90 rounded-md px-2 py-0.5">
                <span className="text-xs font-bold text-white">TV</span>
              </div>
            )}
            {/* Watchlist button */}
            <motion.button
              onClick={handleWatchlistToggle}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {inWatchlist ? (
                <BookmarkCheck size={16} className="text-primary" />
              ) : (
                <BookmarkPlus size={16} className="text-white" />
              )}
            </motion.button>
          </div>
          {/* Info */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-white/50 mt-1">
              {year}{movie.original_language && ` • ${movie.original_language.toUpperCase()}`}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
