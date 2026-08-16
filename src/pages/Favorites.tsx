import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, SortAsc } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import { MovieGrid } from '../components/movie/MovieGrid';
import type { Movie, SortOption } from '../types/movie';

export const Favorites: React.FC = () => {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [showConfirm, setShowConfirm] = useState(false);

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.Title.localeCompare(b.Title);
      case 'year':
        return b.Year.localeCompare(a.Year);
      case 'type':
        return a.Type.localeCompare(b.Type);
      default:
        return 0;
    }
  });

  const handleClearAll = () => {
    clearFavorites();
    pushToast('All favorites removed', 'info');
    setShowConfirm(false);
  };

  const handleFavoriteToggle = (movie: Movie) => {
    const alreadyFavorite = favorites.some((item) => item.imdbID === movie.imdbID);
    toggleFavorite(movie);
    pushToast(alreadyFavorite ? 'Removed from favorites' : 'Added to favorites', alreadyFavorite ? 'info' : 'success');
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 animate-fade-in">
          <Heart className="w-24 h-24 mx-auto text-gray-700" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-300">
              No Favorites Yet
            </h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Start adding movies to your favorites by clicking the heart icon on any movie card
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Discover Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            My Favorites
          </h1>
          <p className="text-gray-400 mt-2">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-5 h-5 text-gray-400" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input py-2 pr-8"
              aria-label="Sort favorites by"
            >
              <option value="title">Title</option>
              <option value="year">Year</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* Clear All Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-gray-800 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 text-red-400 hover:text-red-300"
            aria-label="Clear all favorites"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
          role="dialog"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-description"
        >
          <div className="card max-w-md w-full p-6 space-y-4">
            <h2 id="confirm-title" className="text-xl font-bold">
              Clear All Favorites?
            </h2>
            <p id="confirm-description" className="text-gray-400">
              Are you sure you want to remove all {favorites.length} movies from your favorites? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-100 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Grid */}
      <MovieGrid 
        movies={sortedFavorites} 
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
};
