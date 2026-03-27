#!/usr/bin/env python3
"""Train 12-mudra model from dataset."""
import sys
from pathlib import Path
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Import preprocessing function
from preprocess import build_dataset

def main():
    dataset_dir = Path(__file__).parent / "dataset" / "12-Mudras"
    data_path = Path(__file__).parent / "artifacts" / "landmark_dataset_12mudras.npz"
    model_path = Path(__file__).parent / "artifacts" / "model.pkl"
    
    # Check if preprocessing already done
    if not data_path.exists():
        print(f"[1/3] Preprocessing 12 mudras from: {dataset_dir}")
        try:
            X, y, processed, skipped = build_dataset(dataset_dir, normalize=True)
            print(f"  ✅ Processed: {processed} images")
            print(f"  ⚠️  Skipped: {skipped} images")
            print(f"  📊 Dataset shape: X={X.shape}, unique classes={len(set(y))}")
            
            # Save
            data_path.parent.mkdir(parents=True, exist_ok=True)
            np.savez_compressed(data_path, X=X, y=y)
            print(f"  ✅ Saved: {data_path}\n")
        except Exception as e:
            print(f"❌ Preprocessing failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    else:
        print(f"[1/3] Loading existing dataset: {data_path}")
        data = np.load(data_path, allow_pickle=True)
        X, y = data['X'], data['y']
        print(f"  ✅ Loaded: X={X.shape}\n")
    
    # Train
    print("[2/3] Training RandomForest on 12 mudras...")
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"  ✅ Test Accuracy: {accuracy:.4f}")
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    # Save
    print(f"\n[3/3] Saving model...")
    model_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "model": model,
        "label_encoder": label_encoder,
        "class_names": label_encoder.classes_.tolist(),
        "feature_dim": int(X.shape[1]),
        "accuracy": float(accuracy),
    }
    joblib.dump(payload, model_path)
    print(f"  ✅ Saved: {model_path}")
    print(f"\n✅ 12-MUDRA MODEL READY FOR PRODUCTION!")
    print(f"  Classes: {sorted(label_encoder.classes_.tolist())}")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
