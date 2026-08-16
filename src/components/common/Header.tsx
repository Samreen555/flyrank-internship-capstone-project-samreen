import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart, Search, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';

interface HeaderProps {
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ favoritesCount }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { clearFavorites } = useFavorites();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent hover:from-primary-300 hover:to-accent-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2"
            aria-label="Go to home page"
          >
            <Film className="w-8 h-8 text-primary-400" aria-hidden="true" />
            <span>MovieSearch</span>
          </Link>

          <nav aria-label="Main navigation" className="flex items-center gap-2">
            <ul className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  to="/search"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    isActive('/search')
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={isActive('/search') ? 'page' : undefined}
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                  <span>Search</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    isActive('/favorites')
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={isActive('/favorites') ? 'page' : undefined}
                  aria-label={`Favorites, ${favoritesCount} movies`}
                >
                  <Heart className="w-5 h-5" aria-hidden="true" />
                  <span>Favorites</span>
                  {favoritesCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                      aria-label={`${favoritesCount} favorites`}
                    >
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                  )}
                </Link>
              </li>
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive('/login')
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      aria-current={isActive('/login') ? 'page' : undefined}
                    >
                      <LogIn className="w-5 h-5" aria-hidden="true" />
                      <span>Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive('/signup')
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      aria-current={isActive('/signup') ? 'page' : undefined}
                    >
                      <UserPlus className="w-5 h-5" aria-hidden="true" />
                      <span>Sign Up</span>
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li>
                    <span className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-200">
                      <User className="w-4 h-4 text-primary-400" aria-hidden="true" />
                      <span>{user?.username}</span>
                    </span>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        clearFavorites();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <LogOut className="w-5 h-5" aria-hidden="true" />
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
