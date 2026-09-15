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
      <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
        <Link
          to={linkTo}
          className="block group relative rounded-2xl overflow-hidden bg-dark-card shadow-lg shadow-black/20 ring-1 ring-white/[0.06] hover:ring-white/[0.12] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
        >
          {/* Poster */}
          <div className="aspect-[2/3] relative overflow-hidden">
            <motion.img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Play button - modern circular */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative group/play"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl scale-150" />
                {/* Button */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl shadow-primary/40 ring-2 ring-white/20">
                  <Play size={22} className="text-white ml-1" fill="white" strokeWidth={2.5} />
                </div>
              </motion.div>
            </motion.div>

            {/* Rating badge - modern pill */}
            <motion.div
              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08]"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Star size={11} className="text-gold" fill="currentColor" strokeWidth={2.5} />
              <span className="text-[11px] font-bold text-white tabular-nums">{movie.vote_average.toFixed(1)}</span>
            </motion.div>

            {/* Type badge */}
            {type === 'tv' && (
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-gradient-to-r from-primary to-primary-dark">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">TV</span>
              </div>
            )}

            {/* Watchlist button - modern icon button */}
            <motion.button
              onClick={handleWatchlistToggle}
              className="absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{
                background: inWatchlist ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                borderColor: inWatchlist ? 'rgba(229, 9, 20, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              {inWatchlist ? (
                <BookmarkCheck size={15} className="text-primary" strokeWidth={2.5} />
              ) : (
                <BookmarkPlus size={15} className="text-white/90" strokeWidth={2.5} />
              )}
            </motion.button>
          </div>

          {/* Info */}
          <div className="p-3.5">
            <h3 className="text-[13px] font-semibold text-white truncate group-hover:text-primary transition-colors duration-300 leading-tight">
              {title}
            </h3>
            <p className="text-[11px] text-white/40 mt-1.5 font-medium tracking-wide">
              {year}{movie.original_language && ` • ${movie.original_language.toUpperCase()}`}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
