import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
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
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 gradient-bottom" />
        <div className="absolute inset-0 gradient-left" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-20 sm:pb-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
              Trending
            </span>
            <span className="flex items-center gap-1 text-gold text-sm">
              <Star size={14} fill="currentColor" />
              {movie.vote_average.toFixed(1)}
            </span>
            {movie.release_date && (
              <span className="text-white/60 text-sm">
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>

          <p className="text-white/70 text-sm sm:text-base line-clamp-3 mb-6 max-w-lg">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4">
            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Play size={20} fill="white" />
              Watch Now
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur-sm"
            >
              <Info size={20} />
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-primary w-8' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
