import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  Users, 
  Film,
  ExternalLink,
  Globe,
  DollarSign
} from 'lucide-react';
import type { Movie } from '../../types/movie';
import { DEFAULT_POSTER } from '../../utils/constants';

interface MovieDetailProps {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export const MovieDetailComponent: React.FC<MovieDetailProps> = ({ 
  movie, 
  isFavorite, 
  onFavoriteToggle 
}) => {
  const [imageError, setImageError] = useState(false);

  const posterUrl = movie.Poster && movie.Poster !== 'N/A' && !imageError 
    ? movie.Poster 
    : DEFAULT_POSTER;

  const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ 
    icon, 
    label, 
    value 
  }) => {
    if (!value || value === 'N/A') return null;
    
    return (
      <div className="flex items-start gap-3">
        <div className="text-primary-400 mt-1">{icon}</div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-gray-100 font-medium">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <img
              src={posterUrl}
              alt={`${movie.Title} poster`}
              className="w-full aspect-[2/3] object-cover"
              onError={() => setImageError(true)}
            />
            <div className="p-4">
              <button
                onClick={onFavoriteToggle}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500'
                }`}
                aria-pressed={isFavorite}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Year */}
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {movie.Title}
            </h1>
            {movie.Year && (
              <p className="text-xl text-gray-400">{movie.Year}</p>
            )}
          </div>

          {/* Ratings */}
          {(movie.imdbRating || movie.Metascore || movie.Ratings) && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Ratings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <div className="text-center p-4 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">IMDb</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {movie.imdbRating}/10
                    </p>
                  </div>
                )}
                {movie.Metascore && movie.Metascore !== 'N/A' && (
                  <div className="text-center p-4 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Metascore</p>
                    <p className="text-2xl font-bold text-green-400">
                      {movie.Metascore}/100
                    </p>
                  </div>
                )}
                {movie.Ratings?.map((rating, index) => (
                  <div key={index} className="text-center p-4 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">{rating.Source}</p>
                    <p className="text-xl font-bold text-primary-400">
                      {rating.Value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plot */}
          {movie.Plot && movie.Plot !== 'N/A' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-3">Plot</h2>
              <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem 
                icon={<Film className="w-5 h-5" />}
                label="Type"
                value={movie.Type}
              />
              <InfoItem 
                icon={<Calendar className="w-5 h-5" />}
                label="Released"
                value={movie.Released}
              />
              <InfoItem 
                icon={<Clock className="w-5 h-5" />}
                label="Runtime"
                value={movie.Runtime}
              />
              <InfoItem 
                icon={<Film className="w-5 h-5" />}
                label="Genre"
                value={movie.Genre}
              />
              <InfoItem 
                icon={<Users className="w-5 h-5" />}
                label="Director"
                value={movie.Director}
              />
              <InfoItem 
                icon={<Users className="w-5 h-5" />}
                label="Writers"
                value={movie.Writer}
              />
              <InfoItem 
                icon={<Users className="w-5 h-5" />}
                label="Actors"
                value={movie.Actors}
              />
              <InfoItem 
                icon={<Globe className="w-5 h-5" />}
                label="Language"
                value={movie.Language}
              />
              <InfoItem 
                icon={<Globe className="w-5 h-5" />}
                label="Country"
                value={movie.Country}
              />
              <InfoItem 
                icon={<DollarSign className="w-5 h-5" />}
                label="Box Office"
                value={movie.BoxOffice}
              />
              <InfoItem 
                icon={<Film className="w-5 h-5" />}
                label="Production"
                value={movie.Production}
              />
            </div>
          </div>

          {/* Awards */}
          {movie.Awards && movie.Awards !== 'N/A' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Awards
              </h2>
              <p className="text-gray-300">{movie.Awards}</p>
            </div>
          )}

          {/* IMDb Link */}
          {movie.imdbID && (
            <div>
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-primary"
              >
                View on IMDb
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
