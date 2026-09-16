import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, Settings, X, ChevronRight, SkipBack
} from 'lucide-react';
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
}

type PlayerStatus = 'playing' | 'paused' | 'completed' | 'seeked' | 'idle';

export default function VideoPlayer({ 
  src, 
  title,
  imdbId,
  tmdbId,
  onNextEpisode, 
  hasNextEpisode = false,
  onProgressUpdate
}: VideoPlayerProps) {
  const { settings } = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Player state from VidAPI events
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  
  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(settings.volume / 100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showStillWatching, setShowStillWatching] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const progressSaveRef = useRef<ReturnType<typeof setInterval>>();

  // Get the media ID for progress saving
  const mediaId = imdbId || tmdbId || '';
  const progressKey = `moviepopcorn_progress_${mediaId}`;

  // Build the embed URL with parameters
  const buildEmbedUrl = useCallback(() => {
    const url = new URL(src);
    
    // Hide VidAPI's native controls - we use our own
    url.searchParams.set('controls', 'false');
    url.searchParams.set('overlay', 'false');
    
    // Set primary color to match our theme
    url.searchParams.set('primaryColor', '#e50914');
    
    // Set title
    if (title) {
      url.searchParams.set('title', title);
    }
    
    // Resume from saved position
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress && !src.includes('resumeAt')) {
      url.searchParams.set('resumeAt', savedProgress);
    }
    
    // Autoplay based on settings
    url.searchParams.set('autoplay', settings.autoplay ? '1' : '0');
    
    // Subtitle language
    if (settings.subtitles && settings.subtitleLanguage) {
      url.searchParams.set('ds_lang', settings.subtitleLanguage);
    }
    
    return url.toString();
  }, [src, title, settings, progressKey]);

  // Listen for VidAPI player events via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'PLAYER_EVENT') return;
      
      const { player_info, player_status, player_progress, player_duration, quality: q, availableQualities: aq } = event.data.data;
      
      // Update state from VidAPI
      setPlayerStatus(player_status);
      setCurrentTime(player_progress);
      setDuration(player_duration);
      
      if (q) setQuality(q.label);
      if (aq) setAvailableQualities(aq);
      
      // Report progress to parent
      onProgressUpdate?.(player_progress, player_duration);
      
      // Handle different statuses
      switch (player_status) {
        case 'playing':
          // Check for skip intro/outro
          // These would need to be configured per content
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
          
        case 'paused':
          break;
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [hasNextEpisode, settings.autoplayNext, onNextEpisode, onProgressUpdate]);

  // Save progress periodically
  useEffect(() => {
    if (!mediaId) return;
    
    progressSaveRef.current = setInterval(() => {
      if (playerStatus === 'playing' && currentTime > 0) {
        localStorage.setItem(progressKey, Math.floor(currentTime).toString());
      }
    }, 5000); // Save every 5 seconds
    
    return () => {
      if (progressSaveRef.current) {
        clearInterval(progressSaveRef.current);
      }
    };
  }, [playerStatus, currentTime, mediaId, progressKey]);

  // Still watching detection
  useStillWatching({
    isPlaying: playerStatus === 'playing' && !showStillWatching,
    onTimeout: () => setShowStillWatching(true),
  });

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls && playerStatus === 'playing') {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, playerStatus]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Send commands to VidAPI iframe via postMessage
  const sendCommand = (command: string, data?: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'PLAYER_COMMAND', command, ...data },
      '*'
    );
  };

  const togglePlay = () => {
    if (playerStatus === 'playing') {
      sendCommand('pause');
    } else {
      sendCommand('play');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    sendCommand('mute', { muted: !isMuted });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    sendCommand('volume', { volume: newVolume });
  };

  const seek = (time: number) => {
    sendCommand('seek', { time });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipIntro = () => {
    // Skip forward 90 seconds (typical intro length)
    seek(currentTime + 90);
  };

  const skipOutro = () => {
    if (hasNextEpisode) {
      onNextEpisode?.();
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinueWatching = () => {
    setShowStillWatching(false);
    sendCommand('play');
  };

  const handleStopWatching = () => {
    setShowStillWatching(false);
    sendCommand('pause');
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/[0.1] group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playerStatus === 'playing' && setShowControls(false)}
    >
      {/* VidAPI iframe with controls hidden */}
      <iframe
        ref={iframeRef}
        src={buildEmbedUrl()}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media"
        className="w-full h-full"
        title={title}
      />

      {/* Custom Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top bar - Title */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
              <motion.h3 
                className="text-white font-semibold text-lg truncate max-w-[70%] drop-shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {title}
              </motion.h3>
              
              <div className="flex items-center gap-2">
                {/* Quality badge */}
                {quality && (
                  <div className="px-2 py-1 rounded bg-white/10 backdrop-blur-sm text-white text-xs font-semibold">
                    {quality}
                  </div>
                )}
                
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings size={20} className="text-white" />
                </motion.button>
              </div>
            </div>

            {/* Center - Play/Pause */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <motion.button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {playerStatus === 'playing' ? (
                  <Pause size={32} className="text-white" fill="white" />
                ) : (
                  <Play size={32} className="text-white ml-1" fill="white" />
                )}
              </motion.button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 pointer-events-auto">
              {/* Progress bar */}
              <div 
                className="relative group/progress cursor-pointer"
                onClick={handleProgressClick}
              >
                <div className="h-1 group-hover/progress:h-1.5 bg-white/20 rounded-full overflow-hidden transition-all">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {/* Hover time tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity">
                  <div className="px-2 py-1 rounded bg-black/80 text-white text-xs">
                    {formatTime(currentTime)}
                  </div>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <motion.button
                    onClick={togglePlay}
                    className="p-2 rounded-full hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {playerStatus === 'playing' ? (
                      <Pause size={20} className="text-white" fill="white" />
                    ) : (
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    )}
                  </motion.button>

                  {/* Skip Back 10s */}
                  <motion.button
                    onClick={() => seek(Math.max(0, currentTime - 10))}
                    className="p-2 rounded-full hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SkipBack size={18} className="text-white" />
                  </motion.button>

                  {/* Skip Forward 10s */}
                  <motion.button
                    onClick={() => seek(Math.min(duration, currentTime + 10))}
                    className="p-2 rounded-full hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SkipForward size={18} className="text-white" />
                  </motion.button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/volume">
                    <motion.button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={20} className="text-white" />
                      ) : (
                        <Volume2 size={20} className="text-white" />
                      )}
                    </motion.button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-white/80 text-sm font-medium tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Fullscreen */}
                  <motion.button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-full hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isFullscreen ? (
                      <Minimize size={20} className="text-white" />
                    ) : (
                      <Maximize size={20} className="text-white" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Intro Button */}
      <AnimatePresence>
        {showSkipIntro && (
          <motion.button
            onClick={skipIntro}
            className="absolute bottom-24 right-4 sm:bottom-28 sm:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg z-20"
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
            onClick={skipOutro}
            className="absolute bottom-24 right-4 sm:bottom-28 sm:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/90 backdrop-blur-md border border-primary text-white hover:bg-primary transition-all shadow-lg z-20"
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

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="absolute top-16 right-4 w-72 bg-dark-lighter/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl p-4 z-30"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Playback Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} className="text-white/60" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Quality Selection */}
              {availableQualities.length > 0 && (
                <div>
                  <label className="text-xs text-white/60 mb-2 block">Quality</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableQualities.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendCommand('quality', { quality: q })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          quality === q
                            ? 'bg-primary text-white'
                            : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Playback Speed */}
              <div>
                <label className="text-xs text-white/60 mb-2 block">Playback Speed</label>
                <div className="grid grid-cols-3 gap-2">
                  {['0.5', '0.75', '1', '1.25', '1.5', '2'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => sendCommand('speed', { speed: parseFloat(speed) })}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/70 hover:bg-white/[0.1] transition-all"
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Status */}
              <div className="pt-3 border-t border-white/[0.06]">
                <p className="text-xs text-white/40">
                  Status: <span className="text-white/70 capitalize">{playerStatus}</span>
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Progress: <span className="text-white/70">{Math.round(progressPercent)}%</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
