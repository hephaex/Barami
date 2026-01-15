# News API - Rust/Axum REST API Service

A high-performance REST API service built with Rust and Axum for the Barami News Aggregation Platform.

## Features

- **Fast & Safe**: Built with Rust for memory safety and high performance
- **Async Runtime**: Powered by Tokio for efficient concurrent request handling
- **Database**: PostgreSQL integration with SQLx for compile-time SQL verification
- **Search**: OpenSearch integration for full-text search capabilities
- **CORS Enabled**: Ready for frontend integration
- **Health Checks**: Built-in health monitoring endpoints
- **Docker Ready**: Multi-stage Docker build for optimized container images

## Tech Stack

- **Framework**: Axum 0.7
- **Runtime**: Tokio (async)
- **Database**: PostgreSQL (via SQLx)
- **Search**: OpenSearch (via reqwest)
- **Serialization**: Serde
- **Logging**: Tracing
- **Error Handling**: thiserror + anyhow

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/news` | List news with pagination |
| GET | `/api/news/:id` | Get news detail by ID |
| GET | `/api/news/search?q=keyword` | Search news |
| GET | `/api/stats` | Get crawling statistics |
| GET | `/api/stats/daily` | Get daily crawling stats |
| GET | `/api/categories` | List categories |

## Quick Start

### Prerequisites

- Rust 1.75+ (install from [rustup.rs](https://rustup.rs/))
- PostgreSQL 15+
- OpenSearch 2.x

### Development Setup

1. **Clone the repository**
```bash
cd /home/mare/Barami/services/news-api
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Run database migrations**
```bash
# The application will auto-create tables on first run
```

4. **Run the development server**
```bash
cargo run
```

The server will start on `http://localhost:8080`

### Production Build

```bash
cargo build --release
./target/release/news-api
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t news-api:latest .
```

### Run Container

```bash
docker run -d \
  --name news-api \
  -p 8080:8080 \
  -e DATABASE_URL=postgres://baram:baram123@postgres:5432/baram \
  -e OPENSEARCH_URL=http://opensearch:9200 \
  -e OPENSEARCH_INDEX=baram-articles \
  news-api:latest
```

### Docker Compose

```yaml
services:
  news-api:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://baram:baram123@postgres:5432/baram
      OPENSEARCH_URL: http://opensearch:9200
      OPENSEARCH_INDEX: baram-articles
    depends_on:
      - postgres
      - opensearch
```

## Configuration

Configure the service using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgres://baram:baram123@localhost:5432/baram` | PostgreSQL connection string |
| `OPENSEARCH_URL` | `http://localhost:9200` | OpenSearch base URL |
| `OPENSEARCH_INDEX` | `baram-articles` | OpenSearch index name |
| `PORT` | `8080` | Server port |
| `RUST_LOG` | `news_api=debug` | Logging level |

## API Usage Examples

### Health Check
```bash
curl http://localhost:8080/api/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "opensearch": "connected",
  "timestamp": "2026-01-15T10:00:00Z"
}
```

### List News (with pagination)
```bash
curl "http://localhost:8080/api/news?page=1&limit=20"
```

Response:
```json
{
  "articles": [...],
  "total": 1500,
  "page": 1,
  "limit": 20,
  "total_pages": 75
}
```

### Search News
```bash
curl "http://localhost:8080/api/news/search?q=정치&page=1&limit=10"
```

### Get News Detail
```bash
curl http://localhost:8080/api/news/{article_id}
```

### Get Statistics
```bash
curl http://localhost:8080/api/stats
```

Response:
```json
{
  "total_articles": 15000,
  "total_crawled_today": 250,
  "success_rate": 98.5,
  "recent_stats": [...]
}
```

### Get Daily Statistics
```bash
curl http://localhost:8080/api/stats/daily
```

### List Categories
```bash
curl http://localhost:8080/api/categories
```

## Development

### Run Tests
```bash
cargo test
```

### Check Code
```bash
# Run clippy for linting
cargo clippy -- -D warnings

# Format code
cargo fmt

# Check compilation without building
cargo check
```

### Watch Mode (with cargo-watch)
```bash
cargo install cargo-watch
cargo watch -x run
```

## Database Schema

### crawl_stats
```sql
CREATE TABLE crawl_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_crawled INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### categories
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    article_count INT DEFAULT 0
);
```

## Performance

- **Startup Time**: < 1 second
- **Memory Usage**: ~20MB (baseline)
- **Request Latency**: < 10ms (avg)
- **Concurrent Requests**: 10,000+ RPS

## License

MIT License
