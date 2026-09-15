import { motion } from 'framer-motion';
import { Bookmark, Trash2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 page-transition">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Bookmark size={32} className="text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            My Watchlist
          </h1>
        </motion.div>

        {watchlist.length === 0 ? (
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
              <Bookmark size={80} className="text-white/10 mb-4" />
            </motion.div>
            <p className="text-white/50 text-xl mb-2">Your watchlist is empty</p>
            <p className="text-white/30 text-sm">Add movies and TV shows to watch later</p>
            <Link
              to="/"
              className="mt-6 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
            >
              Browse Content
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {watchlist.map((item, index) => (
              <motion.div
                key={`${item.media_type}-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="relative group">
                  <Link
                    to={item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`}
                    className="block rounded-xl overflow-hidden bg-dark-card card-hover"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                      <p className="text-xs text-white/50 mt-1 uppercase">{item.media_type}</p>
                    </div>
                  </Link>
                  <motion.button
                    onClick={() => removeFromWatchlist(item.id, item.media_type)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
