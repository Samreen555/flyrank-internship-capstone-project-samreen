import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from './MovieCard';
import type { Movie } from '../../types/movie';

interface MovieGridProps {
  movies: Movie[];
  favorites: Movie[];
  onFavoriteToggle: (movie: Movie) => void;
  isLoading?: boolean;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-[2/3] bg-gray-700" />
    <div className="p-4 space-y-2">
      <div className="h-6 bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

export const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  favorites, 
  onFavoriteToggle,
  isLoading = false 
}) => {
  const navigate = useNavigate();

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.imdbID}`);
  };

  const handleFavoriteToggle = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    onFavoriteToggle(movie);
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  };

  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        aria-busy="true"
        aria-label="Loading movies"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      role="list"
      aria-label="Movie search results"
    >
      {movies.map((movie) => (
        <div key={movie.imdbID} role="listitem">
          <MovieCard
            movie={movie}
            onClick={handleMovieClick}
            isFavorite={isFavorite(movie.imdbID)}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      ))}
    </div>
  );
};
