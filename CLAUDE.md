# Barami - Claude Project Guide

## Project Overview
Barami는 뉴스 수집 현황 대시보드 플랫폼입니다. Baram 프로젝트의 크롤링 데이터를 시각화합니다.

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (:8800)                             │
├─────────────────────────────────────────────────────────────┤
│  /           │  /admin        │  /api/*      │  /grafana    │
│  ▼           │  ▼             │  ▼           │  ▼           │
│ News         │ Admin          │ News API     │ Grafana      │
│ Dashboard    │ Dashboard      │ (Rust/Axum)  │ :3000        │
│ :3001        │ :3002          │ :8080        │              │
└─────────────────────────────────────────────────────────────┘
       │              │               │
       └──────────────┴───────────────┘
                      │
        ┌─────────────┴─────────────┐
        │     Baram Infrastructure   │
        │  PostgreSQL │ OpenSearch   │
        │  Prometheus │ Grafana      │
        └───────────────────────────┘
```

## Quick Commands

### Start/Stop Services
```bash
./scripts/start.sh      # Start all
./scripts/stop.sh       # Stop all
make status             # Check status
```

### Development
```bash
# News API (Rust)
cd services/news-api
cargo run               # Run locally
cargo check             # Check compilation
cargo test              # Run tests

# News Dashboard (React)
cd services/news-dashboard
npm install             # Install deps
npm run dev             # Dev server (localhost:3000)
npm run build           # Production build

# Admin Dashboard (React)
cd services/admin-dashboard
npm install
npm run dev             # Dev server (localhost:3001)
npm run build
```

### Docker
```bash
docker compose up -d            # Start containers
docker compose down             # Stop containers
docker compose logs -f          # View logs
make build-all                  # Rebuild all
```

## Key Files

### Backend (Rust)
- `services/news-api/src/main.rs` - Server entry point
- `services/news-api/src/routes/*.rs` - API endpoints
- `services/news-api/src/models/*.rs` - Data models
- `services/news-api/Cargo.toml` - Dependencies

### Frontend (React)
- `services/news-dashboard/src/App.tsx` - Main app
- `services/news-dashboard/src/pages/*.tsx` - Pages
- `services/news-dashboard/src/components/*.tsx` - Components
- `services/news-dashboard/src/api/client.ts` - API client

### Infrastructure
- `docker-compose.yml` - Container orchestration
- `services/nginx/nginx.conf` - Reverse proxy
- `.env.example` - Environment variables
- `Makefile` - Build commands

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/news | List news (page, limit) |
| GET | /api/news/:id | Get news detail |
| GET | /api/news/search?q= | Search news |
| GET | /api/stats | Statistics |
| GET | /api/stats/daily | Daily stats |
| GET | /api/categories | Categories |

## Database
- **PostgreSQL**: `postgres://baram:baram123@localhost:5432/baram`
- **OpenSearch**: `http://localhost:9200` (index: `baram-articles`)

## GitHub
- Repository: https://github.com/hephaex/Barami
- Issues: Sprint 1-4 planning

## Coding Standards

### Rust
- Run `cargo fmt` before committing
- Run `cargo clippy` for linting
- Use `Result<T, E>` for error handling
- Follow Rust naming conventions (snake_case)

### TypeScript/React
- Run `npm run lint` before committing
- Use functional components with hooks
- Use React Query for data fetching
- Follow React naming conventions (PascalCase for components)

### Git
- Commit message format: `type: description`
- Types: feat, fix, refactor, docs, test, chore
- Push to main branch

## When Working on This Project
1. Check current status: `make status` or `./scripts/status.sh`
2. Read relevant skill files in `.claude/skills/`
3. Make changes and test locally
4. Run linting and formatting
5. Commit with descriptive message
6. Push to GitHub
