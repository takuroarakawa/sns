# Quantumy - Doctor Canvas Architecture

## Project Overview

**Quantumy (カンタミ)** is a platform aiming for a 100 trillion yen market cap. Phase 1 focuses on "Doctor Canvas" - a tool that transforms academic papers into engaging manga-style story plots.

## Phase 1: Doctor Canvas

### Concept
Converts academic research papers into exciting manga plots (起承転結 - Ki-Sho-Ten-Ketsu structure):
- **起 (Ki)**: Introduction - Setting the scene
- **承 (Sho)**: Development - Building the story
- **転 (Ten)**: Twist - The unexpected turn
- **結 (Ketsu)**: Conclusion - Resolution

### Technology Stack

#### Backend: Rust
- **Framework**: Axum (Fast, ergonomic web framework)
- **Purpose**: Text analysis and plot generation
- **API**: RESTful HTTP API for cross-platform compatibility

#### Frontend: Flutter
- **Framework**: Flutter (Cross-platform UI)
- **Platform Support**: Web, iOS, Android, Desktop
- **Communication**: HTTP REST API calls to Rust backend

### Architecture Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Flutter Frontend                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  UI Components                                       │    │
│  │  - Paper Input Screen                               │    │
│  │  - Plot Display Screen                              │    │
│  │  - Loading States                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          │ HTTP REST API                     │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  API Service Layer                                  │    │
│  │  - HTTP Client (http package)                       │    │
│  │  - Request/Response Models                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Rust Backend                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Axum HTTP Server                                   │    │
│  │  - Route Handlers                                   │    │
│  │  - JSON Serialization (serde)                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Plot Generator Service                             │    │
│  │  - Text Analysis                                    │    │
│  │  - Ki-Sho-Ten-Ketsu Structure Generation            │    │
│  │  - Manga Plot Transformation Logic                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### API Specification

#### Endpoint: `POST /api/convert`

**Request:**
```json
{
  "paper_text": "Academic paper content...",
  "title": "Paper Title",
  "author": "Dr. Name"
}
```

**Response:**
```json
{
  "success": true,
  "plot": {
    "ki": {
      "title": "起 - Introduction",
      "content": "The hero discovers the challenge..."
    },
    "sho": {
      "title": "承 - Development",
      "content": "Training and preparation begins..."
    },
    "ten": {
      "title": "転 - Twist",
      "content": "Unexpected obstacles appear..."
    },
    "ketsu": {
      "title": "結 - Resolution",
      "content": "Victory through perseverance..."
    }
  }
}
```

### Why REST API over FFI?

1. **Simplicity**: HTTP REST is standard and well-understood
2. **Cross-platform**: Works seamlessly across all Flutter targets (Web, Mobile, Desktop)
3. **Development**: Can develop and test backend/frontend independently
4. **Scalability**: Easy to deploy backend separately, scale horizontally
5. **Debugging**: HTTP requests are easy to inspect and debug
6. **Maintenance**: No complex FFI bindings to maintain

### Directory Structure

```
quantumy/
├── ARCHITECTURE.md          # This file
├── backend/                 # Rust backend
│   ├── Cargo.toml
│   ├── src/
│   │   ├── main.rs         # Axum server setup
│   │   ├── models.rs       # Data models
│   │   ├── handlers.rs     # API handlers
│   │   └── plot_generator.rs  # Core logic
│   └── README.md
├── frontend/                # Flutter frontend
│   ├── pubspec.yaml
│   ├── lib/
│   │   ├── main.dart       # App entry point
│   │   ├── models/         # Data models
│   │   ├── services/       # API service
│   │   ├── screens/        # UI screens
│   │   └── widgets/        # Reusable components
│   └── README.md
└── README.md               # Project overview
```

### Future Enhancements

- AI/ML integration for smarter plot generation
- Multi-language support
- User authentication and saved papers
- Collaboration features
- Export to various formats
- Integration with research databases
