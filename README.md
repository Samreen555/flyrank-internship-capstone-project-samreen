# MovieSearch - React Movie Search Application

A modern, feature-rich movie search application built with React, TypeScript, Vite, and Tailwind CSS. Search millions of movies, TV series, and episodes using the OMDb API.

## Features

✅ **Search Functionality**
- Real-time movie search with debouncing
- Filter by type (movies, series, episodes)
- Pagination with load more functionality
- Search results count

✅ **Movie Details**
- Comprehensive movie information
- Ratings from multiple sources (IMDb, Rotten Tomatoes, Metacritic)
- Full plot, cast, director, and awards
- Direct links to IMDb

✅ **Favorites Management**
- Add/remove movies to favorites
- Persistent storage using localStorage
- Sort favorites by title, year, or type
- Favorites counter in header

✅ **User Experience**
- Dark theme with gradient accents
- Fully responsive design (mobile-first)
- Loading states and skeletons
- Error handling with retry
- Smooth animations and transitions
- Keyboard shortcuts (/ to focus search, Esc to clear)
- Lazy loading images with fallbacks
- Accessible (ARIA labels, keyboard navigation)

✅ **Performance**
- React lazy loading for routes
- API response caching
- Debounced search queries
- Optimized re-renders with React.memo

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **OMDb API** - Movie database

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd movie-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## API Configuration

The application uses the OMDb API with the following configuration:

- **API Key**: 271d25e3
- **Base URL**: http://www.omdbapi.com/
- **Rate Limit**: 1000 requests per day

**Note**: For production use, please obtain your own API key from [OMDb API](http://www.omdbapi.com/apikey.aspx).

## Project Structure

```
movie-search-app/
├── src/
│   ├── api/
│   │   └── omdb.ts              # API service layer
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx       # App header with navigation
│   │   │   ├── Footer.tsx       # App footer
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── movie/
│   │   │   ├── MovieCard.tsx    # Movie card component
│   │   │   ├── MovieGrid.tsx    # Grid layout for movies
│   │   │   └── MovieDetail.tsx  # Detailed movie view
│   │   └── search/
│   │       └── SearchBar.tsx    # Search input with filters
│   ├── hooks/
│   │   ├── useMovies.ts         # Movie search logic
│   │   └── useFavorites.ts      # Favorites management
│   ├── pages/
│   │   ├── Search.tsx           # Home/search page
│   │   ├── MovieDetailPage.tsx  # Movie details page
│   │   ├── Favorites.tsx        # Favorites list page
│   │   └── NotFound.tsx         # 404 page
│   ├── types/
│   │   └── movie.ts             # TypeScript types
│   ├── utils/
│   │   └── constants.ts         # App constants
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── index.html                   # HTML template
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── package.json                 # Dependencies
```

## Key Features Implementation

### Custom Hooks

**useMovies**
- Manages movie search state
- Implements debouncing (500ms)
- Handles pagination
- Error handling

**useFavorites**
- LocalStorage persistence
- Add/remove/toggle favorites
- Check if movie is favorite
- Clear all favorites

### API Service

- Axios instance with base configuration
- Response caching (5 minutes TTL)
- Comprehensive error handling
- Network timeout handling

### Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Semantic HTML

### Performance Optimizations

- Route-based code splitting
- Image lazy loading
- Memoized components (React.memo)
- Debounced API calls
- API response caching

## Keyboard Shortcuts

- `/` - Focus search input
- `Esc` - Clear search (when focused)
- `Enter` - Submit search
- `Tab` - Navigate between elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

- OMDb API free tier limited to 1000 requests/day
- Some movies may not have poster images
- Search limited to 10 results per page (API limitation)

## Future Enhancements

- Advanced filtering (genre, year range, rating)
- User accounts and cloud sync
- Watchlist separate from favorites
- Movie recommendations
- Share favorites via URL
- Export favorites list

## License

MIT License - feel free to use this project for learning or personal use.

## Credits

- Movie data powered by [OMDb API](http://www.omdbapi.com/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

## Support

For issues or questions, please check the OMDb API documentation or review the code comments.
