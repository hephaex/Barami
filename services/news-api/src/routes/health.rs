use axum::{extract::State, Json};
use serde_json::{json, Value};

use crate::{error::ApiResult, AppState};

pub async fn health_check(State(state): State<AppState>) -> ApiResult<Json<Value>> {
    // Check database connection
    let db_healthy = sqlx::query("SELECT 1")
        .fetch_one(&state.db.pool)
        .await
        .is_ok();

    // Check OpenSearch connection
    let search_healthy = state.search.health_check().await.unwrap_or(false);

    let status = if db_healthy && search_healthy {
        "healthy"
    } else {
        "degraded"
    };

    Ok(Json(json!({
        "status": status,
        "database": if db_healthy { "connected" } else { "disconnected" },
        "opensearch": if search_healthy { "connected" } else { "disconnected" },
        "timestamp": chrono::Utc::now(),
    })))
}
