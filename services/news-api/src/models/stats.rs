use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CrawlStats {
    pub id: i32,
    pub date: NaiveDate,
    pub total_crawled: i32,
    pub success_count: i32,
    pub failed_count: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyCrawlStats {
    pub date: NaiveDate,
    pub total_crawled: i32,
    pub success_count: i32,
    pub failed_count: i32,
}

/// Dashboard-compatible stats response
#[derive(Debug, Serialize, Deserialize)]
pub struct StatsResponse {
    pub total_articles: i64,
    pub today_articles: i64,
    pub categories: HashMap<String, i64>,
    pub publishers: HashMap<String, i64>,
    pub hourly_counts: Vec<HourlyCount>,
    pub daily_counts: Vec<DailyCount>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HourlyCount {
    pub hour: String,
    pub count: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyCount {
    pub date: String,
    pub count: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyStatsResponse {
    pub stats: Vec<DailyCrawlStats>,
    pub total_days: i64,
}

/// System status response for /api/status
#[derive(Debug, Serialize, Deserialize)]
pub struct SystemStatusResponse {
    pub database: String,
    pub llm: String,
    pub disk_usage: f64,
    pub uptime: i64,
}
