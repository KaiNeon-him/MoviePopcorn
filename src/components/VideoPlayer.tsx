import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, ChevronRight, RefreshCw, RotateCw, Subtitles } from 'lucide-react';
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
  // Multiple server sources for fallback
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
  episode
}: VideoPlayerProps) {
  const { settings } = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0); // Force iframe reload only when needed
  
  // Player state from VidAPI events
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('');
  
  // UI state
  const [showStillWatching, setShowStillWatching] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState(settings.subtitleLanguage || 'off');
  const [isPortrait, setIsPortrait] = useState(false);

  // Get the media ID for progress saving
  const mediaId = imdbId || tmdbId || '';
  const progressKey = `moviepopcorn_progress_${mediaId}`;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect portrait mode
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Manual rotate function
  const handleRotate = async () => {
    if (!('orientation' in screen)) {
      alert('Screen rotation is not supported on this device');
      return;
    }
    
    try {
      await (screen.orientation as any).lock('landscape');
    } catch (err) {
      console.log('Rotation failed:', err);
      alert('Please rotate your device manually to landscape mode for the best viewing experience');
    }
  };

  // Build the embed URL ONCE on mount - this prevents iframe reloads
  // Only rebuilds when src or mediaId changes (i.e., different movie/episode)
  const embedUrl = useMemo(() => {
    // If we have multiple sources, use the current one
    if (sources.length > 0 && sources[currentSourceIndex]) {
      const id = imdbId || tmdbId || '';
      return sources[currentSourceIndex].buildUrl(id, mediaType, season, episode);
    }
    
    // Otherwise use the provided src
    const url = new URL(src);
    
    // Hide VidAPI's hover overlay (we show our own title)
    url.searchParams.set('overlay', 'false');
    
    // Set primary color to match our theme
    url.searchParams.set('primaryColor', '#e50914');
    
    // Resume from saved position
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress && !src.includes('resumeAt')) {
      url.searchParams.set('resumeAt', savedProgress);
    }
    
    // Autoplay based on settings
    url.searchParams.set('autoplay', settings.autoplay ? '1' : '0');
    
    // Subtitle language - use selected subtitle or default from settings
    const subtitleLang = selectedSubtitle !== 'off' ? selectedSubtitle : (settings.subtitles ? settings.subtitleLanguage : null);
    if (subtitleLang) {
      url.searchParams.set('ds_lang', subtitleLang);
    }
    
    return url.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, imdbId, tmdbId, season, episode, currentSourceIndex, selectedSubtitle]);
  
  // Switch to a different server source
  const switchSource = (index: number) => {
    setCurrentSourceIndex(index);
    setIframeKey(prev => prev + 1); // Force iframe reload with new source
    setShowSourceMenu(false);
  };
  
  // Reload current source (useful if playback is broken)
  const reloadPlayer = () => {
    setIframeKey(prev => prev + 1);
  };

  // Listen for VidAPI player events via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'PLAYER_EVENT') return;
      
      const { player_status, player_progress, player_duration, quality: q } = event.data.data;
      
      // Update state from VidAPI
      setPlayerStatus(player_status);
      setCurrentTime(player_progress);
      setDuration(player_duration);
      
      if (q) setQuality(q.label);
      
      // Report progress to parent
      onProgressUpdate?.(player_progress, player_duration);
      
      // Handle different statuses
      switch (player_status) {
        case 'playing':
          // Show skip intro button at the beginning (first 90 seconds)
          setShowSkipIntro(currentTime < 90 && currentTime > 5);
          break;
          
        case 'completed':
          // Auto-play next episode if enabled
          if (hasNextEpisode && settings.autoplayNext) {
            setTimeout(() => {
              onNextEpisode?.();
            }, 2000);
          }
          setShowNextEpisode(hasNextEpisode);
          break;
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [hasNextEpisode, settings.autoplayNext, onNextEpisode, onProgressUpdate, currentTime]);

  // Close subtitle menu when clicking outside
  useEffect(() => {
    if (!showSubtitleMenu) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-subtitle-menu]')) {
        setShowSubtitleMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSubtitleMenu]);

  // Save progress periodically
  useEffect(() => {
    if (!mediaId) return;
    
    const interval = setInterval(() => {
      if (playerStatus === 'playing' && currentTime > 0) {
        localStorage.setItem(progressKey, Math.floor(currentTime).toString());
      }
    }, 5000); // Save every 5 seconds
    
    return () => clearInterval(interval);
  }, [playerStatus, currentTime, mediaId, progressKey]);

  // Still watching detection
  useStillWatching({
    isPlaying: playerStatus === 'playing' && !showStillWatching,
    onTimeout: () => setShowStillWatching(true),
  });

  // Auto-rotate to landscape on mobile when playing
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile || !('orientation' in screen)) return;

    const lockLandscape = async () => {
      try {
        await (screen.orientation as any).lock('landscape');
      } catch (err) {
        console.log('Orientation lock not supported or failed:', err);
      }
    };

    const unlockOrientation = async () => {
      try {
        (screen.orientation as any).unlock();
      } catch (err) {
        console.log('Orientation unlock failed:', err);
      }
    };

    // Lock to landscape when video starts playing
    if (playerStatus === 'playing') {
      lockLandscape();
    } else {
      unlockOrientation();
    }

    // Cleanup: unlock when component unmounts
    return () => {
      unlockOrientation();
    };
  }, [playerStatus]);

  const handleContinueWatching = () => {
    setShowStillWatching(false);
  };

  const handleStopWatching = () => {
    setShowStillWatching(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/[0.1]">
      {/* Video iframe - key forces reload only when source changes */}
      <div 
        className="relative w-full" 
        style={{ 
          aspectRatio: isPortrait ? 'auto' : '16/9',
          height: isPortrait ? '60vh' : 'auto',
          minHeight: '250px',
          maxHeight: '85vh'
        }}
      >
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media"
          className="w-full h-full"
          title={title}
        />

        {/* Top overlay - title and controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none">
          <motion.h3 
            className="text-white font-semibold text-lg truncate max-w-[60%] drop-shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.h3>
          
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Quality badge */}
            {quality && (
              <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
                {quality}
              </div>
            )}
            
            {/* Source switcher - only if multiple sources */}
            {sources.length > 1 && (
              <div className="relative">
                <motion.button
                  onClick={() => setShowSourceMenu(!showSourceMenu)}
                  className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-semibold hover:bg-black/80 transition-all flex items-center gap-1.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Server {currentSourceIndex + 1}</span>
                  <ChevronRight size={12} className={`transition-transform ${showSourceMenu ? 'rotate-90' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {showSourceMenu && (
                    <motion.div
                      className="absolute bottom-full right-0 mb-2 w-48 bg-dark-lighter/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-30"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                      {sources.map((source, index) => (
                        <button
                          key={source.name}
                          onClick={() => switchSource(index)}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-all ${
                            index === currentSourceIndex
                              ? 'bg-primary/20 text-primary font-semibold'
                              : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{source.name}</span>
                            {index === currentSourceIndex && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Reload button */}
            <motion.button
              onClick={reloadPlayer}
              className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 transition-all"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              title="Reload player"
            >
              <RefreshCw size={14} strokeWidth={2.5} />
            </motion.button>

            {/* Subtitle button */}
            <div className="relative" data-subtitle-menu>
              <motion.button
                onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${
                  selectedSubtitle !== 'off' 
                    ? 'bg-primary/60 text-white hover:bg-primary/80' 
                    : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Subtitles"
              >
                <Subtitles size={14} strokeWidth={2.5} />
              </motion.button>
              
              <AnimatePresence>
                {showSubtitleMenu && (
                  <motion.div
                    className="absolute bottom-full right-0 mb-2 w-56 bg-dark-lighter/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-30"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <div className="p-2 border-b border-white/[0.06]">
                      <p className="text-xs text-white/40 font-semibold px-2 py-1">Select Subtitle Language</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedSubtitle('off');
                          setShowSubtitleMenu(false);
                          reloadPlayer();
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-all ${
                          selectedSubtitle === 'off'
                            ? 'bg-primary/20 text-primary font-semibold'
                            : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Off</span>
                          {selectedSubtitle === 'off' && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </button>
                      {[
                        { code: 'en', name: 'English' },
                        { code: 'es', name: 'Spanish' },
                        { code: 'fr', name: 'French' },
                        { code: 'de', name: 'German' },
                        { code: 'it', name: 'Italian' },
                        { code: 'pt', name: 'Portuguese' },
                        { code: 'ru', name: 'Russian' },
                        { code: 'zh', name: 'Chinese' },
                        { code: 'ja', name: 'Japanese' },
                        { code: 'ko', name: 'Korean' },
                        { code: 'ar', name: 'Arabic' },
                        { code: 'hi', name: 'Hindi' },
                        { code: 'tr', name: 'Turkish' },
                        { code: 'pl', name: 'Polish' },
                        { code: 'nl', name: 'Dutch' },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedSubtitle(lang.code);
                            setShowSubtitleMenu(false);
                            reloadPlayer();
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-all ${
                            selectedSubtitle === lang.code
                              ? 'bg-primary/20 text-primary font-semibold'
                              : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{lang.name}</span>
                            {selectedSubtitle === lang.code && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-white/[0.06]">
                      <p className="text-xs text-white/40 px-2 py-1">
                        Powered by OpenSubtitles via VidAPI
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rotate button - only show on mobile */}
            {isMobile && (
              <motion.button
                onClick={handleRotate}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 transition-all md:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Rotate to landscape"
              >
                <RotateCw size={14} strokeWidth={2.5} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Skip Intro Button */}
        <AnimatePresence>
          {showSkipIntro && (
            <motion.button
              onClick={() => {
                iframeRef.current?.contentWindow?.postMessage(
                  { type: 'PLAYER_COMMAND', command: 'seek', time: 90 },
                  '*'
                );
                setShowSkipIntro(false);
              }}
              className="absolute bottom-32 right-4 sm:bottom-36 sm:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg z-20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward size={18} strokeWidth={2.5} />
              <span className="text-sm font-semibold">Skip Intro</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Next Episode Button */}
        <AnimatePresence>
          {showNextEpisode && hasNextEpisode && (
            <motion.button
              onClick={() => onNextEpisode?.()}
              className="absolute bottom-32 right-4 sm:bottom-36 sm:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/90 backdrop-blur-md border border-primary text-white hover:bg-primary transition-all shadow-lg z-20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-semibold">Next Episode</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Still Watching Modal */}
      <StillWatchingModal
        isOpen={showStillWatching}
        onContinue={handleContinueWatching}
        onStop={handleStopWatching}
        title={`Still watching ${title}?`}
      />
    </div>
  );
}
