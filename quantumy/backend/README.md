# Doctor Canvas Backend

Rust-based backend API for converting academic papers into manga-style story plots.

## Technology Stack

- **Framework**: Axum (Modern, fast web framework for Rust)
- **Runtime**: Tokio (Async runtime)
- **Serialization**: Serde + Serde JSON
- **CORS**: Tower HTTP

## Features

- 🎨 Converts academic papers to Ki-Sho-Ten-Ketsu (起承転結) manga plots
- 📝 Text analysis and theme extraction
- 🚀 Fast and efficient Rust implementation
- 🌐 RESTful API with CORS support
- 📊 Structured JSON responses

## API Endpoints

### Health Check
```bash
GET /health
```

### Convert Paper to Manga Plot
```bash
POST /api/convert
Content-Type: application/json

{
  "paper_text": "Your academic paper text here...",
  "title": "Optional paper title",
  "author": "Optional author name"
}
```

**Response:**
```json
{
  "success": true,
  "plot": {
    "ki": {
      "title": "起 (Ki) - The Challenge Emerges",
      "content": "...",
      "highlights": ["..."]
    },
    "sho": {
      "title": "承 (Sho) - The Journey Begins",
      "content": "...",
      "highlights": ["..."]
    },
    "ten": {
      "title": "転 (Ten) - The Dramatic Twist",
      "content": "...",
      "highlights": ["..."]
    },
    "ketsu": {
      "title": "結 (Ketsu) - Triumphant Resolution",
      "content": "...",
      "highlights": ["..."]
    }
  }
}
```

## Setup and Running

### Prerequisites
- Rust 1.70+ (install from https://rustup.rs/)

### Build and Run

```bash
# Development mode (with hot reload using cargo-watch)
cargo watch -x run

# Or standard development run
cargo run

# Production build
cargo build --release
./target/release/doctor-canvas-backend
```

The server will start on `http://localhost:3000`

### Testing

```bash
# Run all tests
cargo test

# Run tests with output
cargo test -- --nocapture

# Test the API with curl
curl http://localhost:3000/health

# Test conversion endpoint
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "paper_text": "This research explores the fascinating world of quantum computing. We developed a novel algorithm that improves quantum error correction. The methodology involves advanced techniques in quantum mechanics. Despite significant challenges in hardware limitations, our results demonstrate a 40% improvement in error rates. This breakthrough opens new possibilities for practical quantum computing applications.",
    "title": "Quantum Error Correction Breakthrough",
    "author": "Dr. Quantum"
  }'
```

## Project Structure

```
backend/
├── Cargo.toml          # Dependencies and project config
├── src/
│   ├── main.rs         # Axum server setup and routing
│   ├── models.rs       # Data models (Request/Response)
│   ├── handlers.rs     # API endpoint handlers
│   └── plot_generator.rs  # Core conversion logic
└── README.md
```

## Development

### Adding New Features

1. **New Analysis Algorithms**: Add to `plot_generator.rs`
2. **New Endpoints**: Add routes in `main.rs` and handlers in `handlers.rs`
3. **New Data Models**: Define in `models.rs`

### Code Style

This project follows standard Rust conventions:
- Run `cargo fmt` to format code
- Run `cargo clippy` for linting
- Write tests for new functionality

## Performance

- Handles papers up to 1MB in size
- Average response time: < 50ms for typical papers
- Concurrent request handling via Tokio async runtime

## Future Enhancements

- [ ] AI/LLM integration for smarter plot generation
- [ ] Multi-language support (Japanese, English, etc.)
- [ ] Database integration for caching results
- [ ] Rate limiting and authentication
- [ ] WebSocket support for real-time updates
- [ ] More sophisticated NLP analysis
