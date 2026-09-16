import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Play, X } from 'lucide-react';
import { useWatchHistory, WatchedItem } from '../hooks/useWatchHistory';
import { getImageUrl } from '../api/tmdb';

export default function WatchedRecently() {
  const { history, removeFromHistory } = useWatchHistory();

  if (history.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.section
      className="py-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="flex items-center gap-3 mb-5 px-4 sm:px-8 lg:px-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-xl">🕐</span>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Continue Watching
        </h2>
        <motion.div
          className="h-px flex-1 max-w-24 bg-gradient-to-r from-white/20 to-transparent rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </motion.div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-8 lg:px-12 pb-4">
        {history.slice(0, 10).map((item, index) => (
          <WatchedCard key={`${item.media_type}-${item.id}`} item={item} index={index} formatTime={formatTime} onRemove={removeFromHistory} />
        ))}
      </div>
    </motion.section>
  );
}

interface WatchedCardProps {
  item: WatchedItem;
  index: number;
  formatTime: (timestamp: number) => string;
  onRemove: (id: number, mediaType: 'movie' | 'tv') => void;
}

function WatchedCard({ item, index, formatTime, onRemove }: WatchedCardProps) {
  const linkTo = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;

  return (
    <motion.div
      className="flex-shrink-0 w-[280px] sm:w-[320px] group"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={linkTo} className="block relative rounded-2xl overflow-hidden bg-dark-card ring-1 ring-white/[0.06] hover:ring-white/[0.12] shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
        {/* Backdrop image */}
        <div className="aspect-video relative overflow-hidden">
          <motion.img
            src={item.poster_path ? getImageUrl(item.poster_path, 'w500') : 'https://via.placeholder.com/500x750/1a1a2e/666?text=No+Image'}
            alt={item.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Play icon - modern circular */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl scale-150" />
              <motion.div
                className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/40 ring-2 ring-white/20"
                whileHover={{ scale: 1.1 }}
              >
                <Play size={18} className="text-white ml-0.5" fill="white" strokeWidth={2.5} />
              </motion.div>
            </div>
          </motion.div>

          {/* Remove button - modern icon button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.id, item.media_type);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.1] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:border-white/[0.2]"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={14} strokeWidth={2.5} className="text-white/80" />
          </motion.button>

          {/* Progress bar */}
          {item.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>
          )}

          {/* Time info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08] text-xs text-white/70 font-medium">
              <Clock size={11} strokeWidth={2.5} />
              {formatTime(item.watchedAt)}
            </span>
            {item.season && item.episode && (
              <span className="px-2.5 py-1 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
                S{item.season}E{item.episode}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="p-3.5">
          <h3 className="text-[13px] font-semibold text-white truncate group-hover:text-primary transition-colors duration-300 leading-tight">
            {item.title}
          </h3>
          <p className="text-[11px] text-white/40 mt-1.5 uppercase font-medium tracking-wide">
            {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
