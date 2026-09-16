import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, ChevronRight } from 'lucide-react';
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
  
  // Player state from VidAPI events
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('');
  
  // UI state
  const [showStillWatching, setShowStillWatching] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);

  // Get the media ID for progress saving
  const mediaId = imdbId || tmdbId || '';
  const progressKey = `moviepopcorn_progress_${mediaId}`;

  // Build the embed URL with parameters
  const buildEmbedUrl = useCallback(() => {
    const url = new URL(src);
    
    // Keep VidAPI's native controls visible (play/pause/volume/progress)
    // Don't set controls=false - let users control playback
    
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

  const handleContinueWatching = () => {
    setShowStillWatching(false);
  };

  const handleStopWatching = () => {
    setShowStillWatching(false);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/[0.1]">
      {/* VidAPI iframe with native controls */}
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

      {/* Minimal overlay - just title and quality badge */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none">
        <motion.h3 
          className="text-white font-semibold text-lg truncate max-w-[70%] drop-shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title}
        </motion.h3>
        
        {/* Quality badge */}
        {quality && (
          <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
            {quality}
          </div>
        )}
      </div>

      {/* Skip Intro Button */}
      <AnimatePresence>
        {showSkipIntro && (
          <motion.button
            onClick={() => {
              // Send skip command to VidAPI
              iframeRef.current?.contentWindow?.postMessage(
                { type: 'PLAYER_COMMAND', command: 'seek', time: 90 },
                '*'
              );
              setShowSkipIntro(false);
            }}
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
            onClick={() => onNextEpisode?.()}
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
