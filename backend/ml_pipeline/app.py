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


def extract_feature_vector(frame_bgr: np.ndarray, hands, normalize: bool = True):
    """Return flattened 42-d landmark vector for first detected hand."""
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if not results.multi_hand_landmarks:
        return None

    hand_landmarks = results.multi_hand_landmarks[0]
    landmarks_xy = np.array([(lm.x, lm.y) for lm in hand_landmarks.landmark], dtype=np.float32)

    if normalize:
        landmarks_xy = normalize_landmarks(landmarks_xy)

    return landmarks_xy.flatten()


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
label_encoder = payload["label_encoder"]
feature_dim = payload.get("feature_dim", 42)

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

    feature = extract_feature_vector(frame, hands, normalize=True)
    if feature is None or feature.shape[0] != feature_dim:
        prediction_history.clear()
        return jsonify({"mudra": "NoHand", "confidence": 0.0}), 200

    probs = model.predict_proba([feature])[0]
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
