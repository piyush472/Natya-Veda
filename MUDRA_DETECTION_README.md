# Real-Time Mudra Detection System

## Overview

The Mudra Detection system uses **MediaPipe Hand Pose Detection** and **OpenCV** to detect classical Indian dance hand gestures (mudras) in real-time from a webcam feed.

## Features

✨ **Real-Time Detection** - Live webcam streaming with instant mudra recognition
🎯 **High Accuracy** - Multi-landmark hand tracking (21 points per hand)
📊 **Confidence Scoring** - Shows detection confidence percentage
🖼️ **Reference Images** - Displays reference mudra images for comparison
🌐 **Web-Based Interface** - No installation needed, works in browser
🎭 **Multiple Mudras** - Supports 4 classical dance mudras:
  - Pataka (open hand)
  - Tripataka (three fingers)
  - Arala (compact hand)
  - Trishula (trident hand)

## Technology Stack

### Backend
- **Flask** - Python web framework
- **MediaPipe** - Hand pose detection (21-point hand landmarks)
- **OpenCV (cv2)** - Image processing and frame capture
- **NumPy** - Numerical computations

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe development
- **Framer Motion** - Smooth animations
- **Lucide React** - Icons
- **TailwindCSS** - Styling

## How It Works

### 1. Hand Detection Pipeline
```
Webcam Frame → MediaPipe Hands → Extract 21 Landmarks
              ↓
        Calculate Position Vectors
              ↓
        Compare with Mudra Database
              ↓
        Calculate Similarity Score
              ↓
        If Score > 65% → Display Detection
```

### 2. Landmark Structure
MediaPipe detects 21 hand landmarks:
- Wrist (0)
- Thumb (1-4)
- Index Finger (5-8)
- Middle Finger (9-12)
- Ring Finger (13-16)
- Pinky Finger (17-20)

Each landmark has (x, y, z) coordinates normalized to image dimensions.

### 3. Matching Algorithm
```python
similarity = 1 / (1 + euclidean_distance)
confidence_threshold = 0.65
```

The system calculates normalized Euclidean distance between:
- Live hand landmarks
- Reference mudra landmarks (from database)

If similarity > 65%, mudra is detected.

## File Structure

```
backend/
├── app.py                      # Flask application
├── mudra_detection.py          # Core detection logic
├── api/routes.py               # API endpoints
├── requirements.txt            # Python dependencies
├── venv/                       # Python 3.10 virtual environment
└── start_backend.bat           # Windows startup script

frontend/
├── src/
│   ├── components/
│   │   ├── MudraDetectionWebcam.tsx  # Webcam UI component
│   │   └── AudioNarrationPlayer.tsx
│   ├── pages/
│   │   └── MudraDetection.tsx   # Mudra detection page
│   ├── assets/
│   │   ├── pataka.jpg           # Reference mudra images
│   │   ├── tripataka.jpg
│   │   ├── arala.jpg
│   │   └── trishula.png
│   └── lib/api.ts               # API client
└── public/audio/                # Audio files
```

## API Endpoints

### POST /api/detect-mudra
Detect mudra from a base64 encoded image.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "detected_mudra": "Pataka",
  "confidence": 0.87,
  "mudra_info": {
    "name": "Pataka",
    "confidence": 0.87,
    "image_path": "frontend/src/assets/pataka.jpg"
  }
}
```

### GET /api/mudra-database
Get list of available mudras.

**Response:**
```json
{
  "mudras": [
    {
      "name": "Pataka",
      "image_path": "frontend/src/assets/pataka.jpg"
    },
    ...
  ]
}
```

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Webcam access
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create Python 3.10 virtual environment:**
```bash
py -3.10 -m venv venv
```

3. **Activate virtual environment:**
**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```bash
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Run Flask backend:**
```bash
python app.py
```

Backend will start on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

Frontend will start on: `http://localhost:8082` (or next available port)

## Usage

1. **Open the application** in your browser (http://localhost:8082)
2. **Navigate to** "Mudra Detection" page
3. **Click "Start Webcam"** button
4. **Position your hand** in front of the camera (30-60cm away)
5. **Perform a mudra gesture** and hold steady
6. **Watch for detection** - when match is found:
   - Mudra name appears
   - Confidence score shows
   - Reference image displays
7. **Switch between mudras** or change hand pose
8. **Detection stops** when hand is no longer in frame

## Detection Tips

✅ **Good Lighting** - Ensure adequate light on your hand
✅ **Clear Visibility** - Keep hand fully visible in frame
✅ **Steady Pose** - Hold mudra steady for few seconds
✅ **Proper Distance** - Position hand 30-60cm from camera
✅ **Hand Isolation** - Keep other objects out of frame

## Configuration

### Confidence Threshold
Located in `backend/mudra_detection.py`:
```python
confidence_threshold = 0.65  # 65% match required
```

Lower value = more detections (less accurate)
Higher value = fewer detections (more accurate)

### Detection Frame Rate
Located in `frontend/src/components/MudraDetectionWebcam.tsx`:
```typescript
detectInterval.current = setInterval(() => {
  captureAndDetect();
}, 500);  // 500ms between detections
```

Lower = more frequent checks (more CPU usage)
Higher = less frequent checks (less responsive)

## Troubleshooting

### Backend Issues

**Issue: "module 'mediapipe' has no attribute 'solutions'"**
- MediaPipe version incompatibility
- Solution: Reinstall with: `pip install mediapipe --force-reinstall`

**Issue: "No module named 'cv2'"**
- OpenCV not installed
- Solution: `pip install opencv-python`

**Issue: "NumPy version mismatch"**
- NumPy incompatibility with other packages
- Solution: `pip install numpy<2`

### Frontend Issues

**Issue: "Failed to fetch" in browser console**
- Backend not running
- Solution: Start backend with `python app.py`

**Issue: Webcam access denied**
- Browser permissions issue
- Solution: Check browser camera permissions in settings

**Issue: No canvas.toDataURL() method**
- Browser compatibility issue
- Solution: Use modern browser (Chrome, Firefox, Safari, Edge)

### Detection Issues

**Issue: Mudra not being detected**
- Poor lighting conditions
- Hand not clearly visible
- Pose doesn't match reference image well
- Solution: Improve lighting, hold hand steady, match reference pose

**Issue: False detections**
- Confidence threshold too low
- User hand is similar to another mudra
- Solution: Increase `confidence_threshold` value

## Performance

- **Detection latency:** ~100-200ms per frame
- **Memory usage:** ~150-200MB (with MediaPipe)
- **CPU usage:** ~20-30% (varies)
- **Webcam resolution:** 640x480 (auto-detected)

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Future Enhancements

🚀 **Multi-hand detection** - Detect both hands simultaneously
🚀 **Mudra sequences** - Recognize dance movements (gestures over time)
🚀 **Pose estimation** - Full body dance pose detection
🚀 **Performance metrics** - Track accuracy over time
🚀 **Custom mudra training** - Add new mudras via upload
🚀 **Mobile support** - iOS/Android native apps

## References

- **MediaPipe Hands:** https://google.github.io/mediapipe/solutions/hands
- **Natyashastra:** Ancient Indian treatise on dance gestures
- **Classical Indian Mudras:** 108 documented hand positions

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please open a GitHub issue on the project repository.

---

**Last Updated:** March 27, 2026
**Version:** 1.0.0
**Status:** Active Development
