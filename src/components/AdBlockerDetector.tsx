import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function AdBlockerDetector() {
  const { settings } = useSettings();
  const [showNotification, setShowNotification] = useState(false);
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);

  useEffect(() => {
    if (!settings.adBlocker) return;

    // Simple ad blocker detection
    // Create a test element that ad blockers typically block
    const test = document.createElement('div');
    test.innerHTML = '&nbsp;';
    test.className = 'adsbox';
    test.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(test);

    // Check if the element was blocked
    setTimeout(() => {
      const blocked = test.offsetHeight === 0 || test.clientHeight === 0;
      setAdBlockerDetected(blocked);
      setShowNotification(blocked);
      document.body.removeChild(test);
    }, 100);
  }, [settings.adBlocker]);

  const dismiss = () => {
    setShowNotification(false);
  };

  return (
    <AnimatePresence>
      {showNotification && adBlockerDetected && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Shield size={20} strokeWidth={2.5} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-1">
                  Ad Blocker Detected
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  We've detected an ad blocker. MoviePopcorn works best without ad blockers for optimal streaming experience.
                </p>
              </div>
              <button
                onClick={dismiss}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X size={16} strokeWidth={2.5} className="text-white/60" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
