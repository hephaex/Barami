# Barami Scripts

This directory contains utility scripts for managing the Barami project.

## Available Scripts

### start.sh
**Purpose**: Start all Barami services

**Usage**:
```bash
./scripts/start.sh
```

**Features**:
- Checks prerequisites (Docker, Docker Compose)
- Verifies external dependencies
- Creates .env from template if missing
- Builds Docker images
- Starts all services
- Waits for health checks
- Displays service URLs

**Example Output**:
```
✓ Docker is installed
✓ Docker Compose is installed
✓ All required external containers are running
✓ Services started successfully

Service URLs:
  🌐 Main Dashboard:   http://localhost:8800
  🔧 Admin Dashboard:  http://localhost:8800/admin
  🔌 API:              http://localhost:8800/api
```

---

### stop.sh
**Purpose**: Stop all Barami services

**Usage**:
```bash
./scripts/stop.sh [OPTIONS]
```

**Options**:
- `-v, --volumes`: Remove volumes (deletes all data)
- `-i, --images`: Remove Docker images
- `-a, --all`: Remove volumes and images
- `-h, --help`: Show help message

**Examples**:
```bash
# Stop services only (preserves data)
./scripts/stop.sh

# Stop and remove volumes (DELETES DATA!)
./scripts/stop.sh --volumes

# Stop and remove everything
./scripts/stop.sh --all
```

---

### status.sh
**Purpose**: Display comprehensive status of all services

**Usage**:
```bash
./scripts/status.sh
```

**Displays**:
- Container status (running/stopped)
- Health status (healthy/unhealthy)
- External dependencies status
- Network connectivity
- Resource usage (CPU, Memory)
- Service URLs
- Quick actions

**Example Output**:
```
Container Status:
  ✓ news-api: Running (Healthy)
  ✓ news-dashboard: Running (Healthy)
  ✓ admin-dashboard: Running (Healthy)
  ✓ nginx: Running (Healthy)

External Dependencies:
  ✓ baram-postgres: Running
  ✓ baram-opensearch: Running
  ✓ baram-grafana: Running
  ✓ baram-prometheus: Running

Resource Usage:
  news-api: CPU: 2.5% | Memory: 256MB / 512MB
  news-dashboard: CPU: 1.2% | Memory: 128MB / 256MB
```

---

### logs.sh
**Purpose**: View service logs

**Usage**:
```bash
./scripts/logs.sh [service_name] [options]
```

**Examples**:
```bash
# View all logs (following)
./scripts/logs.sh

# View specific service logs
./scripts/logs.sh news-api

# View last 50 lines without following
./scripts/logs.sh news-api --tail=50
```

**Available Services**:
- `news-api`
- `news-dashboard`
- `admin-dashboard`
- `nginx`

---

### health-check.sh
**Purpose**: Comprehensive health check of all services

**Usage**:
```bash
./scripts/health-check.sh [OPTIONS]
```

**Options**:
- `-h, --help`: Show help message
- `-q, --quiet`: Quiet mode (only show summary)
- `-v, --verbose`: Verbose mode (detailed output)

**Checks**:
- Container status
- Health endpoints
- Network connectivity
- Disk space
- Memory usage

**Example**:
```bash
# Full health check
./scripts/health-check.sh

# Quiet mode (for scripting)
./scripts/health-check.sh --quiet && echo "All healthy"

# Verbose mode (debugging)
./scripts/health-check.sh --verbose
```

**Exit Codes**:
- `0`: All services healthy
- `1`: Some services unhealthy

---

## Script Permissions

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

Or individually:
```bash
chmod +x scripts/start.sh
chmod +x scripts/stop.sh
chmod +x scripts/status.sh
chmod +x scripts/logs.sh
chmod +x scripts/health-check.sh
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Deploy Barami
  run: |
    ./scripts/start.sh
    ./scripts/health-check.sh

- name: Check Status
  run: ./scripts/status.sh
```

### GitLab CI Example

```yaml
deploy:
  script:
    - ./scripts/start.sh
    - ./scripts/health-check.sh || exit 1
```

### Jenkins Example

```groovy
stage('Deploy') {
    steps {
        sh './scripts/start.sh'
        sh './scripts/health-check.sh'
    }
}
```

## Using with Cron

### Daily Health Check

```bash
# Add to crontab (crontab -e)
0 */6 * * * /home/mare/Barami/scripts/health-check.sh --quiet || /home/mare/Barami/scripts/start.sh
```

### Automatic Restart

```bash
# Restart services daily at 3 AM
0 3 * * * cd /home/mare/Barami && ./scripts/stop.sh && ./scripts/start.sh
```

## Error Handling

All scripts include comprehensive error handling:

- **Prerequisites check**: Verifies Docker and Docker Compose
- **Dependency verification**: Checks external services
- **Graceful degradation**: Warns but continues when safe
- **Detailed error messages**: Clear explanations of failures
- **Exit codes**: Proper exit codes for scripting

## Logging

Scripts output to stdout with colored messages:

- **Blue**: Informational messages
- **Green**: Success messages
- **Yellow**: Warnings
- **Red**: Errors

## Best Practices

1. **Always check status before operations**:
   ```bash
   ./scripts/status.sh
   ```

2. **Review logs after starting**:
   ```bash
   ./scripts/start.sh && ./scripts/logs.sh
   ```

3. **Use health checks in automation**:
   ```bash
   ./scripts/health-check.sh || exit 1
   ```

4. **Stop gracefully**:
   ```bash
   ./scripts/stop.sh  # Without flags to preserve data
   ```

5. **Clean shutdown when needed**:
   ```bash
   ./scripts/stop.sh --all  # Complete cleanup
   ```

## Customization

Scripts can be customized by editing:

- **Timeout values**: Adjust `MAX_WAIT` variables
- **Retry logic**: Modify `MAX_RETRIES` and `RETRY_DELAY`
- **Health check endpoints**: Update `ENDPOINTS` array
- **Color output**: Modify color variable definitions

## Troubleshooting Scripts

### Script won't execute

```bash
# Check permissions
ls -l scripts/*.sh

# Make executable
chmod +x scripts/*.sh
```

### Script can't find Docker

```bash
# Check Docker installation
which docker

# Check Docker daemon
docker info
```

### Script shows wrong status

```bash
# Force refresh
./scripts/status.sh

# Check Docker Compose
docker compose ps
```

## Support

For issues with scripts:

1. Check permissions: `ls -l scripts/*.sh`
2. Verify Docker: `docker --version`
3. Check logs: `./scripts/logs.sh`
4. Run with verbose: `bash -x scripts/start.sh`

---

**Last Updated**: 2026-01-15
**Maintainer**: Barami Team
