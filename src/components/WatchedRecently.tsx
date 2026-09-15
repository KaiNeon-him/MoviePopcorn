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
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center gap-3 mb-4 px-4 sm:px-8 lg:px-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-2xl">🕐</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Continue Watching
        </h2>
        <motion.div
          className="h-0.5 flex-1 max-w-20 bg-gradient-to-r from-gold/50 to-transparent rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
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
      <Link to={linkTo} className="block relative rounded-xl overflow-hidden bg-dark-card">
        {/* Backdrop image */}
        <div className="aspect-video relative overflow-hidden">
          <motion.img
            src={item.poster_path ? getImageUrl(item.poster_path, 'w500') : 'https://via.placeholder.com/500x750/1a1a2e/666?text=No+Image'}
            alt={item.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Play icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </motion.div>
          </motion.div>

          {/* Remove button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.id, item.media_type);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={14} className="text-white" />
          </motion.button>

          {/* Progress bar */}
          {item.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </div>
          )}

          {/* Time info */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <span className="text-xs text-white/70 flex items-center gap-1">
              <Clock size={12} />
              {formatTime(item.watchedAt)}
            </span>
            {item.season && item.episode && (
              <span className="text-xs text-white/70 bg-black/50 px-2 py-0.5 rounded">
                S{item.season}E{item.episode}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-white/50 mt-0.5 uppercase">
            {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
