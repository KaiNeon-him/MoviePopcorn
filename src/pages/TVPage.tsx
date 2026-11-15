import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Play, ArrowLeft, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { MovieDetails, CastMember, Episode, fetchTVDetails, fetchTVCredits, fetchSeasonEpisodes, getImageUrl, getVidLinkTVUrl } from '../api/tmdb';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { useWatchlist } from '../hooks/useWatchlist';
import VideoPlayer from '../components/VideoPlayer';
import { DEFAULT_SOURCES } from '../config/videoSources';

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
    Promise.all([fetchTVDetails(Number(id)), fetchTVCredits(Number(id))]).then(([details, credits]) => {
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
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4">
        <p className="text-white/60">TV show not found</p>
        <Link to="/" className="text-primary hover:underline">Go home</Link>
      </div>
    );
  }

  const title = show.name || show.title || 'Untitled';
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
  const inWatchlist = isInWatchlist(show.id, 'tv');
  const embedUrl = selectedEpisode
    ? getVidLinkTVUrl(show.id, selectedEpisode.season_number, selectedEpisode.episode_number)
    : '';

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
    addToHistory({
      id: show.id,
      title,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      media_type: 'tv',
      vote_average: show.vote_average,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWatchlist = () => {
    if (inWatchlist) removeFromWatchlist(show.id, 'tv');
    else {
      addToWatchlist({
        id: show.id,
        title,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        media_type: 'tv',
        vote_average: show.vote_average,
      });
    }
  };

  return (
    <motion.div className="min-h-screen bg-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="relative h-[45vh] sm:h-[55vh]">
        <img src={getImageUrl(show.backdrop_path, 'original')} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
        <Link to="/" className="absolute top-20 left-4 sm:left-8 z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur text-white/80 hover:text-white text-sm">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="relative -mt-28 sm:-mt-36 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <img src={getImageUrl(show.poster_path, 'w500')} alt={title} className="w-36 sm:w-48 rounded-xl shadow-2xl ring-1 ring-white/10 flex-shrink-0 mx-auto md:mx-0" />
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-white/70">
              <span className="flex items-center gap-1"><Star size={14} className="text-gold" fill="currentColor" />{show.vote_average.toFixed(1)}</span>
              {year && <span className="flex items-center gap-1"><Calendar size={14} />{year}</span>}
              {show.number_of_seasons && <span>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>}
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {show.genres?.map((g) => (
                <span key={g.id} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">{g.name}</span>
              ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-2xl">{show.overview}</p>
            <button onClick={toggleWatchlist} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10">
              {inWatchlist ? <BookmarkCheck size={16} className="text-primary" /> : <BookmarkPlus size={16} />}
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        {showPlayer && selectedEpisode && (
          <motion.section className="mt-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
                S{selectedEpisode.season_number} E{selectedEpisode.episode_number}
              </span>
              <span className="text-white font-semibold">{selectedEpisode.name}</span>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
              <VideoPlayer
                src={embedUrl}
                title={`${title} S${selectedEpisode.season_number}E${selectedEpisode.episode_number}`}
                tmdbId={show.id.toString()}
                mediaType="tv"
                season={selectedEpisode.season_number}
                episode={selectedEpisode.episode_number}
                sources={DEFAULT_SOURCES}
              />
            </div>
          </motion.section>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Episodes</h2>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
            {(show.seasons || []).filter((s) => s.season_number > 0).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSeason(s.season_number)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedSeason === s.season_number
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => handleEpisodeClick(ep)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors ${
                  selectedEpisode?.id === ep.id ? 'bg-primary/15 border border-primary/30' : 'bg-white/[0.03] hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <div className="w-28 h-16 rounded-lg overflow-hidden bg-dark-card flex-shrink-0">
                  {ep.still_path ? (
                    <img src={getImageUrl(ep.still_path, 'w300')} alt={ep.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Play size={20} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{ep.episode_number}. {ep.name}</p>
                  <p className="text-xs text-white/40 line-clamp-1 mt-0.5">{ep.overview}</p>
                </div>
                <Play size={16} className="text-white/40 flex-shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {cast.map((person) => (
                <div key={person.id} className="flex-shrink-0 w-28 text-center">
                  <img src={getImageUrl(person.profile_path, 'w185')} alt={person.name} className="w-28 h-28 rounded-xl object-cover mb-2 ring-1 ring-white/10" />
                  <p className="text-xs text-white font-medium truncate">{person.name}</p>
                  <p className="text-[10px] text-white/40 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
