use actix_web::{web, HttpResponse, Result};
use std::time::Instant;

use crate::models::{TransformRequest, TransformResponse, ErrorResponse};
use crate::services::{TextAnalyzer, PlotGenerator};

/// Handler for POST /api/v1/transform
pub async fn transform_paper(req: web::Json<TransformRequest>) -> Result<HttpResponse> {
    let start_time = Instant::now();

    // Validate input
    if req.paper_text.trim().is_empty() {
        let error_response = ErrorResponse {
            success: false,
            error: "Paper text cannot be empty".to_string(),
        };
        return Ok(HttpResponse::BadRequest().json(error_response));
    }

    // Analyze the paper text
    let analyzer = TextAnalyzer::new();
    let analyzed = analyzer.analyze(&req.paper_text);

    // Generate the plot structure
    let generator = PlotGenerator::new();
    let plot = generator.generate_plot(&analyzed);

    // Calculate processing time
    let processing_time_ms = start_time.elapsed().as_millis() as u64;

    // Build response
    let response = TransformResponse {
        success: true,
        plot,
        original_abstract: analyzed.abstract_text,
        processing_time_ms,
    };

    Ok(HttpResponse::Ok().json(response))
}

/// Health check endpoint
pub async fn health_check() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "Doctor Canvas API",
        "version": "0.1.0"
    })))
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{test, App};

    #[actix_rt::test]
    async fn test_health_check() {
        let resp = health_check().await.unwrap();
        assert_eq!(resp.status(), 200);
    }
}
