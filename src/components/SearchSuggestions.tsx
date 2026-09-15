import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, Tv, X } from 'lucide-react';
import { searchMulti, Movie, getImageUrl } from '../api/tmdb';

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSuggestions({ query, isOpen, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchMulti(query);
        setSuggestions(results.slice(0, 8)); // Show top 8 results
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    setSelectedIndex(-1); // Reset selection when suggestions change
  }, [suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleSelect = (item: Movie) => {
    const type = item.media_type || 'movie';
    navigate(`/${type}/${item.id}`);
    onClose();
  };

  const getItemIcon = (mediaType: string | undefined) => {
    if (mediaType === 'tv') {
      return <Tv size={16} className="text-blue-400" />;
    }
    return <Film size={16} className="text-primary" />;
  };

  const getTitle = (item: Movie) => {
    return item.title || item.name || 'Untitled';
  };

  const getYear = (item: Movie) => {
    const date = item.release_date || item.first_air_date;
    if (date) {
      return new Date(date).getFullYear();
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="absolute top-full left-0 right-0 mt-2 bg-dark-lighter/95 backdrop-blur-2xl border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onKeyDown={handleKeyDown}
    >
      {/* Loading State */}
      {loading && (
        <div className="p-6 text-center">
          <motion.div
            className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/60 text-sm mt-2">Searching...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && query.length >= 2 && suggestions.length === 0 && (
        <div className="p-6 text-center">
          <Search size={32} className="text-white/20 mx-auto mb-2" />
          <p className="text-white/60 text-sm">No results found for "{query}"</p>
          <p className="text-white/40 text-xs mt-1">Try a different search term</p>
        </div>
      )}

      {/* Suggestions List */}
      {!loading && suggestions.length > 0 && (
        <div className="max-h-[400px] overflow-y-auto">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Suggestions
            </p>
          </div>

          {/* Items */}
          <div className="p-2">
            <AnimatePresence>
              {suggestions.map((item, index) => (
                <motion.button
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left ${
                    selectedIndex === index
                      ? 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40'
                      : 'hover:bg-white/[0.08] border border-transparent'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Poster */}
                  <div className="flex-shrink-0 w-12 h-16 rounded-lg overflow-hidden bg-white/[0.06]">
                    {item.poster_path ? (
                      <img
                        src={getImageUrl(item.poster_path, 'w92')}
                        alt={getTitle(item)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getItemIcon(item.media_type)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getItemIcon(item.media_type)}
                      <h3 className={`text-sm font-semibold truncate ${
                        selectedIndex === index ? 'text-primary' : 'text-white'
                      }`}>
                        {getTitle(item)}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span className="capitalize">{item.media_type || 'movie'}</span>
                      {getYear(item) && (
                        <>
                          <span>•</span>
                          <span>{getYear(item)}</span>
                        </>
                      )}
                      {item.vote_average > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-gold">★ {item.vote_average.toFixed(1)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedIndex === index && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
            <p className="text-xs text-white/40 text-center">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px]">Enter</kbd> to select, <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px]">↑↓</kbd> to navigate
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
