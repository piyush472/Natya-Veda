# Mudra Landmark ML Pipeline

This pipeline uses MediaPipe hand landmarks (21 points) as features and trains a scikit-learn model.

## Folder Structure

Place your dataset like this:

```text
dataset/
├── Pataka/
├── Tripataka/
├── Ardhapataka/
└── Mushti/
```

For the cloned repo dataset, use:

```text
dataset/Bharatanatyam-Mudra-Dataset/
```

The preprocessing script automatically maps folder spellings used in that dataset:
- `Pathaka(1)` -> `Pataka`
- `Tripathaka(1)` -> `Tripataka`
- `Ardhapathaka(1)` -> `Ardhapataka`
- `Mushti(1)` -> `Mushti`

Other classes are ignored.

You can use either:
- `backend/ml_pipeline/dataset` (recommended)
- any absolute path by passing `--dataset-dir`

## 1) Preprocess Dataset

```powershell
cd backend/ml_pipeline
..\venv\Scripts\python.exe preprocess.py --dataset-dir dataset/Bharatanatyam-Mudra-Dataset --output artifacts/landmark_dataset.npz
```

## 2) Train Model

```powershell
..\venv\Scripts\python.exe train.py --data artifacts/landmark_dataset.npz --model-out artifacts/model.pkl
```

## 3) Real-time Webcam Prediction

```powershell
..\venv\Scripts\python.exe predict.py --model artifacts/model.pkl --smooth-window 5
```

Press `q` to quit webcam window.

## 4) Flask API

```powershell
..\venv\Scripts\python.exe app.py
```

API endpoint:
- `POST /detect_mudra`

Accepted inputs:
- multipart form with file key `frame`
- JSON with base64 image key `image`
- optional testing mode: `/detect_mudra?use_webcam=1`

Sample response:

```json
{
  "mudra": "Pataka",
  "confidence": 0.92,
  "raw_prediction": "Pataka"
}
```

Notes:
- `mudra` can be `Pending` until smoothing confirms a majority label.
- `mudra` can be `NoHand` when no hand is detected.
