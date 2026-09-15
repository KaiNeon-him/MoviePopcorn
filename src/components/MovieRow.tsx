import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../api/tmdb';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  mediaType?: 'movie' | 'tv';
  icon?: string;
}

export default function MovieRow({ title, movies, mediaType, icon }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <motion.section
      className="py-6 relative group/row"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="flex items-center gap-3 mb-5 px-4 sm:px-8 lg:px-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {icon && <span className="text-xl">{icon}</span>}
        <h2
          className="text-lg sm:text-xl font-bold text-white tracking-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {title}
        </h2>
        <motion.div
          className="h-px flex-1 max-w-24 bg-gradient-to-r from-white/20 to-transparent rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </motion.div>

      <div className="relative">
        {/* Scroll buttons - modern glass style */}
        <motion.button
          onClick={() => scroll('left')}
          className="absolute left-2 top-0 bottom-0 z-10 w-14 bg-gradient-to-r from-dark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-2.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:bg-white/[0.15] hover:border-white/[0.2] transition-all shadow-lg">
            <ChevronLeft size={18} strokeWidth={2.5} className="text-white" />
          </div>
        </motion.button>
        <motion.button
          onClick={() => scroll('right')}
          className="absolute right-2 top-0 bottom-0 z-10 w-14 bg-gradient-to-l from-dark to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-2.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:bg-white/[0.15] hover:border-white/[0.2] transition-all shadow-lg">
            <ChevronRight size={18} strokeWidth={2.5} className="text-white" />
          </div>
        </motion.button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-8 lg:px-12 pb-4"
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px]">
              <MovieCard movie={movie} mediaType={mediaType} index={index} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
