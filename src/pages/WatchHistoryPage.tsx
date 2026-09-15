import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X, Play, Filter, Film, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { getImageUrl } from '../api/tmdb';

type FilterType = 'all' | 'movie' | 'tv';

export default function WatchHistoryPage() {
  const { history, removeFromHistory, clearHistory } = useWatchHistory();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleClearAll = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Watch History
            </h1>
            <p className="text-white/50 text-sm">
              {history.length} {history.length === 1 ? 'title' : 'titles'} watched
            </p>
          </div>

          {history.length > 0 && (
            <motion.button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={16} strokeWidth={2.5} />
              Clear All
            </motion.button>
          )}
        </motion.div>

        {/* Filter tabs */}
        {history.length > 0 && (
          <motion.div
            className="flex gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Filter size={18} strokeWidth={2} className="text-white/40 mr-2 self-center" />
            {(['all', 'movie', 'tv'] as FilterType[]).map((type) => (
              <motion.button
                key={type}
                onClick={() => setFilter(type)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === type
                    ? 'text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter === type && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-full"
                    layoutId="history-filter-bg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {type === 'all' && <span>All</span>}
                  {type === 'movie' && (
                    <>
                      <Film size={14} strokeWidth={2.5} />
                      <span>Movies</span>
                    </>
                  )}
                  {type === 'tv' && (
                    <>
                      <Tv size={14} strokeWidth={2.5} />
                      <span>TV Shows</span>
                    </>
                  )}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {filteredHistory.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.06] mb-4">
                <Clock size={64} strokeWidth={1.5} className="text-white/10" />
              </div>
            </motion.div>
            <p className="text-white/50 text-xl mb-2 font-medium">
              {history.length === 0 ? 'No watch history yet' : 'No items match this filter'}
            </p>
            <p className="text-white/30 text-sm mb-6">
              {history.length === 0 
                ? 'Start watching movies and TV shows to see them here'
                : 'Try selecting a different filter'}
            </p>
            {history.length === 0 && (
              <Link
                to="/"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Play size={16} strokeWidth={2.5} fill="white" />
                <span className="relative z-10">Browse Content</span>
              </Link>
            )}
          </motion.div>
        )}

        {/* History list */}
        <AnimatePresence mode="popLayout">
          {filteredHistory.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredHistory.map((item, index) => (
                <motion.div
                  key={`${item.media_type}-${item.id}`}
                  className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Link to={item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`}>
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-20 h-28 sm:w-24 sm:h-36 rounded-xl overflow-hidden relative">
                        <img
                          src={getImageUrl(item.poster_path, 'w300')}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                            {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-primary transition-colors truncate mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-white/50">
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} strokeWidth={2.5} />
                              {formatTime(item.watchedAt)}
                            </span>
                            {item.season && item.episode && (
                              <span className="px-2 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs font-bold">
                                S{item.season}E{item.episode}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress bar */}
                        {item.progress !== undefined && item.progress > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                              <span>Progress</span>
                              <span>{item.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Remove button */}
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromHistory(item.id, item.media_type);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.1] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/30"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={14} strokeWidth={2.5} className="text-red-400" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear confirmation modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                className="bg-dark-lighter border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <Trash2 size={28} strokeWidth={2} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  Clear Watch History?
                </h3>
                <p className="text-white/50 text-sm text-center mb-6">
                  This will permanently remove all {history.length} items from your watch history. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white font-semibold text-sm transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleClearAll}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear All
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
