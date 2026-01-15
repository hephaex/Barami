#!/bin/bash

# Script to populate OpenSearch with sample articles for testing
# Usage: ./opensearch-test-data.sh

OPENSEARCH_URL="${OPENSEARCH_URL:-http://localhost:9200}"
INDEX_NAME="${OPENSEARCH_INDEX:-baram-articles}"

echo "Populating OpenSearch at $OPENSEARCH_URL with test data..."

# Create index if it doesn't exist
curl -X PUT "$OPENSEARCH_URL/$INDEX_NAME" \
  -H 'Content-Type: application/json' \
  -d '{
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 0,
      "analysis": {
        "analyzer": {
          "korean": {
            "type": "custom",
            "tokenizer": "nori_tokenizer"
          }
        }
      }
    },
    "mappings": {
      "properties": {
        "title": {
          "type": "text",
          "analyzer": "korean"
        },
        "content": {
          "type": "text",
          "analyzer": "korean"
        },
        "summary": {
          "type": "text",
          "analyzer": "korean"
        },
        "category": {
          "type": "keyword"
        },
        "source": {
          "type": "keyword"
        },
        "url": {
          "type": "keyword"
        },
        "published_at": {
          "type": "date"
        },
        "crawled_at": {
          "type": "date"
        }
      }
    }
  }' 2>/dev/null

echo ""
echo "Adding sample articles..."

# Sample article 1
curl -X POST "$OPENSEARCH_URL/$INDEX_NAME/_doc" \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "정부, 새로운 경제 정책 발표",
    "content": "정부가 오늘 새로운 경제 활성화 정책을 발표했습니다. 주요 내용으로는...",
    "summary": "정부의 새로운 경제 정책 발표",
    "category": "정치",
    "source": "뉴스1",
    "url": "https://example.com/article/1",
    "author": "김기자",
    "published_at": "2026-01-15T09:00:00Z",
    "crawled_at": "2026-01-15T09:05:00Z"
  }'

# Sample article 2
curl -X POST "$OPENSEARCH_URL/$INDEX_NAME/_doc" \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "주식시장 상승세 지속",
    "content": "코스피가 3거래일 연속 상승세를 이어가고 있습니다...",
    "summary": "주식시장 연일 상승",
    "category": "경제",
    "source": "이코노미",
    "url": "https://example.com/article/2",
    "author": "이기자",
    "published_at": "2026-01-15T08:30:00Z",
    "crawled_at": "2026-01-15T08:35:00Z"
  }'

# Sample article 3
curl -X POST "$OPENSEARCH_URL/$INDEX_NAME/_doc" \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "AI 기술 발전으로 산업 혁신 가속화",
    "content": "인공지능 기술의 급격한 발전으로 다양한 산업 분야에서 혁신이 일어나고 있습니다...",
    "summary": "AI 기술이 산업 혁신 주도",
    "category": "IT/과학",
    "source": "테크뉴스",
    "url": "https://example.com/article/3",
    "author": "박기자",
    "published_at": "2026-01-15T10:00:00Z",
    "crawled_at": "2026-01-15T10:05:00Z"
  }'

echo ""
echo "Test data inserted successfully!"
echo "Check with: curl $OPENSEARCH_URL/$INDEX_NAME/_search?pretty"
