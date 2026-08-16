import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { SearchBar } from '../components/search/SearchBar';
import { MovieGrid } from '../components/movie/MovieGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useMovies } from '../hooks/useMovies';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import type { Movie, MovieType } from '../types/movie';
import { DEFAULT_HOME_QUERY } from '../utils/constants';
import { AIRecommendations } from '../components/ai/AIRecommendations';

export const Home: React.FC = () => {
  const navigate = useNavigate(); // ✅ ADD THIS
  const {
    movies,
    loading,
    error,
    searchQuery,
    totalResults,
    hasMore,
    search,
    loadMore,
    reset,
  } = useMovies();
  const { favorites, toggleFavorite } = useFavorites();
  const { pushToast } = useToast();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      search(DEFAULT_HOME_QUERY);
      setStarted(true);
    }
  }, [started, search]);

  const handleSearch = (query: string, type: MovieType) => {
    if (query.trim().length > 0) {
      search(query, type);
    } else {
      reset();
    }
  };

  const handleFavoriteToggle = (movie: Movie) => {
    const alreadyFavorite = favorites.some((item) => item.imdbID === movie.imdbID);
    toggleFavorite(movie);
    pushToast(
      alreadyFavorite ? 'Removed from favorites' : 'Added to favorites',
      alreadyFavorite ? 'info' : 'success'
    );
  };

  const handleRetry = () => {
    if (searchQuery.trim().length > 0) {
      search(searchQuery);
    } else {
      search(DEFAULT_HOME_QUERY);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Search Bar - Only once! */}
      <div className="max-w-4xl mx-auto">
        <SearchBar 
          onSearch={handleSearch} 
          isLoading={loading} 
          initialValue={searchQuery} 
        />
      </div>

      {error ? (
        <ErrorMessage message={error} onRetry={handleRetry} />
      ) : loading && movies.length === 0 ? (
        <LoadingSpinner size="lg" text="Loading featured movies..." />
      ) : movies.length > 0 ? (
        <>
          <section className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary-300">
                  {searchQuery === DEFAULT_HOME_QUERY ? 'Trending Movies' : 'Search Results'}
                </p>
                <h2 className="text-3xl font-semibold text-white">
                  {searchQuery === DEFAULT_HOME_QUERY 
                    ? 'Top picks for you' 
                    : `Results for "${searchQuery}"`}
                </h2>
              </div>
              <p className="text-sm text-gray-400">
                Showing {movies.length} of {totalResults} movies
              </p>
            </div>

            <MovieGrid 
              movies={movies} 
              favorites={favorites} 
              onFavoriteToggle={handleFavoriteToggle} 
              isLoading={loading} 
            />

            {hasMore && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => loadMore()}
                  className="btn-primary px-8 py-3"
                >
                  Load More
                </button>
              </div>
            )}
          </section>

          {/* AI Recommendations Section */}
          <section className="max-w-4xl mx-auto">
            <AIRecommendations 
              onMovieSelect={(imdbId) => navigate(`/movie/${imdbId}`)}
              onAddToFavorites={handleFavoriteToggle}
            />
          </section>
        </>
      ) : null}
    </div>
  );
};