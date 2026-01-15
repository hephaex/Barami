# ================================
# Barami Project Makefile
# ================================

.PHONY: help start stop restart status logs build clean test health dev prod

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

# Docker Compose command
COMPOSE := docker compose
ifeq (, $(shell which docker compose))
	COMPOSE := docker-compose
endif

# ================================
# Help
# ================================
help: ## Show this help message
	@echo "$(BLUE)================================================$(NC)"
	@echo "$(BLUE)  Barami Project - Available Commands$(NC)"
	@echo "$(BLUE)================================================$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(BLUE)================================================$(NC)"

# ================================
# Service Management
# ================================
start: ## Start all services
	@echo "$(BLUE)Starting Barami services...$(NC)"
	@./scripts/start.sh

stop: ## Stop all services
	@echo "$(BLUE)Stopping Barami services...$(NC)"
	@./scripts/stop.sh

restart: stop start ## Restart all services

status: ## Show status of all services
	@./scripts/status.sh

logs: ## Show logs (use SERVICE=name to filter)
	@if [ -z "$(SERVICE)" ]; then \
		./scripts/logs.sh; \
	else \
		./scripts/logs.sh $(SERVICE); \
	fi

health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo ""
	@echo "News API:"
	@curl -sf http://localhost:8080/health && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(YELLOW)✗ Unhealthy$(NC)"
	@echo ""
	@echo "News Dashboard:"
	@curl -sf http://localhost:3001/health && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(YELLOW)✗ Unhealthy$(NC)"
	@echo ""
	@echo "Admin Dashboard:"
	@curl -sf http://localhost:3002/health && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(YELLOW)✗ Unhealthy$(NC)"
	@echo ""
	@echo "Nginx:"
	@curl -sf http://localhost:8800/nginx-health && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(YELLOW)✗ Unhealthy$(NC)"
	@echo ""

# ================================
# Build Commands
# ================================
build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	@$(COMPOSE) build

build-no-cache: ## Build all Docker images without cache
	@echo "$(BLUE)Building Docker images (no cache)...$(NC)"
	@$(COMPOSE) build --no-cache

pull: ## Pull latest base images
	@echo "$(BLUE)Pulling latest base images...$(NC)"
	@$(COMPOSE) pull

# ================================
# Development Commands
# ================================
dev: ## Start services in development mode
	@echo "$(BLUE)Starting services in development mode...$(NC)"
	@NODE_ENV=development $(COMPOSE) up -d

dev-logs: ## Start services in development mode with logs
	@echo "$(BLUE)Starting services in development mode...$(NC)"
	@NODE_ENV=development $(COMPOSE) up

shell-api: ## Open shell in news-api container
	@docker exec -it barami-news-api sh

shell-dashboard: ## Open shell in news-dashboard container
	@docker exec -it barami-news-dashboard sh

shell-admin: ## Open shell in admin-dashboard container
	@docker exec -it barami-admin-dashboard sh

shell-nginx: ## Open shell in nginx container
	@docker exec -it barami-nginx sh

# ================================
# Production Commands
# ================================
prod: ## Start services in production mode
	@echo "$(BLUE)Starting services in production mode...$(NC)"
	@NODE_ENV=production $(COMPOSE) up -d

prod-logs: ## Start services in production mode with logs
	@echo "$(BLUE)Starting services in production mode...$(NC)"
	@NODE_ENV=production $(COMPOSE) up

# ================================
# Database Commands
# ================================
db-shell: ## Open PostgreSQL shell
	@docker exec -it baram-postgres psql -U barami -d barami

db-backup: ## Backup PostgreSQL database
	@echo "$(BLUE)Backing up database...$(NC)"
	@mkdir -p backups
	@docker exec baram-postgres pg_dump -U barami barami > backups/barami-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "$(GREEN)✓ Backup created in backups/$(NC)"

db-restore: ## Restore PostgreSQL database (use FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(YELLOW)Please specify backup file: make db-restore FILE=backup.sql$(NC)"; \
	else \
		echo "$(BLUE)Restoring database from $(FILE)...$(NC)"; \
		docker exec -i baram-postgres psql -U barami -d barami < $(FILE); \
		echo "$(GREEN)✓ Database restored$(NC)"; \
	fi

# ================================
# OpenSearch Commands
# ================================
search-health: ## Check OpenSearch health
	@curl -X GET "http://localhost:9200/_cluster/health?pretty"

search-indices: ## List OpenSearch indices
	@curl -X GET "http://localhost:9200/_cat/indices?v"

search-shell: ## Open OpenSearch curl shell
	@docker exec -it baram-opensearch bash

# ================================
# Cleanup Commands
# ================================
clean: ## Remove stopped containers and unused images
	@echo "$(BLUE)Cleaning up...$(NC)"
	@docker system prune -f
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-all: ## Remove all containers, images, and volumes (DANGEROUS!)
	@echo "$(YELLOW)WARNING: This will remove all Barami data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		./scripts/stop.sh --all; \
		docker system prune -af --volumes; \
		echo "$(GREEN)✓ All data removed$(NC)"; \
	else \
		echo "$(BLUE)Cancelled$(NC)"; \
	fi

# ================================
# Testing Commands
# ================================
test: ## Run tests (when implemented)
	@echo "$(BLUE)Running tests...$(NC)"
	@echo "$(YELLOW)Tests not yet implemented$(NC)"

test-integration: ## Run integration tests
	@echo "$(BLUE)Running integration tests...$(NC)"
	@echo "$(YELLOW)Integration tests not yet implemented$(NC)"

# ================================
# Monitoring Commands
# ================================
grafana: ## Open Grafana in browser
	@echo "$(BLUE)Opening Grafana...$(NC)"
	@xdg-open http://localhost:8800/grafana 2>/dev/null || open http://localhost:8800/grafana 2>/dev/null || echo "Visit: http://localhost:8800/grafana"

prometheus: ## Open Prometheus in browser
	@echo "$(BLUE)Opening Prometheus...$(NC)"
	@xdg-open http://localhost:8800/prometheus 2>/dev/null || open http://localhost:8800/prometheus 2>/dev/null || echo "Visit: http://localhost:8800/prometheus"

dashboard: ## Open News Dashboard in browser
	@echo "$(BLUE)Opening News Dashboard...$(NC)"
	@xdg-open http://localhost:8800 2>/dev/null || open http://localhost:8800 2>/dev/null || echo "Visit: http://localhost:8800"

admin: ## Open Admin Dashboard in browser
	@echo "$(BLUE)Opening Admin Dashboard...$(NC)"
	@xdg-open http://localhost:8800/admin 2>/dev/null || open http://localhost:8800/admin 2>/dev/null || echo "Visit: http://localhost:8800/admin"

# ================================
# Network Commands
# ================================
network-create: ## Create required networks
	@echo "$(BLUE)Creating networks...$(NC)"
	@docker network create baram 2>/dev/null || echo "Network baram already exists"
	@docker network create barami-network 2>/dev/null || echo "Network barami-network already exists"
	@echo "$(GREEN)✓ Networks ready$(NC)"

network-inspect: ## Inspect network configuration
	@echo "$(BLUE)Baram Network:$(NC)"
	@docker network inspect baram
	@echo ""
	@echo "$(BLUE)Barami Network:$(NC)"
	@docker network inspect barami-network

# ================================
# Configuration Commands
# ================================
config: ## Show current configuration
	@echo "$(BLUE)Current Configuration:$(NC)"
	@$(COMPOSE) config

env-check: ## Check environment variables
	@echo "$(BLUE)Checking environment configuration...$(NC)"
	@if [ -f .env ]; then \
		echo "$(GREEN)✓ .env file exists$(NC)"; \
		echo ""; \
		echo "Database Configuration:"; \
		grep "^POSTGRES_" .env || true; \
		echo ""; \
		echo "OpenSearch Configuration:"; \
		grep "^OPENSEARCH_" .env || true; \
	else \
		echo "$(YELLOW)✗ .env file not found$(NC)"; \
		echo "Run: cp .env.example .env"; \
	fi

env-init: ## Initialize .env file from template
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(GREEN)✓ .env file created from .env.example$(NC)"; \
		echo "$(YELLOW)⚠ Please update .env with your configuration$(NC)"; \
	else \
		echo "$(YELLOW).env file already exists$(NC)"; \
	fi

# ================================
# Update Commands
# ================================
update: ## Update services to latest version
	@echo "$(BLUE)Updating services...$(NC)"
	@git pull
	@$(COMPOSE) pull
	@$(COMPOSE) build --no-cache
	@echo "$(GREEN)✓ Update complete$(NC)"
	@echo "$(YELLOW)Run 'make restart' to apply changes$(NC)"

# ================================
# Info Commands
# ================================
info: ## Show system information
	@echo "$(BLUE)================================================$(NC)"
	@echo "$(BLUE)  System Information$(NC)"
	@echo "$(BLUE)================================================$(NC)"
	@echo ""
	@echo "Docker Version:"
	@docker --version
	@echo ""
	@echo "Docker Compose Version:"
	@$(COMPOSE) version
	@echo ""
	@echo "Running Containers:"
	@docker ps --filter "name=barami" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""

version: ## Show version information
	@echo "Barami Project v1.0.0"
	@echo "Build Date: 2026-01-15"
