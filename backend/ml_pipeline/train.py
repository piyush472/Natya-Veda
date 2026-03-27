import argparse
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


def train_model(X: np.ndarray, y: np.ndarray, test_size: float = 0.2, random_state: int = 42):
    """Train a RandomForest classifier on landmark features."""
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=test_size,
        random_state=random_state,
        stratify=y_encoded,
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        class_weight="balanced",
        random_state=random_state,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Test Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

    return model, label_encoder, accuracy


def main():
    parser = argparse.ArgumentParser(description="Train mudra landmark classifier")
    parser.add_argument(
        "--data",
        type=Path,
        default=Path("artifacts/landmark_dataset.npz"),
        help="Path to preprocessed dataset .npz",
    )
    parser.add_argument(
        "--model-out",
        type=Path,
        default=Path("artifacts/model.pkl"),
        help="Output model file",
    )
    args = parser.parse_args()

    data_path = args.data.resolve()
    model_out = args.model_out.resolve()
    model_out.parent.mkdir(parents=True, exist_ok=True)

    if not data_path.exists():
        raise FileNotFoundError(f"Dataset file not found: {data_path}")

    data = np.load(data_path, allow_pickle=True)
    X = data["X"]
    y = data["y"]

    model, label_encoder, accuracy = train_model(X, y)

    payload = {
        "model": model,
        "label_encoder": label_encoder,
        "class_names": label_encoder.classes_.tolist(),
        "feature_dim": int(X.shape[1]),
        "accuracy": float(accuracy),
    }
    joblib.dump(payload, model_out)

    print(f"\nSaved model: {model_out}")


if __name__ == "__main__":
    main()
