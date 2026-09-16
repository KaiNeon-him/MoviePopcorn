import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookiePreferences {
  essential: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_KEY = 'moviepopcorn_cookie_consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Show banner after 2 seconds
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const consent = {
      ...prefs,
      timestamp: Date.now(),
      version: '1.0',
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setShowBanner(false);
    setShowDetails(false);
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Banner */}
      <AnimatePresence>
        {showBanner && !showDetails && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[90] p-4"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          >
            <div className="max-w-6xl mx-auto bg-dark-lighter/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Icon & Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Cookie size={20} strokeWidth={2.5} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-white">We value your privacy</h3>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-2">
                    We use cookies to enhance your browsing experience, personalize content, and analyze our traffic. 
                    By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                    <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
                  </p>
                  <p className="text-xs text-white/40">
                    You can customize your preferences or reject non-essential cookies. Essential cookies cannot be disabled as they are required for the website to function.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 lg:min-w-[200px]">
                  <motion.button
                    onClick={acceptAll}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Accept All
                  </motion.button>
                  <motion.button
                    onClick={rejectAll}
                    className="w-full py-3 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white font-semibold text-sm transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reject All
                  </motion.button>
                  <motion.button
                    onClick={() => setShowDetails(true)}
                    className="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings size={14} strokeWidth={2.5} />
                    Customize
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Preferences */}
        {showDetails && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-dark-lighter border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Shield size={24} strokeWidth={2.5} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Cookie Preferences</h2>
                    <p className="text-xs text-white/50">Manage your cookie settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} strokeWidth={2.5} className="text-white/60" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-white">Essential Cookies</h3>
                        <span className="px-2 py-0.5 rounded-md bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase">
                          Always Active
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Required for the website to function. Enable core features like user authentication, 
                        security, and basic navigation. Cannot be disabled.
                      </p>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-gradient-to-r from-primary to-primary-dark relative">
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-1">Functional Cookies</h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Enable enhanced functionality like personalized settings, watch history, 
                        and watchlist. These remember your preferences.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        preferences.functional ? 'bg-gradient-to-r from-primary to-primary-dark' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all ${
                          preferences.functional ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-1">Analytics Cookies</h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Help us understand how visitors use the site by collecting anonymous data. 
                        This helps us improve the user experience.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        preferences.analytics ? 'bg-gradient-to-r from-primary to-primary-dark' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all ${
                          preferences.analytics ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-1">Marketing Cookies</h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Used to deliver personalized advertisements and track campaign effectiveness. 
                        These are set by our advertising partners.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        preferences.marketing ? 'bg-gradient-to-r from-primary to-primary-dark' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all ${
                          preferences.marketing ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white font-semibold text-sm transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={saveCustom}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Preferences
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
