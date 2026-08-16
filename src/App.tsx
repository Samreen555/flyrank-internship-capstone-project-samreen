import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { FavoritesProvider, useFavorites } from './hooks/useFavorites';
import { ToastProvider } from './hooks/useToast';
import { AuthProvider } from './hooks/useAuth';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Search = lazy(() => import('./pages/Search').then((module) => ({ default: module.Search })));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage').then((module) => ({ default: module.MovieDetailPage })));
const Favorites = lazy(() => import('./pages/Favorites').then((module) => ({ default: module.Favorites })));
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Signup = lazy(() => import('./pages/Signup').then((module) => ({ default: module.Signup })));

function AppContent() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <Header favoritesCount={favorites.length} />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-16">
              <LoadingSpinner size="lg" text="Loading..." />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
