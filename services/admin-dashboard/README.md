# Barami Admin Dashboard

A modern, dark-themed admin dashboard for the Barami News Intelligence System built with React, TypeScript, and TailwindCSS.

## Features

- **System Overview**: Real-time system status, service health checks, and resource usage monitoring
- **Grafana Integration**: Embedded Grafana dashboards with dashboard selector and time range picker
- **Metrics Viewer**: Prometheus metrics display with direct access to Prometheus UI
- **Service Management**: View and control running services (start, stop, restart)
- **Log Viewer**: Real-time log streaming with filtering by service and log level

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Deployment**: Docker + Nginx

## Prerequisites

- Node.js 20+
- npm or yarn
- Docker (for containerized deployment)

## Development

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Docker Deployment

### Build Docker image

```bash
docker build -t barami-admin-dashboard .
```

### Run container

```bash
docker run -p 80:80 barami-admin-dashboard
```

## Environment Configuration

The dashboard expects the following services to be available:

- **API Server**: `/api` - Backend API endpoints
- **Grafana**: `/grafana` - Grafana dashboards
- **Prometheus**: `/prometheus` - Metrics collection

These are configured as proxy rules in `vite.config.ts` (dev) and `nginx.conf` (production).

## API Endpoints

The dashboard communicates with the following backend endpoints:

- `GET /api/admin/status` - System status and health checks
- `GET /api/admin/services` - List of services
- `POST /api/admin/services/:id/start` - Start a service
- `POST /api/admin/services/:id/stop` - Stop a service
- `POST /api/admin/services/:id/restart` - Restart a service
- `GET /api/admin/logs` - Retrieve logs
- `GET /api/admin/metrics` - Get metrics data
- `GET /api/admin/grafana/dashboards` - List Grafana dashboards

## Project Structure

```
admin-dashboard/
├── src/
│   ├── api/           # API client and HTTP functions
│   ├── components/    # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main app component with routing
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── public/            # Static assets
├── Dockerfile         # Docker configuration
├── nginx.conf         # Nginx configuration for production
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # TailwindCSS configuration
└── package.json       # Dependencies and scripts
```

## Features in Detail

### Overview Page (`/admin`)

- System health indicator (Healthy/Degraded/Down)
- Service status cards for API, Database, OpenSearch, etc.
- Resource usage bars for CPU, Memory, and Disk
- Quick links to other admin pages

### Grafana View (`/admin/grafana`)

- Dashboard selector dropdown
- Time range picker
- Embedded Grafana iframe with auto-refresh
- Kiosk mode for clean presentation

### Metrics (`/admin/metrics`)

- Key metrics display cards
- Toggle between metrics view and Prometheus UI
- Real-time metric updates
- Metric categorization (Application/System)

### Services (`/admin/services`)

- Service listing grouped by type
- Status indicators (Running/Stopped/Restarting)
- Service controls (Start/Stop/Restart)
- Service metadata (port, version, replicas)

### Logs (`/admin/logs`)

- Real-time log streaming
- Filter by service and log level
- Adjustable log limit
- Auto-scroll toggle
- Export logs to file
- Log statistics (Total, Errors, Warnings, Info)

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize the dark theme colors:

```javascript
colors: {
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    hover: '#475569',
  },
  primary: {
    // ... primary color shades
  },
}
```

### API Base URL

Modify the API base URL in `src/api/client.ts`:

```typescript
const apiClient = axios.create({
  baseURL: '/api',
  // ...
});
```

## License

Part of the Barami News Intelligence System
