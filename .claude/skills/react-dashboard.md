# React Dashboard Development Skill

## Projects
1. News Dashboard: `/home/mare/Barami/services/news-dashboard/`
2. Admin Dashboard: `/home/mare/Barami/services/admin-dashboard/`

## Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Query (@tanstack/react-query)
- React Router v6
- Recharts (charts)
- Axios (HTTP client)
- Lucide React (icons)

## Project Structure
```
services/news-dashboard/          # or admin-dashboard
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Routes
│   ├── index.css                 # Global styles
│   ├── api/
│   │   └── client.ts             # API client
│   ├── components/               # Reusable components
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   ├── NewsCard.tsx
│   │   └── ...
│   ├── pages/                    # Page components
│   │   ├── Home.tsx
│   │   ├── NewsList.tsx
│   │   └── ...
│   └── types/
│       └── index.ts              # TypeScript types
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── Dockerfile
└── nginx.conf
```

## Common Commands
```bash
cd services/news-dashboard  # or admin-dashboard

# Install dependencies
npm install

# Development server
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## News Dashboard Pages
- `/` - Home (stats, chart, recent news)
- `/news` - News list with pagination & filters
- `/news/:id` - News detail

## Admin Dashboard Pages
- `/admin` - Overview (health, resources)
- `/admin/grafana` - Grafana embed
- `/admin/metrics` - Prometheus metrics
- `/admin/services` - Service management
- `/admin/logs` - Log viewer

## TailwindCSS Theme
```js
// News Dashboard: Light theme (default)
// Admin Dashboard: Dark theme
colors: {
  'dark-bg': '#0f172a',
  'dark-surface': '#1e293b',
  'dark-border': '#334155',
}
```

## API Client Pattern
```typescript
// src/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const newsApi = {
  getNews: (params) => api.get('/news', { params }),
  getNewsById: (id) => api.get(`/news/${id}`),
  searchNews: (q) => api.get('/news/search', { params: { q } }),
  getStats: () => api.get('/stats'),
  getDailyStats: () => api.get('/stats/daily'),
};
```

## React Query Usage
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['news', page],
  queryFn: () => newsApi.getNews({ page, limit: 10 }),
});
```

## Docker Build
```bash
# Build image
docker build -t barami-news-dashboard .

# Run container
docker run -p 3001:80 barami-news-dashboard
```

## When modifying:
1. Run `npm run lint` after changes
2. Check types with `npx tsc --noEmit`
3. Test in dev mode: `npm run dev`
4. Build before Docker: `npm run build`
