import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-lighter border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍿</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                MoviePopcorn
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Your ultimate destination for streaming movies and TV shows. 
              Powered by VidAPI for seamless video playback.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/40 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link to="/movies" className="text-white/40 hover:text-white text-sm transition-colors">Movies</Link></li>
              <li><Link to="/tv" className="text-white/40 hover:text-white text-sm transition-colors">TV Shows</Link></li>
              <li><Link to="/trending" className="text-white/40 hover:text-white text-sm transition-colors">Trending</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Info</h3>
            <ul className="space-y-2">
              <li><span className="text-white/40 text-sm">Movie data by TMDB</span></li>
              <li><span className="text-white/40 text-sm">Video streaming by VidAPI</span></li>
              <li><span className="text-white/40 text-sm">For educational purposes only</span></li>
            </ul>
          </div>

          {/* Powered by */}
          <div>
            <h3 className="text-white font-semibold mb-4">Powered By</h3>
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
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} MoviePopcorn. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
