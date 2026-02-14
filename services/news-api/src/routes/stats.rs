use axum::{extract::State, Json};
use std::collections::HashMap;

use crate::{
    error::ApiResult,
    models::{DailyCount, DailyCrawlStats, DailyStatsResponse, HourlyCount, StatsResponse, SystemStatusResponse},
    AppState,
};

/// GET /api/stats - Dashboard statistics from OpenSearch aggregations
pub async fn get_stats(State(state): State<AppState>) -> ApiResult<Json<StatsResponse>> {
    let body = state.search.get_dashboard_stats().await?;

    // Total articles
    let total_articles = body["hits"]["total"]["value"].as_i64().unwrap_or(0);

    // Today's articles
    let today_articles = body["aggregations"]["today_articles"]["doc_count"]
        .as_i64()
        .unwrap_or(0);

    // Categories
    let mut categories = HashMap::new();
    if let Some(buckets) = body["aggregations"]["categories"]["buckets"].as_array() {
        for bucket in buckets {
            if let (Some(key), Some(count)) = (bucket["key"].as_str(), bucket["doc_count"].as_i64())
            {
                if !key.is_empty() {
                    categories.insert(key.to_string(), count);
                }
            }
        }
    }

    // Publishers
    let mut publishers = HashMap::new();
    if let Some(buckets) = body["aggregations"]["publishers"]["buckets"].as_array() {
        for bucket in buckets {
            if let (Some(key), Some(count)) = (bucket["key"].as_str(), bucket["doc_count"].as_i64())
            {
                if !key.is_empty() {
                    publishers.insert(key.to_string(), count);
                }
            }
        }
    }

    // Daily counts (last 30 days)
    let mut daily_counts = Vec::new();
    if let Some(buckets) = body["aggregations"]["daily_counts"]["buckets"].as_array() {
        for bucket in buckets.iter().take(30) {
            if let (Some(date), Some(count)) =
                (bucket["key_as_string"].as_str(), bucket["doc_count"].as_i64())
            {
                daily_counts.push(DailyCount {
                    date: date.to_string(),
                    count,
                });
            }
        }
    }

    // Hourly counts (last 24h)
    let mut hourly_counts = Vec::new();
    if let Some(buckets) = body["aggregations"]["hourly_counts"]["hours"]["buckets"].as_array() {
        for bucket in buckets {
            if let (Some(hour), Some(count)) =
                (bucket["key_as_string"].as_str(), bucket["doc_count"].as_i64())
            {
                hourly_counts.push(HourlyCount {
                    hour: hour.to_string(),
                    count,
                });
            }
        }
    }

    Ok(Json(StatsResponse {
        total_articles,
        today_articles,
        categories,
        publishers,
        hourly_counts,
        daily_counts,
    }))
}

/// GET /api/status - System status
pub async fn get_status(State(state): State<AppState>) -> ApiResult<Json<SystemStatusResponse>> {
    // Check database
    let db_status = if sqlx::query("SELECT 1")
        .fetch_one(&state.db.pool)
        .await
        .is_ok()
    {
        "healthy"
    } else {
        "unhealthy"
    };

    // Check LLM (vLLM on port 8002)
    let llm_status = match reqwest::Client::new()
        .get("http://baram-vllm:8002/health")
        .timeout(std::time::Duration::from_secs(3))
        .send()
        .await
    {
        Ok(resp) if resp.status().is_success() => "healthy",
        Ok(_) => "unhealthy",
        Err(_) => "unavailable",
    };

    // Get uptime from /proc/uptime
    let uptime = match tokio::fs::read_to_string("/proc/uptime").await {
        Ok(content) => content
            .split_whitespace()
            .next()
            .and_then(|s| s.parse::<f64>().ok())
            .map(|s| s as i64)
            .unwrap_or(0),
        Err(_) => 0,
    };

    // Disk usage: check /app or root filesystem
    let disk_usage = get_disk_usage().await;

    Ok(Json(SystemStatusResponse {
        database: db_status.to_string(),
        llm: llm_status.to_string(),
        disk_usage,
        uptime,
    }))
}

async fn get_disk_usage() -> f64 {
    // Use statvfs-like approach via df command
    match tokio::process::Command::new("df")
        .args(["--output=pcent", "/"])
        .output()
        .await
    {
        Ok(output) => {
            let text = String::from_utf8_lossy(&output.stdout);
            text.lines()
                .nth(1)
                .and_then(|line| line.trim().trim_end_matches('%').parse::<f64>().ok())
                .unwrap_or(0.0)
        }
        Err(_) => 0.0,
    }
}

/// GET /api/stats/daily - Daily crawling stats from PostgreSQL
pub async fn get_daily_stats(
    State(state): State<AppState>,
) -> ApiResult<Json<DailyStatsResponse>> {
    let stats: Vec<crate::models::CrawlStats> = sqlx::query_as(
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
