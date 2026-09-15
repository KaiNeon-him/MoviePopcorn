import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import TVPage from './pages/TVPage';
import SearchPage from './pages/SearchPage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage';
import WatchlistPage from './pages/WatchlistPage';

export default function App() {
  // Track splash state but DON'T use it for conditional rendering of the main tree.
  // The SplashScreen uses a React Portal (renders into document.body) so it never
  // affects this component tree. We only use this state to optionally delay showing
  // the main content until the splash finishes.
  const [ready, setReady] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <>
      {/* Splash screen rendered via portal into document.body — completely isolated
          from the router tree below, so it cannot disrupt the <BrowserRouter> context. */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* The entire app lives inside a single stable <BrowserRouter> that never
          unmounts, ensuring useNavigate/useLocation always have a valid context. */}
      <BrowserRouter>
        <div className="min-h-screen bg-dark text-white">
          <Navbar />
          <main className={ready ? '' : 'invisible'}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/tv" element={<TVShowsPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route path="/tv/:id" element={<TVPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}
