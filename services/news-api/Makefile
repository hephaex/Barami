.PHONY: help build run test clean docker-build docker-run docker-stop format lint check dev

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the project in release mode
	cargo build --release

run: ## Run the development server
	cargo run

test: ## Run tests
	cargo test

clean: ## Clean build artifacts
	cargo clean

docker-build: ## Build Docker image
	docker build -t news-api:latest .

docker-run: ## Run with Docker Compose
	docker-compose up -d

docker-stop: ## Stop Docker Compose
	docker-compose down

docker-logs: ## Show Docker logs
	docker-compose logs -f news-api

format: ## Format code
	cargo fmt

lint: ## Run clippy linter
	cargo clippy -- -D warnings

check: ## Check compilation without building
	cargo check

dev: ## Run in development mode with auto-reload (requires cargo-watch)
	cargo watch -x run

.DEFAULT_GOAL := help
