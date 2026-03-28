import base64
from collections import Counter, deque
from io import BytesIO
from pathlib import Path

import cv2
import joblib
import mediapipe as mp
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image


MODEL_PATH = Path("artifacts/model.pkl")
SMOOTH_WINDOW = 5
prediction_history = deque(maxlen=SMOOTH_WINDOW)


def normalize_landmarks(landmarks_xy: np.ndarray) -> np.ndarray:
    """Normalize 21x2 landmarks using wrist-relative scaling."""
    wrist = landmarks_xy[0]
    centered = landmarks_xy - wrist
    scale = np.max(np.linalg.norm(centered, axis=1))
    if scale < 1e-6:
        return centered
    return centered / scale


def get_finger_bend_angles(landmarks_xy: np.ndarray) -> np.ndarray:
    """Calculate bend angles for each finger."""
    bend_angles = []
    finger_ranges = [
        (0, 1, 2, 3),   # Thumb
        (0, 5, 6, 7),   # Index
        (0, 9, 10, 11), # Middle
        (0, 13, 14, 15),# Ring
        (0, 17, 18, 19) # Pinky
    ]
    
    for wrist_idx, base_idx, pip_idx, tip_idx in finger_ranges:
        wrist = landmarks_xy[wrist_idx]
        pip = landmarks_xy[pip_idx]
        tip = landmarks_xy[tip_idx]
        
        v1 = landmarks_xy[base_idx] - pip
        v2 = tip - pip
        
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-6)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.arccos(cos_angle)
        bend_angles.append(angle)
    
    return np.array(bend_angles, dtype=np.float32)


def get_finger_spread(landmarks_xy: np.ndarray) -> float:
    """Calculate finger spread variance."""
    finger_tips = [4, 8, 12, 16, 20]
    distances = []
    
    for i in range(len(finger_tips) - 1):
        tip1 = landmarks_xy[finger_tips[i]]
        tip2 = landmarks_xy[finger_tips[i + 1]]
        dist = np.linalg.norm(tip2 - tip1)
        distances.append(dist)
    
    return np.var(distances) if distances else 0.0


def extract_feature_vector(frame_bgr: np.ndarray, hands, normalize: bool = True, feature_dim: int = 48):
    """Extract enhanced feature vector with bend angles and finger spread."""
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if not results.multi_hand_landmarks:
        return None

    hand_landmarks = results.multi_hand_landmarks[0]
    landmarks_xy = np.array([(lm.x, lm.y) for lm in hand_landmarks.landmark], dtype=np.float32)

    if normalize:
        landmarks_xy = normalize_landmarks(landmarks_xy)

    # Get base features (42 dimensions)
    base_features = landmarks_xy.flatten()
    
    # Only add bend angles and spread if model expects them (48 dims)
    if feature_dim == 48:
        bend_angles = get_finger_bend_angles(landmarks_xy)
        finger_spread = np.array([get_finger_spread(landmarks_xy)], dtype=np.float32)
        combined_features = np.concatenate([base_features, bend_angles, finger_spread])
    else:
        # Backward compatibility with 42-dim models
        combined_features = base_features
    
    return combined_features


def smooth_prediction(history: deque[str], label: str):
    """Return majority label if enough recent frames agree."""
    history.append(label)
    if len(history) < history.maxlen:
        return None

    winner, votes = Counter(history).most_common(1)[0]
    if votes >= (history.maxlen // 2 + 1):
        return winner
    return None


def decode_request_frame(req):
    """Decode frame from multipart upload, base64 json, or optional webcam capture."""
    if "frame" in req.files:
        file = req.files["frame"]
        content = file.read()
        arr = np.frombuffer(content, dtype=np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)

    data = req.get_json(silent=True) or {}
    image_data = data.get("image")
    if image_data:
        try:
            if "," in image_data:
                image_data = image_data.split(",", 1)[1]
            image_bytes = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_bytes)).convert("RGB")
            return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        except Exception:
            return None

    # Optional fallback for local testing only.
    if req.args.get("use_webcam") == "1":
        cap = cv2.VideoCapture(0)
        ok, frame = cap.read()
        cap.release()
        return frame if ok else None

    return None


app = Flask(__name__)
CORS(app)

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH.resolve()}")

payload = joblib.load(MODEL_PATH)
model = payload["model"]
scaler = payload.get("scaler", None)  # Load scaler if available
label_encoder = payload["label_encoder"]
feature_dim = payload.get("feature_dim", 48)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    model_complexity=0,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6,
)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/detect_mudra", methods=["POST"])
def detect_mudra():
    frame = decode_request_frame(request)
    if frame is None:
        return jsonify({"error": "No valid frame provided"}), 400

    feature = extract_feature_vector(frame, hands, normalize=True, feature_dim=feature_dim)
    if feature is None or feature.shape[0] != feature_dim:
        prediction_history.clear()
        return jsonify({"mudra": "NoHand", "confidence": 0.0}), 200

    # Scale features if scaler is available
    if scaler is not None:
        feature_scaled = scaler.transform([feature])[0]
    else:
        feature_scaled = feature

    probs = model.predict_proba([feature_scaled])[0]
    pred_idx = int(np.argmax(probs))
    label = label_encoder.inverse_transform([pred_idx])[0]
    confidence = float(probs[pred_idx])

    stable_label = smooth_prediction(prediction_history, label)
    mudra = stable_label if stable_label else "Pending"

    return jsonify({
        "mudra": mudra,
        "confidence": confidence,
        "raw_prediction": label,
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
