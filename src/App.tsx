import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './components/NotificationToast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import AdBlockerDetector from './components/AdBlockerDetector';
import InstallPrompt from './components/InstallPrompt';
import CookieConsent from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import TVPage from './pages/TVPage';
import SearchPage from './pages/SearchPage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import TrendingPage from './pages/TrendingPage';
import WatchlistPage from './pages/WatchlistPage';
import AnimePage from './pages/AnimePage';
import KDramasPage from './pages/KDramasPage';
import CDramasPage from './pages/CDramasPage';
import DocumentariesPage from './pages/DocumentariesPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import WatchHistoryPage from './pages/WatchHistoryPage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import DMCAPage from './pages/DMCAPage';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-dark text-white">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/kdramas" element={<KDramasPage />} />
          <Route path="/cdramas" element={<CDramasPage />} />
          <Route path="/documentaries" element={<DocumentariesPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<WatchHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/tv/:id" element={<TVPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/dmca" element={<DMCAPage />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      <AdBlockerDetector />
      <InstallPrompt />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              {/* Splash screen rendered via portal into document.body — completely isolated
                  from the router tree below, so it cannot disrupt the <BrowserRouter> context. */}
              <SplashScreen />

              {/* The entire app lives inside a single stable <BrowserRouter> that never
                  unmounts, ensuring useNavigate/useLocation always have a valid context. */}
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
