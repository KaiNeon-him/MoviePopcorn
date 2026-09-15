import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bookmark, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tv', label: 'TV Shows' },
    { to: '/trending', label: 'Trending' },
    { to: '/watchlist', label: 'Watchlist' },
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={link.to}
                  className={`relative px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {location.pathname === link.to && (
                    <motion.span
                      className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-full"
                      layoutId="navbar-bg"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search, Auth & Mobile Menu */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {showSearch ? (
                <motion.form
                  key="search-form"
                  onSubmit={handleSearch}
                  className="flex items-center"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative flex items-center">
                    <Search size={16} className="absolute left-3 text-white/40 pointer-events-none" strokeWidth={2.25} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="bg-white/[0.06] border border-white/[0.08] rounded-full pl-9 pr-10 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] w-56 sm:w-72 transition-all"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowSearch(false)}
                      className="absolute right-1.5 p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </motion.form>
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
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      location.pathname === link.to
                        ? 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile auth buttons */}
              {!user && (
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
