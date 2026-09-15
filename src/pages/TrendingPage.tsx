import { useState, useEffect } from 'react';
import { Movie, fetchTrending } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

type TimeWindow = 'day' | 'week';

export default function TrendingPage() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTrending('all', timeWindow).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [timeWindow]);

  return (
    <div className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">🔥 Trending</h1>

        {/* Time window tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTimeWindow('day')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              timeWindow === 'day'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeWindow('week')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              timeWindow === 'week'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            This Week
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] shimmer rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
