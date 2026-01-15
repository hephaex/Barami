# Docker Deployment Skill

## Project: Barami Microservices

Location: `/home/mare/Barami/`

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (:8800)                             │
├─────────────────────────────────────────────────────────────┤
│  /           │  /admin        │  /api/*      │  /grafana    │
│  ▼           │  ▼             │  ▼           │  ▼           │
│ News         │ Admin          │ News API     │ Grafana      │
│ Dashboard    │ Dashboard      │ (Rust/Axum)  │ :3000        │
│ :3001        │ :3002          │ :8080        │              │
└─────────────────────────────────────────────────────────────┘
```

## Services
| Service | Port | Build Path |
|---------|------|------------|
| nginx | 8800 | services/nginx |
| news-api | 8080 | services/news-api |
| news-dashboard | 3001 | services/news-dashboard |
| admin-dashboard | 3002 | services/admin-dashboard |

## External Dependencies (from Baram project)
- PostgreSQL: `baram-postgres:5432`
- OpenSearch: `baram-opensearch:9200`
- Grafana: `baram-grafana:3000`
- Prometheus: `baram-prometheus:9090`

## Docker Compose Commands
```bash
# Start all services
docker compose up -d

# Start with rebuild
docker compose up -d --build

# Stop services
docker compose down

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f news-api

# Restart service
docker compose restart news-api

# Scale service
docker compose up -d --scale news-api=2
```

## Makefile Commands
```bash
make start          # Start all services
make stop           # Stop all services
make restart        # Restart all services
make status         # Check status
make logs           # View all logs
make health         # Health check

make build-api      # Build news-api
make build-dashboard # Build news-dashboard
make build-admin    # Build admin-dashboard
make build-all      # Build all services

make clean          # Clean up containers
make prune          # Remove unused images
```

## Script Commands
```bash
./scripts/start.sh          # Start with checks
./scripts/stop.sh           # Stop gracefully
./scripts/stop.sh --all     # Stop and clean
./scripts/status.sh         # Detailed status
./scripts/logs.sh           # View logs
./scripts/health-check.sh   # Health check
```

## Environment Variables
```bash
# Copy template
cp .env.example .env

# Key variables
POSTGRES_HOST=baram-postgres
POSTGRES_PORT=5432
POSTGRES_DB=baram
POSTGRES_USER=baram
POSTGRES_PASSWORD=baram123

OPENSEARCH_HOST=baram-opensearch
OPENSEARCH_PORT=9200

GRAFANA_URL=http://baram-grafana:3000
PROMETHEUS_URL=http://baram-prometheus:9090
```

## Network Configuration
```yaml
networks:
  barami-network:
    driver: bridge
  baram:
    external: true
    name: baram_default
```

## Health Checks
All services have health check endpoints:
- news-api: `GET /api/health`
- news-dashboard: `GET /health` (nginx)
- admin-dashboard: `GET /health` (nginx)
- nginx: `GET /nginx-health`

## Troubleshooting
```bash
# Check container status
docker ps -a

# Check logs for errors
docker compose logs --tail=50 news-api

# Enter container shell
docker compose exec news-api /bin/sh

# Check network
docker network inspect barami-network

# Force rebuild
docker compose build --no-cache
docker compose up -d
```

## Production Deployment
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Enable SSL in nginx.conf
4. Run `docker compose -f docker-compose.yml up -d`
