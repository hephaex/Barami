# Sprint 1: Project Setup & News API

## Goal
프로젝트 기반 설정 및 News API 서비스 개발

## Duration
1주

## Tasks

### 1.1 Project Infrastructure
- [ ] Git repository 초기화
- [ ] GitHub repository 생성 (hephaex/Barami)
- [ ] CI/CD 파이프라인 설정 (GitHub Actions)
- [ ] 개발 환경 설정 (Docker Compose 기본)

### 1.2 News API Service (Rust/Axum)
- [ ] Cargo 프로젝트 생성
- [ ] Axum 웹 프레임워크 설정
- [ ] PostgreSQL 연결 (SQLx)
- [ ] OpenSearch 연결

### 1.3 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/news` | 뉴스 목록 조회 (페이징) |
| GET | `/api/news/:id` | 뉴스 상세 조회 |
| GET | `/api/news/search` | 뉴스 검색 |
| GET | `/api/stats` | 크롤링 통계 |
| GET | `/api/stats/daily` | 일별 수집 현황 |
| GET | `/api/categories` | 카테고리 목록 |

### 1.4 Database Schema
```sql
-- PostgreSQL: 크롤링 메타데이터
CREATE TABLE crawl_stats (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_crawled INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    article_count INT DEFAULT 0
);
```

### 1.5 Docker Configuration
- [ ] Dockerfile for news-api
- [ ] Multi-stage build 적용
- [ ] Health check 설정

## Deliverables
1. News API 서비스 (Docker 컨테이너)
2. API 문서 (OpenAPI/Swagger)
3. 단위 테스트

## Dependencies
- Baram 프로젝트의 OpenSearch 인덱스 (baram-articles)
- PostgreSQL (기존 baram-postgres 활용)
