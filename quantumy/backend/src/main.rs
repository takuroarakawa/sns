mod handlers;
mod models;
mod plot_generator;

use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "doctor_canvas_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Configure CORS to allow Flutter frontend
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build the application router
    let app = Router::new()
        .route("/", get(root_handler))
        .route("/health", get(handlers::health_check))
        .route("/api/convert", post(handlers::convert_paper))
        .layer(cors);

    // Set the server address
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    tracing::info!("🚀 Doctor Canvas Backend starting on http://{}", addr);
    tracing::info!("📖 API Documentation:");
    tracing::info!("  GET  /           - Root endpoint");
    tracing::info!("  GET  /health     - Health check");
    tracing::info!("  POST /api/convert - Convert paper to manga plot");

    // Start the server
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind to address");
    
    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}

/// Root endpoint handler
async fn root_handler() -> &'static str {
    r#"
    🎨 Welcome to Doctor Canvas Backend! 🎨
    
    Quantumy Project - Phase 1
    
    This API converts academic papers into exciting manga-style plots!
    
    Available Endpoints:
    - GET  /health          Health check
    - POST /api/convert     Convert paper to manga plot
    
    Example request to /api/convert:
    {
        "paper_text": "Your academic paper text here...",
        "title": "Your Paper Title",
        "author": "Dr. Your Name"
    }
    
    The response will contain a Ki-Sho-Ten-Ketsu structured manga plot! 🚀
    "#
}
