use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Search error: {0}")]
    Search(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Bad request: {0}")]
    BadRequest(String),

    #[error("Internal server error: {0}")]
    InternalServerError(String),

    #[error("HTTP client error: {0}")]
    HttpClient(#[from] reqwest::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            Self::Database(ref e) => {
                tracing::error!("Database error: {e:?}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Database error occurred".to_string(),
                )
            }
            Self::Search(ref msg) => {
                tracing::error!("Search error: {msg}");
                (StatusCode::INTERNAL_SERVER_ERROR, msg.clone())
            }
            Self::NotFound(ref msg) => (StatusCode::NOT_FOUND, msg.clone()),
            Self::BadRequest(ref msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            Self::InternalServerError(ref msg) => {
                tracing::error!("Internal server error: {msg}");
                (StatusCode::INTERNAL_SERVER_ERROR, msg.clone())
            }
            Self::HttpClient(ref e) => {
                tracing::error!("HTTP client error: {e:?}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "External service error".to_string(),
                )
            }
            Self::Serialization(ref e) => {
                tracing::error!("Serialization error: {e:?}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Serialization error".to_string(),
                )
            }
        };

        let body = Json(json!({
            "error": error_message,
            "status": status.as_u16(),
        }));

        (status, body).into_response()
    }
}

pub type ApiResult<T> = Result<T, ApiError>;
