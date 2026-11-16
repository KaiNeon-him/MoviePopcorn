import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bookmark, Settings, ChevronDown, Film, Tv, TrendingUp, Clapperboard, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import DiscordButton from './DiscordButton';
import LanguageSelector from './LanguageSelector';
import SearchSuggestions from './SearchSuggestions';
import UserMenu from './UserMenu';

const browseLinks = [
  { to: '/movies', label: 'Movies', icon: Film },
  { to: '/tv', label: 'TV Shows', icon: Tv },
  { to: '/trending', label: 'Trending', icon: TrendingUp },
  { to: '/anime', label: 'Anime', icon: Sparkles },
  { to: '/kdramas', label: 'K-Dramas', icon: Clapperboard },
  { to: '/cdramas', label: 'C-Dramas', icon: Clapperboard },
  { to: '/documentaries', label: 'Documentaries', icon: BookOpen },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const browseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setBrowseOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const isBrowseActive = browseLinks.some((l) => location.pathname === l.to);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-dark/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-[4.25rem]">
          <div className="flex items-center gap-5 lg:gap-8">
            <Link to="/" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>

            {/* Desktop primary nav — Home + Browse dropdown (not a wall of links) */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'text-white bg-white/[0.08]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Home
              </Link>

              <div className="relative" ref={browseRef}>
                <button
                  onClick={() => setBrowseOpen((v) => !v)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isBrowseActive || browseOpen ? 'text-white bg-white/[0.08]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Browse
                  <ChevronDown size={14} className={`transition-transform ${browseOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {browseOpen && (
                    <motion.div
                      className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-dark-lighter/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="p-2">
                        {browseLinks.map((link) => {
                          const Icon = link.icon;
                          const active = location.pathname === link.to;
                          return (
                            <Link
                              key={link.to}
                              to={link.to}
                              onClick={() => setBrowseOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                active ? 'bg-primary/15 text-primary font-semibold' : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                              }`}
                            >
                              <Icon size={16} strokeWidth={2.25} />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/watchlist"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/watchlist' ? 'text-white bg-white/[0.08]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Bookmark size={14} /> Watchlist
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <AnimatePresence mode="wait">
              {showSearch ? (
                <motion.div key="search" initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="relative">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative flex items-center">
                      <Search size={16} className="absolute left-3 text-white/40 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search..."
                        className="bg-white/[0.06] border border-white/[0.08] rounded-full pl-9 pr-10 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 w-40 sm:w-56"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearch(false);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="absolute right-1.5 p-1.5 rounded-full hover:bg-white/10 text-white/50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </form>
                  <SearchSuggestions query={searchQuery} isOpen={showSuggestions && searchQuery.length >= 2} onClose={() => setShowSuggestions(false)} />
                </motion.div>
              ) : (
                <motion.button
                  key="search-btn"
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={17} className="text-white/70" />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="hidden lg:flex items-center gap-2">
              <DiscordButton />
              <LanguageSelector />
            </div>

            <Link
              to="/settings"
              className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
              title="Settings"
            >
              <Settings size={17} className="text-white/70" />
            </Link>

            {user ? (
              <div className="hidden sm:block">
                <UserMenu />
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-3 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06]">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold shadow-lg shadow-primary/20"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-white/[0.06] bg-dark/98 backdrop-blur-xl max-h-[80vh] overflow-y-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 py-4 space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm">
                Home
              </Link>
              <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider text-white/35 font-semibold">Browse</p>
              {browseLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] text-sm"
                >
                  <link.icon size={16} /> {link.label}
                </Link>
              ))}
              <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/[0.04] text-sm">
                <Bookmark size={16} /> Watchlist
              </Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/[0.04] text-sm">
                <Settings size={16} /> Settings
              </Link>
              {!user && (
                <div className="pt-3 mt-2 border-t border-white/[0.06] space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-3 rounded-xl text-white/70 hover:bg-white/[0.04] text-sm">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block text-center mx-2 px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
