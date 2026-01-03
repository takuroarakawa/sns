# Quantumy (カンタミ)

> Aiming for a 100 trillion yen market cap enterprise

## Project Overview

Quantumy is an ambitious project to revolutionize how academic knowledge is communicated and shared. Our goal is to make scientific research more accessible and engaging by transforming complex academic papers into compelling narratives.

## Phase 1: Doctor Canvas

**Doctor Canvas** is the first component of the Quantumy project. It transforms academic papers into engaging manga-style story plots using the traditional Japanese narrative structure of **kishōtenketsu** (起承転結).

### What is Kishōtenketsu?

Kishōtenketsu is a four-act story structure used in Japanese and Chinese narratives:

- **起 (Ki)** - Introduction: Sets the scene and introduces characters
- **承 (Sho)** - Development: Develops the story and builds tension
- **転 (Ten)** - Twist: Introduces an unexpected change or revelation
- **結 (Ketsu)** - Conclusion: Resolves the story and provides closure

### Features

- 📝 Transform academic papers into exciting narratives
- 🎨 Manga-style plot generation with kishōtenketsu structure
- ⚡ Fast processing with Rust backend
- 📱 Cross-platform Flutter frontend (iOS, Android, Web, Desktop)
- 🔄 RESTful API architecture

## Technology Stack

### Backend
- **Language**: Rust
- **Framework**: Actix-web
- **Features**: Text analysis, plot generation, REST API

### Frontend
- **Framework**: Flutter
- **Platforms**: iOS, Android, Web, Desktop
- **Features**: Clean UI, real-time transformation

## Architecture

```
┌─────────────────────────────────────┐
│        Flutter Frontend             │
│  - Cross-platform UI                │
│  - Material Design 3                │
│  - HTTP Client                      │
└──────────────┬──────────────────────┘
               │ REST API (JSON)
               │
┌──────────────┴──────────────────────┐
│         Rust Backend                │
│  - Actix-web Server                 │
│  - Text Analysis Engine             │
│  - Plot Generation Logic            │
│  - Kishōtenketsu Transformer        │
└─────────────────────────────────────┘
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design documentation.

## Project Structure

```
quantumy/
├── ARCHITECTURE.md          # Architecture documentation
├── README.md               # This file
├── backend/                # Rust backend
│   ├── src/
│   │   ├── main.rs        # Server entry point
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Data models
│   │   └── services/      # Business logic
│   ├── Cargo.toml
│   └── README.md
└── frontend/              # Flutter frontend
    ├── lib/
    │   ├── main.dart      # App entry point
    │   ├── models/        # Data models
    │   ├── services/      # API client
    │   ├── screens/       # UI screens
    │   └── widgets/       # UI components
    ├── pubspec.yaml
    └── README.md
```

## Quick Start

### Prerequisites

- **Rust**: 1.70 or higher
- **Flutter**: 3.0 or higher
- **Dart**: 3.0 or higher

### 1. Start the Backend

```bash
cd backend
cargo run
```

The server will start at `http://localhost:8080`

### 2. Start the Frontend

```bash
cd frontend
flutter pub get
flutter run
```

### 3. Use the Application

1. Enter your academic paper text (including abstract, methodology, findings, and conclusions)
2. Optionally enter the author name
3. Click "Transform to Epic Plot!"
4. View your paper transformed into an exciting manga-style narrative!

## API Usage

### Transform Paper Endpoint

```bash
POST http://localhost:8080/api/v1/transform
Content-Type: application/json

{
  "paper_text": "Your academic paper text...",
  "author_name": "Dr. Name (optional)"
}
```

### Health Check

```bash
GET http://localhost:8080/health
```

See [backend/README.md](backend/README.md) for detailed API documentation.

## Example Transformation

**Input**: Academic paper about climate change research

**Output**:
- **起 (Introduction)**: "In the halls of academia, a brilliant mind pondered: What truly drives our changing climate? The stage was set for an epic quest for truth!"
- **承 (Development)**: "With unwavering focus, wielding the power of statistical analysis and field observations..."
- **転 (Twist)**: "BREAKTHROUGH! The data revealed a powerful correlation that defied all expectations..."
- **結 (Conclusion)**: "Victory! This discovery opened doors to infinite possibilities, lighting the way for future heroes..."

## Development

### Backend Development

```bash
cd backend
cargo build      # Build
cargo test       # Run tests
cargo run        # Run server
```

### Frontend Development

```bash
cd frontend
flutter pub get       # Install dependencies
flutter run          # Run with hot reload
flutter test         # Run tests
flutter build apk    # Build Android APK
flutter build web    # Build for web
```

## Testing

Both backend and frontend include comprehensive test suites:

```bash
# Backend tests
cd backend && cargo test

# Frontend tests
cd frontend && flutter test
```

## Roadmap

### Phase 1: Doctor Canvas (Current)
- [x] Core text transformation engine
- [x] Kishōtenketsu plot generation
- [x] REST API backend
- [x] Cross-platform Flutter UI
- [ ] AI/ML integration for improved transformation
- [ ] PDF upload support
- [ ] Multiple language support

### Phase 2: Future Features
- User authentication and saved transformations
- Collaborative editing features
- Advanced plot customization
- Integration with academic databases
- Social sharing capabilities

## Contributing

This is a private project for Quantumy. For questions or collaboration opportunities, please contact the project team.

## License

© 2026 Quantumy Project. All rights reserved.

---

**Built with ❤️ using Rust + Flutter**

*Transforming academic knowledge into engaging stories, one paper at a time.*
