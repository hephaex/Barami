# Barami Project Overview

## Project Description
Barami는 뉴스 수집 현황을 보여주는 대시보드 플랫폼입니다.
Baram 프로젝트의 크롤링 데이터를 시각화하고 관리하는 마이크로서비스 아키텍처로 구성되어 있습니다.

## Repository
- GitHub: https://github.com/hephaex/Barami
- Local: /home/mare/Barami

## Related Project
- Baram (크롤러): /home/mare/Baram
  - PostgreSQL, OpenSearch, Grafana, Prometheus 등 인프라 서비스 제공

## Tech Stack
| Component | Technology |
|-----------|------------|
| Backend API | Rust, Axum, SQLx |
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS |
| Charts | Recharts |
| Database | PostgreSQL (from Baram) |
| Search | OpenSearch (from Baram) |
| Monitoring | Grafana, Prometheus |
| Reverse Proxy | Nginx |
| Container | Docker, Docker Compose |

## Directory Structure
```
/home/mare/Barami/
├── services/
│   ├── news-api/           # Rust REST API
│   ├── news-dashboard/     # React 뉴스 대시보드
│   ├── admin-dashboard/    # React 관리자 대시보드
│   └── nginx/              # Reverse proxy
├── docs/
│   └── sprints/            # Sprint 문서
├── scripts/                # 관리 스크립트
├── docker-compose.yml
├── Makefile
└── .env.example
```

## GitHub Issues (Sprints)
- #1: Sprint 1 - Project Setup & News API
- #2: Sprint 2 - News Dashboard Frontend
- #3: Sprint 3 - Admin Dashboard & Monitoring
- #4: Sprint 4 - Docker Compose & Deployment

## Access URLs (when running)
| URL | Description |
|-----|-------------|
| http://localhost:8800 | 뉴스 대시보드 |
| http://localhost:8800/admin | 관리자 대시보드 |
| http://localhost:8800/api/health | API 헬스체크 |
| http://localhost:8800/grafana | Grafana |
| http://localhost:8800/prometheus | Prometheus |

## Quick Start
```bash
cd /home/mare/Barami
cp .env.example .env
./scripts/start.sh
# or: make start
```

## Development Workflow
1. News API 수정: `cd services/news-api && cargo check`
2. Dashboard 수정: `cd services/news-dashboard && npm run dev`
3. Admin 수정: `cd services/admin-dashboard && npm run dev`
4. 전체 빌드: `make build-all`
5. 테스트: `make health`
6. 커밋: `git add . && git commit -m "..."`
7. 푸시: `git push origin main`

## Common Tasks
- API 엔드포인트 추가: `services/news-api/src/routes/`
- 새 컴포넌트 추가: `services/news-dashboard/src/components/`
- 새 페이지 추가: `services/*/src/pages/`
- Docker 설정 변경: `docker-compose.yml`
- Nginx 라우팅 변경: `services/nginx/nginx.conf`
