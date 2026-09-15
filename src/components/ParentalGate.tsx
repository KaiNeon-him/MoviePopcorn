import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useNotifications } from './NotificationToast';

interface ParentalGateProps {
  children: React.ReactNode;
  rating?: string;
}

export default function ParentalGate({ children, rating }: ParentalGateProps) {
  const { settings, isContentAllowed } = useSettings();
  const { warning } = useNotifications();
  const [unlocked, setUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  // If parental controls are disabled or content is allowed, show children
  if (!settings.parentalControls.enabled || isContentAllowed(rating || '')) {
    return <>{children}</>;
  }

  // If already unlocked for this session, show children
  if (unlocked) {
    return <>{children}</>;
  }

  const handlePinSubmit = () => {
    if (pinInput === settings.parentalControls.pin) {
      setUnlocked(true);
      setShowPinModal(false);
      setPinInput('');
      setError('');
    } else {
      setError('Incorrect PIN');
      setPinInput('');
      warning('Incorrect PIN', 'Please try again');
    }
  };

  const handlePinChange = (value: string) => {
    // Only allow numbers, max 4 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setPinInput(cleaned);
    setError('');
    
    // Auto-submit when 4 digits entered
    if (cleaned.length === 4) {
      setTimeout(() => {
        if (cleaned === settings.parentalControls.pin) {
          setUnlocked(true);
          setShowPinModal(false);
          setPinInput('');
        } else {
          setError('Incorrect PIN');
          setPinInput('');
        }
      }, 200);
    }
  };

  return (
    <>
      {/* Blurred/blocked content preview */}
      <div className="relative">
        <div className="filter blur-sm opacity-50 pointer-events-none">
          {children}
        </div>
        
        {/* Overlay with lock */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={() => setShowPinModal(true)}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl hover:bg-white/[0.08] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Lock size={28} strokeWidth={2} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Parental Control</p>
              <p className="text-xs text-white/50 mt-1">Enter PIN to continue</p>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPinModal(false)}
          >
            <motion.div
              className="bg-dark-lighter border border-white/[0.08] rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Lock size={20} strokeWidth={2.5} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Enter PIN</h3>
                    <p className="text-xs text-white/50">Parental control required</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={18} strokeWidth={2.5} className="text-white/60" />
                </button>
              </div>

              {/* PIN input */}
              <div className="mb-6">
                <div className="flex gap-3 justify-center mb-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                        pinInput[index]
                          ? 'border-primary bg-primary/10 text-white'
                          : 'border-white/20 bg-white/[0.03] text-white/30'
                      }`}
                    >
                      {pinInput[index] ? '•' : ''}
                    </div>
                  ))}
                </div>
                
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => handlePinChange(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  autoFocus
                />
                
                {error && (
                  <motion.p
                    className="mt-3 text-sm text-red-400 text-center"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white font-semibold text-sm transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handlePinSubmit}
                  disabled={pinInput.length !== 4}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: pinInput.length === 4 ? 1.02 : 1 }}
                  whileTap={{ scale: pinInput.length === 4 ? 0.98 : 1 }}
                >
                  Unlock
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
