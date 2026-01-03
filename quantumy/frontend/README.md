# Doctor Canvas Frontend

Flutter-based frontend application for Doctor Canvas - converts academic papers into manga-style story plots.

## Technology Stack

- **Framework**: Flutter 3.0+
- **State Management**: Provider
- **HTTP Client**: http package
- **UI**: Material Design 3
- **Fonts**: Google Fonts

## Features

- 🎨 Beautiful, modern UI with Material Design 3
- 📱 Cross-platform support (Web, iOS, Android, Desktop)
- 📝 Text input for academic papers
- 🚀 Real-time conversion to manga plots
- 📖 Ki-Sho-Ten-Ketsu structured plot display
- 💫 Smooth animations and transitions

## Setup and Running

### Prerequisites
- Flutter SDK 3.0 or higher (install from https://flutter.dev)
- Backend server running (see `../backend/README.md`)

### Installation

```bash
# Install dependencies
flutter pub get

# Run on your platform of choice
flutter run

# Or specify a platform:
flutter run -d chrome      # Web
flutter run -d macos       # macOS
flutter run -d windows     # Windows
flutter run -d linux       # Linux
```

### Build for Production

```bash
# Build for web
flutter build web

# Build for mobile
flutter build apk          # Android
flutter build ios          # iOS

# Build for desktop
flutter build macos
flutter build windows
flutter build linux
```

## Project Structure

```
frontend/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── models/
│   │   └── plot_models.dart         # Data models
│   ├── services/
│   │   └── api_service.dart         # API communication
│   ├── screens/
│   │   ├── home_screen.dart         # Input screen
│   │   └── plot_display_screen.dart # Plot display
│   └── widgets/                     # Reusable widgets
├── pubspec.yaml                     # Dependencies
└── README.md
```

## Configuration

The app connects to the backend at `http://localhost:3000` by default. To change this:

Edit [`lib/services/api_service.dart`](lib/services/api_service.dart):
```dart
ApiService({this.baseUrl = 'http://your-backend-url:port'});
```

## Usage

1. **Start the backend server** (see backend README)
2. **Launch the Flutter app**
3. **Enter paper details**:
   - Paper title (optional)
   - Author name (optional)
   - Paper text (required - minimum 50 characters)
4. **Click "Convert to Manga Plot"**
5. **View your manga-style plot** with Ki-Sho-Ten-Ketsu structure!

## Screenshots

The app features:
- Clean input form with validation
- Beautiful gradient backgrounds
- Color-coded plot sections
- Highlighted key points
- Responsive design for all screen sizes

## Development

### Hot Reload
Flutter supports hot reload for fast development:
- Press `r` to hot reload
- Press `R` to hot restart
- Press `q` to quit

### Code Quality

```bash
# Format code
flutter format .

# Analyze code
flutter analyze

# Run tests
flutter test
```

## Troubleshooting

### Cannot connect to backend
- Ensure backend is running on `http://localhost:3000`
- Check CORS settings in backend
- Verify firewall settings

### Flutter SDK issues
```bash
flutter doctor
flutter clean
flutter pub get
```

## Future Enhancements

- [ ] Dark mode support
- [ ] Save/load paper history
- [ ] Export plots to PDF/Image
- [ ] Share functionality
- [ ] Offline mode
- [ ] Multiple language support
- [ ] Custom themes
