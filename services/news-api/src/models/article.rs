use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Article {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    pub title: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub image_url: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub published_at: Option<DateTime<Utc>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub crawled_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArticleListResponse {
    pub articles: Vec<Article>,
    pub total: i64,
    pub page: i64,
    pub limit: i64,
    pub total_pages: i64,
}

impl ArticleListResponse {
    pub fn new(articles: Vec<Article>, total: i64, page: i64, limit: i64) -> Self {
        let total_pages = (total as f64 / limit as f64).ceil() as i64;
        Self {
            articles,
            total,
            page,
            limit,
            total_pages,
        }
    }
}
