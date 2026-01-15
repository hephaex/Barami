use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;

use crate::{
    error::{ApiError, ApiResult},
    models::{Article, ArticleListResponse},
    AppState,
};

#[derive(Debug, Deserialize)]
pub struct PaginationParams {
    #[serde(default = "default_page")]
    pub page: i64,
    #[serde(default = "default_limit")]
    pub limit: i64,
}

fn default_page() -> i64 {
    1
}

fn default_limit() -> i64 {
    20
}

#[derive(Debug, Deserialize)]
pub struct SearchParams {
    pub q: String,
    #[serde(default = "default_page")]
    pub page: i64,
    #[serde(default = "default_limit")]
    pub limit: i64,
}

/// GET /api/news - List news with pagination
pub async fn get_news_list(
    State(state): State<AppState>,
    Query(params): Query<PaginationParams>,
) -> ApiResult<Json<ArticleListResponse>> {
    let page = params.page.max(1);
    let limit = params.limit.clamp(1, 100);
    let from = (page - 1) * limit;

    let (articles, total) = state.search.get_articles(from, limit).await?;

    Ok(Json(ArticleListResponse::new(articles, total, page, limit)))
}

/// GET /api/news/:id - Get news detail by ID
pub async fn get_news_detail(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> ApiResult<Json<Article>> {
    let article = state.search.get_article_by_id(&id).await?;

    Ok(Json(article))
}

/// GET /api/news/search?q=keyword - Search news
pub async fn search_news(
    State(state): State<AppState>,
    Query(params): Query<SearchParams>,
) -> ApiResult<Json<ArticleListResponse>> {
    if params.q.trim().is_empty() {
        return Err(ApiError::BadRequest(
            "Search query cannot be empty".to_string(),
        ));
    }

    let page = params.page.max(1);
    let limit = params.limit.clamp(1, 100);
    let from = (page - 1) * limit;

    let (articles, total) = state.search.search_articles(&params.q, from, limit).await?;

    Ok(Json(ArticleListResponse::new(articles, total, page, limit)))
}
