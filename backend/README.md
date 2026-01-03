# Doctor Canvas Backend

Rust-based backend API for transforming academic papers into engaging manga-style story plots.

## Features

- RESTful API built with Actix-web
- Text analysis of academic papers
- Kishōtenketsu (起承転結) plot structure generation
- CORS-enabled for Flutter frontend integration

## Requirements

- Rust 1.70 or higher
- Cargo

## Installation

```bash
cd backend
cargo build
```

## Running the Server

```bash
cargo run
```

The server will start on `http://localhost:8080`

## API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "Doctor Canvas API",
  "version": "0.1.0"
}
```

### Transform Paper to Plot
```bash
POST /api/v1/transform
Content-Type: application/json

{
  "paper_text": "Your academic paper text here...",
  "author_name": "Dr. Name (optional)"
}
```

Response:
```json
{
  "success": true,
  "plot": {
    "ki": "起 (Introduction): The exciting beginning...",
    "sho": "承 (Development): The challenges emerge...",
    "ten": "転 (Twist): The dramatic turning point...",
    "ketsu": "結 (Conclusion): The triumphant resolution..."
  },
  "original_abstract": "Extracted abstract or summary",
  "processing_time_ms": 150
}
```

## Testing

Run tests with:
```bash
cargo test
```

## Project Structure

```
backend/
├── src/
│   ├── main.rs              # Application entry point
│   ├── api/                 # API routes and handlers
│   │   ├── mod.rs
│   │   └── transform.rs
│   ├── models/              # Data models
│   │   ├── mod.rs
│   │   ├── request.rs
│   │   └── response.rs
│   └── services/            # Business logic
│       ├── mod.rs
│       ├── text_analyzer.rs
│       └── plot_generator.rs
├── Cargo.toml
└── README.md
```

## Development

The backend uses:
- **Actix-web** for the HTTP server
- **Serde** for JSON serialization
- **Regex** for text pattern matching
- **Tokio** for async runtime

## License

Part of the Quantumy project.
