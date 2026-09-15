import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Movie, getImageUrl } from '../api/tmdb';

interface MovieCardProps {
  movie: Movie;
  mediaType?: 'movie' | 'tv';
}

export default function MovieCard({ movie, mediaType }: MovieCardProps) {
  const type = mediaType || movie.media_type || 'movie';
  const title = movie.title || movie.name || 'Untitled';
  const date = movie.release_date || movie.first_air_date || '';
  const year = date ? new Date(date).getFullYear() : '';
  const linkTo = type === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <Link
      to={linkTo}
      className="card-hover block group relative rounded-xl overflow-hidden bg-dark-card"
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </div>
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
          <Star size={12} className="text-gold" fill="currentColor" />
          <span className="text-xs font-semibold text-white">{movie.vote_average.toFixed(1)}</span>
        </div>
        {/* Type badge */}
        {type === 'tv' && (
          <div className="absolute top-2 left-2 bg-primary/90 rounded-md px-2 py-0.5">
            <span className="text-xs font-bold text-white">TV</span>
          </div>
        )}
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
  );
}
