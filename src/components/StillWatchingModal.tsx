import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface StillWatchingModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onStop: () => void;
  title?: string;
}

export default function StillWatchingModal({ 
  isOpen, 
  onContinue, 
  onStop,
  title = "Are you still watching?"
}: StillWatchingModalProps) {
  const { settings } = useSettings();
  const [countdown, setCountdown] = useState(settings.autoPauseCountdown);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(settings.autoPauseCountdown);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, settings.autoPauseCountdown, onStop]);

  const handleContinue = () => {
    onContinue();
  };

  const handleStop = () => {
    onStop();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-dark-lighter to-dark-card border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Close button */}
              <button
                onClick={handleStop}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>

              {/* Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Play size={32} className="text-primary ml-1" fill="currentColor" />
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {title}
              </h2>

              {/* Countdown */}
              <p className="text-white/60 text-center mb-8">
                Pausing in <span className="text-primary font-bold">{countdown}</span> seconds
              </p>

              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-gold"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(countdown / settings.autoPauseCountdown) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleStop}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white font-semibold transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Stop Playing
                </motion.button>
                <motion.button
                  onClick={handleContinue}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Yes, Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
