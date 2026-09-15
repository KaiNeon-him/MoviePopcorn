import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, ExternalLink, ArrowLeft } from 'lucide-react';
import { MovieDetails, CastMember, fetchMovieDetails, fetchMovieCredits, getImageUrl, getVidApiMovieUrl } from '../api/tmdb';

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

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

  return (
    <div className="min-h-screen bg-dark">
      {/* Backdrop */}
      <div className="relative h-[60vh] sm:h-[70vh]">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title || ''}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative -mt-48 sm:-mt-64 z-10 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title || ''}
              className="w-48 sm:w-64 rounded-xl shadow-2xl mx-auto md:mx-0"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-white/50 italic text-lg mb-4">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
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
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 border border-white/10"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
              {movie.overview}
            </p>

            {/* Watch Button */}
            <button
              onClick={() => setShowPlayer(!showPlayer)}
              className="flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
            >
              <Play size={24} fill="white" />
              {showPlayer ? 'Hide Player' : 'Watch Now'}
            </button>

            {/* External link */}
            {movie.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-white/50 hover:text-gold transition-colors ml-4"
              >
                <ExternalLink size={16} />
                View on IMDB
              </a>
            )}
          </div>
        </div>

        {/* Video Player */}
        {showPlayer && (
          <div className="mt-8 mb-8">
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
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="text-center">
                  <img
                    src={getImageUrl(person.profile_path, 'w185')}
                    alt={person.name}
                    className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-white/10"
                    loading="lazy"
                  />
                  <p className="text-sm font-medium text-white truncate">{person.name}</p>
                  <p className="text-xs text-white/50 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Production */}
        {movie.production_companies && movie.production_companies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-white/60 mb-3">Production</h2>
            <div className="flex flex-wrap gap-4">
              {movie.production_companies.slice(0, 5).map((company) => (
                <span key={company.id} className="text-white/50 text-sm bg-white/5 px-3 py-1 rounded">
                  {company.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
