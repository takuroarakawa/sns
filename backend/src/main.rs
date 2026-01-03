mod api;
mod models;
mod services;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};
use std::io;

#[actix_web::main]
async fn main() -> io::Result<()> {
    // Initialize logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    println!("🚀 Starting Doctor Canvas Backend Server...");
    println!("📍 Server will be available at: http://localhost:8080");
    println!("📋 API endpoint: POST http://localhost:8080/api/v1/transform");
    println!("❤️  Health check: GET http://localhost:8080/health");

    // Start HTTP server
    HttpServer::new(|| {
        // Configure CORS to allow Flutter frontend
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            // Enable logger middleware
            .wrap(middleware::Logger::default())
            // Enable CORS
            .wrap(cors)
            // Configure routes
            .route("/health", web::get().to(api::health_check))
            .service(
                web::scope("/api/v1")
                    .route("/transform", web::post().to(api::transform_paper))
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
