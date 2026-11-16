import { useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../api/tmdb';
import MovieCard from './MovieCard';
import { useSettings } from '../context/SettingsContext';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  mediaType?: 'movie' | 'tv';
  icon?: string;
  showRank?: boolean;
}

export default function MovieRow({ title, movies, mediaType, icon, showRank = false }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const visible = useMemo(() => {
    if (!movies?.length) return [];
    if (!settings.parentalControls.enabled) return movies;
    if (!settings.parentalControls.matureContent) {
      return movies.filter((m) => !m.adult);
    }
    return movies;
  }, [movies, settings.parentalControls.enabled, settings.parentalControls.matureContent]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!visible.length) return null;

  return (
    <motion.section
      className="py-5 relative group/row"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="flex items-center gap-3 mb-4 px-4 sm:px-8 lg:px-12"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        {icon && <span className="text-xl">{icon}</span>}
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {title}
        </h2>
        <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-white/15 to-transparent rounded-full" />
      </motion.div>

      <div className="relative">
        <motion.button
          onClick={() => scroll('left')}
          className="absolute left-2 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-dark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll left"
        >
          <div className="p-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:bg-white/[0.15]">
            <ChevronLeft size={18} strokeWidth={2.5} className="text-white" />
          </div>
        </motion.button>
        <motion.button
          onClick={() => scroll('right')}
          className="absolute right-2 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-dark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll right"
        >
          <div className="p-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:bg-white/[0.15]">
            <ChevronRight size={18} strokeWidth={2.5} className="text-white" />
          </div>
        </motion.button>

        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-8 lg:px-12 pb-3">
          {visible.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              className={`flex-shrink-0 ${showRank ? 'w-[140px] sm:w-[160px] md:w-[180px]' : 'w-[150px] sm:w-[180px] md:w-[200px]'}`}
            >
              <MovieCard movie={movie} mediaType={mediaType} index={index} rank={showRank ? index + 1 : undefined} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
