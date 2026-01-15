#!/bin/bash

# ================================
# Barami Project Status Script
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

# Change to project directory
cd "$PROJECT_DIR"

# Determine Docker Compose Command
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo -e "${RED}Docker Compose is not installed${NC}"
    exit 1
fi

# Banner
echo "================================================"
echo "  🌊 Barami Project - Status Check"
echo "================================================"
echo ""

# --------------------------------
# Check Container Status
# --------------------------------
echo -e "${BLUE}Container Status:${NC}"
echo "================================================"

SERVICES=("news-api" "news-dashboard" "admin-dashboard" "nginx")
ALL_HEALTHY=true

for service in "${SERVICES[@]}"; do
    CONTAINER_NAME="barami-$service"

    # Check if container exists
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        # Get container status
        STATUS=$(docker inspect --format='{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null)
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "none")

        # Display status with color
        if [ "$STATUS" = "running" ]; then
            if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "none" ]; then
                echo -e "  ✓ ${GREEN}$service${NC}: Running (Healthy)"
            elif [ "$HEALTH" = "starting" ]; then
                echo -e "  ⏳ ${YELLOW}$service${NC}: Running (Starting...)"
                ALL_HEALTHY=false
            else
                echo -e "  ⚠ ${YELLOW}$service${NC}: Running (Unhealthy)"
                ALL_HEALTHY=false
            fi
        else
            echo -e "  ✗ ${RED}$service${NC}: $STATUS"
            ALL_HEALTHY=false
        fi
    else
        echo -e "  ✗ ${RED}$service${NC}: Not found"
        ALL_HEALTHY=false
    fi
done

echo ""

# --------------------------------
# Check External Dependencies
# --------------------------------
echo -e "${BLUE}External Dependencies:${NC}"
echo "================================================"

EXTERNAL_SERVICES=("baram-postgres:5432" "baram-opensearch:9200" "baram-grafana:3000" "baram-prometheus:9090")

for service_port in "${EXTERNAL_SERVICES[@]}"; do
    SERVICE_NAME=$(echo "$service_port" | cut -d: -f1)
    PORT=$(echo "$service_port" | cut -d: -f2)

    if docker ps --format '{{.Names}}' | grep -q "^${SERVICE_NAME}$"; then
        STATUS=$(docker inspect --format='{{.State.Status}}' "$SERVICE_NAME" 2>/dev/null)
        if [ "$STATUS" = "running" ]; then
            echo -e "  ✓ ${GREEN}$SERVICE_NAME${NC}: Running"
        else
            echo -e "  ✗ ${RED}$SERVICE_NAME${NC}: $STATUS"
            ALL_HEALTHY=false
        fi
    else
        echo -e "  ✗ ${RED}$SERVICE_NAME${NC}: Not found"
        ALL_HEALTHY=false
    fi
done

echo ""

# --------------------------------
# Check Network
# --------------------------------
echo -e "${BLUE}Network Status:${NC}"
echo "================================================"

if docker network ls | grep -q "baram"; then
    echo -e "  ✓ ${GREEN}baram${NC}: Network exists"
else
    echo -e "  ✗ ${RED}baram${NC}: Network not found"
    ALL_HEALTHY=false
fi

if docker network ls | grep -q "barami-network"; then
    echo -e "  ✓ ${GREEN}barami-network${NC}: Network exists"
else
    echo -e "  ✗ ${RED}barami-network${NC}: Network not found"
fi

echo ""

# --------------------------------
# Resource Usage
# --------------------------------
echo -e "${BLUE}Resource Usage:${NC}"
echo "================================================"

for service in "${SERVICES[@]}"; do
    CONTAINER_NAME="barami-$service"

    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        STATS=$(docker stats --no-stream --format "{{.CPUPerc}}\t{{.MemUsage}}" "$CONTAINER_NAME" 2>/dev/null)
        CPU=$(echo "$STATS" | awk '{print $1}')
        MEM=$(echo "$STATS" | awk '{print $2}')

        echo -e "  $service: CPU: $CPU | Memory: $MEM"
    fi
done

echo ""

# --------------------------------
# Service URLs
# --------------------------------
echo -e "${BLUE}Service URLs:${NC}"
echo "================================================"
echo "  🌐 Main Dashboard:   http://localhost:8800"
echo "  🔧 Admin Dashboard:  http://localhost:8800/admin"
echo "  🔌 API:              http://localhost:8800/api"
echo "  📊 Grafana:          http://localhost:8800/grafana"
echo "  📈 Prometheus:       http://localhost:8800/prometheus"
echo ""

# --------------------------------
# Overall Status
# --------------------------------
echo "================================================"
if [ "$ALL_HEALTHY" = true ]; then
    echo -e "  ${GREEN}✓ All services are healthy${NC}"
else
    echo -e "  ${YELLOW}⚠ Some services need attention${NC}"
fi
echo "================================================"
echo ""

# Show quick actions
echo "Quick Actions:"
echo "  View logs:     $SCRIPT_DIR/logs.sh [service_name]"
echo "  Restart:       $SCRIPT_DIR/stop.sh && $SCRIPT_DIR/start.sh"
echo "  Stop:          $SCRIPT_DIR/stop.sh"
echo ""
