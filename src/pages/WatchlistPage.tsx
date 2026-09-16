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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Bookmark size={28} strokeWidth={2.25} className="text-primary" />
          </div>
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
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.06] mb-4">
                <Bookmark size={64} strokeWidth={1.5} className="text-white/10" />
              </div>
            </motion.div>
            <p className="text-white/50 text-xl mb-2 font-medium">Your watchlist is empty</p>
            <p className="text-white/30 text-sm mb-6">Add movies and TV shows to watch later</p>
            <Link
              to="/"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Browse Content</span>
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
                    className="block rounded-2xl overflow-hidden bg-dark-card ring-1 ring-white/[0.06] hover:ring-white/[0.12] shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden">
                      <motion.img
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-[13px] font-semibold text-white truncate group-hover:text-primary transition-colors duration-300 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-white/40 mt-1.5 uppercase font-medium tracking-wide">
                        {item.media_type}
                      </p>
                    </div>
                  </Link>
                  <motion.button
                    onClick={() => removeFromWatchlist(item.id, item.media_type)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.1] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/30"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={14} strokeWidth={2.5} className="text-red-400" />
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
