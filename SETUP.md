# Doctor Canvas - Setup Guide

Complete guide to set up and run the Doctor Canvas prototype.

## Prerequisites

### Required Software

1. **Rust & Cargo**
   - Install from: https://rustup.rs/
   - Version required: 1.70 or higher
   - Verify: `cargo --version`

2. **Flutter & Dart**
   - Install from: https://flutter.dev/docs/get-started/install
   - Version required: Flutter 3.0+, Dart 3.0+
   - Verify: `flutter --version`

3. **Git**
   - Required for version control
   - Verify: `git --version`

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/takuroarakawa/sns.git
cd sns
git checkout feature/doctor-canvas-prototype
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Download dependencies and build
cargo build

# Run tests to verify setup
cargo test

# Start the backend server
cargo run
```

The backend server will start on `http://localhost:8080`

**Expected output:**
```
🚀 Starting Doctor Canvas Backend Server...
📍 Server will be available at: http://localhost:8080
📋 API endpoint: POST http://localhost:8080/api/v1/transform
❤️  Health check: GET http://localhost:8080/health
```

### Step 3: Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Get Flutter dependencies
flutter pub get

# Run the app (choose your platform)
flutter run -d chrome        # For web
flutter run -d macos         # For macOS desktop
flutter run -d windows       # For Windows desktop
flutter run -d linux         # For Linux desktop
flutter run                  # For connected mobile device
```

**First-time Flutter setup:**
If this is your first Flutter app, you may need to enable the platform:
```bash
flutter config --enable-web           # Enable web
flutter config --enable-macos-desktop # Enable macOS
flutter config --enable-windows-desktop # Enable Windows
flutter config --enable-linux-desktop # Enable Linux
```

## Verification

### 1. Test Backend Health

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Doctor Canvas API",
  "version": "0.1.0"
}
```

### 2. Test Transformation Endpoint

```bash
curl -X POST http://localhost:8080/api/v1/transform \
  -H "Content-Type: application/json" \
  -d '{
    "paper_text": "Abstract: This study investigates the effects of machine learning on productivity. Method: We analyzed data from 100 companies. Results: We found significant improvements. Conclusion: ML has transformative potential."
  }'
```

### 3. Test Flutter App

1. Open the Flutter app
2. Enter sample paper text
3. Click "Transform to Epic Plot!"
4. Verify the kishōtenketsu plot appears

## Troubleshooting

### Backend Issues

**Issue: "cargo: command not found"**
- Solution: Install Rust from https://rustup.rs/
- Run: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

**Issue: Port 8080 already in use**
- Solution: Stop the process using port 8080 or change the port in `backend/src/main.rs`
- Find process: `lsof -i :8080` (macOS/Linux) or `netstat -ano | findstr :8080` (Windows)

**Issue: Compilation errors**
- Solution: Update Rust to the latest version
- Run: `rustup update`

### Frontend Issues

**Issue: "flutter: command not found"**
- Solution: Install Flutter from https://flutter.dev/
- Add Flutter to your PATH

**Issue: "No devices found"**
- Solution: Enable the platform you want to use
- Run: `flutter devices` to see available devices
- Enable platforms with `flutter config --enable-<platform>`

**Issue: HTTP connection refused**
- Solution: Ensure the backend server is running on `http://localhost:8080`
- Check backend logs for errors

**Issue: CORS errors (when running on web)**
- Solution: The backend already has CORS enabled. If issues persist, check browser console for specific errors.

### Platform-Specific Issues

**macOS**
- May need to allow network access for the Rust binary
- Go to System Preferences > Security & Privacy if prompted

**Windows**
- May need to allow firewall access for the Rust binary
- Check Windows Defender Firewall if connection issues occur

**Linux**
- Ensure you have the necessary build tools installed
- Run: `sudo apt-get install build-essential` (Ubuntu/Debian)

## Development Workflow

### Hot Reload (Frontend)

Flutter supports hot reload for faster development:
1. Run: `flutter run`
2. Make changes to your Dart files
3. Press `r` in the terminal to hot reload
4. Press `R` to hot restart

### Auto-Rebuild (Backend)

For auto-rebuild on file changes, install cargo-watch:
```bash
cargo install cargo-watch
cargo watch -x run
```

## Building for Production

### Backend

```bash
cd backend
cargo build --release
./target/release/doctor_canvas_backend
```

### Frontend

**Web:**
```bash
cd frontend
flutter build web --release
# Output in: build/web/
```

**Desktop:**
```bash
flutter build macos --release    # macOS
flutter build windows --release  # Windows
flutter build linux --release    # Linux
```

**Mobile:**
```bash
flutter build apk --release      # Android
flutter build ios --release      # iOS
```

## Next Steps

1. Explore the [ARCHITECTURE.md](ARCHITECTURE.md) for system design details
2. Read the [backend/README.md](backend/README.md) for API documentation
3. Check [frontend/README.md](frontend/README.md) for UI component details
4. Try transforming your own academic papers!

## Support

For issues or questions:
1. Check this setup guide
2. Review the troubleshooting section
3. Check the README files in backend/ and frontend/
4. Review the architecture documentation

---

**Happy coding! 🚀**
