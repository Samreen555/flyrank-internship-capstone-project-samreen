import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { MovieGrid } from '../components/movie/MovieGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useMovies } from '../hooks/useMovies';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import type { Movie, MovieType } from '../types/movie';
import { ChevronDown, Film } from 'lucide-react';
import { DEFAULT_HOME_QUERY } from '../utils/constants';

export const Search: React.FC = () => {
  const { 
    movies, 
    loading, 
    error, 
    searchQuery, 
    totalResults, 
    hasMore,
    search, 
    loadMore, 
  } = useMovies();
  
  const [searchParams] = useSearchParams();
  const { favorites, toggleFavorite } = useFavorites();
  const { pushToast } = useToast();
  const [currentType, setCurrentType] = useState<MovieType>('');

  const handleSearch = (query: string, type: MovieType) => {
    const trimmed = query.trim();
    setCurrentType(type);

    if (trimmed.length > 0) {
      search(trimmed, type);
    } else {
      setCurrentType('');
      search(DEFAULT_HOME_QUERY, '');
    }
  };

  const handleBrowseAll = () => {
    setCurrentType('');
    search(DEFAULT_HOME_QUERY, '');
  };

  const handleLoadMore = () => {
    loadMore(currentType);
  };

  const handleFavoriteToggle = (movie: Movie) => {
    const alreadyFavorite = favorites.some((item) => item.imdbID === movie.imdbID);
    toggleFavorite(movie);
    pushToast(alreadyFavorite ? 'Removed from favorites' : 'Added to favorites', alreadyFavorite ? 'info' : 'success');
  };

  const handleRetry = () => {
    if (searchQuery) {
      search(searchQuery, currentType);
    }
  };

  useEffect(() => {
    const all = searchParams.get('all');
    if (all === 'true' && !searchQuery && !loading) {
      search(DEFAULT_HOME_QUERY, '');
    }
  }, [searchParams, searchQuery, loading, search]);

  useEffect(() => {
    if (!searchQuery && !loading) {
      search(DEFAULT_HOME_QUERY, '');
    }
  }, [searchQuery, loading, search]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Search Bar */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Discover Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Search millions of movies, series, and episodes
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <SearchBar 
            onSearch={handleSearch} 
            isLoading={loading}
            initialValue={searchQuery}
          />
          <button
            type="button"
            onClick={handleBrowseAll}
            className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3"
          >
            Browse All Movies
          </button>
        </div>
      </div>

      {/* Results Count */}
      {!loading && !error && movies.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-400" aria-live="polite">
            Showing <span className="text-primary-400 font-bold">{movies.length}</span> of <span className="text-primary-400 font-bold">{totalResults}</span> results for "{searchQuery || DEFAULT_HOME_QUERY}"
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && movies.length === 0 && (
        <LoadingSpinner size="lg" text="Searching movies..." />
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {/* Empty State - No search performed */}
      {!searchQuery && !loading && !error && movies.length === 0 && (
        <div className="text-center py-16 space-y-4 animate-fade-in">
          <Film className="w-24 h-24 mx-auto text-gray-700" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-300">
              Start Your Search
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter a movie title, series name, or keyword to discover amazing content
            </p>
          </div>
        </div>
      )}

      {/* Empty State - No results */}
      {searchQuery && !loading && !error && movies.length === 0 && (
        <div className="text-center py-16 space-y-4 animate-fade-in">
          <Film className="w-24 h-24 mx-auto text-gray-700" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-300">
              No Results Found
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any movies matching "{searchQuery}". Try a different search term or clear search to return to trending movies.
            </p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {movies.length > 0 && (
        <>
          <MovieGrid 
            movies={movies} 
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2"
                aria-label="Load more results"
              >
                <span>Load More</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && movies.length > 0 && (
            <LoadingSpinner text="Loading more results..." />
          )}
        </>
      )}
    </div>
  );
};
