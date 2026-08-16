import React, { memo, useState } from 'react';
import { Heart, Calendar, Film } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { DEFAULT_POSTER } from '../../utils/constants';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  isFavorite: boolean;
  onFavoriteToggle: (e: React.MouseEvent, movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = memo(({ 
  movie, 
  onClick, 
  isFavorite, 
  onFavoriteToggle 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' && !imageError 
    ? movie.Poster 
    : DEFAULT_POSTER;

  const handleCardClick = () => {
    onClick(movie);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(e, movie);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(movie);
    }
  };

  return (
    <div
      className="card group cursor-pointer animate-fade-in"
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.Title} (${movie.Year})`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={posterUrl}
          alt={`${movie.Title} poster`}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Overlay with favorite button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isFavorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-900/80 text-white hover:bg-gray-800'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary-400 transition-colors duration-200">
          {movie.Title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{movie.Year}</span>
          </div>
          <div className="flex items-center gap-1 capitalize">
            <Film className="w-4 h-4" aria-hidden="true" />
            <span>{movie.Type}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';
