import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds or if user has visited before
      const hasVisited = localStorage.getItem('moviepopcorn_visited');
      if (hasVisited) {
        setShowPrompt(true);
      } else {
        setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
        localStorage.setItem('moviepopcorn_visited', 'true');
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app was installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('moviepopcorn_install_dismissed', 'true');
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl border border-primary/30 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Download size={24} strokeWidth={2.5} className="text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white mb-1">
                Install MoviePopcorn
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Install our app for a better experience with offline support and quick access!
              </p>
              
              <div className="flex gap-2">
                <motion.button
                  onClick={handleInstall}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Install App
                </motion.button>
                <motion.button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white font-semibold text-sm transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Later
                </motion.button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X size={18} strokeWidth={2.5} className="text-white/60" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
