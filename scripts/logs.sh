#!/bin/bash

# ================================
# Barami Project Logs Script
# ================================

set -e

# Colors for output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to project directory
cd "$PROJECT_DIR"

# Determine Docker Compose Command
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "Docker Compose is not installed"
    exit 1
fi

# Parse arguments
SERVICE="${1:-}"
FOLLOW="${2:--f}"

# Display banner
echo "================================================"
echo "  🌊 Barami Project - Logs Viewer"
echo "================================================"
echo ""

if [ -z "$SERVICE" ]; then
    echo "Available services:"
    echo "  - news-api"
    echo "  - news-dashboard"
    echo "  - admin-dashboard"
    echo "  - nginx"
    echo ""
    echo "Usage: $0 [service_name] [options]"
    echo "Example: $0 news-api -f"
    echo ""
    echo "Showing all logs (use Ctrl+C to exit):"
    echo ""
    $DOCKER_COMPOSE logs -f --tail=100
else
    echo "Showing logs for: $SERVICE (use Ctrl+C to exit)"
    echo ""
    $DOCKER_COMPOSE logs $FOLLOW --tail=100 "$SERVICE"
fi
