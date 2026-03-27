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


def extract_feature_vector(image_bgr: np.ndarray, hands, normalize: bool = True) -> np.ndarray | None:
    """Extract a flattened 42-dim feature vector from the first detected hand."""
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)

    if not results.multi_hand_landmarks:
        return None

    first_hand = results.multi_hand_landmarks[0]
    landmarks_xy = np.array([(lm.x, lm.y) for lm in first_hand.landmark], dtype=np.float32)

    if normalize:
        landmarks_xy = normalize_landmarks(landmarks_xy)

    return landmarks_xy.flatten()


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
