import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCw, RotateCw, Subtitles } from 'lucide-react';
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

const NEXT_COUNTDOWN_SEC = 5;

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

  const mediaId = tmdbId || imdbId || '';
  const progressKey = `moviepopcorn_progress_${mediaId}_${season ?? 0}_${episode ?? 0}`;

  // Reset advance guard when episode changes
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

  // Countdown → auto advance
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

  const cancelAutoNext = () => {
    setNextCountdown(null);
    // keep the Next button visible
  };

  // Listen for player end events (VidLink / generic iframe players)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const raw = event.data;
      if (raw == null) return;

      // Support several payload shapes
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
        // timeupdate-style without status
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
        // Near-end fallback when player never sends "ended"
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

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
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

        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between pointer-events-none z-10">
          <motion.h3
            className="text-white font-semibold text-sm sm:text-base truncate max-w-[50%] drop-shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.h3>

          <div className="flex items-center gap-2 pointer-events-auto">
            {quality && (
              <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">{quality}</div>
            )}

            {sources.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowSourceMenu(!showSourceMenu)}
                  className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-semibold hover:bg-black/80 flex items-center gap-1.5"
                >
                  <span>Server {currentSourceIndex + 1}</span>
                  <ChevronRight size={12} className={showSourceMenu ? 'rotate-90' : ''} />
                </button>
                <AnimatePresence>
                  {showSourceMenu && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-48 bg-dark-lighter/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-30"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {sources.map((source, index) => (
                        <button
                          key={source.name}
                          onClick={() => switchSource(index)}
                          className={`w-full px-4 py-2.5 text-left text-sm ${
                            index === currentSourceIndex ? 'bg-primary/20 text-primary font-semibold' : 'text-white/70 hover:bg-white/[0.06]'
                          }`}
                        >
                          {source.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button onClick={reloadPlayer} className="p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-white hover:bg-black/80" title="Reload">
              <RefreshCw size={14} />
            </button>

            <div className="relative" data-subtitle-menu>
              <button
                onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                className="p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-white hover:bg-black/80"
                title="Subtitles"
              >
                <Subtitles size={14} />
              </button>
              <AnimatePresence>
                {showSubtitleMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 w-56 bg-dark-lighter/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-30"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="p-3 border-b border-white/[0.06]">
                      <p className="text-xs text-white/50 font-medium">Captions</p>
                      <p className="text-[11px] text-white/35 mt-1 leading-relaxed">
                        Use the <span className="text-white/70">CC</span> button inside the player for working subtitles.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isMobile && (
              <button onClick={handleRotate} className="p-1.5 rounded-lg bg-black/60 text-white/70 hover:text-white md:hidden" title="Rotate">
                <RotateCw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Auto next / manual next */}
        <AnimatePresence>
          {showNextEpisode && hasNextEpisode && (
            <motion.div
              className="absolute bottom-24 right-4 z-20 flex flex-col items-end gap-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              {nextCountdown !== null && (
                <div className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur text-xs text-white/80 border border-white/10">
                  Next episode in {nextCountdown}s…{' '}
                  <button onClick={cancelAutoNext} className="text-primary hover:underline ml-1">
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setNextCountdown(null);
                  advancedRef.current = true;
                  onNextEpisode?.();
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/90 hover:bg-primary text-white shadow-lg"
              >
                Next Episode <ChevronRight size={18} />
              </button>
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
