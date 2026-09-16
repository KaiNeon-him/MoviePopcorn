import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bookmark, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { House, FilmStrip, Television, TrendUp, BookmarkSimple } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import UserMenu from './UserMenu';
import DiscordButton from './DiscordButton';
import LanguageSelector from './LanguageSelector';
import SearchSuggestions from './SearchSuggestions';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const navLinks = [
    { to: '/', label: 'Home', icon: House, description: 'Discover new content' },
    { to: '/movies', label: 'Movies', icon: FilmStrip, description: 'Browse all movies' },
    { to: '/tv', label: 'TV Shows', icon: Television, description: 'Explore TV series' },
    { to: '/anime', label: 'Anime', icon: FilmStrip, description: 'Japanese animation' },
    { to: '/kdramas', label: 'K-Dramas', icon: Television, description: 'Korean dramas' },
    { to: '/cdramas', label: 'C-Dramas', icon: Television, description: 'Chinese dramas' },
    { to: '/documentaries', label: 'Documentaries', icon: FilmStrip, description: 'Real stories' },
    { to: '/trending', label: 'Trending', icon: TrendUp, description: 'What\'s hot now' },
    { to: '/watchlist', label: 'Watchlist', icon: BookmarkSimple, description: 'Your saved items' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-dark/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/40'
          : 'bg-gradient-to-b from-dark/80 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                dropdownOpen
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 text-white hover:bg-primary/30 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-white">Browse</span>
              <motion.div
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown size={18} strokeWidth={2.5} className="text-white" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="absolute top-full left-0 mt-3 w-72 bg-dark-lighter/98 backdrop-blur-2xl border-2 border-primary/30 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Arrow pointing up */}
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-dark-lighter/98 border-l-2 border-t-2 border-primary/30 transform rotate-45" />
                  
                  <div className="p-3">
                    {/* Header */}
                    <div className="px-3 py-2 mb-2 border-b border-white/[0.06]">
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Navigation</p>
                    </div>
                    
                    {navLinks.map((link, index) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.to;
                      return (
                        <motion.div
                          key={link.to}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={link.to}
                            onClick={() => setDropdownOpen(false)}
                            className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40'
                                : 'hover:bg-white/[0.08] border border-transparent hover:border-white/[0.1]'
                            }`}
                          >
                            <motion.div 
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                isActive
                                  ? 'bg-primary/40 shadow-lg shadow-primary/20'
                                  : 'bg-white/[0.08] group-hover:bg-primary/20'
                              }`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Icon size={22} weight="duotone" className={isActive ? 'text-primary' : 'text-white/80 group-hover:text-primary'} />
                            </motion.div>
                            <div className="flex-1">
                              <div className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-white group-hover:text-primary'} transition-colors`}>
                                {link.label}
                              </div>
                              <div className="text-xs text-white/50 mt-0.5">{link.description}</div>
                            </div>
                            {isActive && (
                              <motion.div
                                className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search, Auth & Mobile Menu */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {showSearch ? (
                <motion.div
                  key="search-form"
                  ref={searchRef}
                  className="relative"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative flex items-center">
                      <Search size={16} className="absolute left-3 text-white/40 pointer-events-none" strokeWidth={2.25} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search movies, TV shows..."
                        className="bg-white/[0.06] border border-white/[0.08] rounded-full pl-9 pr-10 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] w-56 sm:w-72 transition-all"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearch(false);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="absolute right-1.5 p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </form>
                  
                  {/* Search Suggestions */}
                  <SearchSuggestions
                    query={searchQuery}
                    isOpen={showSuggestions && searchQuery.length >= 2}
                    onClose={() => setShowSuggestions(false)}
                  />
                </motion.div>
              ) : (
                <motion.button
                  key="search-btn"
                  onClick={() => setShowSearch(true)}
                  className="relative group p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={17} strokeWidth={2.25} className="text-white/70 group-hover:text-white transition-colors" />
                  <span className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Discord & Language */}
            <div className="hidden lg:flex items-center gap-2">
              <DiscordButton />
              <LanguageSelector />
            </div>

            {/* Auth section */}
            {user ? (
              <UserMenu />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </motion.div>
              </div>
            )}

            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative group p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X size={17} strokeWidth={2.25} className="text-white/70 group-hover:text-white transition-colors" />
              ) : (
                <Menu size={17} strokeWidth={2.25} className="text-white/70 group-hover:text-white transition-colors" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-dark-lighter/95 backdrop-blur-2xl border-t border-white/[0.06]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary'
                          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-primary/30' : 'bg-white/[0.06]'
                      }`}>
                        <Icon size={20} weight="duotone" className={isActive ? 'text-primary' : 'text-white/70'} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-white'}`}>
                          {link.label}
                        </div>
                        <div className="text-xs text-white/40">{link.description}</div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile auth buttons */}
              {!user ? (
                <motion.div
                  className="pt-3 mt-3 border-t border-white/[0.06] space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all"
                  >
                    <User size={16} strokeWidth={2.25} />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-sm shadow-lg shadow-primary/20"
                  >
                    Create Account
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  className="pt-3 mt-3 border-t border-white/[0.06] space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <p className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Account</p>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all"
                  >
                    <User size={16} strokeWidth={2.25} />
                    Profile
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all"
                  >
                    <Bookmark size={16} strokeWidth={2.25} />
                    Watch History
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm transition-all"
                  >
                    <Settings size={16} strokeWidth={2.25} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium text-sm transition-all text-left"
                  >
                    <LogOut size={16} strokeWidth={2.25} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
