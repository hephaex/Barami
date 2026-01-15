# Changelog

All notable changes to the News API service will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-15

### Added
- Initial release of News API service
- Axum-based REST API server on port 8080
- PostgreSQL integration with SQLx for metadata storage
- OpenSearch integration for full-text article search
- Health check endpoint (`GET /api/health`)
- News listing endpoint with pagination (`GET /api/news`)
- News detail endpoint (`GET /api/news/:id`)
- News search endpoint (`GET /api/news/search`)
- Statistics endpoints (`GET /api/stats`, `GET /api/stats/daily`)
- Categories endpoint (`GET /api/categories`)
- CORS middleware for frontend integration
- Structured logging with tracing
- Custom error handling with proper HTTP status codes
- Multi-stage Docker build for optimized container images
- Docker Compose configuration for local development
- OpenAPI 3.0 specification (openapi.yaml)
- Comprehensive README and documentation
- Test data scripts for PostgreSQL and OpenSearch
- Quick start script for development setup
- Makefile with common development commands
- `.env.example` for configuration template

### Database Schema
- `crawl_stats` table for tracking daily crawling statistics
- `categories` table for news category management

### Dependencies
- axum 0.7 - Web framework
- tokio 1.x - Async runtime
- sqlx 0.7 - Database ORM with compile-time query verification
- reqwest 0.11 - HTTP client for OpenSearch
- serde 1.0 - Serialization/deserialization
- chrono 0.4 - Date/time handling
- thiserror 1.0 - Error handling
- tracing 0.1 - Structured logging

### Performance
- Startup time: < 1 second
- Memory footprint: ~20MB baseline
- Request latency: < 10ms average
- Concurrent connections: 10 PostgreSQL pool connections

### Security
- Non-root Docker user (newsapi:1000)
- Environment-based configuration
- Parameterized SQL queries
- CORS protection

[0.1.0]: https://github.com/hephaex/Barami/releases/tag/v0.1.0
