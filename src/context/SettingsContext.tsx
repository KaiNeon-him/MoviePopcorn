import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface AppSettings {
  // Playback
  autoplay: boolean;
  autoplayNext: boolean;
  videoQuality: 'auto' | 'low' | 'medium' | 'high';
  stillWatching: boolean;
  inactivityTimeout: number;
  autoPauseCountdown: number;
  autoSkipIntro: boolean;
  autoSkipOutro: boolean;
  
  // Audio & Subtitles
  subtitles: boolean;
  subtitleLanguage: string;
  audioLanguage: string;
  volume: number;
  
  // Ad Blocker
  adBlocker: boolean;
  
  // Language
  language: string;
  
  // Notifications
  notifications: {
    newReleases: boolean;
    recommendations: boolean;
    watchlistUpdates: boolean;
  };
  
  // Parental Controls
  parentalControls: {
    enabled: boolean;
    pin: string;
    matureContent: boolean;
    ageRestriction: number;
  };
  
  // Data Usage
  dataUsage: {
    mobileData: boolean;
    downloadQuality: 'low' | 'medium' | 'high';
  };
  
  // Account
  account: {
    email: string;
    twoFactor: boolean;
    privateProfile: boolean;
    showWatchHistory: boolean;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  autoplay: true,
  autoplayNext: true,
  videoQuality: 'high',
  stillWatching: true,
  inactivityTimeout: 10,
  autoPauseCountdown: 30,
  autoSkipIntro: true,
  autoSkipOutro: true,
  subtitles: false,
  subtitleLanguage: 'en',
  audioLanguage: 'en',
  volume: 100,
  adBlocker: true,
  language: 'en',
  notifications: {
    newReleases: true,
    recommendations: true,
    watchlistUpdates: false,
  },
  parentalControls: {
    enabled: false,
    pin: '',
    matureContent: true,
    ageRestriction: 18,
  },
  dataUsage: {
    mobileData: true,
    downloadQuality: 'high',
  },
  account: {
    email: '',
    twoFactor: false,
    privateProfile: false,
    showWatchHistory: true,
  },
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateNotifications: (updates: Partial<AppSettings['notifications']>) => void;
  updateParentalControls: (updates: Partial<AppSettings['parentalControls']>) => void;
  updateDataUsage: (updates: Partial<AppSettings['dataUsage']>) => void;
  updateAccount: (updates: Partial<AppSettings['account']>) => void;
  resetSettings: () => void;
  isContentAllowed: (rating: string, releaseDate?: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = 'moviepopcorn_settings_v2';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((newSettings: AppSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, []);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      persist(next);
      return next;
    });
  };

  const updateNotifications = (updates: Partial<AppSettings['notifications']>) => {
    setSettings(prev => {
      const next = { ...prev, notifications: { ...prev.notifications, ...updates } };
      persist(next);
      return next;
    });
  };

  const updateParentalControls = (updates: Partial<AppSettings['parentalControls']>) => {
    setSettings(prev => {
      const next = { ...prev, parentalControls: { ...prev.parentalControls, ...updates } };
      persist(next);
      return next;
    });
  };

  const updateDataUsage = (updates: Partial<AppSettings['dataUsage']>) => {
    setSettings(prev => {
      const next = { ...prev, dataUsage: { ...prev.dataUsage, ...updates } };
      persist(next);
      return next;
    });
  };

  const updateAccount = (updates: Partial<AppSettings['account']>) => {
    setSettings(prev => {
      const next = { ...prev, account: { ...prev.account, ...updates } };
      persist(next);
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(SETTINGS_KEY);
  };

  // Content rating filter
  const isContentAllowed = (rating: string, releaseDate?: string): boolean => {
    if (!settings.parentalControls.enabled) return true;
    if (settings.parentalControls.matureContent) return true;

    const ratingMap: Record<string, number> = {
      'G': 0,
      'PG': 7,
      'PG-13': 13,
      'R': 17,
      'NC-17': 18,
      'TV-Y': 0,
      'TV-Y7': 7,
      'TV-G': 0,
      'TV-PG': 7,
      'TV-14': 14,
      'TV-MA': 17,
    };

    const contentAge = ratingMap[rating] ?? 0;
    return contentAge <= settings.parentalControls.ageRestriction;
  };

  if (!loaded) return null;

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      updateNotifications,
      updateParentalControls,
      updateDataUsage,
      updateAccount,
      resetSettings,
      isContentAllowed,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
