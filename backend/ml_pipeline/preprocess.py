import argparse
from pathlib import Path

import cv2
import numpy as np

# MediaPipe import - deferred to avoid initialization issues
mp_hands = None

def init_mediapipe():
    """Initialize MediaPipe hands detector."""
    global mp_hands
    if mp_hands is None:
        try:
            import mediapipe as mp
            mp_hands = mp.solutions.hands
        except (ImportError, AttributeError) as e:
            print(f"Error initializing MediaPipe: {e}")
            raise


def normalize_class_name(raw_name: str) -> str:
    """Convert folder name to mudra class name by removing numeric suffixes and parentheses."""
    # Remove (1), (2), etc. suffixes and clean up
    clean = raw_name.replace("(1)", "").replace("(2)", "").replace("(3)", "").strip()
    return clean if clean else ""


def normalize_landmarks(landmarks_xy: np.ndarray) -> np.ndarray:
    """Normalize 21x2 landmarks using wrist as origin and max radial distance as scale."""
    wrist = landmarks_xy[0]
    centered = landmarks_xy - wrist
    scale = np.max(np.linalg.norm(centered, axis=1))
    if scale < 1e-6:
        return centered
    return centered / scale


def get_finger_bend_angles(landmarks_xy: np.ndarray) -> np.ndarray:
    """Calculate bend angles for each finger (MCP-PIP-TIP angle).
    Each finger has 4 points: base, MCP, PIP, TIP. We calculate the angle at PIP joint.
    """
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
        
        # Vector from PIP to base and PIP to tip
        v1 = landmarks_xy[base_idx] - pip
        v2 = tip - pip
        
        # Calculate angle
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-6)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.arccos(cos_angle)
        bend_angles.append(angle)
    
    return np.array(bend_angles, dtype=np.float32)


def get_finger_spread(landmarks_xy: np.ndarray) -> float:
    """Calculate how spread out fingers are (distance variance between adjacent finger tips)."""
    finger_tips = [4, 8, 12, 16, 20]  # Thumb, Index, Middle, Ring, Pinky
    distances = []
    
    for i in range(len(finger_tips) - 1):
        tip1 = landmarks_xy[finger_tips[i]]
        tip2 = landmarks_xy[finger_tips[i + 1]]
        dist = np.linalg.norm(tip2 - tip1)
        distances.append(dist)
    
    # Return variance of distances (high variance = fingers spread differently)
    return np.var(distances) if distances else 0.0


def extract_feature_vector(image_bgr: np.ndarray, hands, normalize: bool = True) -> np.ndarray | None:
    """Extract enhanced feature vector capturing finger bends and hand shape.
    Dimensions: 42 (base landmarks) + 5 (bend angles) + 1 (spread) = 48 features
    """
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)

    if not results.multi_hand_landmarks:
        return None

    first_hand = results.multi_hand_landmarks[0]
    landmarks_xy = np.array([(lm.x, lm.y) for lm in first_hand.landmark], dtype=np.float32)

    if normalize:
        landmarks_xy = normalize_landmarks(landmarks_xy)

    # Get base features (normalized landmarks)
    base_features = landmarks_xy.flatten()
    
    # Get finger bend angles (key for distinguishing bent vs straight mudras)
    bend_angles = get_finger_bend_angles(landmarks_xy)
    
    # Get finger spread metric
    finger_spread = np.array([get_finger_spread(landmarks_xy)], dtype=np.float32)
    
    # Combine all features
    combined_features = np.concatenate([base_features, bend_angles, finger_spread])
    
    return combined_features


def build_dataset(dataset_dir: Path, normalize: bool = True):
    """Walk class folders, extract MediaPipe landmarks, and build X/y arrays."""
    init_mediapipe()
    
    X, y = [], []
    skipped = 0
    processed = 0

    class_dirs = sorted([d for d in dataset_dir.iterdir() if d.is_dir()])
    if not class_dirs:
        raise FileNotFoundError(f"No class folders found in {dataset_dir}")

    with mp_hands.Hands(
        static_image_mode=True,
        model_complexity=0,
        max_num_hands=1,
        min_detection_confidence=0.6,
    ) as hands:
        for class_dir in class_dirs:
            label = normalize_class_name(class_dir.name)
            if not label:
                continue

            image_paths = sorted(
                [
                    p
                    for p in class_dir.rglob("*")
                    if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
                ]
            )

            for image_path in image_paths:
                processed += 1
                image = cv2.imread(str(image_path))
                if image is None:
                    skipped += 1
                    continue

                feature = extract_feature_vector(image, hands, normalize=normalize)
                if feature is None:
                    skipped += 1
                    continue

                X.append(feature)
                y.append(label)

    if not X:
        raise RuntimeError("No valid samples found. Check dataset images and hand visibility.")

    return np.array(X, dtype=np.float32), np.array(y), processed, skipped


def main():
    parser = argparse.ArgumentParser(description="Preprocess mudra image dataset into landmark features")
    parser.add_argument("--dataset-dir", type=Path, default=Path("dataset"), help="Path to dataset root")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("artifacts/landmark_dataset.npz"),
        help="Output .npz file path",
    )
    parser.add_argument("--no-normalize", action="store_true", help="Disable landmark normalization")
    args = parser.parse_args()

    dataset_dir = args.dataset_dir.resolve()
    output_path = args.output.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    X, y, processed, skipped = build_dataset(dataset_dir, normalize=not args.no_normalize)

    np.savez_compressed(output_path, X=X, y=y)

    print(f"Processed images: {processed}")
    print(f"Skipped images (no hand/invalid): {skipped}")
    print(f"Saved dataset: {output_path}")
    print(f"X shape: {X.shape}")
    print(f"y shape: {y.shape}")
    print(f"Classes: {sorted(set(y.tolist()))}")


if __name__ == "__main__":
    main()
