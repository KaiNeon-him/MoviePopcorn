import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, Sun, Globe, Bell, Shield, Film, Volume2, 
  Monitor, Smartphone, Wifi, Check, Save, Play, 
  User, Lock, Download, RotateCcw, Trash2, Clock, SkipForward
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage, languageNames, Language } from '../context/LanguageContext';
import { useNotifications } from '../components/NotificationToast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { 
    settings, 
    updateSettings, 
    updateNotifications, 
    updateParentalControls, 
    updateDataUsage,
    updateAccount,
    resetSettings 
  } = useSettings();
  const { success, error: showError, warning, info } = useNotifications();
  
  const [showPinInput, setShowPinInput] = useState(settings.parentalControls.enabled);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
    success('Settings Reset', 'All settings have been restored to defaults');
  };

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

          <motion.button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-300 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={16} strokeWidth={2.5} />
            Reset All
          </motion.button>
        </motion.div>

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
                    success('Theme Changed', 'Switched to dark mode');
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                      : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <Moon size={14} strokeWidth={2.5} />
                    Dark
                  </span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    setTheme('light');
                    success('Theme Changed', 'Switched to light mode');
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                      : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <Sun size={14} strokeWidth={2.5} />
                    Light
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Language</p>
                  <p className="text-xs text-white/40">Choose your preferred language</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as Language);
                  success('Language Changed', `Switched to ${languageNames[e.target.value as Language]}`);
                }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>
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
                onChange={(value) => {
                  updateSettings({ autoplay: value });
                  info('Autoplay Updated', value ? 'Videos will autoplay' : 'Videos will not autoplay');
                }}
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
                onChange={(value) => {
                  updateSettings({ autoplayNext: value });
                  info('Autoplay Next Updated', value ? 'Next episode will autoplay' : 'Next episode will not autoplay');
                }}
              />
            </div>

            {/* Auto Skip Intro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkipForward size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Auto Skip Intro</p>
                  <p className="text-xs text-white/40">Automatically skip intro sequences</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.autoSkipIntro} 
                onChange={(value) => {
                  updateSettings({ autoSkipIntro: value });
                  info('Auto Skip Intro Updated', value ? 'Intro will be skipped automatically' : 'Intro will not be skipped');
                }}
              />
            </div>

            {/* Auto Skip Outro */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkipForward size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Auto Skip Outro</p>
                  <p className="text-xs text-white/40">Automatically skip outro sequences</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.autoSkipOutro} 
                onChange={(value) => {
                  updateSettings({ autoSkipOutro: value });
                  info('Auto Skip Outro Updated', value ? 'Outro will be skipped automatically' : 'Outro will not be skipped');
                }}
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
                onChange={(e) => {
                  updateSettings({ videoQuality: e.target.value as any });
                  success('Quality Updated', `Video quality set to ${e.target.value}`);
                }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
              >
                <option value="auto">Auto</option>
                <option value="low">Low (480p)</option>
                <option value="medium">Medium (720p)</option>
                <option value="high">High (1080p)</option>
              </select>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Default Volume</p>
                  <p className="text-xs text-white/40">Starting volume for videos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                  className="w-32 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm text-white/70 w-10 text-right">{settings.volume}%</span>
              </div>
            </div>

            {/* Still Watching */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Are You Still Watching?</p>
                  <p className="text-xs text-white/40">Prompt after inactivity during playback</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.stillWatching} 
                onChange={(value) => {
                  updateSettings({ stillWatching: value });
                  info('Still Watching Updated', value ? 'Inactivity detection enabled' : 'Inactivity detection disabled');
                }}
              />
            </div>

            {/* Inactivity Timeout */}
            {settings.stillWatching && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Clock size={20} strokeWidth={2} className="text-white/60" />
                  <div>
                    <p className="text-sm font-medium text-white">Inactivity Timeout</p>
                    <p className="text-xs text-white/40">Minutes before showing prompt</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={settings.inactivityTimeout}
                    onChange={(e) => updateSettings({ inactivityTimeout: Number(e.target.value) })}
                    className="w-32 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-white/70 w-16 text-right">{settings.inactivityTimeout} min</span>
                </div>
              </motion.div>
            )}

            {/* Auto-pause Countdown */}
            {settings.stillWatching && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Clock size={20} strokeWidth={2} className="text-white/60" />
                  <div>
                    <p className="text-sm font-medium text-white">Auto-pause Countdown</p>
                    <p className="text-xs text-white/40">Seconds to respond before pausing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={settings.autoPauseCountdown}
                    onChange={(e) => updateSettings({ autoPauseCountdown: Number(e.target.value) })}
                    className="w-32 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-white/70 w-12 text-right">{settings.autoPauseCountdown}s</span>
                </div>
              </motion.div>
            )}

            {/* Ad Blocker Detection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Ad Blocker Detection</p>
                  <p className="text-xs text-white/40">Detect and notify about ad blockers</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.adBlocker} 
                onChange={(value) => {
                  updateSettings({ adBlocker: value });
                  info('Ad Blocker Detection Updated', value ? 'Ad blocker detection enabled' : 'Ad blocker detection disabled');
                }}
              />
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
                onChange={(value) => {
                  updateSettings({ subtitles: value });
                  info('Subtitles Updated', value ? 'Subtitles enabled' : 'Subtitles disabled');
                }}
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
                onChange={(e) => {
                  updateSettings({ subtitleLanguage: e.target.value });
                  success('Subtitle Language Updated', `Subtitles set to ${e.target.value}`);
                }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
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
                onChange={(e) => {
                  updateSettings({ audioLanguage: e.target.value });
                  success('Audio Language Updated', `Audio set to ${e.target.value}`);
                }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
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
                onChange={(value) => {
                  updateNotifications({ newReleases: value });
                  info('Notification Updated', value ? 'New release notifications enabled' : 'New release notifications disabled');
                }}
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
                onChange={(value) => {
                  updateNotifications({ recommendations: value });
                  info('Notification Updated', value ? 'Recommendation notifications enabled' : 'Recommendation notifications disabled');
                }}
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
                onChange={(value) => {
                  updateNotifications({ watchlistUpdates: value });
                  info('Notification Updated', value ? 'Watchlist notifications enabled' : 'Watchlist notifications disabled');
                }}
              />
            </div>

            {/* Test notification button */}
            <motion.button
              onClick={() => {
                success('Test Notification', 'This is a test notification!');
              }}
              className="w-full mt-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white font-semibold text-sm transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Bell size={16} strokeWidth={2.5} />
                Test Notifications
              </span>
            </motion.button>
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
                  updateParentalControls({ enabled: value });
                  setShowPinInput(value);
                  if (value) {
                    warning('Parental Controls Enabled', 'Set a PIN to protect your settings');
                  } else {
                    info('Parental Controls Disabled', 'All content is now accessible');
                  }
                }}
              />
            </div>

            {/* PIN Input */}
            {showPinInput && settings.parentalControls.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <label className="block text-xs text-white/50 mb-2">Security PIN (4 digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={settings.parentalControls.pin}
                  onChange={(e) => {
                    const pin = e.target.value.replace(/\D/g, '');
                    updateParentalControls({ pin });
                  }}
                  placeholder="Enter 4-digit PIN"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-all"
                />
                {settings.parentalControls.pin && (
                  <p className="text-xs text-green-400 flex items-center gap-1.5">
                    <Check size={12} strokeWidth={3} />
                    PIN set successfully
                  </p>
                )}
              </motion.div>
            )}

            {/* Age Restriction */}
            {settings.parentalControls.enabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-white">Age Restriction</p>
                  <p className="text-xs text-white/40">Maximum allowed content rating</p>
                </div>
                <select
                  value={settings.parentalControls.ageRestriction}
                  onChange={(e) => {
                    updateParentalControls({ ageRestriction: Number(e.target.value) });
                    success('Age Restriction Updated', `Content limited to ${e.target.value}+`);
                  }}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value={0}>All Ages</option>
                  <option value={7}>7+</option>
                  <option value={13}>13+</option>
                  <option value={17}>17+</option>
                  <option value={18}>18+</option>
                </select>
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
                onChange={(value) => {
                  updateDataUsage({ mobileData: value });
                  if (!value) {
                    warning('Mobile Data Disabled', 'Streaming will only work on WiFi');
                  } else {
                    info('Mobile Data Enabled', 'Streaming allowed on mobile data');
                  }
                }}
              />
            </div>

            {/* Download Quality */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Download Quality</p>
                  <p className="text-xs text-white/40">Quality for offline downloads</p>
                </div>
              </div>
              <select
                value={settings.dataUsage.downloadQuality}
                onChange={(e) => {
                  updateDataUsage({ downloadQuality: e.target.value as any });
                  success('Download Quality Updated', `Downloads set to ${e.target.value} quality`);
                }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
              >
                <option value="low">Low (saves data)</option>
                <option value="medium">Medium</option>
                <option value="high">High (best quality)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User size={20} strokeWidth={2.5} className="text-primary" />
            Account
          </h2>

          <div className="space-y-4">
            {/* Private Profile */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Private Profile</p>
                <p className="text-xs text-white/40">Hide your profile from other users</p>
              </div>
              <ToggleSwitch 
                enabled={settings.account.privateProfile} 
                onChange={(value) => {
                  updateAccount({ privateProfile: value });
                  info('Privacy Updated', value ? 'Profile is now private' : 'Profile is now public');
                }}
              />
            </div>

            {/* Show Watch History */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Show Watch History</p>
                <p className="text-xs text-white/40">Display your watch history on profile</p>
              </div>
              <ToggleSwitch 
                enabled={settings.account.showWatchHistory} 
                onChange={(value) => {
                  updateAccount({ showWatchHistory: value });
                  info('History Visibility Updated', value ? 'Watch history is visible' : 'Watch history is hidden');
                }}
              />
            </div>

            {/* Two-Factor Auth */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={20} strokeWidth={2} className="text-white/60" />
                <div>
                  <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-white/40">Add an extra layer of security</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.account.twoFactor} 
                onChange={(value) => {
                  updateAccount({ twoFactor: value });
                  if (value) {
                    success('2FA Enabled', 'Two-factor authentication is now active');
                  } else {
                    warning('2FA Disabled', 'Two-factor authentication has been turned off');
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              className="bg-dark-lighter border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                <RotateCcw size={28} strokeWidth={2} className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Reset All Settings?
              </h3>
              <p className="text-white/50 text-sm text-center mb-6">
                This will restore all settings to their default values. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white font-semibold text-sm transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset All
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
