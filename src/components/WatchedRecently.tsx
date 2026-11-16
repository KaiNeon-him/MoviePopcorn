import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Play, X } from 'lucide-react';
import { useWatchHistory, WatchedItem } from '../hooks/useWatchHistory';
import { getImageUrl } from '../api/tmdb';
import { useSettings } from '../context/SettingsContext';

export default function WatchedRecently() {
  const { history, removeFromHistory } = useWatchHistory();
  const { settings } = useSettings();

  if (!settings.account.showWatchHistory) return null;
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
  formatTime: (t: number) => string;
  onRemove: (id: number, type: 'movie' | 'tv') => void;
}

function WatchedCard({ item, index, formatTime, onRemove }: WatchedCardProps) {
  const link = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
  const title = item.title || 'Untitled';

  return (
    <motion.div
      className="relative flex-shrink-0 w-[150px] sm:w-[170px] group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link to={link} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-white/[0.08] group-hover:ring-white/20 transition-all">
          <img
            src={getImageUrl(item.poster_path, 'w300')}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Play size={16} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          {item.progress !== undefined && item.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-primary" style={{ width: `${Math.min(item.progress, 100)}%` }} />
            </div>
          )}
        </div>
        <p className="mt-2 text-xs font-medium text-white truncate">{title}</p>
        <p className="text-[10px] text-white/40 flex items-center gap-1">
          <Clock size={10} /> {formatTime(item.watchedAt || Date.now())}
        </p>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove(item.id, item.media_type);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove"
      >
        <X size={12} className="text-white" />
      </button>
    </motion.div>
  );
}
