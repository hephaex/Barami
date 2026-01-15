# Barami - News Aggregation Dashboard Platform

뉴스 수집 현황 대시보드 및 모니터링 플랫폼

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Nginx (Reverse Proxy)                            │
│                              Port: 8800                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  /                │  /admin           │  /api/*          │ /grafana     │
│  ▼                │  ▼                │  ▼               │ ▼            │
│ ┌────────────┐   │ ┌──────────────┐  │ ┌─────────────┐ │ ┌──────────┐ │
│ │   News     │   │ │    Admin     │  │ │  News API   │ │ │ Grafana  │ │
│ │ Dashboard  │   │ │  Dashboard   │  │ │   (Axum)    │ │ │  :3000   │ │
│ │  (React)   │   │ │   (React)    │  │ │   :8080     │ │ └──────────┘ │
│ │   :3001    │   │ │    :3002     │  │ └──────┬──────┘ │              │
│ └────────────┘   │ └──────────────┘  │        │        │ ┌──────────┐ │
│                  │                    │        ▼        │ │Prometheus│ │
│                  │                    │ ┌──────────────┐│ │  :9090   │ │
│                  │                    │ │  PostgreSQL  ││ └──────────┘ │
│                  │                    │ │    :5432     ││              │
│                  │                    │ └──────────────┘│              │
│                  │                    │        │        │              │
│                  │                    │        ▼        │              │
│                  │                    │ ┌──────────────┐│              │
│                  │                    │ │  OpenSearch  ││              │
│                  │                    │ │    :9200     ││              │
│                  │                    │ └──────────────┘│              │
└─────────────────────────────────────────────────────────────────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Nginx | 8800 | Reverse proxy & load balancer |
| News API | 8080 | REST API (Rust/Axum) |
| News Dashboard | 3001 | News viewing frontend (React) |
| Admin Dashboard | 3002 | Monitoring & management (React) |
| PostgreSQL | 5432 | Primary database |
| OpenSearch | 9200 | Full-text search engine |
| Grafana | 3000 | Metrics visualization |
| Prometheus | 9090 | Metrics collection |

## Quick Start

```bash
# Start all services
docker-compose up -d

# Access dashboards
open http://localhost:8800        # News Dashboard
open http://localhost:8800/admin  # Admin Dashboard
open http://localhost:8800/grafana # Grafana
```

## Project Structure

```
Barami/
├── services/
│   ├── news-api/          # Rust/Axum REST API
│   ├── news-dashboard/    # React News Frontend
│   ├── admin-dashboard/   # React Admin Frontend
│   └── nginx/             # Reverse Proxy Config
├── infrastructure/
│   ├── docker/            # Docker configurations
│   └── k8s/               # Kubernetes manifests
├── docs/
│   ├── sprints/           # Sprint planning docs
│   └── architecture/      # Architecture docs
└── scripts/               # Utility scripts
```

## Sprints

- [Sprint 1](docs/sprints/sprint-1.md): Project Setup & News API
- [Sprint 2](docs/sprints/sprint-2.md): News Dashboard Frontend
- [Sprint 3](docs/sprints/sprint-3.md): Admin Dashboard & Monitoring
- [Sprint 4](docs/sprints/sprint-4.md): Docker Compose & Deployment

## Tech Stack

- **Backend**: Rust, Axum, SQLx, tokio
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Database**: PostgreSQL, OpenSearch
- **Monitoring**: Prometheus, Grafana
- **Infrastructure**: Docker, Nginx, Kubernetes

## License

MIT License
