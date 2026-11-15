import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bookmark, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import DiscordButton from './DiscordButton';
import LanguageSelector from './LanguageSelector';
import SearchSuggestions from './SearchSuggestions';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tv', label: 'TV Shows' },
    { to: '/trending', label: 'Trending' },
    { to: '/anime', label: 'Anime' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-dark/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-[4.25rem]">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link to="/" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to ? 'text-white bg-white/[0.08]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/watchlist"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/watchlist' ? 'text-white bg-white/[0.08]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Bookmark size={14} /> Watchlist
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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
                        className="bg-white/[0.06] border border-white/[0.08] rounded-full pl-9 pr-10 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 w-44 sm:w-64"
                        autoFocus
                      />
                      <button type="button" onClick={() => { setShowSearch(false); setShowSuggestions(false); setSearchQuery(''); }} className="absolute right-1.5 p-1.5 rounded-full hover:bg-white/10 text-white/50">
                        <X size={14} />
                      </button>
                    </div>
                  </form>
                  <SearchSuggestions query={searchQuery} isOpen={showSuggestions && searchQuery.length >= 2} onClose={() => setShowSuggestions(false)} />
                </motion.div>
              ) : (
                <motion.button key="search-btn" onClick={() => setShowSearch(true)} className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Search size={17} className="text-white/70" />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="hidden lg:flex items-center gap-2">
              <DiscordButton />
              <LanguageSelector />
            </div>

            {/* Settings — guests and signed-in */}
            <Link
              to="/settings"
              className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
              title="Settings"
            >
              <Settings size={17} className="text-white/70 hover:text-white" />
            </Link>

            {user ? (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center text-xs font-bold">{user.name?.[0]?.toUpperCase()}</div>
                  )}
                  <ChevronDown size={14} className="text-white/50" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-dark-lighter/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/[0.06]"><User size={14} /> Profile</Link>
                      <Link to="/history" className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/[0.06]"><Bookmark size={14} /> History</Link>
                      <Link to="/settings" className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/[0.06]"><Settings size={14} /> Settings</Link>
                      <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"><LogOut size={14} /> Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06]">Sign In</Link>
                <Link to="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold shadow-lg shadow-primary/20">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-white/[0.06] bg-dark/98 backdrop-blur-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm">
                  {link.label}
                </Link>
              ))}
              <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm">Watchlist</Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] font-medium text-sm">
                <Settings size={16} /> Settings
              </Link>
              {user ? (
                <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-1">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/[0.04] text-sm"><User size={16} /> Profile</Link>
                  <button onClick={() => { setMobileMenuOpen(false); logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 text-sm text-left"><LogOut size={16} /> Sign Out</button>
                </div>
              ) : (
                <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-3 rounded-xl text-white/70 hover:bg-white/[0.04] text-sm">Sign In</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block text-center mx-4 px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm">Create Account</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
