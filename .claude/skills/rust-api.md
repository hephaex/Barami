# Rust API Development Skill

## Project: Barami News API

Location: `/home/mare/Barami/services/news-api/`

## Tech Stack
- Rust 1.75+
- Axum web framework
- SQLx for PostgreSQL
- reqwest for OpenSearch
- tokio async runtime
- serde for JSON serialization

## Project Structure
```
services/news-api/
├── src/
│   ├── main.rs          # Entry point, server setup
│   ├── db.rs            # PostgreSQL connection
│   ├── search.rs        # OpenSearch client
│   ├── error.rs         # Error handling
│   ├── routes/          # API endpoints
│   │   ├── mod.rs
│   │   ├── health.rs    # GET /api/health
│   │   ├── news.rs      # GET /api/news, /api/news/:id, /api/news/search
│   │   ├── stats.rs     # GET /api/stats, /api/stats/daily
│   │   └── categories.rs # GET /api/categories
│   └── models/          # Data models
│       ├── mod.rs
│       ├── article.rs
│       ├── category.rs
│       └── stats.rs
├── Cargo.toml
├── Dockerfile
└── .env.example
```

## Common Commands
```bash
cd services/news-api

# Build
cargo build
cargo build --release

# Run
cargo run

# Test
cargo test

# Lint
cargo clippy

# Format
cargo fmt

# Check
cargo check
```

## Database Connection
- PostgreSQL: `postgres://baram:baram123@localhost:5432/baram`
- OpenSearch: `http://localhost:9200` (index: `baram-articles`)

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/news | List news (page, limit) |
| GET | /api/news/:id | Get news by ID |
| GET | /api/news/search?q= | Search news |
| GET | /api/stats | Crawling statistics |
| GET | /api/stats/daily | Daily statistics |
| GET | /api/categories | Category list |

## When modifying this service:
1. Always run `cargo check` after changes
2. Run `cargo clippy` for lint warnings
3. Run `cargo fmt` before committing
4. Test with `cargo test`
5. Build Docker image: `docker build -t barami-news-api .`
