use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub article_count: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryListResponse {
    pub categories: Vec<Category>,
    pub total: i64,
}
