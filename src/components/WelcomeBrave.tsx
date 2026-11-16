import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, ExternalLink, Monitor } from 'lucide-react';

const STORAGE_KEY = 'moviepopcorn_welcome_brave_v1';

export default function WelcomeBrave() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    // Slight delay so splash / first paint settle
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            className="fixed z-[101] left-1/2 top-1/2 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/[0.1] bg-dark-lighter/95 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            role="dialog"
            aria-labelledby="welcome-title"
          >
            <div className="relative p-6 sm:p-7">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-primary/15 border border-primary/30">
                  <Shield size={22} className="text-primary" />
                </div>
                <div>
                  <h2 id="welcome-title" className="text-lg font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Welcome to MoviePopcorn
                  </h2>
                  <p className="text-xs text-white/45">A quick tip for a cleaner stream</p>
                </div>
              </div>

              <p className="text-sm text-white/70 leading-relaxed mb-4">
                We block popups that try to open from this site, but <span className="text-white/90">ads inside the video player</span> live in a
                third-party player we can't fully control from the app.
              </p>

              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 mb-5">
                <div className="flex items-start gap-3">
                  <Monitor size={18} className="text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Stream with Brave</p>
                    <p className="text-xs text-white/55 leading-relaxed">
                      For the best experience, open MoviePopcorn in the{' '}
                      <span className="text-white/85 font-medium">Brave browser</span>. Built-in shields cut most ads and trackers without
                      installing extra extensions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://brave.com/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
                >
                  Get Brave <ExternalLink size={14} />
                </a>
                <button
                  onClick={dismiss}
                  className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/80 text-sm font-medium hover:bg-white/[0.08] transition-colors"
                >
                  Got it — continue
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
