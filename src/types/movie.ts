export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  imdbRating?: string;
  Plot?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  Awards?: string;
  Ratings?: Rating[];
  Country?: string;
  Language?: string;
  Released?: string;
  Writer?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Metascore?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface SearchResponse {
  Search?: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieDetailsResponse extends Movie {
  Response: string;
  Error?: string;
}

export type MovieType = 'movie' | 'series' | 'episode' | '';
export type SortOption = 'title' | 'year' | 'type';
