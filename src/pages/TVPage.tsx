import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Play, ArrowLeft, BookmarkPlus, BookmarkCheck, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieDetails, CastMember, Episode, fetchTVDetails, fetchTVCredits, fetchSeasonEpisodes, fetchTVTrailerKey, getImageUrl, getVidLinkTVUrl } from '../api/tmdb';
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
  const [infoOpen, setInfoOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
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
  }, [id, selectedSeason, show]);

  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    setTrailerLoading(true);
    fetchTVTrailerKey(show.id)
      .then((key) => {
        if (!cancelled) setTrailerKey(key);
      })
      .finally(() => {
        if (!cancelled) setTrailerLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [show?.id]);

  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInfoOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [infoOpen]);

  const title = show?.name || show?.title || 'Untitled';

  const playEpisode = useCallback(
    (episode: Episode) => {
      if (!show) return;
      setSelectedEpisode(episode);
      setSelectedSeason(episode.season_number);
      setShowPlayer(true);
      addToHistory({
        id: show.id,
        title,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        media_type: 'tv',
        vote_average: show.vote_average,
      });
      setTimeout(() => {
        document.getElementById('player-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
    },
    [show, title, addToHistory]
  );

  const nextEpisodeInfo = useMemo(() => {
    if (!selectedEpisode || !show) return null;
    const idx = episodes.findIndex((e) => e.id === selectedEpisode.id);
    if (idx >= 0 && idx < episodes.length - 1) {
      return { episode: episodes[idx + 1], needsSeasonFetch: false as const };
    }
    const seasons = (show.seasons || []).filter((s) => s.season_number > 0);
    const nextSeason = seasons.find((s) => s.season_number === selectedEpisode.season_number + 1);
    if (nextSeason) {
      return {
        episode: null as Episode | null,
        needsSeasonFetch: true as const,
        nextSeasonNumber: nextSeason.season_number,
      };
    }
    return null;
  }, [selectedEpisode, episodes, show]);

  const hasNextEpisode = Boolean(nextEpisodeInfo);

  const handleNextEpisode = useCallback(async () => {
    if (!show || !nextEpisodeInfo) return;
    if (!nextEpisodeInfo.needsSeasonFetch && nextEpisodeInfo.episode) {
      playEpisode(nextEpisodeInfo.episode);
      return;
    }
    if (nextEpisodeInfo.needsSeasonFetch && nextEpisodeInfo.nextSeasonNumber) {
      const nextSeasonEps = await fetchSeasonEpisodes(show.id, nextEpisodeInfo.nextSeasonNumber);
      if (nextSeasonEps.length > 0) {
        setSelectedSeason(nextEpisodeInfo.nextSeasonNumber);
        setEpisodes(nextSeasonEps);
        playEpisode(nextSeasonEps[0]);
      }
    }
  }, [show, nextEpisodeInfo, playEpisode]);

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

  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
  const inWatchlist = isInWatchlist(show.id, 'tv');
  const embedUrl = selectedEpisode
    ? getVidLinkTVUrl(show.id, selectedEpisode.season_number, selectedEpisode.episode_number)
    : '';

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
      <div className="relative h-[42vh] sm:h-[50vh]">
        <img src={getImageUrl(show.backdrop_path, 'original')} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
        <Link to="/" className="absolute top-20 left-4 sm:left-8 z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur text-white/80 hover:text-white text-sm">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="relative -mt-28 sm:-mt-32 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <img src={getImageUrl(show.poster_path, 'w500')} alt={title} className="w-36 sm:w-44 rounded-xl shadow-2xl ring-1 ring-white/10 flex-shrink-0 mx-auto md:mx-0" />
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
            <div className="flex flex-wrap gap-3">
              <button onClick={toggleWatchlist} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10">
                {inWatchlist ? <BookmarkCheck size={16} className="text-primary" /> : <BookmarkPlus size={16} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10"
              >
                <Info size={16} /> More Info
              </button>
            </div>
          </div>
        </div>

        {showPlayer && selectedEpisode && (
          <motion.section
            id="player-section"
            className="mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
                S{selectedEpisode.season_number} E{selectedEpisode.episode_number}
              </span>
              <span className="text-white font-semibold text-sm sm:text-base">{selectedEpisode.name}</span>
            </div>
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/40 bg-black">
              <div className="aspect-video w-full">
                <VideoPlayer
                  key={`${selectedEpisode.season_number}-${selectedEpisode.episode_number}`}
                  src={embedUrl}
                  title={`${title} S${selectedEpisode.season_number}E${selectedEpisode.episode_number}`}
                  tmdbId={show.id.toString()}
                  mediaType="tv"
                  season={selectedEpisode.season_number}
                  episode={selectedEpisode.episode_number}
                  sources={DEFAULT_SOURCES}
                  hasNextEpisode={hasNextEpisode}
                  onNextEpisode={handleNextEpisode}
                />
              </div>
            </div>
          </motion.section>
        )}

        <section>
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Episodes</h2>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-1">
            {(show.seasons || []).filter((s) => s.season_number > 0).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSeason(s.season_number)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSeason === s.season_number
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {episodes.map((ep) => {
              const active = selectedEpisode?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => playEpisode(ep)}
                  className={`group relative flex gap-3 p-3 rounded-xl text-left transition-all duration-300 ${
                    active
                      ? 'bg-primary/15 border border-primary/40 shadow-lg shadow-primary/10'
                      : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="relative w-28 sm:w-32 h-16 sm:h-[4.5rem] rounded-lg overflow-hidden bg-dark-card flex-shrink-0">
                    {ep.still_path ? (
                      <img
                        src={getImageUrl(ep.still_path, 'w300')}
                        alt={ep.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20"><Play size={22} /></div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50 ring-2 ring-white/30">
                        <Play size={16} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">E{ep.episode_number}</span>
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className={`text-sm font-semibold truncate ${active ? 'text-primary' : 'text-white group-hover:text-primary'} transition-colors`}>
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="text-xs text-white/40 line-clamp-2 mt-1">{ep.overview || 'No description'}</p>
                  </div>
                </button>
              );
            })}
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

      <AnimatePresence>
        {infoOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoOpen(false)}
            />
            <motion.div
              className="fixed z-[81] left-1/2 top-1/2 w-[min(96vw,920px)] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dark-lighter flex flex-col"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              role="dialog"
              aria-label={`${title} trailer`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                <p className="text-sm font-semibold text-white truncate pr-4">{title}</p>
                <button onClick={() => setInfoOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-y-auto">
                <div className="relative w-full aspect-video bg-black">
                  {trailerKey ? (
                    <iframe
                      key={trailerKey}
                      src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
                      title={`${title} trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {trailerLoading ? (
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <p className="text-white/50 text-sm">No trailer available for this title</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm text-white/70 leading-relaxed">{show.overview}</p>
                  <button type="button" onClick={() => setInfoOpen(false)} className="px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-white/80 text-sm font-medium hover:bg-white/10">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
