use axum::{extract::State, Json};

use crate::{
    error::ApiResult,
    models::{Category, CategoryListResponse},
    AppState,
};

/// GET /api/categories - List categories
pub async fn get_categories(
    State(state): State<AppState>,
) -> ApiResult<Json<CategoryListResponse>> {
    let categories: Vec<Category> = sqlx::query_as(
        r#"
        SELECT id, name, article_count
        FROM categories
        ORDER BY article_count DESC
        "#,
    )
    .fetch_all(&state.db.pool)
    .await?;

    let total = categories.len() as i64;

    Ok(Json(CategoryListResponse { categories, total }))
}
