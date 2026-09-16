import { motion } from 'framer-motion';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { fetchCDramas } from '../api/tmdb';
import InfiniteScrollGrid from '../components/InfiniteScrollGrid';

export default function CDramasPage() {
  const { items, loading, hasMore, error, loadMoreRef } = useInfiniteScroll({
    fetchFn: fetchCDramas,
  });

  return (
    <motion.div
      className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            🇨🇳 C-Dramas
          </h1>
          <p className="text-white/50 text-sm">Popular Chinese drama series</p>
        </motion.div>

        <InfiniteScrollGrid
          items={items}
          loading={loading}
          hasMore={hasMore}
          error={error}
          loadMoreRef={loadMoreRef}
          mediaType="tv"
        />
      </div>
    </motion.div>
  );
}
