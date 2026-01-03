# Quantumy (カンタミ) - Phase 1: Doctor Canvas

**Vision**: Building towards a 100 trillion yen market cap company

**Phase 1**: Doctor Canvas - Transform academic papers into exciting manga-style story plots

## 🎯 Project Overview

Doctor Canvas is an innovative tool that converts academic research papers into engaging manga-style narratives using the traditional Japanese storytelling structure: **Ki-Sho-Ten-Ketsu (起承転結)**.

### What is Ki-Sho-Ten-Ketsu?

- **起 (Ki) - Introduction**: Sets the scene and introduces the challenge
- **承 (Sho) - Development**: The journey and preparation
- **転 (Ten) - Twist**: Unexpected challenges and breakthroughs
- **結 (Ketsu) - Resolution**: Victory and conclusions

## 🏗️ Architecture

This project uses a modern, scalable architecture:

- **Backend**: Rust with Axum framework (high-performance REST API)
- **Frontend**: Flutter (cross-platform UI for Web, Mobile, Desktop)
- **Communication**: HTTP REST API with JSON

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for detailed design documentation.

## 📁 Project Structure

```
quantumy/
├── ARCHITECTURE.md          # System design and architecture
├── README.md               # This file
├── backend/                # Rust backend
│   ├── Cargo.toml
│   ├── src/
│   │   ├── main.rs        # Axum server
│   │   ├── models.rs      # Data models
│   │   ├── handlers.rs    # API handlers
│   │   └── plot_generator.rs  # Core conversion logic
│   └── README.md
└── frontend/               # Flutter frontend
    ├── pubspec.yaml
    ├── lib/
    │   ├── main.dart      # App entry point
    │   ├── models/        # Data models
    │   ├── services/      # API service
    │   └── screens/       # UI screens
    └── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Rust** 1.70+ ([Install Rust](https://rustup.rs/))
- **Flutter** 3.0+ ([Install Flutter](https://flutter.dev/docs/get-started/install))

### 1. Start the Backend

```bash
cd quantumy/backend
cargo run
```

The backend will start on `http://localhost:3000`

### 2. Start the Frontend

```bash
cd quantumy/frontend
flutter pub get
flutter run
```

Choose your platform (web, desktop, mobile)

### 3. Try It Out!

1. Enter an academic paper (title, author, text)
2. Click "Convert to Manga Plot"
3. View your paper transformed into an exciting story!

## 📖 Usage Example

### Input:
```
Title: Quantum Error Correction Breakthrough
Author: Dr. Quantum
Text: This research explores quantum computing. We developed a novel 
algorithm that improves quantum error correction. The methodology 
involves advanced techniques. Despite hardware limitations, our results 
demonstrate a 40% improvement. This opens new possibilities...
```

### Output:
A complete manga-style plot with:
- **Ki**: The challenge of quantum error correction emerges
- **Sho**: The hero develops advanced algorithms and techniques
- **Ten**: Hardware limitations create dramatic obstacles
- **Ketsu**: Breakthrough achieved with 40% improvement!

## 🔧 Development

### Backend Development

```bash
cd quantumy/backend

# Run with auto-reload (requires cargo-watch)
cargo watch -x run

# Run tests
cargo test

# Format code
cargo fmt

# Lint code
cargo clippy
```

### Frontend Development

```bash
cd quantumy/frontend

# Hot reload during development
flutter run

# Run tests
flutter test

# Format code
flutter format .

# Analyze code
flutter analyze
```

## 🧪 Testing the API

```bash
# Health check
curl http://localhost:3000/health

# Convert a paper
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "paper_text": "Your research paper here...",
    "title": "Paper Title",
    "author": "Dr. Name"
  }'
```

## 🎨 Features

- ✅ Academic paper to manga plot conversion
- ✅ Ki-Sho-Ten-Ketsu story structure
- ✅ Text analysis and theme extraction
- ✅ Beautiful, responsive UI
- ✅ Cross-platform support (Web, iOS, Android, Desktop)
- ✅ REST API architecture
- ✅ Fast Rust backend
- ✅ Modern Flutter frontend

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic text-to-plot conversion
- [x] Ki-Sho-Ten-Ketsu structure
- [x] Web interface
- [ ] Advanced NLP analysis
- [ ] AI/LLM integration

### Phase 2 (Future)
- [ ] Multi-language support (Japanese, English, etc.)
- [ ] Visual manga generation
- [ ] Collaboration features
- [ ] Database integration
- [ ] User authentication
- [ ] Paper database integration

### Phase 3 (Future)
- [ ] Mobile apps (iOS, Android)
- [ ] Desktop apps (macOS, Windows, Linux)
- [ ] API marketplace
- [ ] Enterprise features

## 📚 Documentation

- [`ARCHITECTURE.md`](ARCHITECTURE.md) - System architecture and design decisions
- [`backend/README.md`](backend/README.md) - Backend setup and API documentation
- [`frontend/README.md`](frontend/README.md) - Frontend setup and development guide

## 🤝 Contributing

This project is part of the Quantumy vision. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Copyright © 2026 Quantumy Project

## 🌟 Vision

Doctor Canvas is just the beginning. Quantumy aims to revolutionize how academic knowledge is communicated and consumed, making research accessible and exciting for everyone.

**Target**: 100 trillion yen market cap
**Mission**: Transform academic communication
**Approach**: Start with manga-style storytelling, expand globally

---

Built with ❤️ using Rust 🦀 and Flutter 💙
