import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../../hooks/useFavorites';
import { FAVORITES_STORAGE_KEY } from '../../utils/constants';

const mockMovie = {
  imdbID: 'tt1234567',
  Title: 'Test Movie',
  Year: '2023',
  Type: 'movie',
  Poster: 'https://example.com/poster.jpg',
};

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes with empty favorites', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    expect(result.current.favorites).toEqual([]);
  });

  it('adds a movie to favorites', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      result.current.addFavorite(mockMovie);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toEqual(mockMovie);
  });

  it('removes a movie from favorites', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      result.current.addFavorite(mockMovie);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.removeFavorite('tt1234567');
    });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('toggles favorites correctly', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.isFavorite('tt1234567')).toBe(true);

    act(() => {
      result.current.toggleFavorite(mockMovie);
    });

    expect(result.current.isFavorite('tt1234567')).toBe(false);
  });

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    act(() => {
      result.current.addFavorite(mockMovie);
    });

    const stored = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].imdbID).toBe('tt1234567');
  });
});