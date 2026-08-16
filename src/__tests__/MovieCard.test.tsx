import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from './../components/movie/MovieCard';
import { BrowserRouter } from 'react-router-dom';

const mockMovie = {
  imdbID: 'tt1234567',
  Title: 'Test Movie',
  Year: '2023',
  Type: 'movie',
  Poster: 'https://example.com/poster.jpg',
};

describe('MovieCard', () => {
  it('renders movie title and year', () => {
    render(
      <BrowserRouter>
        <MovieCard
          movie={mockMovie}
          onClick={() => {}}
          isFavorite={false}
          onFavoriteToggle={() => {}}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('shows favorite button with correct state', () => {
    render(
      <BrowserRouter>
        <MovieCard
          movie={mockMovie}
          onClick={() => {}}
          isFavorite={true}
          onFavoriteToggle={() => {}}
        />
      </BrowserRouter>
    );

    const favButton = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <BrowserRouter>
        <MovieCard
          movie={mockMovie}
          onClick={handleClick}
          isFavorite={false}
          onFavoriteToggle={() => {}}
        />
      </BrowserRouter>
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledWith(mockMovie);
  });

  it('handles image loading error gracefully', () => {
    render(
      <BrowserRouter>
        <MovieCard
          movie={{ ...mockMovie, Poster: '' }}
          onClick={() => {}}
          isFavorite={false}
          onFavoriteToggle={() => {}}
        />
      </BrowserRouter>
    );

    const img = screen.getByAltText('Test Movie poster');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', expect.stringContaining('No Poster'));
  });
});