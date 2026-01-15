use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use std::time::Duration;

pub type DbPool = Pool<Postgres>;

#[derive(Clone)]
pub struct Database {
    pub pool: DbPool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self, sqlx::Error> {
        tracing::info!("Connecting to PostgreSQL database...");

        let pool = PgPoolOptions::new()
            .max_connections(10)
            .acquire_timeout(Duration::from_secs(5))
            .connect(database_url)
            .await?;

        tracing::info!("Successfully connected to PostgreSQL database");

        Ok(Self { pool })
    }

    pub fn pool(&self) -> &DbPool {
        &self.pool
    }
}

// Initialize database schema
pub async fn init_schema(pool: &DbPool) -> Result<(), sqlx::Error> {
    tracing::info!("Initializing database schema...");

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS crawl_stats (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            total_crawled INT DEFAULT 0,
            success_count INT DEFAULT 0,
            failed_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        )
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            article_count INT DEFAULT 0
        )
        "#,
    )
    .execute(pool)
    .await?;

    tracing::info!("Database schema initialized successfully");

    Ok(())
}
