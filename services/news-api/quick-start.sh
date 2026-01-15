#!/bin/bash

# Quick start script for News API development
set -e

echo "🚀 Starting News API Development Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL and OpenSearch
echo "📦 Starting PostgreSQL and OpenSearch..."
docker-compose up -d postgres opensearch

echo "⏳ Waiting for services to be ready..."
sleep 10

# Wait for PostgreSQL
echo "🔍 Checking PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U baram > /dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Wait for OpenSearch
echo "🔍 Checking OpenSearch..."
until curl -s http://localhost:9200/_cluster/health > /dev/null 2>&1; do
    echo "   Waiting for OpenSearch..."
    sleep 2
done
echo "✅ OpenSearch is ready"

# Load test data
echo ""
echo "📊 Loading test data into PostgreSQL..."
docker-compose exec -T postgres psql -U baram -d baram < test-data.sql

echo ""
echo "📊 Loading test data into OpenSearch..."
bash opensearch-test-data.sh > /dev/null 2>&1

echo ""
echo "✨ Setup complete! You can now:"
echo ""
echo "   1. Run the API:         cargo run"
echo "   2. Or use Docker:       docker-compose up news-api"
echo "   3. Run tests:           cargo test"
echo "   4. Check health:        curl http://localhost:8080/api/health"
echo ""
echo "📚 API Documentation: http://localhost:8080/api"
echo "🗄️  PostgreSQL:         localhost:5432 (user: baram, password: baram123, db: baram)"
echo "🔍 OpenSearch:          http://localhost:9200"
echo ""
