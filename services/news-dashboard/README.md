# Barami News Dashboard

A modern, responsive React dashboard for browsing and analyzing collected news articles from the Barami project.

## Features

- **Dashboard Overview**: View key statistics and trends at a glance
- **News Listing**: Browse all collected articles with advanced filtering
- **Article Details**: View full article content with extracted entities and metadata
- **Real-time Charts**: Visualize collection trends over time using Recharts
- **Advanced Search**: Filter by category, date range, and keywords
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Deployment**: Docker + Nginx

## Project Structure

```
news-dashboard/
├── src/
│   ├── api/              # API client functions
│   │   └── client.ts
│   ├── components/       # Reusable components
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   ├── NewsCard.tsx
│   │   ├── DailyChart.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── NewsList.tsx
│   │   └── NewsDetail.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── Dockerfile            # Production Docker image
├── nginx.conf            # Nginx configuration for SPA
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (optional):

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Development

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t barami-news-dashboard .
```

### Run Container

```bash
docker run -p 80:80 barami-news-dashboard
```

### Docker Compose

Add to your `docker-compose.yml`:

```yaml
services:
  dashboard:
    build: ./services/news-dashboard
    ports:
      - "3001:80"
    depends_on:
      - api
    networks:
      - barami-network
```

## API Integration

The dashboard expects the following API endpoints:

- `GET /api/news/stats` - Get overall statistics
- `GET /api/news/stats/daily?days=30` - Get daily statistics
- `GET /api/news/categories` - Get available categories
- `GET /api/news?page=1&size=20` - Get paginated news list
- `GET /api/news/:id` - Get single article details
- `GET /api/news/recent?limit=10` - Get recent articles

### API Response Types

See `src/types/index.ts` for detailed TypeScript interfaces.

## Configuration

### Vite Proxy

The development server proxies API requests to `http://localhost:8000`. Update `vite.config.ts` to change the target:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-api-server:8000',
      changeOrigin: true,
    },
  },
}
```

### Nginx Proxy

In production, Nginx proxies `/api` requests to the backend API service. Update `nginx.conf` to change the proxy target:

```nginx
location /api/ {
    proxy_pass http://api:8000/;
}
```

## Customization

### Colors

Update `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your color palette
      }
    }
  }
}
```

### API Base URL

Update `src/api/client.ts` to change the API base URL:

```typescript
const api = axios.create({
  baseURL: '/api',  // Change this
});
```

## Performance Optimizations

- Code splitting with dynamic imports
- Lazy loading of routes
- React Query caching with 5-minute stale time
- Gzip compression in production
- Static asset caching (1 year)
- Bundle size optimization with manual chunks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Part of the Barami project.

## Contributing

Please follow the existing code style and component patterns when contributing.
