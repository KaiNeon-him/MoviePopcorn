import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, ArrowLeft, ChevronRight, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieDetails, CastMember, Episode, fetchTVDetails, fetchTVCredits, fetchSeasonEpisodes, getImageUrl, getVidApiTVUrl } from '../api/tmdb';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useWatchlist } from '../hooks/useWatchlist';

export default function TVPage() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const { addToHistory } = useWatchHistory();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetchTVDetails(Number(id)),
      fetchTVCredits(Number(id)),
    ]).then(([details, credits]) => {
      setShow(details);
      setCast(credits.slice(0, 12));
      setSelectedSeason(1);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!id || !show) return;
    fetchSeasonEpisodes(Number(id), selectedSeason).then(setEpisodes);
    setSelectedEpisode(null);
    setShowPlayer(false);
  }, [id, selectedSeason, show]);

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

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60 text-xl">TV Show not found</p>
      </div>
    );
  }

  const embedUrl = selectedEpisode
    ? getVidApiTVUrl(show.id, selectedEpisode.season_number, selectedEpisode.episode_number)
    : '';
  const inWatchlist = isInWatchlist(show.id, 'tv');

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
    addToHistory({
      id: show.id,
      title: show.name || '',
      poster_path: show.poster_path,
      media_type: 'tv',
      season: episode.season_number,
      episode: episode.episode_number,
    });
  };

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(show.id, 'tv');
    } else {
      addToWatchlist({
        id: show.id,
        title: show.name || '',
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        media_type: 'tv',
        vote_average: show.vote_average,
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
          src={getImageUrl(show.backdrop_path, 'original')}
          alt={show.name || ''}
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
              src={getImageUrl(show.poster_path, 'w500')}
              alt={show.name || ''}
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
              {show.name}
            </h1>
            {show.tagline && (
              <motion.p
                className="text-white/50 italic text-lg mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "{show.tagline}"
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
                <span className="font-bold">{show.vote_average.toFixed(1)}</span>
              </span>
              {show.first_air_date && (
                <span className="flex items-center gap-1 text-white/60">
                  <Calendar size={16} />
                  {new Date(show.first_air_date).getFullYear()}
                </span>
              )}
              {show.number_of_seasons && (
                <span className="text-white/60">
                  {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
              {show.number_of_episodes && (
                <span className="text-white/60">
                  {show.number_of_episodes} Episodes
                </span>
              )}
            </motion.div>

            {/* Genres */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {show.genres.map((genre, index) => (
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
              {show.overview}
            </motion.p>

            {/* Watchlist button */}
            <motion.button
              onClick={handleWatchlistToggle}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                inWatchlist
                  ? 'bg-primary/20 text-primary border border-primary/50'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {inWatchlist ? <BookmarkCheck size={20} /> : <BookmarkPlus size={20} />}
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </motion.button>
          </motion.div>
        </div>

        {/* Video Player */}
        <AnimatePresence>
          {showPlayer && selectedEpisode && (
            <motion.div
              className="mt-8 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white/60 text-sm">
                  S{selectedEpisode.season_number} E{selectedEpisode.episode_number}
                </span>
                <span className="text-white font-medium">{selectedEpisode.name}</span>
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                  className="w-full h-full"
                  title={`${show.name} S${selectedEpisode.season_number}E${selectedEpisode.episode_number}`}
                />
              </div>
              <p className="text-white/40 text-xs mt-2 text-center">
                Powered by VidAPI • If the player doesn't load, try refreshing
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Season & Episode Selector */}
        {show.seasons && show.seasons.length > 0 && (
          <motion.section
            className="mt-12 mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Episodes
            </h2>

            {/* Season tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
              {show.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                  <motion.button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.season_number)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedSeason === season.season_number
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Season {season.season_number}
                  </motion.button>
                ))}
            </div>

            {/* Episode list */}
            <div className="space-y-3">
              {episodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedEpisode?.id === episode.id
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                  onClick={() => handleEpisodeClick(episode)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  {/* Episode thumbnail */}
                  <div className="flex-shrink-0 w-32 sm:w-40 aspect-video rounded-lg overflow-hidden relative">
                    {episode.still_path ? (
                      <img
                        src={getImageUrl(episode.still_path, 'w300')}
                        alt={episode.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-surface flex items-center justify-center">
                        <Play size={24} className="text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play size={16} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>

                  {/* Episode info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary font-bold text-sm">
                        E{episode.episode_number}
                      </span>
                      <h4 className="text-white font-medium truncate">{episode.name}</h4>
                    </div>
                    <p className="text-white/50 text-sm line-clamp-2">{episode.overview}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {episode.runtime && (
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {episode.runtime}m
                        </span>
                      )}
                      {episode.vote_average > 0 && (
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Star size={12} className="text-gold" fill="currentColor" />
                          {episode.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={20} className="text-white/30 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

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
