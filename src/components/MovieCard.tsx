import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Play, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Movie, getImageUrl } from '../api/tmdb';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../context/AuthContext';

interface MovieCardProps {
  movie: Movie;
  mediaType?: 'movie' | 'tv';
  index?: number;
  rank?: number;
}

export default function MovieCard({ movie, mediaType, index = 0, rank }: MovieCardProps) {
  const type = mediaType || movie.media_type || 'movie';
  const title = movie.title || movie.name || 'Untitled';
  const date = movie.release_date || movie.first_air_date || '';
  const year = date ? new Date(date).getFullYear() : '';
  const linkTo = type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const inWatchlist = isInWatchlist(movie.id, type as 'movie' | 'tv');

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        to={linkTo}
        className="block group relative rounded-xl overflow-hidden bg-transparent transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="aspect-[2/3] relative overflow-hidden rounded-xl ring-1 ring-white/[0.06] group-hover:ring-white/[0.14] transition-all duration-300">
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />

          {/* Soft hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rank badge (TOP 10) */}
          {rank != null && (
            <div className="absolute bottom-2 left-2 z-10">
              <span
                className="text-4xl sm:text-5xl font-black leading-none text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {rank}
              </span>
            </div>
          )}

          {/* Rating pill */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm border border-white/[0.08]">
            <Star size={10} className="text-gold" fill="currentColor" />
            <span className="text-[10px] font-bold text-white tabular-nums">
              {movie.vote_average?.toFixed(1) ?? '—'}
            </span>
          </div>

          {/* Play on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-11 h-11 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/40 ring-2 ring-white/20">
              <Play size={18} className="text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Watchlist */}
          <button
            onClick={handleWatchlistToggle}
            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/30 hover:border-primary/40"
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inWatchlist ? (
              <BookmarkCheck size={14} className="text-primary" />
            ) : (
              <BookmarkPlus size={14} className="text-white/90" />
            )}
          </button>
        </div>

        {/* Meta under poster — Koddo style */}
        <div className="pt-2.5 px-0.5">
          <h3 className="text-[13px] font-semibold text-white truncate group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-[11px] text-white/45 mt-0.5 font-medium flex items-center gap-1.5">
            {movie.vote_average > 0 && (
              <>
                <Star size={9} className="text-gold" fill="currentColor" />
                <span className="tabular-nums">{movie.vote_average.toFixed(1)}</span>
                <span className="text-white/25">·</span>
              </>
            )}
            {year && <span>{year}</span>}
            {year && <span className="text-white/25">·</span>}
            <span className="capitalize">{type === 'tv' ? 'Series' : 'Movie'}</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
