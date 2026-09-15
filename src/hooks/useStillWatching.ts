import { useEffect, useRef, useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';

interface UseStillWatchingOptions {
  isPlaying: boolean;
  onTimeout: () => void;
}

export function useStillWatching({ isPlaying, onTimeout }: UseStillWatchingOptions) {
  const { settings } = useSettings();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isPlaying && settings.stillWatching) {
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, settings.inactivityTimeout * 60 * 1000);
    }
  }, [isPlaying, settings.stillWatching, settings.inactivityTimeout, onTimeout]);

  useEffect(() => {
    if (!settings.stillWatching || !isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Activity events to track
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, settings.stillWatching, resetTimer]);

  const pauseTracking = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resumeTracking = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return {
    pauseTracking,
    resumeTracking,
    lastActivity: lastActivityRef.current,
  };
}
