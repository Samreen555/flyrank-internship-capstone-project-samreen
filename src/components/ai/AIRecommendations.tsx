import React, { useState } from 'react';
import { Sparkles, Loader2, Film, X, ThumbsUp } from 'lucide-react';
import { getAIRecommendations, getFallbackRecommendations } from '../../api/claude';
import { useNavigate } from 'react-router-dom';

interface AIRecommendationsProps {
  onMovieSelect?: (imdbId: string) => void;
}

interface Recommendation {
  title: string;
  year: string;
  reason: string;
  imdbId?: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  onMovieSelect,
}) => {
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleGetRecommendations = async () => {
    if (!mood.trim()) {
      setError("Please describe what you're in the mood for");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getAIRecommendations({
        mood: mood.trim(),
        genre: genre || undefined,
      });
      setRecommendations(result);
    } catch (err) {
      console.warn('AI API error, using fallback:', err);
      // Use fallback recommendations
      const fallback = getFallbackRecommendations(mood);
      setRecommendations(fallback);
      setError('Using offline recommendations (AI service unavailable)');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleGetRecommendations();
    }
  };

  const handleMovieClick = (recommendation: Recommendation) => {
    if (recommendation.imdbId) {
      navigate(`/movie/${recommendation.imdbId}`);
      if (onMovieSelect) {
        onMovieSelect(recommendation.imdbId);
      }
    }
  };

  const moodSuggestions = [
    'Happy and uplifting',
    'Dark and suspenseful',
    'Romantic and warm',
    'Action-packed and thrilling',
    'Thought-provoking and deep',
    'Scary and intense',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Movie Recommendations</h2>
            <p className="text-gray-400 text-sm">
              Tell us what you're in the mood for and get personalized suggestions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="mood-input" className="block text-sm font-medium text-gray-300 mb-1">
                What are you in the mood for?
              </label>
              <input
                id="mood-input"
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                onKeyPress={handleMoodKeyPress}
                placeholder="e.g., 'Something funny and lighthearted' or 'A dark thriller'"
                className="input w-full"
                disabled={loading}
                aria-label="Describe your mood"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary self-end h-[42px] px-4"
              aria-expanded={showFilters}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-700">
              <div>
                <label htmlFor="genre-select" className="block text-sm font-medium text-gray-300 mb-1">
                  Genre (optional)
                </label>
                <select
                  id="genre-select"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="input w-full"
                  disabled={loading}
                >
                  <option value="">Any genre</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setMood('');
                    setGenre('');
                    setRecommendations([]);
                    setError(null);
                  }}
                  className="btn-secondary w-full"
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-2 inline" />
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Quick moods:</span>
            {moodSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setMood(suggestion)}
                className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors duration-200"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <button
            onClick={() => void handleGetRecommendations()}
            disabled={loading || !mood.trim()}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get Recommendations
              </>
            )}
          </button>

          {error && (
            <div className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-green-400" />
            Recommended for You
            <span className="text-sm font-normal text-gray-400">
              ({recommendations.length} suggestions)
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <div
                key={`${rec.title}-${index}`}
                className="card p-4 hover:border-primary-500 transition-all duration-200 cursor-pointer group"
                onClick={() => handleMovieClick(rec)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMovieClick(rec);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${rec.title}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors truncate">
                      {rec.title}
                    </h4>
                    <p className="text-sm text-gray-400">{rec.year}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {rec.reason}
                    </p>
                    {rec.imdbId && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary-400">
                        <Film className="w-3 h-3" />
                        <span>View Details</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};