# Multi-stage build for News API service
# Stage 1: Builder
FROM rust:1.75-slim as builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Create a new empty project
WORKDIR /app

# Copy manifests
COPY Cargo.toml ./

# Create a dummy main.rs to build dependencies
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs

# Build dependencies - this is the caching layer
RUN cargo build --release && \
    rm -rf src

# Copy the actual source code
COPY src ./src

# Build the application
# Touch main.rs to force rebuild
RUN touch src/main.rs && \
    cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1000 newsapi

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/news-api /app/news-api

# Change ownership
RUN chown -R newsapi:newsapi /app

# Switch to non-root user
USER newsapi

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
CMD ["/app/news-api"]
