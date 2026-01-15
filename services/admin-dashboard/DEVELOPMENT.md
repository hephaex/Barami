# Development Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Development with Mock Data

For development without backend services, you can use mock data:

1. Create a `.env.local` file:

```bash
VITE_USE_MOCK_DATA=true
```

2. Modify `src/api/client.ts` to return mock data when the flag is set

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/              # API client and data fetching
│   ├── client.ts     # Axios client with API methods
│   └── mockData.ts   # Mock data for development
│
├── components/       # Reusable components
│   ├── AdminSidebar.tsx
│   ├── ServiceStatusCard.tsx
│   ├── ResourceUsageBar.tsx
│   ├── GrafanaEmbed.tsx
│   ├── LogViewer.tsx
│   └── index.ts
│
├── hooks/            # Custom React hooks
│   └── useSystemStatus.ts  # React Query hooks
│
├── pages/            # Page components (routes)
│   ├── Overview.tsx
│   ├── GrafanaView.tsx
│   ├── Metrics.tsx
│   ├── Services.tsx
│   ├── Logs.tsx
│   └── index.ts
│
├── types/            # TypeScript type definitions
│   └── index.ts
│
├── App.tsx           # Main app with routing
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Adding a New Page

1. Create page component in `src/pages/`:

```tsx
// src/pages/MyNewPage.tsx
export const MyNewPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">My New Page</h1>
      {/* Page content */}
    </div>
  );
};
```

2. Export from `src/pages/index.ts`:

```tsx
export { MyNewPage } from './MyNewPage';
```

3. Add route in `src/App.tsx`:

```tsx
import { MyNewPage } from '@/pages';

// In Routes component:
<Route path="/admin/my-new-page" element={<MyNewPage />} />
```

4. Add navigation link in `src/components/AdminSidebar.tsx`:

```tsx
{
  to: '/admin/my-new-page',
  icon: YourIcon,
  label: 'My New Page',
}
```

## Adding a New Component

1. Create component in `src/components/`:

```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
      <h3 className="text-white font-semibold">{title}</h3>
    </div>
  );
};
```

2. Export from `src/components/index.ts`:

```tsx
export { MyComponent } from './MyComponent';
```

## Working with API

### Adding a New API Endpoint

1. Define types in `src/types/index.ts`:

```tsx
export interface MyData {
  id: string;
  name: string;
}
```

2. Add API method in `src/api/client.ts`:

```tsx
export const api = {
  // ... existing methods

  getMyData: async (): Promise<MyData[]> => {
    const { data } = await apiClient.get<MyData[]>('/admin/my-data');
    return data;
  },
};
```

3. Create React Query hook in `src/hooks/`:

```tsx
// src/hooks/useMyData.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

export const useMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: api.getMyData,
    refetchInterval: 10000, // 10 seconds
  });
};
```

4. Use in component:

```tsx
import { useMyData } from '@/hooks/useMyData';

export const MyComponent = () => {
  const { data, isLoading } = useMyData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## Styling Guidelines

### Using Tailwind Classes

```tsx
// Background colors
className="bg-dark-bg"        // Main background
className="bg-dark-surface"   // Card/surface background
className="bg-dark-hover"     // Hover state

// Borders
className="border border-dark-border"
className="hover:border-primary-600"

// Text colors
className="text-white"        // Primary text
className="text-gray-400"     // Secondary text
className="text-primary-500"  // Accent text

// Common patterns
className="bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-primary-600 transition-colors"
```

### Pre-built CSS Classes

```tsx
// Buttons
className="btn-primary"
className="btn-secondary"

// Cards
className="card"

// Inputs
className="input"
```

## Common Patterns

### Loading State

```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
```

### Error State

```tsx
if (error) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
      <p className="text-red-200">Error: {error.message}</p>
    </div>
  );
}
```

### Empty State

```tsx
if (!data || data.length === 0) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
      <Icon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400">No data available</p>
    </div>
  );
}
```

## Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] API calls are made correctly
- [ ] Loading states display properly
- [ ] Error states are handled
- [ ] Responsive design works on mobile
- [ ] Dark theme is consistent
- [ ] Auto-refresh works for real-time data

## Building for Production

```bash
# Build
npm run build

# Preview locally
npm run preview

# Build Docker image
docker build -t barami-admin-dashboard .

# Run Docker container
docker run -p 80:80 barami-admin-dashboard
```

## Troubleshooting

### Port already in use

If port 3000 is already in use, modify `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change to available port
}
```

### API proxy not working

Check that proxy configuration in `vite.config.ts` matches your backend URLs:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

### Build errors

Clear cache and reinstall:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Best Practices

1. **Component Organization**: Keep components small and focused
2. **Type Safety**: Always define TypeScript interfaces for data
3. **Error Handling**: Always handle loading and error states
4. **Accessibility**: Use semantic HTML and ARIA labels
5. **Performance**: Use React Query for caching and deduplication
6. **Consistency**: Follow existing patterns and naming conventions
