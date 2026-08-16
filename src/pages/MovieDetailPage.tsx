import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getMovieDetails } from '../api/omdb';
import { useFavorites } from '../hooks/useFavorites';
import { MovieDetailComponent } from '../components/movie/MovieDetail';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import type { Movie } from '../types/movie';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError('No movie ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load movie details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    if (id) {
      setLoading(true);
      setError(null);
      getMovieDetails(id)
        .then(setMovie)
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load movie details';
          setError(errorMessage);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleFavoriteToggle = () => {
    if (movie) {
      toggleFavorite(movie);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Loading movie details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-800 text-gray-100 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-800 text-gray-100 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <ErrorMessage message="Movie not found" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="px-4 py-2 bg-gray-800 text-gray-100 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 mb-6 flex items-center gap-2"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <MovieDetailComponent
        movie={movie}
        isFavorite={isFavorite(movie.imdbID)}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
};
