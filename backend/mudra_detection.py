import cv2
import numpy as np
import os
from pathlib import Path

try:
    import mediapipe as mp
    MP_AVAILABLE = True
except ImportError:
    MP_AVAILABLE = False
    print("Warning: MediaPipe not available")

# Initialize MediaPipe (only if available)
if MP_AVAILABLE:
    try:
        mp_hands = mp.solutions.hands
        mp_drawing = mp.solutions.drawing_utils
        MP_HANDS_AVAILABLE = True
    except AttributeError as e:
        print(f"Warning: MediaPipe solutions not available - {e}")
        MP_HANDS_AVAILABLE = False
else:
    MP_HANDS_AVAILABLE = False

class MudraDetector:
    def __init__(self):
        if not MP_HANDS_AVAILABLE:
            raise RuntimeError("MediaPipe is not properly initialized")
        
        self.hands = mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        self.hands_video = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        self.mudra_database = {}
        self.load_mudra_database()

    def load_mudra_database(self):
        """Load and extract landmarks from reference mudra images"""
        assets_path = Path(__file__).parent.parent / "frontend" / "src" / "assets"
        
        mudra_images = {
            "Pataka": "pataka.jpg",
            "Tripataka": "tripataka.jpg",
            "Arala": "arala.jpg",
            "Trishula": "trishula.png"
        }

        for mudra_name, image_file in mudra_images.items():
            image_path = assets_path / image_file
            
            if image_path.exists():
                try:
                    image = cv2.imread(str(image_path))
                    if image is not None:
                        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                        results = self.hands.process(rgb_image)
                        
                        if results.multi_hand_landmarks:
                            landmarks = results.multi_hand_landmarks[0]
                            landmark_list = self.landmarks_to_array(landmarks)
                            self.mudra_database[mudra_name] = {
                                "landmarks": landmark_list,
                                "image_path": str(image_path)
                            }
                            print(f"✓ Loaded mudra: {mudra_name}")
                        else:
                            print(f"✗ No hand detected in {mudra_name}")
                except Exception as e:
                    print(f"Error loading {mudra_name}: {e}")

    def landmarks_to_array(self, landmarks):
        """Convert landmark object to numpy array"""
        landmark_list = []
        for landmark in landmarks.landmark:
            landmark_list.extend([landmark.x, landmark.y, landmark.z])
        return np.array(landmark_list)

    def calculate_similarity(self, landmarks1, landmarks2, threshold=0.15):
        """Calculate similarity between two landmark arrays using Euclidean distance"""
        if landmarks1 is None or landmarks2 is None:
            return 0
        
        # Normalize landmarks
        landmarks1_norm = (landmarks1 - landmarks1.min()) / (landmarks1.max() - landmarks1.min() + 1e-6)
        landmarks2_norm = (landmarks2 - landmarks2.min()) / (landmarks2.max() - landmarks2.min() + 1e-6)
        
        # Calculate Euclidean distance
        distance = np.linalg.norm(landmarks1_norm - landmarks2_norm)
        
        # Convert distance to similarity score (0-1)
        similarity = 1 / (1 + distance)
        
        return similarity

    def detect_mudra(self, landmarks):
        """Detect mudra from landmarks"""
        if landmarks is None:
            return None, 0
        
        current_landmarks = self.landmarks_to_array(landmarks)
        best_match = None
        best_score = 0
        confidence_threshold = 0.65

        for mudra_name, mudra_data in self.mudra_database.items():
            similarity = self.calculate_similarity(current_landmarks, mudra_data["landmarks"])
            
            if similarity > best_score:
                best_score = similarity
                best_match = mudra_name

        if best_score >= confidence_threshold:
            return best_match, best_score
        
        return None, 0

    def process_frame(self, frame):
        """Process video frame and detect mudra"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands_video.process(rgb_frame)
        
        detected_mudra = None
        confidence = 0
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mudra_name, score = self.detect_mudra(hand_landmarks)
                if mudra_name:
                    detected_mudra = mudra_name
                    confidence = float(score)
                    
                    # Draw landmarks on frame
                    mp_drawing.draw_landmarks(
                        frame,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS
                    )
                    
                    # Display mudra name and confidence
                    cv2.putText(frame, f"{mudra_name}: {confidence:.2f}",
                                (10, 50), cv2.FONT_HERSHEY_SIMPLEX,
                                1.2, (0, 255, 0), 2)

        return frame, detected_mudra, confidence

    def get_mudra_info(self, mudra_name):
        """Get information about a detected mudra"""
        if mudra_name in self.mudra_database:
            return self.mudra_database[mudra_name]
        return None


# Global detector instance
detector = None

def init_detector():
    """Initialize the detector"""
    global detector
    if detector is None:
        detector = MudraDetector()
    return detector

def get_detector():
    """Get the detector instance"""
    global detector
    if detector is None:
        detector = MudraDetector()
    return detector
