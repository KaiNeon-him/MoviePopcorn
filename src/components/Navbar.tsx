import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-dark/90 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl popcorn-bounce">🍿</span>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent group-hover:from-gold group-hover:to-primary transition-all duration-300">
              MoviePopcorn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link to="/movies" className="text-white/80 hover:text-white transition-colors font-medium">
              Movies
            </Link>
            <Link to="/tv" className="text-white/80 hover:text-white transition-colors font-medium">
              TV Shows
            </Link>
            <Link to="/trending" className="text-white/80 hover:text-white transition-colors font-medium">
              Trending
            </Link>
          </div>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-3">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies & TV shows..."
                  className="bg-dark-lighter border border-white/20 rounded-l-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-primary w-48 sm:w-64 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="bg-dark-lighter border border-l-0 border-white/20 rounded-r-lg px-3 py-2 text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <Search size={22} />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-lighter/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-white py-2 font-medium">
              Home
            </Link>
            <Link to="/movies" onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-white py-2 font-medium">
              Movies
            </Link>
            <Link to="/tv" onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-white py-2 font-medium">
              TV Shows
            </Link>
            <Link to="/trending" onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-white py-2 font-medium">
              Trending
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
