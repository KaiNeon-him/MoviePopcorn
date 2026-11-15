import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { MovieDetails, CastMember, fetchMovieDetails, fetchMovieCredits, getImageUrl, getVidLinkMovieUrl } from '../api/tmdb';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchHistory } from '../hooks/useWatchHistory';
import VideoPlayer from '../components/VideoPlayer';
import { DEFAULT_SOURCES } from '../config/videoSources';

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { addToHistory } = useWatchHistory();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setPlaying(false);
    Promise.all([
      fetchMovieDetails(Number(id)),
      fetchMovieCredits(Number(id)),
    ]).then(([details, credits]) => {
      setMovie(details);
      setCast(credits.slice(0, 12));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4">
        <p className="text-white/60">Movie not found</p>
        <Link to="/" className="text-primary hover:underline">Go home</Link>
      </div>
    );
  }

  const title = movie.title || movie.name || 'Untitled';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const inList = isInWatchlist(movie.id, 'movie');
  const embedUrl = getVidLinkMovieUrl(movie.id);

  const handlePlay = () => {
    setPlaying(true);
    addToHistory({
      id: movie.id,
      title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      media_type: 'movie',
      vote_average: movie.vote_average,
    });
  };

  const toggleWatchlist = () => {
    if (inList) {
      removeFromWatchlist(movie.id, 'movie');
    } else {
      addToWatchlist({
        id: movie.id,
        title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        media_type: 'movie',
        vote_average: movie.vote_average,
      });
    }
  };

  return (
    <motion.div className="min-h-screen bg-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="relative h-[50vh] sm:h-[60vh]">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-transparent" />
        <Link
          to="/"
          className="absolute top-20 left-4 sm:left-8 z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur text-white/80 hover:text-white text-sm"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="relative -mt-32 sm:-mt-40 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={title}
            className="w-40 sm:w-52 rounded-xl shadow-2xl ring-1 ring-white/10 flex-shrink-0 mx-auto md:mx-0"
          />

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {title}
            </h1>
            {movie.tagline && (
              <p className="text-white/50 italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-gold" fill="currentColor" />
                {movie.vote_average.toFixed(1)}
              </span>
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {year}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {movie.runtime} min
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-2xl">{movie.overview}</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePlay}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/30"
              >
                <Play size={18} fill="white" /> Watch Now
              </button>
              <button
                onClick={toggleWatchlist}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10"
              >
                {inList ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10"
                >
                  IMDb <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {playing && (
          <motion.section
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
              <VideoPlayer
                src={embedUrl}
                title={title}
                tmdbId={movie.id.toString()}
                mediaType="movie"
                sources={DEFAULT_SOURCES}
              />
            </div>
          </motion.section>
        )}

        {cast.length > 0 && (
          <motion.section className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {cast.map((person) => (
                <div key={person.id} className="flex-shrink-0 w-28 text-center">
                  <img
                    src={getImageUrl(person.profile_path, 'w185')}
                    alt={person.name}
                    className="w-28 h-28 rounded-xl object-cover mb-2 ring-1 ring-white/10"
                  />
                  <p className="text-xs text-white font-medium truncate">{person.name}</p>
                  <p className="text-[10px] text-white/40 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
