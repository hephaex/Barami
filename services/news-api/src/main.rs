mod db;
mod error;
mod models;
mod routes;
mod search;

use axum::{
    routing::get,
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use db::Database;
use search::SearchClient;

#[derive(Clone)]
pub struct AppState {
    db: Database,
    search: SearchClient,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "news_api=debug,tower_http=debug,axum=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables from .env file (optional)
    dotenv::dotenv().ok();

    // Configuration from environment variables
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://baram:baram123@localhost:5432/baram".to_string());

    let opensearch_url = std::env::var("OPENSEARCH_URL")
        .unwrap_or_else(|_| "http://localhost:9200".to_string());

    let opensearch_index = std::env::var("OPENSEARCH_INDEX")
        .unwrap_or_else(|_| "baram-articles".to_string());

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);

    tracing::info!("Starting News API server...");
    tracing::info!("Database URL: {}", database_url);
    tracing::info!("OpenSearch URL: {}", opensearch_url);
    tracing::info!("OpenSearch Index: {}", opensearch_index);

    // Initialize database connection
    let db = Database::new(&database_url).await?;

    // Initialize database schema
    db::init_schema(db.pool()).await?;

    // Initialize search client
    let search = SearchClient::new(&opensearch_url, &opensearch_index);

    // Create application state
    let state = AppState { db, search };

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build application with routes
    let app = Router::new()
        .route("/api/health", get(routes::health_check))
        .route("/api/news", get(routes::get_news_list))
        .route("/api/news/search", get(routes::search_news))
        .route("/api/news/:id", get(routes::get_news_detail))
        .route("/api/stats", get(routes::get_stats))
        .route("/api/stats/daily", get(routes::get_daily_stats))
        .route("/api/categories", get(routes::get_categories))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("News API listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
