use crate::error::{ApiError, ApiResult};
use crate::models::Article;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Clone)]
pub struct SearchClient {
    client: Client,
    base_url: String,
    index_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchResponse {
    hits: SearchHits,
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchHits {
    total: SearchTotal,
    hits: Vec<SearchHit>,
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchTotal {
    value: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchHit {
    #[serde(rename = "_source")]
    source: Article,
}

impl SearchClient {
    pub fn new(opensearch_url: &str, index_name: &str) -> Self {
        Self {
            client: Client::new(),
            base_url: opensearch_url.to_string(),
            index_name: index_name.to_string(),
        }
    }

    /// Search for articles by keyword
    pub async fn search_articles(&self, query: &str, from: i64, size: i64) -> ApiResult<(Vec<Article>, i64)> {
        let url = format!("{}/{}/_search", self.base_url, self.index_name);

        let search_query = json!({
            "from": from,
            "size": size,
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title^3", "content", "category"],
                    "type": "best_fields",
                    "fuzziness": "AUTO"
                }
            },
            "sort": [
                { "published_at": { "order": "desc" } }
            ]
        });

        let response = self
            .client
            .post(&url)
            .json(&search_query)
            .send()
            .await
            .map_err(|e| ApiError::Search(format!("Failed to send search request: {e}")))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(ApiError::Search(format!(
                "Search request failed with status {status}: {text}"
            )));
        }

        let search_response: SearchResponse = response.json().await.map_err(|e| {
            ApiError::Search(format!("Failed to parse search response: {e}"))
        })?;

        let articles: Vec<Article> = search_response
            .hits
            .hits
            .into_iter()
            .map(|hit| hit.source)
            .collect();

        let total = search_response.hits.total.value;

        Ok((articles, total))
    }

    /// Get articles with pagination
    pub async fn get_articles(&self, from: i64, size: i64) -> ApiResult<(Vec<Article>, i64)> {
        let url = format!("{}/{}/_search", self.base_url, self.index_name);

        let query = json!({
            "from": from,
            "size": size,
            "query": {
                "match_all": {}
            },
            "sort": [
                { "published_at": { "order": "desc" } }
            ]
        });

        let response = self
            .client
            .post(&url)
            .json(&query)
            .send()
            .await
            .map_err(|e| ApiError::Search(format!("Failed to fetch articles: {e}")))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(ApiError::Search(format!(
                "Fetch articles failed with status {status}: {text}"
            )));
        }

        let search_response: SearchResponse = response.json().await.map_err(|e| {
            ApiError::Search(format!("Failed to parse articles response: {e}"))
        })?;

        let articles: Vec<Article> = search_response
            .hits
            .hits
            .into_iter()
            .map(|hit| hit.source)
            .collect();

        let total = search_response.hits.total.value;

        Ok((articles, total))
    }

    /// Get article by ID
    pub async fn get_article_by_id(&self, id: &str) -> ApiResult<Article> {
        let url = format!("{}/{}/_doc/{}", self.base_url, self.index_name, id);

        let response = self
            .client
            .get(&url)
            .send()
            .await
            .map_err(|e| ApiError::Search(format!("Failed to fetch article: {e}")))?;

        if response.status() == reqwest::StatusCode::NOT_FOUND {
            return Err(ApiError::NotFound(format!("Article with id {id} not found")));
        }

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(ApiError::Search(format!(
                "Fetch article failed with status {status}: {text}"
            )));
        }

        #[derive(Deserialize)]
        struct GetResponse {
            #[serde(rename = "_source")]
            source: Article,
        }

        let get_response: GetResponse = response.json().await.map_err(|e| {
            ApiError::Search(format!("Failed to parse article response: {e}"))
        })?;

        Ok(get_response.source)
    }

    /// Health check for OpenSearch
    pub async fn health_check(&self) -> ApiResult<bool> {
        let url = format!("{}/_cluster/health", self.base_url);

        let response = self.client.get(&url).send().await?;

        Ok(response.status().is_success())
    }
}
