# Quantumy - Doctor Canvas Architecture

## Project Overview

**Project Name:** Quantumy (カンタミ)  
**Phase 1 Component:** Doctor Canvas  
**Goal:** Convert academic paper text into engaging manga-style story plots (起承転結 - kishōtenketsu format)

## Technology Stack

### Backend
- **Language:** Rust
- **Web Framework:** Actix-web
- **API Style:** RESTful HTTP API
- **Text Processing:** Custom logic for academic text analysis and transformation

### Frontend
- **Framework:** Flutter
- **Platform:** Cross-platform (iOS, Android, Web, Desktop)
- **HTTP Client:** http or dio package

## Architecture Design

### Communication Approach: REST API

We chose REST API over FFI for the following reasons:
1. **Simplicity:** Easier to develop, test, and debug
2. **Flexibility:** Backend and frontend can be developed independently
3. **Scalability:** Can easily scale backend horizontally
4. **Cross-platform:** Works seamlessly across all Flutter platforms
5. **Maintainability:** Clear separation of concerns

### System Architecture

```
┌─────────────────────────────────────┐
│        Flutter Frontend             │
│  ┌───────────────────────────────┐  │
│  │   UI Layer                    │  │
│  │   - Input Form                │  │
│  │   - Plot Display              │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Service Layer               │  │
│  │   - HTTP Client               │  │
│  │   - State Management          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                 │
                 │ HTTP/JSON
                 │
┌─────────────────────────────────────┐
│         Rust Backend                │
│  ┌───────────────────────────────┐  │
│  │   API Layer                   │  │
│  │   - Actix-web Routes          │  │
│  │   - Request/Response Models   │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Business Logic Layer        │  │
│  │   - Text Analysis             │  │
│  │   - Plot Transformation       │  │
│  │   - Kishōtenketsu Generator   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## API Specification

### Endpoint: Transform Paper to Plot

**URL:** `POST /api/v1/transform`

**Request Body:**
```json
{
  "paper_text": "The full text of the academic paper...",
  "author_name": "Dr. Name (optional)"
}
```

**Response Body:**
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

## Text Transformation Logic (起承転結)

### Ki (起) - Introduction
- Extract the research question or problem statement
- Identify the protagonist (the researcher or the research subject)
- Set up the dramatic stakes

### Sho (承) - Development
- Describe the methodology as a journey or challenge
- Highlight obstacles and experimental processes
- Build tension through the research process

### Ten (転) - Twist
- Focus on the key findings or breakthrough moment
- Present unexpected discoveries or contradictions
- Create dramatic reversal or revelation

### Ketsu (結) - Conclusion
- Present the resolution and implications
- Show the impact and future possibilities
- Deliver a satisfying ending with lasting impact

## Project Structure

```
quantumy/
├── backend/                    # Rust backend
│   ├── Cargo.toml
│   ├── src/
│   │   ├── main.rs            # Application entry point
│   │   ├── api/               # API routes and handlers
│   │   │   └── transform.rs
│   │   ├── models/            # Data models
│   │   │   ├── request.rs
│   │   │   └── response.rs
│   │   └── services/          # Business logic
│   │       ├── text_analyzer.rs
│   │       └── plot_generator.rs
│   └── tests/
├── frontend/                   # Flutter frontend
│   ├── pubspec.yaml
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/            # Data models
│   │   │   └── plot.dart
│   │   ├── services/          # API client
│   │   │   └── api_service.dart
│   │   ├── screens/           # UI screens
│   │   │   └── home_screen.dart
│   │   └── widgets/           # Reusable widgets
│   │       ├── input_form.dart
│   │       └── plot_display.dart
│   └── test/
├── docs/                       # Documentation
│   └── API.md
├── ARCHITECTURE.md             # This file
└── README.md                   # Project overview
```

## Development Workflow

1. **Backend Development:**
   - Set up Rust project with Actix-web
   - Implement text analysis logic
   - Implement plot generation with kishōtenketsu structure
   - Create RESTful API endpoints
   - Test API with curl/Postman

2. **Frontend Development:**
   - Set up Flutter project
   - Create UI for paper input
   - Implement API client
   - Create plot display components
   - Connect UI to backend API

3. **Integration Testing:**
   - Test end-to-end flow
   - Validate transformation quality
   - Performance testing

## Future Enhancements

- AI/ML integration for more sophisticated text analysis
- Support for multiple languages (Japanese, English, etc.)
- User authentication and saved transformations
- PDF upload support
- Real-time collaboration features
- Advanced plot customization options
