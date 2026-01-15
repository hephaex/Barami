# Sprint 4: Docker Compose & Deployment

## Goal
전체 마이크로서비스 통합 및 프로덕션 배포 환경 구축

## Duration
1주

## Tasks

### 4.1 Docker Compose Configuration
- [ ] docker-compose.yml 작성
- [ ] 서비스 간 네트워크 설정
- [ ] 볼륨 마운트 설정
- [ ] 환경 변수 관리 (.env)

### 4.2 Nginx Reverse Proxy
```nginx
# 라우팅 설정
upstream news-api {
    server news-api:8080;
}

upstream news-dashboard {
    server news-dashboard:3001;
}

upstream admin-dashboard {
    server admin-dashboard:3002;
}

server {
    listen 8800;

    # News Dashboard (메인)
    location / {
        proxy_pass http://news-dashboard;
    }

    # Admin Dashboard
    location /admin {
        proxy_pass http://admin-dashboard;
    }

    # News API
    location /api/ {
        proxy_pass http://news-api;
    }

    # Grafana
    location /grafana/ {
        proxy_pass http://grafana:3000/;
    }

    # Prometheus
    location /prometheus/ {
        proxy_pass http://prometheus:9090/;
    }
}
```

### 4.3 Service Dependencies
```yaml
# 서비스 시작 순서
1. PostgreSQL
2. OpenSearch
3. Prometheus
4. Grafana
5. News API
6. News Dashboard
7. Admin Dashboard
8. Nginx
```

### 4.4 Health Checks
```yaml
services:
  news-api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 4.5 Kubernetes Manifests (Optional)
- [ ] Deployment manifests
- [ ] Service manifests
- [ ] Ingress configuration
- [ ] ConfigMaps & Secrets
- [ ] HPA (Horizontal Pod Autoscaler)

### 4.6 CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    - Build news-api image
    - Build news-dashboard image
    - Build admin-dashboard image
    - Push to container registry

  deploy:
    - Deploy to server via SSH
    - docker-compose pull && up -d
```

### 4.7 Monitoring & Alerting
- [ ] Grafana Alert 설정
- [ ] Slack/Discord 웹훅 연동
- [ ] 주요 알림 룰:
  - API 응답 시간 > 5초
  - 크롤링 성공률 < 90%
  - 디스크 사용량 > 80%
  - 서비스 다운

### 4.8 Backup Strategy
- [ ] PostgreSQL 백업 스크립트
- [ ] OpenSearch 스냅샷 설정
- [ ] 백업 일정 (cron)

## Final Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Network                            │
│                         (barami-net)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Nginx (:8800)                          │   │
│  │  /          /admin      /api        /grafana  /prometheus │   │
│  └─────┬────────┬──────────┬───────────┬─────────┬──────────┘   │
│        │        │          │           │         │              │
│        ▼        ▼          ▼           ▼         ▼              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ ┌──────────┐    │
│  │  News   │ │  Admin  │ │  News   │ │Grafana│ │Prometheus│    │
│  │Dashboard│ │Dashboard│ │   API   │ │ :3000 │ │  :9090   │    │
│  │  :3001  │ │  :3002  │ │  :8080  │ └───────┘ └──────────┘    │
│  └─────────┘ └─────────┘ └────┬────┘                           │
│                               │                                 │
│              ┌────────────────┼────────────────┐                │
│              ▼                ▼                ▼                │
│        ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│        │PostgreSQL│    │OpenSearch│    │  Redis   │            │
│        │  :5432   │    │  :9200   │    │  :6379   │            │
│        └──────────┘    └──────────┘    └──────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Deliverables
1. docker-compose.yml (Production Ready)
2. Nginx 설정 파일
3. CI/CD 파이프라인
4. Kubernetes manifests
5. 운영 문서

## Post-Deployment Checklist
- [ ] 모든 서비스 헬스체크 통과
- [ ] API 응답 정상
- [ ] 대시보드 접근 가능
- [ ] 메트릭 수집 정상
- [ ] 알림 테스트 완료
- [ ] SSL 인증서 적용 (Production)
