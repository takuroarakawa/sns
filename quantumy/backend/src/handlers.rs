use axum::{
    extract::Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::models::{ConvertRequest, ConvertResponse};
use crate::plot_generator::PlotGenerator;

/// Health check endpoint
pub async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, "Doctor Canvas API is running! 🚀")
}

/// Main conversion endpoint - converts academic papers to manga plots
pub async fn convert_paper(
    Json(request): Json<ConvertRequest>,
) -> impl IntoResponse {
    tracing::info!(
        "Received conversion request for paper: {:?}",
        request.title.as_deref().unwrap_or("Untitled")
    );

    // Validate input
    if request.paper_text.trim().is_empty() {
        let response = ConvertResponse::error(
            "Paper text cannot be empty".to_string()
        );
        return (StatusCode::BAD_REQUEST, Json(response));
    }

    if request.paper_text.len() > 1_000_000 {
        let response = ConvertResponse::error(
            "Paper text is too long (max 1MB)".to_string()
        );
        return (StatusCode::BAD_REQUEST, Json(response));
    }

    // Convert the paper to a manga plot
    match PlotGenerator::convert_to_manga_plot(
        &request.paper_text,
        request.title.as_deref(),
        request.author.as_deref(),
    ) {
        Ok(plot) => {
            tracing::info!("Successfully generated manga plot");
            let response = ConvertResponse::success(plot);
            (StatusCode::OK, Json(response))
        }
        Err(err) => {
            tracing::error!("Failed to generate plot: {}", err);
            let response = ConvertResponse::error(err);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(response))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_health_check() {
        let response = health_check().await.into_response();
        assert_eq!(response.status(), StatusCode::OK);
    }
}
