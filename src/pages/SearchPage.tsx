import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Movie, searchMulti } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setSearched(true);
      searchMulti(query).then((data) => {
        setResults(data);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-dark pt-24 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        {searched && !loading && (
          <p className="text-white/50 mb-8">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] shimmer rounded-xl" />
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchIcon size={64} className="text-white/20 mb-4" />
            <p className="text-white/50 text-xl">No results found</p>
            <p className="text-white/30 text-sm mt-2">Try a different search term</p>
          </div>
        )}

        {!searched && (
          <div className="flex flex-col items-center justify-center py-20">
            <SearchIcon size={64} className="text-white/20 mb-4" />
            <p className="text-white/50 text-xl">Search for movies & TV shows</p>
            <p className="text-white/30 text-sm mt-2">Use the search bar above to find content</p>
          </div>
        )}
      </div>
    </div>
  );
}
