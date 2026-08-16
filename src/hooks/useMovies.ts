import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { searchMovies } from '../api/omdb';
import type { Movie, MovieType } from '../types/movie';
import { DEBOUNCE_DELAY, SEARCH_HISTORY_KEY, MAX_SEARCH_HISTORY } from '../utils/constants';

interface UseMoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  page: number;
  totalResults: number;
  hasMore: boolean;
  searchHistory: string[];
}

export function useMovies() {
  const [state, setState] = useState<UseMoviesState>({
    movies: [],
    loading: false,
    error: null,
    searchQuery: '',
    page: 1,
    totalResults: 0,
    hasMore: false,
    searchHistory: [],
  });

  const debounceTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setState((prev) => ({ ...prev, searchHistory: parsed }));
        }
      }
    } catch {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(state.searchHistory));
    } catch {
      // Ignore write failures for history storage
    }
  }, [state.searchHistory]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const addSearchHistory = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setState((prev) => {
      const normalized = trimmed;
      const nextHistory = [normalized, ...prev.searchHistory.filter((item) => item.toLowerCase() !== normalized.toLowerCase())];
      return {
        ...prev,
        searchHistory: nextHistory.slice(0, MAX_SEARCH_HISTORY),
      };
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setState((prev) => ({ ...prev, searchHistory: [] }));
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  const search = useCallback(
    async (query: string, type: MovieType = '', pageNum: number = 1, append: boolean = false) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!query || query.trim().length === 0) {
        setState((prev) => ({
          ...prev,
          movies: [],
          loading: false,
          error: null,
          searchQuery: '',
          page: 1,
          totalResults: 0,
          hasMore: false,
        }));
        return;
      }

      const normalizedQuery = query.trim();
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        searchQuery: normalizedQuery,
      }));

      debounceTimerRef.current = window.setTimeout(async () => {
        try {
          const controller = new AbortController();
          abortControllerRef.current = controller;

          const response = await searchMovies(normalizedQuery, pageNum, type, controller.signal);
          const allMovies = response.Search || [];
          const newMovies = allMovies.filter((item) => item.Type === 'movie' || item.Type === 'series');
          const total = parseInt(response.totalResults, 10) || 0;
          const calculatedHasMore = pageNum * 10 < total;

          setState((prev) => ({
            movies: append ? [...prev.movies, ...newMovies] : newMovies,
            loading: false,
            error: null,
            searchQuery: query,
            page: pageNum,
            totalResults: total,
            hasMore: calculatedHasMore,
            searchHistory: prev.searchHistory,
          }));

          if (!append) {
            addSearchHistory(query);
          }
        } catch (err) {
          if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
            return;
          }

          const errorMessage = err instanceof Error ? err.message : 'An error occurred while searching';
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
            movies: append ? prev.movies : [],
          }));
        }
      }, DEBOUNCE_DELAY);
    },
    [addSearchHistory]
  );

  const loadMore = useCallback(
    async (type: MovieType = '') => {
      if (!state.searchQuery || state.loading || !state.hasMore) {
        return;
      }

      const nextPage = state.page + 1;
      await search(state.searchQuery, type, nextPage, true);
    },
    [state.searchQuery, state.loading, state.hasMore, state.page, search]
  );

  const reset = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState((prev) => ({
      ...prev,
      movies: [],
      loading: false,
      error: null,
      searchQuery: '',
      page: 1,
      totalResults: 0,
      hasMore: false,
    }));
  }, []);

  return {
    movies: state.movies,
    loading: state.loading,
    error: state.error,
    searchQuery: state.searchQuery,
    totalResults: state.totalResults,
    hasMore: state.hasMore,
    page: state.page,
    searchHistory: state.searchHistory,
    search,
    loadMore,
    reset,
    clearSearchHistory,
  };
}
