#!/usr/bin/env python3
"""Train 12-mudra model from dataset with improved feature extraction."""
import sys
from pathlib import Path
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
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
    
    # Normalize features (important for gradient boosting)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Calculate class weights to handle imbalance (e.g., if Sarpashirsha has more samples)
    from sklearn.utils.class_weight import compute_class_weight
    class_weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
    sample_weights = class_weights[y_train]
    
    print(f"  📊 Class weights (for balancing imbalance):")
    for name, weight in zip(label_encoder.classes_, class_weights):
        print(f"     {name}: {weight:.2f}")
    
    # Use Gradient Boosting for better handling of similar classes
    # Tuned for better discrimination of similar mudras like Pataka
    model = GradientBoostingClassifier(
        n_estimators=1000,  # More trees for better accuracy
        max_depth=9,  # Deeper trees to capture mudra nuances
        learning_rate=0.05,  # Lower learning rate for finer discrimination
        subsample=0.7,  # Better generalization
        min_samples_split=3,  # Lower to capture mudra differences
        min_samples_leaf=1,
        max_features='sqrt',  # Better feature selection
        init='zero',  # Better for weighted samples
        random_state=42,
        verbose=0
    )
    model.fit(X_train_scaled, y_train, sample_weight=sample_weights)
    
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"  ✅ Test Accuracy: {accuracy:.2%}")
    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    # Show confusion to identify which mudras are confused
    print(f"\n  Analyzing confusions...")
    conf = confusion_matrix(y_test, y_pred)
    for i, name in enumerate(label_encoder.classes_):
        correct = conf[i, i]
        total = conf[i].sum()
        acc = correct / total if total > 0 else 0
        if acc < 0.85:
            print(f"    ⚠️  {name}: {acc:.1%} ({correct}/{total})")
    
    # Save
    print(f"\n[3/3] Saving model...")
    model_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "model": model,
        "scaler": scaler,  # Important: save scaler for inference
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
