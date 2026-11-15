import { useState, useEffect, useRef, useMemo } from 'react';
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
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('');
  const [showStillWatching, setShowStillWatching] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState(settings.subtitleLanguage || 'off');
  const [isPortrait, setIsPortrait] = useState(false);

  const mediaId = tmdbId || imdbId || '';
  const progressKey = `moviepopcorn_progress_${mediaId}`;

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'PLAYER_EVENT') return;
      const d = event.data.data || {};
      const status = d.player_status || d.event;
      const progress = d.player_progress ?? d.currentTime ?? 0;
      const dur = d.player_duration ?? d.duration ?? 0;
      if (status === 'play' || status === 'playing') setPlayerStatus('playing');
      else if (status === 'pause' || status === 'paused') setPlayerStatus('paused');
      else if (status === 'ended' || status === 'completed') {
        setPlayerStatus('completed');
        if (hasNextEpisode && settings.autoplayNext) {
          setTimeout(() => onNextEpisode?.(), 2000);
        }
        setShowNextEpisode(hasNextEpisode);
      } else if (status) setPlayerStatus(status);
      setCurrentTime(progress);
      setDuration(dur);
      if (d.quality?.label) setQuality(d.quality.label);
      onProgressUpdate?.(progress, dur);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [hasNextEpisode, settings.autoplayNext, onNextEpisode, onProgressUpdate]);

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
                        Use the <span className="text-white/70">CC</span> button inside the player for working subtitles. Preference is saved for next time.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSubtitle('off');
                        setShowSubtitleMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.06]"
                    >
                      Off
                    </button>
                    {['en', 'es', 'fr', 'de', 'ja', 'ko', 'ar', 'hi'].map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          setSelectedSubtitle(code);
                          setShowSubtitleMenu(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm capitalize ${
                          selectedSubtitle === code ? 'bg-primary/20 text-primary' : 'text-white/70 hover:bg-white/[0.06]'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
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

        <AnimatePresence>
          {showNextEpisode && hasNextEpisode && (
            <motion.button
              onClick={() => onNextEpisode?.()}
              className="absolute bottom-28 right-4 flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/90 text-white shadow-lg z-20"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              Next Episode <ChevronRight size={18} />
            </motion.button>
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
