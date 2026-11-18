import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCw, RotateCw, Subtitles, Server } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import StillWatchingModal from './StillWatchingModal';
import { useStillWatching } from '../hooks/useStillWatching';

interface VideoPlayerProps {
  src: string;
  title: string;
  imdbId?: string;
  tmdbId?: string;
  onNextEpisode?: () => void;
  hasNextEpisode?: boolean;
  onProgressUpdate?: (progress: number, duration: number) => void;
  sources?: Array<{
    name: string;
    buildUrl: (id: string, type: 'movie' | 'tv', season?: number, episode?: number) => string;
  }>;
  mediaType?: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

type PlayerStatus = 'playing' | 'paused' | 'completed' | 'seeked' | 'idle';

const NEXT_COUNTDOWN_SEC = 8;

export default function VideoPlayer({
  src,
  title,
  imdbId,
  tmdbId,
  onNextEpisode,
  hasNextEpisode = false,
  onProgressUpdate,
  sources = [],
  mediaType = 'movie',
  season,
  episode,
}: VideoPlayerProps) {
  const { settings } = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const advancedRef = useRef(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('');
  const [showStillWatching, setShowStillWatching] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [nextCountdown, setNextCountdown] = useState<number | null>(null);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState(settings.subtitleLanguage || 'off');
  const [isPortrait, setIsPortrait] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mediaId = tmdbId || imdbId || '';
  const progressKey = `moviepopcorn_progress_${mediaId}_${season ?? 0}_${episode ?? 0}`;

  useEffect(() => {
    advancedRef.current = false;
    setShowNextEpisode(false);
    setNextCountdown(null);
    setPlayerStatus('idle');
    setCurrentTime(0);
    setDuration(0);
  }, [src, season, episode, tmdbId]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const bumpChrome = useCallback(() => {
    setChromeVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setChromeVisible(false), 3200);
  }, []);

  useEffect(() => {
    bumpChrome();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [bumpChrome, src]);

  const handleRotate = async () => {
    if (!('orientation' in screen)) {
      alert('Screen rotation is not supported on this device');
      return;
    }
    try {
      await (screen.orientation as any).lock('landscape');
    } catch {
      alert('Please rotate your device to landscape for the best viewing experience');
    }
  };

  const embedUrl = useMemo(() => {
    if (sources.length > 0 && sources[currentSourceIndex]) {
      const id = tmdbId || imdbId || '';
      return sources[currentSourceIndex].buildUrl(id, mediaType, season, episode);
    }

    const url = new URL(src);
    // Netflix red/black theme (honored by VidLink; ignored harmlessly by others)
    url.searchParams.set('primaryColor', 'e50914');
    url.searchParams.set('secondaryColor', '141414');
    url.searchParams.set('iconColor', 'ffffff');
    url.searchParams.set('title', 'false');
    url.searchParams.set('poster', 'true');

    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress && !src.includes('startAt') && !src.includes('resumeAt')) {
      url.searchParams.set('startAt', savedProgress);
    }
    url.searchParams.set('autoplay', settings.autoplay ? 'true' : 'false');
    return url.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, imdbId, tmdbId, season, episode, currentSourceIndex, selectedSubtitle]);

  const switchSource = (index: number) => {
    setCurrentSourceIndex(index);
    setIframeKey((prev) => prev + 1);
    setShowSourceMenu(false);
  };

  const reloadPlayer = () => setIframeKey((prev) => prev + 1);

  const startNextFlow = useCallback(() => {
    if (advancedRef.current) return;
    if (!hasNextEpisode) {
      setShowNextEpisode(false);
      return;
    }
    advancedRef.current = true;
    setShowNextEpisode(true);

    if (settings.autoplayNext) {
      setNextCountdown(NEXT_COUNTDOWN_SEC);
    }
  }, [hasNextEpisode, settings.autoplayNext]);

  useEffect(() => {
    if (nextCountdown === null) return;
    if (nextCountdown <= 0) {
      onNextEpisode?.();
      setNextCountdown(null);
      return;
    }
    const t = setTimeout(() => setNextCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(t);
  }, [nextCountdown, onNextEpisode]);

  const cancelAutoNext = () => setNextCountdown(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const raw = event.data;
      if (raw == null) return;

      let status: string | undefined;
      let progress = 0;
      let dur = 0;
      let qualityLabel: string | undefined;

      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          status = parsed?.type || parsed?.event || parsed?.player_status;
          progress = parsed?.currentTime ?? parsed?.player_progress ?? 0;
          dur = parsed?.duration ?? parsed?.player_duration ?? 0;
        } catch {
          if (/ended|complete/i.test(raw)) status = 'ended';
        }
      } else if (typeof raw === 'object') {
        const d = raw.data && typeof raw.data === 'object' ? raw.data : raw;
        status =
          raw.type === 'PLAYER_EVENT'
            ? d.player_status || d.event || d.status
            : d.player_status || d.event || d.status || raw.event || raw.type;
        progress = d.player_progress ?? d.currentTime ?? d.time ?? 0;
        dur = d.player_duration ?? d.duration ?? 0;
        qualityLabel = d.quality?.label || d.quality;
      }

      if (!status && progress > 0) {
        setCurrentTime(progress);
        if (dur > 0) setDuration(dur);
        onProgressUpdate?.(progress, dur);
        if (dur > 30 && progress >= dur - 1.25) {
          setPlayerStatus('completed');
          startNextFlow();
        }
        return;
      }

      if (!status) return;

      const s = String(status).toLowerCase();
      if (s === 'play' || s === 'playing' || s === 'timeupdate') {
        if (s !== 'timeupdate') setPlayerStatus('playing');
        setCurrentTime(progress);
        if (dur > 0) setDuration(dur);
        onProgressUpdate?.(progress, dur);
        if (dur > 30 && progress >= dur - 1.25) {
          setPlayerStatus('completed');
          startNextFlow();
        }
      } else if (s === 'pause' || s === 'paused') {
        setPlayerStatus('paused');
      } else if (s === 'ended' || s === 'completed' || s === 'complete' || s === 'finish' || s === 'finished') {
        setPlayerStatus('completed');
        startNextFlow();
      } else {
        setPlayerStatus(s as PlayerStatus);
      }

      if (qualityLabel) setQuality(String(qualityLabel));
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [startNextFlow, onProgressUpdate]);

  useEffect(() => {
    if (!showSubtitleMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-subtitle-menu]')) setShowSubtitleMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSubtitleMenu]);

  useEffect(() => {
    if (!mediaId) return;
    const interval = setInterval(() => {
      if (playerStatus === 'playing' && currentTime > 0) {
        localStorage.setItem(progressKey, Math.floor(currentTime).toString());
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [playerStatus, currentTime, mediaId, progressKey]);

  useStillWatching({
    isPlaying: playerStatus === 'playing' && !showStillWatching,
    onTimeout: () => setShowStillWatching(true),
  });

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden group/player"
      onMouseMove={bumpChrome}
      onTouchStart={bumpChrome}
    >
      <div
        className="relative w-full bg-black"
        style={{ aspectRatio: isPortrait ? 'auto' : '16 / 9', minHeight: isPortrait ? '50vh' : '240px' }}
      >
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={embedUrl}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          className="absolute inset-0 w-full h-full border-0"
          title={title}
        />

        {/* Netflix-style vignette gradients */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/35 to-transparent transition-opacity duration-500 z-[5] ${
            chromeVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 z-[5] ${
            chromeVisible || showNextEpisode ? 'opacity-100' : 'opacity-40'
          }`}
        />

        {/* Top chrome */}
        <div
          className={`absolute top-0 left-0 right-0 px-3 sm:px-5 pt-3 sm:pt-4 pb-8 flex items-start justify-between z-10 transition-all duration-400 ${
            chromeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="min-w-0 max-w-[55%]">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#e50914]">Now Playing</p>
            <h3 className="text-white font-semibold text-sm sm:text-lg truncate drop-shadow-lg leading-tight mt-0.5">
              {title}
            </h3>
            {season != null && episode != null && (
              <p className="text-white/55 text-xs mt-0.5">S{season} · E{episode}</p>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {quality && (
              <div className="hidden sm:block px-2 py-1 rounded bg-black/55 border border-white/10 text-white/80 text-[10px] font-bold tracking-wide">
                {quality}
              </div>
            )}

            {sources.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowSourceMenu(!showSourceMenu)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded bg-black/55 border border-white/15 text-white text-xs font-semibold hover:bg-black/75 hover:border-white/25 transition-colors"
                >
                  <Server size={12} className="text-[#e50914]" />
                  <span className="hidden sm:inline">{sources[currentSourceIndex]?.name || 'Server'}</span>
                  <span className="sm:hidden">{currentSourceIndex + 1}</span>
                </button>
                <AnimatePresence>
                  {showSourceMenu && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-44 rounded-md overflow-hidden bg-[#141414] border border-white/10 shadow-2xl shadow-black/80 z-30"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {sources.map((source, index) => (
                        <button
                          key={source.name}
                          onClick={() => switchSource(index)}
                          className={`w-full px-3.5 py-2.5 text-left text-sm border-b border-white/[0.06] last:border-0 ${
                            index === currentSourceIndex
                              ? 'bg-[#e50914]/15 text-white font-semibold'
                              : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          {source.name}
                          {index === currentSourceIndex && (
                            <span className="ml-2 text-[10px] text-[#e50914]">●</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              onClick={reloadPlayer}
              className="p-1.5 rounded bg-black/55 border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-colors"
              title="Reload"
            >
              <RefreshCw size={14} />
            </button>

            <div className="relative" data-subtitle-menu>
              <button
                onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                className="p-1.5 rounded bg-black/55 border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-colors"
                title="Subtitles"
              >
                <Subtitles size={14} />
              </button>
              <AnimatePresence>
                {showSubtitleMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 w-56 rounded-md overflow-hidden bg-[#141414] border border-white/10 shadow-2xl z-30"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="p-3">
                      <p className="text-xs text-white/50 font-medium">Subtitles</p>
                      <p className="text-[11px] text-white/35 mt-1 leading-relaxed">
                        Use the <span className="text-white/80">CC</span> control inside the video player for captions.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isMobile && (
              <button
                onClick={handleRotate}
                className="p-1.5 rounded bg-black/55 border border-white/10 text-white/70 hover:text-white md:hidden"
                title="Rotate"
              >
                <RotateCw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Fake Netflix scrubber hint when we have progress */}
        {duration > 0 && (
          <div
            className={`absolute left-3 right-3 sm:left-5 sm:right-5 bottom-3 z-[6] transition-opacity duration-400 ${
              chromeVisible && !showNextEpisode ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="h-[3px] w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-[#e50914] rounded-full transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* Netflix-style next episode card */}
        <AnimatePresence>
          {showNextEpisode && hasNextEpisode && (
            <motion.div
              className="absolute bottom-6 right-3 sm:right-6 z-20 w-[min(92vw,320px)]"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <div className="rounded-md overflow-hidden bg-[#141414] border border-white/10 shadow-2xl shadow-black/80">
                <div className="px-4 pt-3 pb-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/45 font-semibold">Up Next</p>
                  <p className="text-white font-semibold text-sm mt-0.5 line-clamp-1">{title}</p>
                  {nextCountdown !== null && (
                    <p className="text-xs text-white/55 mt-1">
                      Playing in <span className="text-white font-semibold">{nextCountdown}s</span>
                      {' · '}
                      <button type="button" onClick={cancelAutoNext} className="text-white/80 hover:text-white underline-offset-2 hover:underline">
                        Cancel
                      </button>
                    </p>
                  )}
                </div>
                {nextCountdown !== null && (
                  <div className="h-1 w-full bg-white/10">
                    <div
                      className="h-full bg-[#e50914] transition-all duration-1000 linear"
                      style={{ width: `${((NEXT_COUNTDOWN_SEC - nextCountdown) / NEXT_COUNTDOWN_SEC) * 100}%` }}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setNextCountdown(null);
                    advancedRef.current = true;
                    onNextEpisode?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#e50914] hover:bg-[#f6121d] text-white text-sm font-bold tracking-wide transition-colors"
                >
                  Next Episode <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StillWatchingModal
        isOpen={showStillWatching}
        onContinue={() => setShowStillWatching(false)}
        onStop={() => setShowStillWatching(false)}
        title={`Still watching ${title}?`}
      />
    </div>
  );
}
