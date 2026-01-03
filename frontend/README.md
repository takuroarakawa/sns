# Doctor Canvas Frontend

Flutter-based frontend for Doctor Canvas, transforming academic papers into manga-style story plots.

## Features

- Clean, intuitive UI for paper input
- Beautiful display of kishōtenketsu plot structure
- Material Design 3 theme
- Responsive layout
- Real-time transformation via REST API

## Requirements

- Flutter SDK 3.0 or higher
- Dart 3.0 or higher

## Installation

```bash
cd frontend
flutter pub get
```

## Running the App

### Development (with hot reload)
```bash
flutter run
```

### Web
```bash
flutter run -d chrome
```

### Mobile
```bash
# iOS
flutter run -d ios

# Android
flutter run -d android
```

## Configuration

The API base URL can be configured in `lib/services/api_service.dart`:

```dart
ApiService({this.baseUrl = 'http://localhost:8080'});
```

For production, update this to your deployed backend URL.

## Project Structure

```
frontend/
├── lib/
│   ├── main.dart              # Application entry point
│   ├── models/                # Data models
│   │   └── plot.dart
│   ├── services/              # API client
│   │   └── api_service.dart
│   ├── screens/               # UI screens
│   │   └── home_screen.dart
│   └── widgets/               # Reusable widgets
│       └── plot_display.dart
├── pubspec.yaml
└── README.md
```

## Usage

1. Start the backend server (see backend/README.md)
2. Run the Flutter app
3. Enter your academic paper text
4. Click "Transform to Epic Plot!"
5. View your paper as an exciting manga-style story!

## Building for Production

### Android APK
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

### Web
```bash
flutter build web --release
```

## Testing

Run tests with:
```bash
flutter test
```

## Dependencies

- **http**: HTTP client for API communication
- **provider**: State management (for future enhancements)
- **cupertino_icons**: iOS-style icons

## License

Part of the Quantumy project.
