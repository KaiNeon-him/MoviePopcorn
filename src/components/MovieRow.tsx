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
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center gap-3 mb-4 px-4 sm:px-8 lg:px-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {icon && <span className="text-2xl">{icon}</span>}
        <h2
          className="text-xl sm:text-2xl font-bold text-white"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {title}
        </h2>
        <motion.div
          className="h-0.5 flex-1 max-w-20 bg-gradient-to-r from-primary/50 to-transparent rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </motion.div>

      <div className="relative">
        {/* Scroll buttons */}
        <motion.button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-dark/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={32} className="text-white" />
        </motion.button>
        <motion.button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-dark/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={32} className="text-white" />
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
