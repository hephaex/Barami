#!/bin/bash

# ================================
# Barami Project Stop Script
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
echo "  🌊 Barami Project - Shutdown Script"
echo "================================================"
echo ""

# Change to project directory
cd "$PROJECT_DIR"

# --------------------------------
# Determine Docker Compose Command
# --------------------------------
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    log_error "Docker Compose is not installed"
    exit 1
fi

# --------------------------------
# Parse Command Line Arguments
# --------------------------------
REMOVE_VOLUMES=false
REMOVE_IMAGES=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--volumes)
            REMOVE_VOLUMES=true
            shift
            ;;
        -i|--images)
            REMOVE_IMAGES=true
            shift
            ;;
        -a|--all)
            REMOVE_VOLUMES=true
            REMOVE_IMAGES=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -v, --volumes    Remove volumes"
            echo "  -i, --images     Remove images"
            echo "  -a, --all        Remove volumes and images"
            echo "  -h, --help       Show this help message"
            echo ""
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# --------------------------------
# Stop Services
# --------------------------------
log "Stopping Barami services..."

if ! $DOCKER_COMPOSE down; then
    log_error "Failed to stop services"
    exit 1
fi
log_success "Services stopped successfully"

# --------------------------------
# Remove Volumes (if requested)
# --------------------------------
if [ "$REMOVE_VOLUMES" = true ]; then
    log_warning "Removing volumes..."

    read -p "Are you sure you want to remove all volumes? This will delete all data! (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if $DOCKER_COMPOSE down -v; then
            log_success "Volumes removed successfully"
        else
            log_error "Failed to remove volumes"
        fi
    else
        log "Volume removal cancelled"
    fi
fi

# --------------------------------
# Remove Images (if requested)
# --------------------------------
if [ "$REMOVE_IMAGES" = true ]; then
    log_warning "Removing images..."

    read -p "Are you sure you want to remove all images? You will need to rebuild them! (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove Barami images
        IMAGES=$(docker images | grep "barami" | awk '{print $3}')
        if [ -n "$IMAGES" ]; then
            echo "$IMAGES" | xargs docker rmi -f
            log_success "Images removed successfully"
        else
            log_warning "No Barami images found to remove"
        fi
    else
        log "Image removal cancelled"
    fi
fi

# --------------------------------
# Clean Up Dangling Resources
# --------------------------------
log "Cleaning up dangling resources..."

# Remove dangling images
DANGLING_IMAGES=$(docker images -f "dangling=true" -q)
if [ -n "$DANGLING_IMAGES" ]; then
    echo "$DANGLING_IMAGES" | xargs docker rmi -f 2>/dev/null || true
    log_success "Dangling images cleaned up"
fi

# Remove unused networks (except baram network)
docker network prune -f 2>/dev/null || true

# --------------------------------
# Display Status
# --------------------------------
echo ""
echo "================================================"
echo "  ✓ Barami Services Stopped Successfully"
echo "================================================"
echo ""

# Check if any Barami containers are still running
RUNNING_CONTAINERS=$(docker ps | grep "barami" | wc -l)
if [ "$RUNNING_CONTAINERS" -gt 0 ]; then
    log_warning "Some Barami containers are still running:"
    docker ps | grep "barami"
else
    log_success "All Barami containers stopped"
fi

echo ""
log "To start services again, run: $SCRIPT_DIR/start.sh"
echo ""

# Display cleanup info
if [ "$REMOVE_VOLUMES" = false ] && [ "$REMOVE_IMAGES" = false ]; then
    echo "Tip: Use the following options for cleanup:"
    echo "  -v, --volumes    Remove volumes (deletes all data)"
    echo "  -i, --images     Remove images (requires rebuild)"
    echo "  -a, --all        Remove both volumes and images"
    echo ""
fi

echo "================================================"
