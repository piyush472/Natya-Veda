import argparse
from collections import Counter, deque
from pathlib import Path

import cv2
import joblib
import mediapipe as mp
import numpy as np


def normalize_landmarks(landmarks_xy: np.ndarray) -> np.ndarray:
    """Normalize 21x2 landmarks using wrist as origin and max radial distance."""
    wrist = landmarks_xy[0]
    centered = landmarks_xy - wrist
    scale = np.max(np.linalg.norm(centered, axis=1))
    if scale < 1e-6:
        return centered
    return centered / scale


def extract_feature_vector(frame_bgr: np.ndarray, hands, normalize: bool = True):
    """Extract flattened landmark feature vector and raw landmarks for drawing."""
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)

    if not results.multi_hand_landmarks:
        return None, None

    hand_landmarks = results.multi_hand_landmarks[0]
    landmarks_xy = np.array([(lm.x, lm.y) for lm in hand_landmarks.landmark], dtype=np.float32)

    if normalize:
        landmarks_xy = normalize_landmarks(landmarks_xy)

    return landmarks_xy.flatten(), hand_landmarks


def smooth_prediction(history: deque[str], window_size: int):
    """Return majority label when enough history is available."""
    if len(history) < window_size:
        return None

    label, votes = Counter(history).most_common(1)[0]
    if votes >= (window_size // 2 + 1):
        return label
    return None


def run_realtime(model_payload: dict, smooth_window: int = 5):
    """Run webcam inference loop and display predicted mudra with smoothing."""
    model = model_payload["model"]
    label_encoder = model_payload["label_encoder"]
    feature_dim = model_payload.get("feature_dim", 42)

    history = deque(maxlen=smooth_window)

    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    mp_styles = mp.solutions.drawing_styles

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise RuntimeError("Could not open webcam")

    with mp_hands.Hands(
        static_image_mode=False,
        model_complexity=0,
        max_num_hands=1,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.6,
    ) as hands:
        while True:
            ok, frame = cap.read()
            if not ok:
                break

            feature, hand_landmarks = extract_feature_vector(frame, hands, normalize=True)

            display_label = "No hand"
            display_conf = 0.0

            if feature is not None and feature.shape[0] == feature_dim:
                probs = model.predict_proba([feature])[0]
                pred_idx = int(np.argmax(probs))
                label = label_encoder.inverse_transform([pred_idx])[0]
                confidence = float(probs[pred_idx])

                history.append(label)
                stable_label = smooth_prediction(history, smooth_window)
                display_label = stable_label if stable_label else f"Trying: {label}"
                display_conf = confidence

                mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_styles.get_default_hand_landmarks_style(),
                    mp_styles.get_default_hand_connections_style(),
                )
            else:
                history.clear()

            cv2.putText(frame, f"Mudra: {display_label}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            cv2.putText(frame, f"Confidence: {display_conf:.2f}", (20, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)

            cv2.imshow("Mudra Prediction", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
    cv2.destroyAllWindows()


def main():
    parser = argparse.ArgumentParser(description="Real-time mudra prediction from webcam")
    parser.add_argument("--model", type=Path, default=Path("artifacts/model.pkl"), help="Path to trained model")
    parser.add_argument("--smooth-window", type=int, default=5, help="Smoothing history size")
    args = parser.parse_args()

    model_path = args.model.resolve()
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    payload = joblib.load(model_path)
    run_realtime(payload, smooth_window=args.smooth_window)


if __name__ == "__main__":
    main()
