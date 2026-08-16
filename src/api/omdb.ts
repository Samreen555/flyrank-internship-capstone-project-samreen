import axios, { AxiosError } from 'axios';
import { API_KEY, FALLBACK_API_KEY, API_BASE_URL } from '../utils/constants';
import type { SearchResponse, MovieDetailsResponse, Movie } from '../types/movie';

const REQUEST_COUNTER_KEY = 'movieApp_requestCounter';
const MAX_REQUESTS_PER_DAY = 1000;

const omdbApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

async function sendOmdbRequest<T>(params: Record<string, string | number>, signal?: AbortSignal, apiKey: string = API_KEY): Promise<T> {
  const response = await omdbApi.get<T>('', {
    params: {
      ...params,
      apikey: apiKey,
    },
    signal,
  });
  return response.data;
}

function isOmdbErrorResponse(response: unknown): response is { Response?: string; Error?: string } {
  return (
    typeof response === 'object' &&
    response !== null &&
    'Response' in response &&
    'Error' in response
  );
}

async function requestOmdb<T>(params: Record<string, string | number>, signal?: AbortSignal): Promise<T> {
  const attemptRequest = async (apiKey: string) => sendOmdbRequest<T>(params, signal, apiKey);

  try {
    const response = await attemptRequest(API_KEY);

    if (
      isOmdbErrorResponse(response) &&
      response.Response === 'False' &&
      response.Error?.toLowerCase().includes('invalid api key') &&
      FALLBACK_API_KEY &&
      FALLBACK_API_KEY !== API_KEY
    ) {
      return await attemptRequest(FALLBACK_API_KEY);
    }

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ Error?: string }>;
      const apiError = axiosError.response?.data?.Error;

      if (apiError?.toLowerCase().includes('invalid api key') && FALLBACK_API_KEY && FALLBACK_API_KEY !== API_KEY) {
        return await attemptRequest(FALLBACK_API_KEY);
      }
    }

    throw error;
  }
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000;

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

interface RequestCounter {
  count: number;
  updatedAt: string;
}

function getRequestCounter(): RequestCounter {
  if (typeof window === 'undefined') {
    return { count: 0, updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(REQUEST_COUNTER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RequestCounter;
      const today = new Date().toISOString().split('T')[0];
      if (parsed.updatedAt.split('T')[0] === today) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed storage value
  }

  return { count: 0, updatedAt: new Date().toISOString() };
}

function incrementRequestCounter(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const current = getRequestCounter();
  const next = {
    count: current.count + 1,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(REQUEST_COUNTER_KEY, JSON.stringify(next));
}

function assertRequestAllowed(): void {
  const counter = getRequestCounter();
  if (counter.count >= MAX_REQUESTS_PER_DAY) {
    throw new Error('Daily request limit reached. Please try again tomorrow.');
  }
}

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ Error?: string }>;
    const message = axiosError.response?.data?.Error;

    if (message) {
      throw new Error(message);
    }

    if (axiosError.code === 'ERR_CANCELED') {
      throw new Error('Request canceled.');
    }

    if (axiosError.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }

    if (!axiosError.response) {
      throw new Error('Network error. Please check your connection.');
    }

    throw new Error('An unexpected error occurred. Please try again.');
  }

  throw error;
}

export async function searchMovies(
  query: string,
  page: number = 1,
  type?: string,
  signal?: AbortSignal
): Promise<SearchResponse> {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  assertRequestAllowed();

  const trimmedQuery = query.trim();
  const cacheKey = `search_${trimmedQuery}_${page}_${type || 'all'}`;
  const cached = getCachedData<SearchResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const params: Record<string, string | number> = {
      s: trimmedQuery,
      page,
    };

    if (type && type !== '') {
      params.type = type;
    }

    const response = await requestOmdb<SearchResponse>(params, signal);

    if (response.Response === 'False') {
      throw new Error(response.Error || 'No results found');
    }

    incrementRequestCounter();
    setCachedData(cacheKey, response);
    return response;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getMovieDetails(imdbID: string, signal?: AbortSignal): Promise<Movie> {
  if (!imdbID) {
    throw new Error('IMDb ID is required');
  }

  const cacheKey = `details_${imdbID}`;
  const cached = getCachedData<Movie>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await requestOmdb<MovieDetailsResponse>(
      {
        i: imdbID,
        plot: 'full',
      },
      signal
    );

    if (response.Response === 'False') {
      throw new Error(response.Error || 'Movie not found');
    }

    incrementRequestCounter();
    const movieData: Movie = {
      imdbID: response.imdbID,
      Title: response.Title,
      Year: response.Year,
      Type: response.Type,
      Poster: response.Poster,
      imdbRating: response.imdbRating,
      Plot: response.Plot,
      Genre: response.Genre,
      Director: response.Director,
      Actors: response.Actors,
      Runtime: response.Runtime,
      Awards: response.Awards,
      Ratings: response.Ratings,
      Country: response.Country,
      Language: response.Language,
      Released: response.Released,
      Writer: response.Writer,
      BoxOffice: response.BoxOffice,
      Production: response.Production,
      Website: response.Website,
      Metascore: response.Metascore,
    };

    setCachedData(cacheKey, movieData);
    return movieData;
  } catch (error) {
    handleApiError(error);
  }
}

export function clearCache(): void {
  cache.clear();
}
