import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward } from 'lucide-react';

interface SkipButtonProps {
  show: boolean;
  onClick: () => void;
  type: 'intro' | 'outro';
}

export default function SkipButton({ show, onClick, type }: SkipButtonProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={onClick}
          className="absolute bottom-20 right-4 sm:bottom-24 sm:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg z-20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward size={18} strokeWidth={2.5} />
          <span className="text-sm font-semibold">
            Skip {type === 'intro' ? 'Intro' : 'Outro'}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
