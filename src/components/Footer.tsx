import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

export default function Footer() {
  return (
    <motion.footer
      className="bg-dark-lighter border-t border-white/5 mt-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Your ultimate destination for streaming movies and TV shows. 
              Powered by VidAPI for seamless video playback.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Navigate</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/40 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link to="/movies" className="text-white/40 hover:text-white text-sm transition-colors">Movies</Link></li>
              <li><Link to="/tv" className="text-white/40 hover:text-white text-sm transition-colors">TV Shows</Link></li>
              <li><Link to="/trending" className="text-white/40 hover:text-white text-sm transition-colors">Trending</Link></li>
              <li><Link to="/watchlist" className="text-white/40 hover:text-white text-sm transition-colors">Watchlist</Link></li>
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Info</h3>
            <ul className="space-y-2">
              <li><span className="text-white/40 text-sm">Movie data by TMDB</span></li>
              <li><span className="text-white/40 text-sm">Video streaming by VidAPI</span></li>
              <li><span className="text-white/40 text-sm">For educational purposes only</span></li>
            </ul>
          </motion.div>

          {/* Powered by */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>Powered By</h3>
            <div className="space-y-3">
              <a
                href="https://vidapi.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/40 hover:text-primary text-sm transition-colors"
              >
                VidAPI - Video Streaming
              </a>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/40 hover:text-primary text-sm transition-colors"
              >
                TMDB - Movie Database
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} MoviePopcorn. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
