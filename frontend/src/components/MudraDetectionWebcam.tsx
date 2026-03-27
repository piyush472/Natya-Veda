import React, { useRef, useEffect, useState } from "react";
import { Camera, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import all 12 mudra images
import pataka from "../assets/pataka.jpg";
import tripataka from "../assets/tripataka.jpg";
import ardhpataka from "../assets/ardhpataka.jpg";
import mushti from "../assets/mushti.jpg";
import shikharam from "../assets/Shikharam.jpg";
import chandrakala from "../assets/Chandrakala.jpg";
import padmakosha from "../assets/Padmakosha.jpg";
import sarpashirsha from "../assets/Sarpashirsha.jpg";
import mrigashirsha from "../assets/Mrigashirsha.jpg";
import simhamukha from "../assets/Simhamukha.jpg";
import mayura from "../assets/Mayura.jpg";
import alapadma from "../assets/Alapadma.jpg";

interface DetectedMudra {
  name: string;
  confidence: number;
  image_file?: string;
  image_path?: string;
  num_landmarks?: number;
}

// Helper function to get image URL based on mudra name
const getMudraImageUrl = (mudraName: string | undefined): string => {
  if (!mudraName) return "";
  const mudraMap: Record<string, string> = {
    Pataka: pataka,
    Tripathaka: tripataka,
    Ardhapataka: ardhpataka,
    Mushti: mushti,
    Shikharam: shikharam,
    Chandrakala: chandrakala,
    Padmakosha: padmakosha,
    Sarpashirsha: sarpashirsha,
    Mrigashirsha: mrigashirsha,
    Simhamukha: simhamukha,
    Mayura: mayura,
    Alapadma: alapadma,
  };
  return mudraMap[mudraName] || "";
};

export const MudraDetectionWebcam: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDetectingRef = useRef(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [detectedMudra, setDetectedMudra] = useState<DetectedMudra | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Start webcam to begin detection");
  const [allScores, setAllScores] = useState<Record<string, number> | null>(null);
  const detectInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start webcam
  const startWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
        setStatusMessage("Detecting mudras in real-time...");
      }
    } catch (err) {
      setError("Could not access webcam. Please check permissions.");
      console.error("Webcam error:", err);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsWebcamActive(false);
    setStatusMessage("Start webcam to begin detection");
    if (detectInterval.current) {
      clearInterval(detectInterval.current);
    }
  };

  // Capture frame and send to backend
  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (isDetectingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Flip canvas horizontally to match video display
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    
    // Draw video frame to canvas
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert canvas to base64
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    try {
      isDetectingRef.current = true;

      const response = await fetch("http://localhost:5000/api/detect-mudra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Detection failed");
      }

      const result = await response.json();
      
      console.log("Detection result:", result);

      if (result.detected_mudra && result.mudra_info) {
        setDetectedMudra({
          name: result.mudra_info.name,
          confidence: result.mudra_info.confidence,
          image_file: result.mudra_info.image_file,
          num_landmarks: result.mudra_info.num_landmarks,
        });
        setConfidence(result.mudra_info.confidence);
        setStatusMessage(`✅ ${result.mudra_info.name} detected!`);
      } else {
        setDetectedMudra(null);
        setConfidence(0);
        // Show best match attempt
        if (result.best_match) {
          setStatusMessage(`Hand visible (trying ${result.best_match})`);
        } else {
          setStatusMessage("Show your hand to the camera");
        }
      }
      
      // Store all scores for debugging
      if (result.all_scores) {
        setAllScores(result.all_scores);
      }
    } catch (err) {
      console.error("Detection error:", err);
      setError("Failed to detect mudra. Check backend connection.");
    } finally {
      isDetectingRef.current = false;
    }
  };

  // Start periodic detection when webcam is active
  useEffect(() => {
    if (isWebcamActive) {
      // Detect every 500ms for real-time response
      detectInterval.current = setInterval(() => {
        captureAndDetect();
      }, 500);

      return () => {
        if (detectInterval.current) {
          clearInterval(detectInterval.current);
        }
      };
    }
  }, [isWebcamActive]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            Real-Time Mudra Detection
          </h1>
          <p className="text-muted-foreground text-lg">
            Show a mudra gesture to your webcam to see instant detection with
            reference images
          </p>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Webcam section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-gold-subtle bg-gradient-to-br from-card to-card/50 p-6"
          >
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <Camera className="h-6 w-6 text-[#f0c96d]" />
              Live Webcam Feed
            </h2>

            {/* Webcam container */}
            <div className="relative mb-6 overflow-hidden rounded-lg border border-gold-subtle/50 bg-black aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover scale-x-[-1]"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />

              {!isWebcamActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <Camera className="mx-auto mb-2 h-12 w-12 text-[#f0c96d]" />
                    <p className="text-sm text-gray-300">
                      Start webcam to begin detection
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Control buttons */}
            <div className="flex gap-3">
              {!isWebcamActive ? (
                <button
                  onClick={startWebcam}
                  className="flex-1 rounded-lg bg-[#f0c96d] px-4 py-3 font-medium text-[#1a1a1a] transition-all hover:bg-[#f0c96d]/90 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Start Webcam
                </button>
              ) : (
                <button
                  onClick={stopWebcam}
                  className="flex-1 rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-3 font-medium text-red-400 transition-all hover:bg-red-500/30 active:scale-95 flex items-center justify-center gap-2"
                >
                  <X className="h-5 w-5" />
                  Stop Webcam
                </button>
              )}
            </div>

            {/* Detection status */}
            <div className="mt-4 rounded-lg bg-card/50 p-3 text-center text-sm text-muted-foreground">
              {isWebcamActive ? (
                <p>🟢 {statusMessage}</p>
              ) : (
                <p>🔴 Webcam not active</p>
              )}
            </div>
          </motion.div>

          {/* Detection results section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-gold-subtle bg-gradient-to-br from-card to-card/50 p-6"
          >
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
              Detection Results
            </h2>

            <AnimatePresence mode="wait">
              {detectedMudra ? (
                <motion.div
                  key="detected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  {/* Success indicator */}
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 border border-green-500/50 p-3">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="font-medium text-green-400">
                      Mudra Detected!
                    </span>
                  </div>

                  {/* Mudra name */}
                  <div className="rounded-lg bg-card/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Detected Mudra
                    </p>
                    <p className="font-display text-3xl font-bold text-[#f0c96d]">
                      {detectedMudra.name}
                    </p>
                  </div>

                  {/* Confidence score */}
                  <div className="rounded-lg bg-card/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Confidence
                      </span>
                      <span className="font-medium text-foreground">
                        {(confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-card border border-gold-subtle/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence * 100}%` }}
                        className="h-full bg-gradient-to-r from-[#f0c96d] to-yellow-400"
                      />
                    </div>
                  </div>

                  {/* Reference image */}
                  {detectedMudra && getMudraImageUrl(detectedMudra.name) && (
                    <div className="rounded-lg border border-gold-subtle/30 overflow-hidden bg-card/50 p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Reference Image
                      </p>
                      <img
                        src={getMudraImageUrl(detectedMudra.name)}
                        alt={detectedMudra.name}
                        className="w-full h-auto max-h-64 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-xs text-blue-300">
                    ✓ Hand detected! Keep the pose steady for better accuracy
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="not-detected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gold-subtle/30 bg-card/30">
                    <div className="text-center">
                      <div className="mb-3 text-4xl">
                        {isWebcamActive ? "👆" : "📹"}
                      </div>
                      <p className="text-muted-foreground font-medium">
                        {isWebcamActive
                          ? "Show your hand to the camera"
                          : "Start the webcam to begin detection"}
                      </p>
                      {isWebcamActive && (
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          Make sure your full hand is visible in the frame
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="rounded-lg bg-card/50 p-4">
                    <p className="mb-3 font-medium text-foreground text-sm">
                      Detection Tips:
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span>💡</span>
                        <span>Bright lighting helps - position light from above/side</span>
                      </li>
                      <li className="flex gap-2">
                        <span>👋</span>
                        <span>Show your entire hand palm-forward or from the side</span>
                      </li>
                      <li className="flex gap-2">
                        <span>⏱️</span>
                        <span>Hold the mudra pose steady for 2-3 seconds</span>
                      </li>
                      <li className="flex gap-2">
                        <span>📏</span>
                        <span>Position hand 25-50cm from camera for best results</span>
                      </li>
                      <li className="flex gap-2">
                        <span>🎯</span>
                        <span>Avoid shadows and keep background clear</span>
                      </li>
                      <li className="flex gap-2">
                        <span>✋</span>
                        <span>Make sure fingers are clearly separated and visible</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Supported mudras info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-xl border border-gold-subtle bg-gradient-to-br from-card to-card/50 p-6"
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
            Supported Mudras
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Pataka", "Tripataka", "Ardhapataka", "Mushti"].map((mudra) => (
              <div
                key={mudra}
                className="rounded-lg border border-gold-subtle/30 bg-card/50 p-3 text-center"
              >
                <p className="font-medium text-foreground">{mudra}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MudraDetectionWebcam;
