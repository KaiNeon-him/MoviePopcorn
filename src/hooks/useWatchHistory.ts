import { useState, useEffect, useCallback } from 'react';

export interface WatchedItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  watchedAt: number;
  progress?: number; // 0-100
  season?: number;
  episode?: number;
}

const STORAGE_KEY = 'moviepopcorn_watch_history';
const MAX_ITEMS = 20;

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchedItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load watch history:', e);
    }
  }, []);

  const addToHistory = useCallback((item: Omit<WatchedItem, 'watchedAt'>) => {
    setHistory((prev) => {
      const filtered = prev.filter((i) => !(i.id === item.id && i.media_type === item.media_type));
      const newHistory = [
        { ...item, watchedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save watch history:', e);
      }
      
      return newHistory;
    });
  }, []);

  const removeFromHistory = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    setHistory((prev) => {
      const filtered = prev.filter((i) => !(i.id === id && i.media_type === mediaType));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error('Failed to save watch history:', e);
      }
      return filtered;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear watch history:', e);
    }
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
