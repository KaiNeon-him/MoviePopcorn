import { useState, useEffect, useCallback } from 'react';

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv';
  vote_average: number;
  addedAt: number;
}

const STORAGE_KEY = 'moviepopcorn_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load watchlist:', e);
    }
  }, []);

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.media_type === item.media_type);
      if (exists) return prev;
      
      const newWatchlist = [{ ...item, addedAt: Date.now() }, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newWatchlist));
      } catch (e) {
        console.error('Failed to save watchlist:', e);
      }
      return newWatchlist;
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    setWatchlist((prev) => {
      const filtered = prev.filter((i) => !(i.id === id && i.media_type === mediaType));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error('Failed to save watchlist:', e);
      }
      return filtered;
    });
  }, []);

  const isInWatchlist = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    return watchlist.some((i) => i.id === id && i.media_type === mediaType);
  }, [watchlist]);

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
