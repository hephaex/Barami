# Barami Quick Start Guide

Get the Barami project up and running in minutes!

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 8GB RAM (minimum)
- 20GB free disk space

## External Dependencies

Ensure these containers are running:
```bash
docker ps | grep -E "(baram-postgres|baram-opensearch|baram-grafana|baram-prometheus)"
```

If not running, start them first before proceeding.

## Quick Setup

### 1. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env  # or your preferred editor
```

**Required Variables to Update:**
```bash
POSTGRES_PASSWORD=your_secure_password
OPENSEARCH_PASSWORD=your_opensearch_password
JWT_SECRET=generate_with_openssl_rand_base64_32
SESSION_SECRET=generate_with_openssl_rand_base64_32
```

### 2. Start Services

```bash
# Using the start script (recommended)
./scripts/start.sh

# Or using make
make start

# Or using docker-compose directly
docker compose up -d
```

### 3. Verify Services

```bash
# Check status
./scripts/status.sh

# Or using make
make status

# Or check health manually
curl http://localhost:8800/nginx-health
```

## Access URLs

Once services are running:

- **Main Dashboard**: http://localhost:8800
- **Admin Dashboard**: http://localhost:8800/admin
- **API Documentation**: http://localhost:8800/api/docs
- **Grafana**: http://localhost:8800/grafana
- **Prometheus**: http://localhost:8800/prometheus

## Common Commands

```bash
# View logs
./scripts/logs.sh                # All services
./scripts/logs.sh news-api       # Specific service

# Check health
./scripts/health-check.sh

# Restart services
make restart

# Stop services
./scripts/stop.sh

# Clean shutdown with data removal
./scripts/stop.sh --all
```

## Using Makefile

The project includes a Makefile for convenience:

```bash
make help                # Show all available commands
make start              # Start all services
make stop               # Stop all services
make status             # Check service status
make logs               # View logs
make health             # Check health
make dashboard          # Open dashboard in browser
make admin              # Open admin panel in browser
```

## Troubleshooting

### Services won't start

1. Check external dependencies:
   ```bash
   docker ps | grep baram
   ```

2. Verify network exists:
   ```bash
   docker network ls | grep baram
   ```

3. Check logs:
   ```bash
   ./scripts/logs.sh
   ```

### Can't connect to database

```bash
# Test PostgreSQL connection
docker exec -it baram-postgres psql -U barami -d barami

# Check credentials in .env
grep POSTGRES .env
```

### Port conflicts

If port 8800 is already in use, edit `docker-compose.yml`:
```yaml
nginx:
  ports:
    - "8801:80"  # Change to available port
```

## Development Mode

For development with hot reload:

```bash
# Start in development mode
make dev

# Or with docker-compose
NODE_ENV=development docker compose up
```

## Production Deployment

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for comprehensive production deployment guide.

## Getting Help

- Check service status: `make status`
- View logs: `make logs`
- Health check: `make health`
- Full documentation: [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

## Next Steps

1. Configure monitoring dashboards in Grafana
2. Set up SSL/TLS for production
3. Configure backup schedules
4. Review security settings

---

For detailed information, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
