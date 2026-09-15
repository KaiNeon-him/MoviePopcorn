import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, Sun, Globe, Bell, Shield, Film, Volume2, 
  Monitor, Smartphone, Wifi, Check, Save, Play 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface Settings {
  theme: 'dark' | 'light';
  autoplay: boolean;
  autoplayNext: boolean;
  videoQuality: 'auto' | 'low' | 'medium' | 'high';
  subtitles: boolean;
  subtitleLanguage: string;
  audioLanguage: string;
  notifications: {
    newReleases: boolean;
    recommendations: boolean;
    watchlistUpdates: boolean;
  };
  parentalControls: {
    enabled: boolean;
    pin: string;
  };
  dataUsage: {
    mobileData: boolean;
    downloadQuality: 'low' | 'medium' | 'high';
  };
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  autoplay: true,
  autoplayNext: true,
  videoQuality: 'high',
  subtitles: false,
  subtitleLanguage: 'en',
  audioLanguage: 'en',
  notifications: {
    newReleases: true,
    recommendations: true,
    watchlistUpdates: false,
  },
  parentalControls: {
    enabled: false,
    pin: '',
  },
  dataUsage: {
    mobileData: true,
    downloadQuality: 'high',
  },
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem('moviepopcorn_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      // Sync theme from settings
      if (parsed.theme) {
        setTheme(parsed.theme);
      }
    }
  }, [setTheme]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNotification = (key: keyof Settings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateParentalControl = (key: keyof Settings['parentalControls'], value: any) => {
    setSettings(prev => ({
      ...prev,
      parentalControls: { ...prev.parentalControls, [key]: value }
    }));
    setHasChanges(true);
  };

  const updateDataUsage = (key: keyof Settings['dataUsage'], value: any) => {
    setSettings(prev => ({
      ...prev,
      dataUsage: { ...prev.dataUsage, [key]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('moviepopcorn_settings', JSON.stringify(settings));
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) => (
    <motion.button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-gradient-to-r from-primary to-primary-dark' : 'bg-white/10'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
        animate={{ x: enabled ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  return (
    <motion.div
      className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Settings
            </h1>
            <p className="text-white/50 text-sm">Customize your MoviePopcorn experience</p>
          </div>

          {hasChanges && (
            <motion.button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={16} strokeWidth={2.5} />
              Save Changes
            </motion.button>
          )}
        </motion.div>

        {/* Success message */}
        {saveSuccess && (
          <motion.div
            className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={14} strokeWidth={3} className="text-green-400" />
            </div>
            <p className="text-sm text-green-300 font-medium">Settings saved successfully!</p>
          </motion.div>
        )}

        {/* Appearance Section */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Monitor size={20} strokeWidth={2.5} className="text-primary" />
            Appearance
          </h2>

          <div className="space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon size={20} strokeWidth={2} className="text-white/60" />
                  ) : (
                    <Sun size={20} strokeWidth={2} className="text-white/60" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">Theme</p>
                    <p className="text-xs text-white/40">Choose your preferred theme</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => {
                      setTheme('dark');
                      updateSetting('theme', 'dark');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white'
                        : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dark
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setTheme('light');
                      updateSetting('theme', 'light');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      theme === 'light'
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white'
                        : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Light
                  </motion.button>
                </div>
              </div>          </div>
        </motion.div>

        {/* Playback Section */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Film size={20} strokeWidth={2.5} className="text-primary" />
            Playback
          </h2>

          <div className="space-y-4">
            {/* Autoplay */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Play size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Autoplay</p>
                  <p className="text-xs text-white/40">Automatically play videos when opened</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.autoplay} 
                onChange={(value) => updateSetting('autoplay', value)} 
              />
            </div>

            {/* Autoplay Next */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Film size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Autoplay Next Episode</p>
                  <p className="text-xs text-white/40">Automatically play the next episode</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.autoplayNext} 
                onChange={(value) => updateSetting('autoplayNext', value)} 
              />
            </div>

            {/* Video Quality */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Video Quality</p>
                  <p className="text-xs text-white/40">Default streaming quality</p>
                </div>
              </div>
              <select
                value={settings.videoQuality}
                onChange={(e) => updateSetting('videoQuality', e.target.value as any)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="auto">Auto</option>
                <option value="low">Low (480p)</option>
                <option value="medium">Medium (720p)</option>
                <option value="high">High (1080p)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Audio & Subtitles Section */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Volume2 size={20} strokeWidth={2.5} className="text-primary" />
            Audio & Subtitles
          </h2>

          <div className="space-y-4">
            {/* Subtitles */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Subtitles</p>
                  <p className="text-xs text-white/40">Enable subtitles by default</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.subtitles} 
                onChange={(value) => updateSetting('subtitles', value)} 
              />
            </div>

            {/* Subtitle Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Subtitle Language</p>
                  <p className="text-xs text-white/40">Default subtitle language</p>
                </div>
              </div>
              <select
                value={settings.subtitleLanguage}
                onChange={(e) => updateSetting('subtitleLanguage', e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </div>

            {/* Audio Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Audio Language</p>
                  <p className="text-xs text-white/40">Default audio language</p>
                </div>
              </div>
              <select
                value={settings.audioLanguage}
                onChange={(e) => updateSetting('audioLanguage', e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Bell size={20} strokeWidth={2.5} className="text-primary" />
            Notifications
          </h2>

          <div className="space-y-4">
            {/* New Releases */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">New Releases</p>
                <p className="text-xs text-white/40">Get notified about new movies and shows</p>
              </div>
              <ToggleSwitch 
                enabled={settings.notifications.newReleases} 
                onChange={(value) => updateNotification('newReleases', value)} 
              />
            </div>

            {/* Recommendations */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Recommendations</p>
                <p className="text-xs text-white/40">Personalized recommendations for you</p>
              </div>
              <ToggleSwitch 
                enabled={settings.notifications.recommendations} 
                onChange={(value) => updateNotification('recommendations', value)} 
              />
            </div>

            {/* Watchlist Updates */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Watchlist Updates</p>
                <p className="text-xs text-white/40">Updates about items in your watchlist</p>
              </div>
              <ToggleSwitch 
                enabled={settings.notifications.watchlistUpdates} 
                onChange={(value) => updateNotification('watchlistUpdates', value)} 
              />
            </div>
          </div>
        </motion.div>

        {/* Parental Controls Section */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield size={20} strokeWidth={2.5} className="text-primary" />
            Parental Controls
          </h2>

          <div className="space-y-4">
            {/* Enable Parental Controls */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Enable Parental Controls</p>
                <p className="text-xs text-white/40">Restrict access to mature content</p>
              </div>
              <ToggleSwitch 
                enabled={settings.parentalControls.enabled} 
                onChange={(value) => {
                  updateParentalControl('enabled', value);
                  if (value) setShowPinInput(true);
                }} 
              />
            </div>

            {/* PIN Input */}
            {showPinInput && settings.parentalControls.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-xs text-white/50 mb-2">Security PIN (4 digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={settings.parentalControls.pin}
                  onChange={(e) => updateParentalControl('pin', e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all"
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Data Usage Section */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Wifi size={20} strokeWidth={2.5} className="text-primary" />
            Data Usage
          </h2>

          <div className="space-y-4">
            {/* Mobile Data */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Mobile Data Streaming</p>
                  <p className="text-xs text-white/40">Allow streaming on mobile data</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.dataUsage.mobileData} 
                onChange={(value) => updateDataUsage('mobileData', value)} 
              />
            </div>

            {/* Download Quality */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Download Quality</p>
                  <p className="text-xs text-white/40">Quality for offline downloads</p>
                </div>
              </div>
              <select
                value={settings.dataUsage.downloadQuality}
                onChange={(e) => updateDataUsage('downloadQuality', e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="low">Low (saves data)</option>
                <option value="medium">Medium</option>
                <option value="high">High (best quality)</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
