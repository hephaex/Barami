use axum::{extract::State, Json};

use crate::{
    error::ApiResult,
    models::{CrawlStats, DailyCrawlStats, DailyStatsResponse, StatsResponse},
    AppState,
};

/// GET /api/stats - Get crawling statistics
pub async fn get_stats(State(state): State<AppState>) -> ApiResult<Json<StatsResponse>> {
    // Get total articles from OpenSearch
    let (_, total_articles) = state.search.get_articles(0, 1).await?;

    // Get today's crawl stats
    let today_stats: Option<CrawlStats> = sqlx::query_as(
        r#"
        SELECT id, date, total_crawled, success_count, failed_count, created_at
        FROM crawl_stats
        WHERE date = CURRENT_DATE
        ORDER BY created_at DESC
        LIMIT 1
        "#,
    )
    .fetch_optional(&state.db.pool)
    .await?;

    let total_crawled_today = today_stats.as_ref().map(|s| s.total_crawled).unwrap_or(0);

    // Calculate success rate
    let success_rate = if let Some(stats) = &today_stats {
        if stats.total_crawled > 0 {
            (stats.success_count as f64 / stats.total_crawled as f64) * 100.0
        } else {
            0.0
        }
    } else {
        0.0
    };

    // Get recent stats (last 7 days)
    let recent_stats: Vec<CrawlStats> = sqlx::query_as(
        r#"
        SELECT id, date, total_crawled, success_count, failed_count, created_at
        FROM crawl_stats
        ORDER BY date DESC
        LIMIT 7
        "#,
    )
    .fetch_all(&state.db.pool)
    .await?;

    Ok(Json(StatsResponse {
        total_articles,
        total_crawled_today,
        success_rate,
        recent_stats,
    }))
}

/// GET /api/stats/daily - Get daily crawling stats
pub async fn get_daily_stats(
    State(state): State<AppState>,
) -> ApiResult<Json<DailyStatsResponse>> {
    // Get all daily stats
    let stats: Vec<CrawlStats> = sqlx::query_as(
        r#"
        SELECT id, date, total_crawled, success_count, failed_count, created_at
        FROM crawl_stats
        ORDER BY date DESC
        "#,
    )
    .fetch_all(&state.db.pool)
    .await?;

    let total_days = stats.len() as i64;

    let daily_stats: Vec<DailyCrawlStats> = stats
        .into_iter()
        .map(|s| DailyCrawlStats {
            date: s.date,
            total_crawled: s.total_crawled,
            success_count: s.success_count,
            failed_count: s.failed_count,
        })
        .collect();

    Ok(Json(DailyStatsResponse {
        stats: daily_stats,
        total_days,
    }))
}
