use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

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

#[derive(Debug, Serialize, Deserialize)]
pub struct StatsResponse {
    pub total_articles: i64,
    pub total_crawled_today: i32,
    pub success_rate: f64,
    pub recent_stats: Vec<CrawlStats>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyStatsResponse {
    pub stats: Vec<DailyCrawlStats>,
    pub total_days: i64,
}
