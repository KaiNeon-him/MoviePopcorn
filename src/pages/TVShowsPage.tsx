import { useState, useEffect } from 'react';
import { Movie, fetchPopularTV, fetchTopRatedTV } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

type Category = 'popular' | 'top_rated';

const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'popular', label: 'Popular', emoji: '📺' },
  { key: 'top_rated', label: 'Top Rated', emoji: '⭐' },
];

export default function TVPage() {
  const [category, setCategory] = useState<Category>('popular');
  const [shows, setShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchFn = {
      popular: fetchPopularTV,
      top_rated: fetchTopRatedTV,
    }[category];
    fetchFn().then((data) => {
      setShows(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <div className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">TV Shows</h1>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                category === cat.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
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
            {shows.map((show) => (
              <MovieCard key={show.id} movie={show} mediaType="tv" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
