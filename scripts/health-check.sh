#!/bin/bash

# ================================
# Barami Project Health Check Script
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_RETRIES=3
RETRY_DELAY=2
TIMEOUT=5

# Health check endpoints
declare -A ENDPOINTS=(
    ["News API"]="http://localhost:8080/health"
    ["News Dashboard"]="http://localhost:3001/health"
    ["Admin Dashboard"]="http://localhost:3002/health"
    ["Nginx"]="http://localhost:8800/nginx-health"
    ["PostgreSQL"]="postgres"
    ["OpenSearch"]="http://localhost:9200/_cluster/health"
    ["Grafana"]="http://localhost:3000/api/health"
    ["Prometheus"]="http://localhost:9090/-/healthy"
)

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

# Check HTTP endpoint
check_http_endpoint() {
    local name=$1
    local url=$2
    local retries=0

    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -sf --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
            return 0
        fi
        retries=$((retries + 1))
        if [ $retries -lt $MAX_RETRIES ]; then
            sleep $RETRY_DELAY
        fi
    done
    return 1
}

# Check PostgreSQL
check_postgres() {
    if docker exec baram-postgres pg_isready -U barami > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

# Check container status
check_container() {
    local container=$1
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        local status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
        if [ "$status" = "running" ]; then
            return 0
        fi
    fi
    return 1
}

# Main health check
main() {
    echo "================================================"
    echo "  🌊 Barami Project - Health Check"
    echo "================================================"
    echo ""
    log "Starting comprehensive health check..."
    echo ""

    local all_healthy=true
    local total_checks=0
    local passed_checks=0

    # Check container status first
    echo -e "${BLUE}Container Status:${NC}"
    echo "================================================"

    local containers=("barami-news-api" "barami-news-dashboard" "barami-admin-dashboard" "barami-nginx" "baram-postgres" "baram-opensearch" "baram-grafana" "baram-prometheus")

    for container in "${containers[@]}"; do
        total_checks=$((total_checks + 1))
        local display_name=${container#barami-}
        display_name=${display_name#baram-}

        if check_container "$container"; then
            echo -e "  ✓ ${GREEN}${display_name}${NC}: Running"
            passed_checks=$((passed_checks + 1))
        else
            echo -e "  ✗ ${RED}${display_name}${NC}: Not running"
            all_healthy=false
        fi
    done

    echo ""

    # Check health endpoints
    echo -e "${BLUE}Health Endpoints:${NC}"
    echo "================================================"

    for name in "${!ENDPOINTS[@]}"; do
        total_checks=$((total_checks + 1))
        local endpoint=${ENDPOINTS[$name]}

        if [ "$endpoint" = "postgres" ]; then
            if check_postgres; then
                echo -e "  ✓ ${GREEN}${name}${NC}: Healthy"
                passed_checks=$((passed_checks + 1))
            else
                echo -e "  ✗ ${RED}${name}${NC}: Unhealthy"
                all_healthy=false
            fi
        else
            if check_http_endpoint "$name" "$endpoint"; then
                echo -e "  ✓ ${GREEN}${name}${NC}: Healthy"
                passed_checks=$((passed_checks + 1))
            else
                echo -e "  ✗ ${RED}${name}${NC}: Unhealthy"
                all_healthy=false
            fi
        fi
    done

    echo ""

    # Check network connectivity
    echo -e "${BLUE}Network Connectivity:${NC}"
    echo "================================================"

    total_checks=$((total_checks + 1))
    if docker network ls | grep -q "baram"; then
        echo -e "  ✓ ${GREEN}baram network${NC}: Available"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "  ✗ ${RED}baram network${NC}: Not found"
        all_healthy=false
    fi

    total_checks=$((total_checks + 1))
    if docker network ls | grep -q "barami-network"; then
        echo -e "  ✓ ${GREEN}barami-network${NC}: Available"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "  ✗ ${RED}barami-network${NC}: Not found"
        all_healthy=false
    fi

    echo ""

    # Check disk space
    echo -e "${BLUE}System Resources:${NC}"
    echo "================================================"

    total_checks=$((total_checks + 1))
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 90 ]; then
        echo -e "  ✓ ${GREEN}Disk Space${NC}: ${disk_usage}% used"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "  ⚠ ${YELLOW}Disk Space${NC}: ${disk_usage}% used (Warning)"
        log_warning "Disk usage is above 90%"
    fi

    total_checks=$((total_checks + 1))
    local mem_usage=$(free | awk 'NR==2 {printf "%.0f", $3/$2 * 100}')
    if [ "$mem_usage" -lt 90 ]; then
        echo -e "  ✓ ${GREEN}Memory${NC}: ${mem_usage}% used"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "  ⚠ ${YELLOW}Memory${NC}: ${mem_usage}% used (Warning)"
        log_warning "Memory usage is above 90%"
    fi

    echo ""

    # Summary
    echo "================================================"
    echo -e "${BLUE}Health Check Summary${NC}"
    echo "================================================"
    echo -e "  Total Checks: ${total_checks}"
    echo -e "  Passed: ${GREEN}${passed_checks}${NC}"
    echo -e "  Failed: ${RED}$((total_checks - passed_checks))${NC}"
    echo ""

    if [ "$all_healthy" = true ]; then
        echo -e "  ${GREEN}✓ All critical services are healthy${NC}"
        echo "================================================"
        exit 0
    else
        echo -e "  ${RED}✗ Some services are unhealthy${NC}"
        echo "================================================"
        echo ""
        log_warning "Run 'docker-compose logs' to investigate issues"
        exit 1
    fi
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Performs comprehensive health check of all Barami services."
        echo ""
        echo "Options:"
        echo "  -h, --help     Show this help message"
        echo "  -q, --quiet    Quiet mode (only show summary)"
        echo "  -v, --verbose  Verbose mode (show detailed output)"
        echo ""
        exit 0
        ;;
    -q|--quiet)
        exec 1>/dev/null
        ;;
    -v|--verbose)
        set -x
        ;;
esac

# Run main function
main
