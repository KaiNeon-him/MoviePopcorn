import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipForward, Settings, Subtitles, X, ChevronRight
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import StillWatchingModal from './StillWatchingModal';
import { useStillWatching } from '../hooks/useStillWatching';

interface VideoPlayerProps {
  src: string;
  title: string;
  onNextEpisode?: () => void;
  hasNextEpisode?: boolean;
  introStart?: number; // seconds
  introEnd?: number;   // seconds
  outroStart?: number; // seconds
}

export default function VideoPlayer({ 
  src, 
  title, 
  onNextEpisode, 
  hasNextEpisode = false,
  introStart,
  introEnd,
  outroStart
}: VideoPlayerProps) {
  const { settings } = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(settings.volume / 100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showSkipOutro, setShowSkipOutro] = useState(false);
  const [showStillWatching, setShowStillWatching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Still watching detection
  useStillWatching({
    isPlaying: isPlaying && !showStillWatching,
    onTimeout: () => setShowStillWatching(true),
  });

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (showControls && isPlaying) {
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
  }, [showControls, isPlaying]);

  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Simulate time tracking (in real app, this would come from VidAPI postMessage)
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        
        // Check for intro skip
        if (settings.autoSkipIntro && introStart !== undefined && introEnd !== undefined) {
          if (newTime >= introStart && newTime <= introEnd) {
            // Auto-skip intro
            return introEnd + 1;
          }
        }
        
        // Check for outro skip
        if (settings.autoSkipOutro && outroStart !== undefined) {
          if (newTime >= outroStart) {
            // Auto-skip outro or trigger next episode
            if (hasNextEpisode && settings.autoplayNext) {
              onNextEpisode?.();
            }
            return newTime;
          }
        }
        
        // Show manual skip buttons
        if (introStart !== undefined && introEnd !== undefined) {
          setShowSkipIntro(newTime >= introStart && newTime <= introEnd - 5);
        }
        
        if (outroStart !== undefined) {
          setShowSkipOutro(newTime >= outroStart && newTime < duration - 5);
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, settings, introStart, introEnd, outroStart, duration, hasNextEpisode]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In real implementation, send postMessage to iframe
    iframeRef.current?.contentWindow?.postMessage(
      { type: isPlaying ? 'pause' : 'play' }, 
      '*'
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'mute', muted: !isMuted }, 
      '*'
    );
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'volume', volume: newVolume }, 
      '*'
    );
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
    if (introEnd !== undefined) {
      setCurrentTime(introEnd + 1);
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'seek', time: introEnd + 1 }, 
        '*'
      );
    }
  };

  const skipOutro = () => {
    if (hasNextEpisode) {
      onNextEpisode?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinueWatching = () => {
    setShowStillWatching(false);
    setIsPlaying(true);
  };

  const handleStopWatching = () => {
    setShowStillWatching(false);
    setIsPlaying(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/[0.1] group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* VidAPI iframe */}
      <iframe
        ref={iframeRef}
        src={src}
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
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top bar - Title */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
              <motion.h3 
                className="text-white font-semibold text-lg truncate max-w-[70%]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {title}
              </motion.h3>
              
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={20} className="text-white" />
              </motion.button>
            </div>

            {/* Center - Play/Pause */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {isPlaying ? (
                  <Pause size={32} className="text-white" fill="white" />
                ) : (
                  <Play size={32} className="text-white ml-1" fill="white" />
                )}
              </motion.button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Progress bar */}
              <div className="relative group/progress">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
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
                    {isPlaying ? (
                      <Pause size={20} className="text-white" fill="white" />
                    ) : (
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    )}
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
                  <span className="text-white/80 text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Subtitles */}
                  {settings.subtitles && (
                    <motion.button
                      className="p-2 rounded-full hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Subtitles size={20} className="text-white" />
                    </motion.button>
                  )}

                  {/* Quality indicator */}
                  <div className="px-2 py-1 rounded bg-white/10 text-white text-xs font-semibold">
                    {settings.videoQuality === 'auto' ? 'AUTO' : settings.videoQuality.toUpperCase()}
                  </div>

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
        {showSkipIntro && !settings.autoSkipIntro && (
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

      {/* Skip Outro Button */}
      <AnimatePresence>
        {showSkipOutro && !settings.autoSkipOutro && hasNextEpisode && (
          <motion.button
            onClick={skipOutro}
            className="absolute bottom-24 right-4 sm:bottom-28 sm:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg z-20"
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
              {/* Quality */}
              <div>
                <label className="text-xs text-white/60 mb-2 block">Quality</label>
                <select className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50">
                  <option value="auto">Auto</option>
                  <option value="low">Low (480p)</option>
                  <option value="medium">Medium (720p)</option>
                  <option value="high">High (1080p)</option>
                </select>
              </div>

              {/* Speed */}
              <div>
                <label className="text-xs text-white/60 mb-2 block">Playback Speed</label>
                <select className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50">
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">Normal</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>

              {/* Subtitles */}
              <div>
                <label className="text-xs text-white/60 mb-2 block">Subtitles</label>
                <select className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50">
                  <option value="off">Off</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
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
