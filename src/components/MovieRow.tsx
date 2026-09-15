import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../api/tmdb';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  mediaType?: 'movie' | 'tv';
}

export default function MovieRow({ title, movies, mediaType }: MovieRowProps) {
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
    <section className="py-6 relative group/row">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 px-4 sm:px-8 lg:px-12">
        {title}
      </h2>
      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-dark/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-dark/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronRight size={32} className="text-white" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-8 lg:px-12 pb-4"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px]">
              <MovieCard movie={movie} mediaType={mediaType} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
