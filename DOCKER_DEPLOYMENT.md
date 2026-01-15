# Barami Project - Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Barami project using Docker and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Configuration](#configuration)
5. [Services](#services)
6. [Scripts](#scripts)
7. [Networking](#networking)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)
10. [Production Deployment](#production-deployment)

## Prerequisites

### Required Software

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For cloning the repository

### System Requirements

- **CPU**: 4 cores or more (recommended)
- **RAM**: 8GB or more (recommended)
- **Disk**: 20GB free space (minimum)
- **OS**: Linux, macOS, or Windows with WSL2

### External Dependencies

The following services must be running before starting Barami:

- `baram-postgres` (PostgreSQL with pgvector)
- `baram-opensearch` (OpenSearch 3.4.0)
- `baram-grafana` (Grafana)
- `baram-prometheus` (Prometheus)

## Quick Start

### 1. Clone the Repository

```bash
cd /home/mare/Barami
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

**Important**: Update the following variables in `.env`:
- `POSTGRES_PASSWORD`
- `OPENSEARCH_PASSWORD`
- `JWT_SECRET`
- `SESSION_SECRET`

### 3. Start Services

```bash
./scripts/start.sh
```

The script will:
- Check prerequisites
- Verify external dependencies
- Build Docker images
- Start all services
- Wait for health checks

### 4. Access Services

Once started, access the services at:

- **Main Dashboard**: http://localhost:8800
- **Admin Dashboard**: http://localhost:8800/admin
- **API**: http://localhost:8800/api
- **Grafana**: http://localhost:8800/grafana
- **Prometheus**: http://localhost:8800/prometheus

## Architecture

### Service Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Nginx Reverse Proxy                      │
│                      (Port 8800)                             │
└───────┬─────────────┬─────────────┬─────────────┬───────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐
│News Dashboard│ │  Admin   │ │ News API │ │  Grafana    │
│ (Port 3001)  │ │Dashboard │ │(Port 8080│ │(Port 3000)  │
└──────────────┘ │(Port 3002│ └────┬─────┘ └─────────────┘
                 └──────────┘      │
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
              ┌──────────┐                  ┌──────────┐
              │PostgreSQL│                  │OpenSearch│
              │(Port 5432│                  │(Port 9200│
              └──────────┘                  └──────────┘
```

### Network Configuration

- **barami-network**: Internal network for Barami services
- **baram**: External network connecting to existing infrastructure

## Configuration

### Environment Variables

See `.env.example` for all available environment variables.

#### Critical Variables

```bash
# Database
POSTGRES_PASSWORD=your_secure_password_here

# OpenSearch
OPENSEARCH_PASSWORD=your_opensearch_password_here

# Security
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
```

#### Optional Variables

```bash
# Feature Flags
ENABLE_WEBSOCKET=true
ENABLE_CACHING=true
ENABLE_RATE_LIMITING=true

# Logging
LOG_LEVEL=info  # debug, info, warn, error

# Performance
POSTGRES_POOL_MAX=10
API_RATE_LIMIT=100
```

## Services

### News API Service

**Container**: `barami-news-api`
**Port**: 8080
**Technology**: Node.js

Provides RESTful API for news data, search, and analytics.

**Health Check**: `http://localhost:8080/health`

### News Dashboard Service

**Container**: `barami-news-dashboard`
**Port**: 3001
**Technology**: React

User-facing dashboard for browsing and searching news.

**Health Check**: `http://localhost:3001/health`

### Admin Dashboard Service

**Container**: `barami-admin-dashboard`
**Port**: 3002
**Technology**: React

Administrative interface for managing the system.

**Health Check**: `http://localhost:3002/health`

### Nginx Reverse Proxy

**Container**: `barami-nginx`
**Port**: 8800
**Technology**: Nginx (Alpine)

Routes traffic to appropriate services and provides:
- Load balancing
- SSL termination (when configured)
- WebSocket support
- Rate limiting
- CORS handling

**Health Check**: `http://localhost:8800/nginx-health`

## Scripts

### start.sh

Starts all Barami services.

```bash
./scripts/start.sh
```

Features:
- Prerequisites checking
- Dependency verification
- Automatic image building
- Health check monitoring
- Status reporting

### stop.sh

Stops all Barami services.

```bash
./scripts/stop.sh [OPTIONS]
```

Options:
- `-v, --volumes`: Remove volumes (deletes data)
- `-i, --images`: Remove Docker images
- `-a, --all`: Remove volumes and images
- `-h, --help`: Show help

Examples:
```bash
# Stop services only
./scripts/stop.sh

# Stop and remove volumes
./scripts/stop.sh --volumes

# Stop and remove everything
./scripts/stop.sh --all
```

### status.sh

Displays current status of all services.

```bash
./scripts/status.sh
```

Shows:
- Container status
- Health status
- External dependencies
- Network status
- Resource usage
- Service URLs

### logs.sh

View service logs.

```bash
./scripts/logs.sh [service_name] [options]
```

Examples:
```bash
# View all logs
./scripts/logs.sh

# View logs for specific service
./scripts/logs.sh news-api

# View logs without following
./scripts/logs.sh news-api --tail=50
```

## Networking

### Internal Network (barami-network)

All Barami services communicate through this network:
- `news-api`
- `news-dashboard`
- `admin-dashboard`
- `nginx`

### External Network (baram)

Connects to existing infrastructure services:
- `baram-postgres`
- `baram-opensearch`
- `baram-grafana`
- `baram-prometheus`

### Port Mapping

| Service | Internal Port | External Port | Access URL |
|---------|--------------|---------------|------------|
| Nginx | 80 | 8800 | http://localhost:8800 |
| News API | 8080 | 8080 | http://localhost:8080 |
| News Dashboard | 3001 | 3001 | http://localhost:3001 |
| Admin Dashboard | 3002 | 3002 | http://localhost:3002 |

## Monitoring

### Health Checks

All services include health checks:

```bash
# Check individual service
curl http://localhost:8080/health  # News API
curl http://localhost:3001/health  # News Dashboard
curl http://localhost:3002/health  # Admin Dashboard
curl http://localhost:8800/nginx-health  # Nginx
```

### Grafana Dashboards

Access Grafana at: http://localhost:8800/grafana

Pre-configured dashboards monitor:
- API performance
- Database metrics
- Search engine metrics
- System resources

### Prometheus Metrics

Access Prometheus at: http://localhost:8800/prometheus

Available metrics:
- HTTP request rates
- Response times
- Error rates
- Resource utilization

### Log Aggregation

View logs using Docker Compose:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f news-api

# Last 100 lines
docker-compose logs --tail=100 news-api
```

## Troubleshooting

### Services Won't Start

1. **Check external dependencies**:
```bash
docker ps | grep baram
```

2. **Verify network exists**:
```bash
docker network ls | grep baram
```

3. **Check logs**:
```bash
./scripts/logs.sh
```

### Database Connection Errors

1. **Verify PostgreSQL is running**:
```bash
docker ps | grep baram-postgres
```

2. **Test connection**:
```bash
docker exec -it baram-postgres psql -U barami -d barami
```

3. **Check credentials in `.env`**:
```bash
grep POSTGRES .env
```

### OpenSearch Connection Errors

1. **Verify OpenSearch is running**:
```bash
docker ps | grep baram-opensearch
```

2. **Test connection**:
```bash
curl -X GET "http://localhost:9200/_cluster/health?pretty"
```

3. **Check credentials in `.env`**:
```bash
grep OPENSEARCH .env
```

### High Memory Usage

1. **Check resource usage**:
```bash
docker stats
```

2. **Adjust memory limits in `docker-compose.yml`**:
```yaml
services:
  news-api:
    deploy:
      resources:
        limits:
          memory: 512M
```

### Port Conflicts

If ports are already in use, update `docker-compose.yml`:

```yaml
services:
  nginx:
    ports:
      - "8801:80"  # Change 8800 to 8801
```

## Production Deployment

### Security Considerations

1. **Use strong passwords**:
```bash
# Generate secure passwords
openssl rand -base64 32
```

2. **Enable HTTPS**:
- Configure SSL certificates
- Update Nginx configuration
- Force HTTPS redirects

3. **Restrict CORS**:
```bash
CORS_ORIGIN=https://yourdomain.com
```

4. **Use secrets management**:
- Docker secrets
- External secret stores (Vault, AWS Secrets Manager)

### Performance Optimization

1. **Increase worker processes**:
```yaml
# In nginx.conf
worker_processes auto;
worker_connections 2048;
```

2. **Enable caching**:
```bash
ENABLE_CACHING=true
```

3. **Adjust connection pools**:
```bash
POSTGRES_POOL_MAX=20
```

### High Availability

1. **Use orchestration**:
- Docker Swarm
- Kubernetes

2. **Add load balancers**:
- HAProxy
- AWS ALB/NLB

3. **Database replication**:
- PostgreSQL streaming replication
- Read replicas

### Backup Strategy

1. **Database backups**:
```bash
docker exec baram-postgres pg_dump -U barami barami > backup.sql
```

2. **Volume backups**:
```bash
docker run --rm -v baram-postgres-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data
```

3. **Automated backups**:
- Set up cron jobs
- Use backup tools (Velero for Kubernetes)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [OpenSearch Documentation](https://opensearch.org/docs/)

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review service logs: `./scripts/logs.sh`
3. Check service status: `./scripts/status.sh`
4. Open an issue in the project repository

---

**Last Updated**: 2026-01-15
**Version**: 1.0.0
