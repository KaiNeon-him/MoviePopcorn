import { Movie } from '../api/tmdb';
import MovieCard from './MovieCard';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollGridProps {
  items: Movie[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  mediaType?: 'movie' | 'tv';
}

export default function InfiniteScrollGrid({
  items,
  loading,
  hasMore,
  error,
  loadMoreRef,
  mediaType,
}: InfiniteScrollGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/60 text-xl mb-2">Error loading content</p>
        <p className="text-white/40 text-sm">{error}</p>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/60 text-xl">No content found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid of items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <MovieCard
            key={`${item.id}-${index}`}
            movie={item}
            mediaType={mediaType}
            index={index}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-white/60">Loading more...</span>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && !loading && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          <p className="text-white/40 text-sm">Scroll for more...</p>
        </div>
      )}

      {/* End of content */}
      {!hasMore && items.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-white/40 text-sm">You've reached the end!</p>
        </div>
      )}
    </div>
  );
}
