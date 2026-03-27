# NatyaVeda - AI-Powered Indian Classical Dance Learning Platform

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![Flask](https://img.shields.io/badge/Flask-2.3+-green)
![ML](https://img.shields.io/badge/ML-RandomForest-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A professional web platform for exploring and learning Indian classical dance traditions with **real-time AI-powered mudra detection**. Built with React, Flask, TailwindCSS, MediaPipe, and scikit-learn.

---

## 📚 About NatyaVeda

NatyaVeda is dedicated to making Indian classical dance traditions accessible to learners worldwide. The platform combines **traditional knowledge with cutting-edge AI technology** to create an immersive, interactive learning experience that honors the authenticity and cultural significance of these ancient art forms.

### Vision
To preserve and promote Indian classical dance traditions through accessible digital learning and intelligent gesture recognition technology.

---

## ✨ Completed Features

### ✅ **1. Real-Time AI Mudra Detection (Production Ready)**
- **12-Mudra Recognition System** with 97.5%+ accuracy
- ML-based detection using MediaPipe hand landmarks + RandomForest classifier
- Real-time webcam detection with 42-dimensional landmark features
- **12 Classical Single-Hand Mudras**:
  - Pataka, Tripathaka, Ardhapataka, Mushti
  - Shikharam, Chandrakala, Padmakosha, Sarpashirsha
  - Mrigashirsha, Simhamukha, Mayura, Alapadma
- Confidence scoring and smoothing window for stable predictions
- Professional reference images for each mudra
- Horizontally flipped webcam display for intuitive mirroring

### ✅ **2. Comprehensive Dance Explorer**
- Information on 4 major Indian classical dance forms:
  - **Bharatanatyam** (Tamil Nadu) - 2000+ years of heritage
  - **Kathak** (North India) - Rhythmic storytelling tradition
  - **Odissi** (Odisha) - Temple-origin lyrical form
  - **Kathakali** (Kerala) - Elaborate makeup & costumes
- Detailed histories with temple traditions and philosophical foundations
- Complete historical timelines from ancient origins to modern era
- Associated mudras and performance characteristics
- Audio narration in English and Hindi

### ✅ **3. Modern, Professional UI/UX**
- Beautiful dark theme inspired by classical Indian aesthetics
- Fully responsive design for mobile, tablet, and desktop
- Smooth animations and transitions (Framer Motion)
- Accessible component library (shadcn/ui)
- Golden accents and gradient backgrounds
- Intuitive navigation and user experience

### ✅ **4. Industrial-Grade Backend**
- Flask REST API with proper error handling and validation
- CORS enabled for cross-origin requests
- ML model serving with real-time predictions
- Modular architecture with blueprint routing
- On-demand model training endpoint
- Confidence-based filtering and result caching

### ✅ **5. Professional Machine Learning Pipeline**
- Complete data preprocessing system
- Automated model training and evaluation
- Feature engineering with MediaPipe landmarks
- Model persistence with joblib serialization
- Real-time inference with <100ms latency
- Smoothing window for prediction stability

---

## 🚀 Planned Features (Roadmap)

### 🔄 **Phase 2 - Enhanced Detection (Q2 2026)**
- [ ] Double-hand mudra recognition (Samyuta Hastas) - 23+ classes
- [ ] Full-body pose estimation for dance positions
- [ ] Mudra sequence and combination recognition
- [ ] Real-time feedback with accuracy metrics
- [ ] Audio feedback for mudra confirmation
- [ ] Performance statistics tracking

### 🎬 **Phase 3 - Interactive Learning (Q3 2026)**
- [ ] Video tutorials for each mudra
- [ ] Step-by-step guided practice mode
- [ ] Rasa (emotion) classification from gestures
- [ ] Tala (rhythm) pattern recognition
- [ ] Dance choreography builder
- [ ] Performance recording and analysis
- [ ] Expert feedback system

### 📊 **Phase 4 - Gamification & Analytics (Q4 2026)**
- [ ] User progress tracking and dashboards
- [ ] Mudra mastery badges and leaderboards
- [ ] Difficulty-based learning paths
- [ ] Performance improvement suggestions
- [ ] Achievement certificates
- [ ] Multiplayer challenges
- [ ] Community competitions

### 📚 **Phase 5 - Content Expansion (2027)**
- [ ] Professional dance videos by acclaimed artists
- [ ] Expert interviews and documentaries
- [ ] Classical compositions and choreography
- [ ] Live virtual classes with instructors
- [ ] Integration with dance academies
- [ ] Teacher and student certification programs
- [ ] Research papers and academic resources

### 🌍 **Phase 6 - Global Reach (2027)**
- [ ] Multi-language support (Hindi, Tamil, Telugu, Kannada, Marathi, Bengali)
- [ ] Offline mode with downloadable content
- [ ] Virtual reality dance learning environment
- [ ] Mobile native apps (iOS/Android)
- [ ] Integration with major dance organizations
- [ ] Cultural exchange features
- [ ] AI-powered personalization engine

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **React Router v6** - Declarative client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **shadcn/ui** - Accessible component library
- **TypeScript** - Type-safe JavaScript

### **Backend**
- **Flask 2.3+** - Python web microframework
- **Flask-CORS** - Cross-origin resource sharing
- **MediaPipe 0.10.9** - Hand landmark detection (21 points)
- **OpenCV-contrib** - Image processing pipeline
- **scikit-learn 1.4+** - Machine learning algorithms
- **joblib** - Model serialization and caching

### **Machine Learning**
- **Algorithm**: RandomForest Classifier (300 estimators)
- **Features**: 42-dimensional normalized landmark vectors
- **Dataset**: 6,000+ curated images (12 mudra classes)
- **Accuracy**: 97.57% on test set
- **Inference Speed**: <100ms per frame
- **Framework**: scikit-learn with NumPy

### **DevOps & Deployment**
- **Python venv** - Virtual environment management
- **npm/yarn** - JavaScript dependency management
- **Git** - Version control system

---

## 📁 Project Structure

```
pi-nt-veda/
├── backend/
│   ├── api/
│   │   ├── routes.py              # Main API endpoints
│   │   ├── __init__.py
│   │   └── __pycache__/
│   ├── ml_pipeline/
│   │   ├── dataset/
│   │   │   ├── 12-Mudras/        # Training data (6,000+ images)
│   │   │   │   ├── Pataka/
│   │   │   │   ├── Tripathaka/
│   │   │   │   ├── ... (10 more)
│   │   │   └── .gitkeep
│   │   ├── artifacts/
│   │   │   └── model.pkl         # Trained ML model
│   │   ├── preprocess.py         # Feature extraction pipeline
│   │   ├── train.py              # Model training script
│   │   └── predict.py            # Inference utilities
│   ├── models/                    # Data models
│   ├── utils/                     # Utility functions
│   ├── app.py                     # Flask application entry point
│   ├── requirements.txt           # Python dependencies
│   └── venv/                      # Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MudraDetectionWebcam.tsx  # Real-time detection UI
│   │   │   ├── DanceCard.tsx            # Dance card component
│   │   │   ├── Navbar.tsx               # Navigation bar
│   │   │   ├── Footer.tsx               # Footer
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Landing page
│   │   │   ├── MudraDetection.tsx       # Detection page
│   │   │   ├── Dances.tsx               # Dance gallery
│   │   │   ├── DanceDetail.tsx          # Dance details
│   │   │   ├── About.tsx                # About page
│   │   │   └── ...
│   │   ├── assets/
│   │   │   ├── pataka.jpg                  # Mudra reference images
│   │   │   ├── tripataka.jpg
│   │   │   ├── ... (10 more mudra images)
│   │   │   └── ...
│   │   ├── data/                    # Content and configuration
│   │   ├── lib/                     # Utility functions
│   │   ├── hooks/                   # Custom React hooks
│   │   └── index.css                # Global styles
│   ├── public/
│   │   ├── audio/                   # Narration audio files
│   │   └── test/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── README.md                       # This file
├── LICENSE                         # MIT License
├── .gitignore                      # Git ignore rules
└── test.txt
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- **Python 3.10+** (for backend ML pipeline)
- **Node.js 16+** (for frontend)
- **npm or yarn** (JavaScript package manager)
- **Git** (version control)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### **Backend Setup**

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Create and activate virtual environment
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Activate on Windows (CMD):
venv\Scripts\activate

# Activate on macOS/Linux:
source venv/bin/activate
```

#### Step 3: Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Run Flask application
```bash
python app.py
```

**Backend running at**: `http://localhost:5000`

### **Frontend Setup**

#### Step 1: Open new terminal and navigate to frontend
```bash
cd frontend
```

#### Step 2: Install Node dependencies
```bash
npm install
# or
yarn install
```

#### Step 3: Start development server
```bash
npm run dev
# or
yarn dev
```

**Frontend running at**: `http://localhost:8081` (or next available port)

### **Access the Application**

Open your browser and navigate to: **`http://localhost:8081`**

---

## 🎯 Usage Guide

### **Using Mudra Detection**

1. **Navigate to Mudra Detection** page from the website menu
2. **Grant webcam permissions** when browser requests
3. **Click "Start Webcam"** button to enable camera
4. **Show a mudra gesture**:
   - Keep hand centered and visible
   - Hold steady for 2-3 seconds for stable prediction
   - Ensure good lighting
5. **View Results**:
   - Detected mudra name with confidence score (0-100%)
   - Reference image showing correct mudra
   - Real-time status updates

### **Supported Mudras**

| Mudra | Description | Fingers |
|-------|-------------|---------|
| **Pataka** | Flat open hand with fingers together | All extended |
| **Tripathaka** | Three fingers extended | Index, middle, little extended |
| **Ardhapataka** | Half flat hand | Index, middle extended |
| **Mushti** | Closed fist | All folded |
| **Shikharam** | Peaked/pyramid shape | Thumbs and index together forming peak |
| **Chandrakala** | Crescent moon shape | Curved inward position |
| **Padmakosha** | Lotus bud shape | All fingers curved inward |
| **Sarpashirsha** | Serpent head | S-curved configuration |
| **Mrigashirsha** | Deer head | Index and middle extended in V |
| **Simhamukha** | Lion face | All fingers spread wide |
| **Mayura** | Peacock shape | Fingers arranged like feathers |
| **Alapadma** | Lotus shape | Thumb and index extended |

---

## 📡 API Reference

### **Detection Endpoint**

**POST** `/api/detect-mudra`

Request:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

Response (Success):
```json
{
  "detected_mudra": "Pataka",
  "confidence": 0.95,
  "mudra_info": {
    "name": "Pataka",
    "confidence": 0.95,
    "image_file": "pataka.jpg",
    "description": "Flat open hand mudra"
  },
  "status": "detected",
  "message": "Pataka detected!",
  "source": "mediapipe",
  "all_scores": {
    "Pataka": 0.95,
    "Tripathaka": 0.03,
    ...
  }
}
```

Response (No Hand):
```json
{
  "detected_mudra": null,
  "mudra_info": null,
  "status": "no_hand",
  "message": "No hand detected. Show your full hand to the camera."
}
```

---

### **Mudra Database Endpoint**

**GET** `/api/mudra-database`

Response:
```json
{
  "mudras": [
    {"name": "Pataka", "image_file": "pataka.jpg"},
    {"name": "Tripathaka", "image_file": "tripataka.jpg"},
    ...
  ]
}
```

---

### **Model Training Endpoint**

**POST** `/api/train-model`

Response:
```json
{
  "status": "success",
  "message": "12-mudra model trained successfully",
  "accuracy": 0.9757,
  "classes": ["Pataka", "Tripathaka", "Ardhapataka", ...],
  "model_path": "backend/ml_pipeline/artifacts/model.pkl"
}
```

---

## 🔬 Machine Learning Pipeline

### **Data Pipeline Architecture**

```
Raw Images (6,000+)
    ↓
[MediaPipe Hand Detection] (21 landmarks per hand)
    ↓
[Feature Extraction] (42-D normalized vectors)
    ↓
[Train-Test Split] (80/20 stratified)
    ↓
[RandomForest Classifier] (300 trees, balanced weights)
    ↓
[Model Evaluation] (97.57% accuracy)
    ↓
[Model Serialization] (Saved as model.pkl)
```

### **Feature Engineering Details**

1. **Input**: Video frame from webcam (RGB)
2. **Detection**: MediaPipe extracts 21 hand landmarks (x, y coordinates)
3. **Normalization**:
   - Translate landmarks to wrist origin (landmark 0)
   - Scale by maximum radial distance
   - MediaPipe coordinates already normalized to [0, 1]
4. **Feature Vector**: Flatten 21×2 matrix → 42-D vector
5. **Model Input**: 42-dimensional feature vector
6. **Output**: Mudra class with confidence probability

### **Real-Time Inference**

```
Webcam Frame
    ↓
[MediaPipe Extraction] (~50ms)
    ↓
[Feature Normalization] (~5ms)
    ↓
[RandomForest Prediction] (~20ms)
    ↓
[Smoothing Window] (Majority vote over 5 frames)
    ↓
[Confidence Filtering] (≥65% threshold)
    ↓
Result Display
```

---

## 🧪 Testing & Validation

### **Test Mudra Detection**

```bash
# 1. Start backend
cd backend
python app.py
# Wait for: "Running on http://127.0.0.1:5000"

# 2. Start frontend (new terminal)
cd frontend
npm run dev
# Wait for: "Local: http://localhost:8081"

# 3. Open browser and test
# Navigate to: http://localhost:8081/mudra-detection
# Click "Start Webcam"
# Show various mudra gestures
# Verify accuracy and confidence scores
```

### **Validation Metrics**

- **Accuracy**: 97.57% on test set
- **Precision**: >95% per class (weighted average)
- **Recall**: >95% per class
- **F1-Score**: >95% across mudras
- **Inference Latency**: <100ms per frame
- **Throughput**: 30+ FPS stable prediction

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **How to Contribute**

1. **Fork the repository** on GitHub
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** with clear, modular commits
4. **Test thoroughly** - run full validation
5. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: Add support for double-hand mudras"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create Pull Request** with detailed description

### **Areas for Contribution**
- 🎯 Additional mudra classes and dataset expansion
- 🎨 UI/UX improvements and new designs
- ⚡ Backend performance optimization
- 📖 Documentation and tutorials
- 🧪 Testing and bug fixes
- 🌐 Multi-language support
- 📱 Mobile responsiveness improvements

### **Development Standards**
- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure no breaking changes

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Free for educational, personal, and commercial use.**

---

## 🙏 Acknowledgments

- **Natyashastra** - Ancient Sanskrit treatise (Bharata Muni)
- **Classical Dance Gurus** - All teachers preserving authentic traditions
- **MediaPipe Team** - Open-source gesture recognition
- **scikit-learn Community** - Machine learning framework
- **shadcn/ui** - React component library
- **Framer Motion** - Animation library
- All cultural institutions and artists supporting Indian classical arts

---

## 📞 Support & Community

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Documentation**: See implementation details
- **Email**: Contact via GitHub profile

---

## 🎓 Educational Resources

### **Learn More About**

- [Natyashastra - Script for Performing Arts](https://en.wikipedia.org/wiki/Natya_Shastra)
- [Bharatanatyam Mudras](https://en.wikipedia.org/wiki/Bharatanatyam#Mudras)
- [MediaPipe Hands Solutions](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [Classical Indian Dance Forms](https://en.wikipedia.org/wiki/Classical_Indian_dance)
- [Hand Gesture Recognition Research](https://arxiv.org)

---

## 🏆 Project Status

| Phase | Status | Features | Timeline |
|-------|--------|----------|----------|
| **Phase 1** | ✅ Complete | 12-mudra detection, Dance explorer, UI | Completed |
| **Phase 2** | 🔄 Planned | Double-hand mudras, Advanced detection | Q2 2026 |
| **Phase 3** | ⏳ Planned | Video tutorials, Practice mode, Rasa detection | Q3 2026 |
| **Phase 4** | ⏳ Planned | Gamification, Analytics, Leaderboards | Q4 2026 |
| **Phase 5** | ⏳ Planned | Content expansion, Live classes | 2027 |
| **Phase 6** | ⏳ Planned | Mobile apps, VR environment, Global reach | 2027-2028 |

---

## 📊 Metrics & Performance

- **Model Accuracy**: 97.57%
- **Detection Speed**: <100ms per frame
- **FPS Support**: 30+ frames per second
- **Dataset Size**: 6,000+ training images
- **Mudras Supported**: 12 classes
- **Feature Dimensions**: 42-D vectors
- **Browser Support**: All modern browsers
- **Mobile Support**: iOS Safari, Android Chrome
- **Uptime Goal**: 99%+

---

**Made with ❤️ for the preservation and celebration of Indian classical dance traditions**

**Last Updated**: March 27, 2026  
**Version**: 1.0.0  
**Maintainer**: NatyaVeda Development Team

---

*"Dance is the hidden language of the soul." - Martha Graham*
