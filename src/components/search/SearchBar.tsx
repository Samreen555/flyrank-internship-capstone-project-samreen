import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { MovieType } from '../../types/movie';

interface SearchBarProps {
  onSearch: (query: string, type: MovieType) => void;
  isLoading?: boolean;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading = false,
  initialValue = '' 
}) => {
  const [query, setQuery] = useState(initialValue);
  const [type, setType] = useState<MovieType>('');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), type);
    }
  };

  const handleClear = () => {
    setQuery('');
    setType('');
    inputRef.current?.focus();
    onSearch('', '');
  };

  const handleTypeChange = (newType: MovieType) => {
    setType(newType);
    if (query.trim()) {
      onSearch(query.trim(), newType);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/' key
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Clear on Escape
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies or series... (press / to focus)"
            className="w-full px-4 py-2 pl-12 pr-24 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
            aria-label="Search movies"
            aria-describedby="search-instructions"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Clear search"
                disabled={isLoading}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                showFilters || type ? 'text-primary-400 hover:text-primary-300' : 'text-gray-400 hover:text-gray-200'
              }`}
              aria-label="Toggle filters"
              aria-expanded={showFilters}
            >
              <Filter className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <span id="search-instructions" className="sr-only">
          Press Enter to search, Escape to clear, or / to focus search box
        </span>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in">
          <span className="text-sm text-gray-400 font-medium mr-2">Filter by type:</span>
          {[
            { value: '', label: 'All' },
            { value: 'movie', label: 'Movies' },
            { value: 'series', label: 'Series' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleTypeChange(option.value as MovieType)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                type === option.value
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-pressed={type === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
