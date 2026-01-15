# Barami Docker Deployment - Installation Checklist

Use this checklist to ensure successful deployment of the Barami project.

## Pre-Installation

- [ ] Docker installed (version 20.10+)
  ```bash
  docker --version
  ```

- [ ] Docker Compose installed (version 2.0+)
  ```bash
  docker compose version
  ```

- [ ] Docker daemon running
  ```bash
  docker info
  ```

- [ ] External services running:
  - [ ] `baram-postgres` (PostgreSQL)
  - [ ] `baram-opensearch` (OpenSearch)
  - [ ] `baram-grafana` (Grafana)
  - [ ] `baram-prometheus` (Prometheus)
  ```bash
  docker ps | grep baram
  ```

- [ ] `baram` network exists
  ```bash
  docker network ls | grep baram
  ```

- [ ] Sufficient disk space (20GB minimum)
  ```bash
  df -h /
  ```

- [ ] Sufficient memory (8GB minimum)
  ```bash
  free -h
  ```

## Configuration

- [ ] Environment file created
  ```bash
  cp .env.example .env
  ```

- [ ] PostgreSQL credentials set in `.env`:
  - [ ] `POSTGRES_PASSWORD`
  - [ ] `POSTGRES_USER`
  - [ ] `POSTGRES_DB`

- [ ] OpenSearch credentials set in `.env`:
  - [ ] `OPENSEARCH_PASSWORD`
  - [ ] `OPENSEARCH_USERNAME`

- [ ] Security secrets generated and set:
  - [ ] `JWT_SECRET`
  - [ ] `SESSION_SECRET`
  ```bash
  # Generate with:
  openssl rand -base64 32
  ```

- [ ] API configuration reviewed:
  - [ ] `CORS_ORIGIN`
  - [ ] `LOG_LEVEL`
  - [ ] `API_RATE_LIMIT`

- [ ] Dashboard URLs configured:
  - [ ] `VITE_API_URL`
  - [ ] `VITE_GRAFANA_URL`
  - [ ] `VITE_PROMETHEUS_URL`

## Script Permissions

- [ ] Make scripts executable
  ```bash
  chmod +x scripts/*.sh
  ```

- [ ] Verify script permissions
  ```bash
  ls -l scripts/*.sh
  ```

## Build & Deploy

- [ ] Review docker-compose.yml
  ```bash
  cat docker-compose.yml
  ```

- [ ] Start services
  ```bash
  ./scripts/start.sh
  ```

- [ ] Wait for services to be healthy (may take 2-3 minutes)

## Verification

### Service Health Checks

- [ ] All containers running
  ```bash
  docker ps | grep barami
  ```

- [ ] Nginx health check passes
  ```bash
  curl -f http://localhost:8800/nginx-health
  ```

- [ ] News API health check passes
  ```bash
  curl -f http://localhost:8080/health
  ```

- [ ] News Dashboard accessible
  ```bash
  curl -f http://localhost:3001/health
  ```

- [ ] Admin Dashboard accessible
  ```bash
  curl -f http://localhost:3002/health
  ```

- [ ] Comprehensive health check
  ```bash
  ./scripts/health-check.sh
  ```

### Service Access

- [ ] Main Dashboard accessible in browser
  - URL: http://localhost:8800
  - Expected: Dashboard loads without errors

- [ ] Admin Dashboard accessible in browser
  - URL: http://localhost:8800/admin
  - Expected: Admin interface loads

- [ ] API accessible
  - URL: http://localhost:8800/api/health
  - Expected: Returns health status

- [ ] Grafana accessible
  - URL: http://localhost:8800/grafana
  - Expected: Grafana login page

- [ ] Prometheus accessible
  - URL: http://localhost:8800/prometheus
  - Expected: Prometheus UI

### Network Connectivity

- [ ] Services can reach PostgreSQL
  ```bash
  docker exec barami-news-api curl -f http://baram-postgres:5432 2>/dev/null || echo "Expected connection"
  ```

- [ ] Services can reach OpenSearch
  ```bash
  docker exec barami-news-api curl -f http://baram-opensearch:9200 2>/dev/null || echo "Check connectivity"
  ```

- [ ] Networks configured correctly
  ```bash
  docker network inspect barami-network
  docker network inspect baram
  ```

### Resource Usage

- [ ] CPU usage acceptable
  ```bash
  docker stats --no-stream
  ```

- [ ] Memory usage acceptable
  ```bash
  docker stats --no-stream
  ```

- [ ] Disk space sufficient
  ```bash
  docker system df
  ```

## Functional Testing

### News API

- [ ] API responds to requests
  ```bash
  curl http://localhost:8800/api/health
  ```

- [ ] API can connect to database
  ```bash
  # Check API logs for database connection
  docker logs barami-news-api | grep -i postgres
  ```

- [ ] API can connect to OpenSearch
  ```bash
  # Check API logs for OpenSearch connection
  docker logs barami-news-api | grep -i opensearch
  ```

### Dashboards

- [ ] News Dashboard loads static assets
  ```bash
  curl -I http://localhost:8800/
  ```

- [ ] Admin Dashboard loads static assets
  ```bash
  curl -I http://localhost:8800/admin
  ```

- [ ] React Router works (no 404 on refresh)

### Nginx Reverse Proxy

- [ ] Routes to News Dashboard work
- [ ] Routes to Admin Dashboard work
- [ ] Routes to API work
- [ ] Routes to Grafana work
- [ ] Routes to Prometheus work
- [ ] CORS headers present
  ```bash
  curl -I http://localhost:8800/api/health | grep -i access-control
  ```

## Monitoring Setup

- [ ] Grafana accessible and working
  ```bash
  curl -f http://localhost:8800/grafana/api/health
  ```

- [ ] Prometheus accessible and working
  ```bash
  curl -f http://localhost:8800/prometheus/-/healthy
  ```

- [ ] Metrics being collected
  ```bash
  curl http://localhost:8800/prometheus/api/v1/targets
  ```

## Logging

- [ ] Logs are being generated
  ```bash
  ./scripts/logs.sh
  ```

- [ ] No critical errors in logs
  ```bash
  docker logs barami-news-api 2>&1 | grep -i error
  docker logs barami-news-dashboard 2>&1 | grep -i error
  docker logs barami-admin-dashboard 2>&1 | grep -i error
  docker logs barami-nginx 2>&1 | grep -i error
  ```

- [ ] Log rotation configured (max 10MB, 3 files)

## Security

- [ ] Containers running as non-root users
  ```bash
  docker exec barami-news-api whoami
  ```

- [ ] Security headers present
  ```bash
  curl -I http://localhost:8800/ | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection"
  ```

- [ ] No secrets in logs
  ```bash
  docker logs barami-news-api 2>&1 | grep -i password
  ```

- [ ] Environment variables not exposed
  ```bash
  docker exec barami-news-api env | grep -i password
  ```

## Backup Strategy

- [ ] Database backup script tested
  ```bash
  make db-backup
  ```

- [ ] Backup directory created
  ```bash
  ls -ld backups/
  ```

- [ ] Restore procedure documented

## Documentation

- [ ] README.md reviewed
- [ ] DOCKER_DEPLOYMENT.md reviewed
- [ ] QUICK_START.md reviewed
- [ ] Scripts README reviewed
- [ ] DEPLOYMENT_FILES.md reviewed

## Operational Procedures

- [ ] Start procedure documented
- [ ] Stop procedure documented
- [ ] Restart procedure documented
- [ ] Backup procedure documented
- [ ] Restore procedure documented
- [ ] Troubleshooting guide reviewed

## Development Setup (Optional)

- [ ] Development override file reviewed
  ```bash
  cat docker-compose.override.yml
  ```

- [ ] Development mode tested
  ```bash
  make dev
  ```

- [ ] Hot reload working

## Production Readiness (If Deploying to Production)

- [ ] SSL/TLS certificates configured
- [ ] Strong passwords set (minimum 32 characters)
- [ ] CORS restricted to specific domains
- [ ] Rate limiting configured
- [ ] Monitoring alerts configured
- [ ] Backup schedule established
- [ ] Disaster recovery plan documented
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Load testing completed

## Post-Installation

- [ ] Status check passes
  ```bash
  ./scripts/status.sh
  ```

- [ ] All services show as healthy

- [ ] Team members can access dashboards

- [ ] Monitoring dashboards configured in Grafana

- [ ] Alert rules configured in Prometheus

- [ ] Documentation shared with team

## Troubleshooting

If any check fails, refer to:

1. **DOCKER_DEPLOYMENT.md** - Comprehensive troubleshooting section
2. **Service logs** - `./scripts/logs.sh [service-name]`
3. **Health check** - `./scripts/health-check.sh`
4. **Status check** - `./scripts/status.sh`

## Common Issues

### Services won't start
```bash
# Check external dependencies
docker ps | grep baram

# Check networks
docker network ls | grep baram

# View logs
./scripts/logs.sh
```

### Database connection errors
```bash
# Test PostgreSQL
docker exec -it baram-postgres psql -U barami -d barami

# Check credentials
grep POSTGRES .env
```

### Port conflicts
```bash
# Check port usage
netstat -tlnp | grep -E "(8080|8800|3001|3002)"

# Update docker-compose.yml if needed
```

## Sign-Off

Installation completed by: _______________

Date: _______________

Services verified: _______________

Production ready: [ ] Yes [ ] No

Notes:
_______________________________________________
_______________________________________________
_______________________________________________

---

**Version**: 1.0.0
**Last Updated**: 2026-01-15
