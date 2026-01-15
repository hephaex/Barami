#!/bin/bash

# ================================
# Barami Project Start Script
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Log function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ✓ $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ✗ $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ⚠ $1"
}

# Banner
echo "================================================"
echo "  🌊 Barami Project - Startup Script"
echo "================================================"
echo ""

# Change to project directory
cd "$PROJECT_DIR"

# --------------------------------
# Check Prerequisites
# --------------------------------
log "Checking prerequisites..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi
log_success "Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
log_success "Docker Compose is installed"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    log_error "Docker daemon is not running. Please start Docker first."
    exit 1
fi
log_success "Docker daemon is running"

# --------------------------------
# Check Environment Variables
# --------------------------------
log "Checking environment variables..."

if [ ! -f "$PROJECT_DIR/.env" ]; then
    log_warning ".env file not found. Creating from .env.example..."
    if [ -f "$PROJECT_DIR/.env.example" ]; then
        cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
        log_warning "Please update .env file with your actual configuration values."
        read -p "Press Enter to continue or Ctrl+C to exit and update .env file..."
    else
        log_error ".env.example file not found. Cannot create .env file."
        exit 1
    fi
else
    log_success ".env file found"
fi

# --------------------------------
# Check External Dependencies
# --------------------------------
log "Checking external dependencies..."

# Check if baram network exists
if ! docker network ls | grep -q "baram"; then
    log_warning "Network 'baram' not found. Creating it..."
    docker network create baram
    log_success "Network 'baram' created"
else
    log_success "Network 'baram' exists"
fi

# Check if required containers are running
REQUIRED_CONTAINERS=("baram-postgres" "baram-opensearch" "baram-grafana" "baram-prometheus")
MISSING_CONTAINERS=()

for container in "${REQUIRED_CONTAINERS[@]}"; do
    if ! docker ps | grep -q "$container"; then
        MISSING_CONTAINERS+=("$container")
    fi
done

if [ ${#MISSING_CONTAINERS[@]} -gt 0 ]; then
    log_warning "The following required containers are not running:"
    for container in "${MISSING_CONTAINERS[@]}"; do
        echo "  - $container"
    done
    log_warning "Please start these containers before proceeding."
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Startup cancelled by user."
        exit 0
    fi
else
    log_success "All required external containers are running"
fi

# --------------------------------
# Build and Start Services
# --------------------------------
log "Building Docker images..."

# Determine docker compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Build images
if ! $DOCKER_COMPOSE build --no-cache; then
    log_error "Failed to build Docker images"
    exit 1
fi
log_success "Docker images built successfully"

# Start services
log "Starting services..."
if ! $DOCKER_COMPOSE up -d; then
    log_error "Failed to start services"
    exit 1
fi
log_success "Services started successfully"

# --------------------------------
# Wait for Services to be Healthy
# --------------------------------
log "Waiting for services to be healthy..."

MAX_WAIT=120
WAIT_INTERVAL=5
ELAPSED=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
    HEALTHY_COUNT=0
    TOTAL_COUNT=0

    for service in news-api news-dashboard admin-dashboard nginx; do
        TOTAL_COUNT=$((TOTAL_COUNT + 1))
        if docker ps | grep -q "barami-$service"; then
            HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "barami-$service" 2>/dev/null || echo "unknown")
            if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "unknown" ]; then
                HEALTHY_COUNT=$((HEALTHY_COUNT + 1))
            fi
        fi
    done

    if [ $HEALTHY_COUNT -eq $TOTAL_COUNT ]; then
        log_success "All services are healthy!"
        break
    fi

    log "Waiting for services to be healthy... ($HEALTHY_COUNT/$TOTAL_COUNT ready)"
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    log_warning "Some services may not be fully healthy yet. Check logs with: $DOCKER_COMPOSE logs"
fi

# --------------------------------
# Display Service Status
# --------------------------------
echo ""
echo "================================================"
echo "  ✓ Barami Services Started Successfully"
echo "================================================"
echo ""
log_success "Service URLs:"
echo "  🌐 Main Dashboard:   http://localhost:8800"
echo "  🔧 Admin Dashboard:  http://localhost:8800/admin"
echo "  🔌 API:              http://localhost:8800/api"
echo "  📊 Grafana:          http://localhost:8800/grafana"
echo "  📈 Prometheus:       http://localhost:8800/prometheus"
echo ""
log_success "Direct Service URLs (for development):"
echo "  📰 News API:         http://localhost:8080"
echo "  🌐 News Dashboard:   http://localhost:3001"
echo "  🔧 Admin Dashboard:  http://localhost:3002"
echo ""
log "View logs with: $DOCKER_COMPOSE logs -f [service_name]"
log "Stop services with: $SCRIPT_DIR/stop.sh"
echo ""
echo "================================================"
