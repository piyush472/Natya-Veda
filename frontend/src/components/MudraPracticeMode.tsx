import React, { useRef, useEffect, useState } from "react";
import { Camera, X, Check, RotateCcw, Volume2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DetectedMudra {
  name: string;
  confidence: number;
}

type DifficultyLevel = "easy" | "medium" | "hard";

const MUDRA_LIST = [
  "Pataka",
  "Tripathaka",
  "Ardhapataka",
  "Mushti",
  "Shikharam",
  "Chandrakala",
  "Padmakosha",
  "Sarpashirsha",
  "Mrigashirsha",
  "Simhamukha",
  "Mayura",
  "Alapadma",
];

// Mudra images mapping - Vite will resolve these paths
const MUDRA_IMAGES: Record<string, string> = {
  Pataka: "/src/assets/pataka.jpg",
  Tripathaka: "/src/assets/tripataka.jpg",
  Ardhapataka: "/src/assets/ardhpataka.jpg",
  Mushti: "/src/assets/mushti.jpg",
  Shikharam: "/src/assets/Shikharam.jpg",
  Chandrakala: "/src/assets/Chandrakala.jpg",
  Padmakosha: "/src/assets/Padmakosha.jpg",
  Sarpashirsha: "/src/assets/Sarpashirsha.jpg",
  Mrigashirsha: "/src/assets/Mrigashirsha.jpg",
  Simhamukha: "/src/assets/Simhamukha.jpg",
  Mayura: "/src/assets/Mayura.jpg",
  Alapadma: "/src/assets/Alapadma.jpg",
};

const DIFFICULTY_SETTINGS = {
  easy: { 
    confidenceThreshold: 0.60,
    requireConsecutive: 1, // Needs 1 consecutive match
    timeLimit: 999,
    description: "Beginner - More forgiving detection"
  },
  medium: { 
    confidenceThreshold: 0.75,
    requireConsecutive: 2, // Needs 2 consecutive matches
    timeLimit: 999,
    description: "Intermediate - Standard detection"
  },
  hard: { 
    confidenceThreshold: 0.88,
    requireConsecutive: 3, // Needs 3 consecutive matches for acceptance
    timeLimit: 999,
    description: "Expert - Very strict detection"
  },
};

const getMudraImageUrl = (mudraName: string | undefined): string => {
  if (!mudraName) return "";
  return MUDRA_IMAGES[mudraName] || "";
};

export const MudraPracticeMode: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDetectingRef = useRef(false);
  const detectInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // State management
  const [gameStarted, setGameStarted] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  
  // Target and detection
  const [targetMudra, setTargetMudra] = useState<string>("");
  const [detectedMudra, setDetectedMudra] = useState<DetectedMudra | null>(null);
  const [lastDetectedMudra, setLastDetectedMudra] = useState<string>("");
  const [consecutiveMatches, setConsecutiveMatches] = useState(0);
  
  // Scoring
  const [successCount, setSuccessCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>("Get ready!");
  const [feedbackType, setFeedbackType] = useState<"neutral" | "success" | "trying">("neutral");
  
  // UI
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [showTargetImage, setShowTargetImage] = useState(true);

  // Select random mudra from list
  const selectNewMudra = () => {
    const randomIndex = Math.floor(Math.random() * MUDRA_LIST.length);
    const newMudra = MUDRA_LIST[randomIndex];
    setTargetMudra(newMudra);
    setFeedback("Now perform this mudra!");
    setFeedbackType("neutral");
    setAttemptsCount(0);
    setLastDetectedMudra("");
    setConsecutiveMatches(0);
    setShowTargetImage(difficulty === "easy" || difficulty === "medium");
  };

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
    if (detectInterval.current) {
      clearInterval(detectInterval.current);
    }
  };

  // Capture and detect mudra
  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (isDetectingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(videoRef.current, 0, 0);

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

      if (!response.ok) throw new Error("Detection failed");

      const result = await response.json();

      if (result.detected_mudra && result.mudra_info) {
        const detected = result.mudra_info.name;
        const confidence = result.mudra_info.confidence;

        setDetectedMudra({
          name: detected,
          confidence: confidence,
        });

        // Check if detected mudra matches target
        const thresholdSettings = DIFFICULTY_SETTINGS[difficulty];
        
        if (detected === targetMudra && confidence >= thresholdSettings.confidenceThreshold) {
          // Correct mudra detected
          if (detected !== lastDetectedMudra) {
            // Reset counter for new detection sequence
            setConsecutiveMatches(1);
            setLastDetectedMudra(detected);
            setFeedback(`Great! Keep holding: ${targetMudra} (1/${thresholdSettings.requireConsecutive})`);
            setFeedbackType("success");
          } else {
            // Same mudra detected consecutively
            const newCount = consecutiveMatches + 1;
            setConsecutiveMatches(newCount);
            setFeedback(`Great! Keep holding: ${targetMudra} (${newCount}/${thresholdSettings.requireConsecutive})`);

            // Check if we've reached required consecutive matches
            if (newCount >= thresholdSettings.requireConsecutive) {
              // SUCCESS!
              setSuccessCount(prev => prev + 1);
              setStreak(prev => prev + 1);
              setFeedback(`✅ Perfect ${targetMudra}!`);
              setFeedbackType("success");
              setShowCelebration(true);
              setLastDetectedMudra("");
              setConsecutiveMatches(0);

              // Auto-select next mudra after 2 seconds
              setTimeout(() => {
                selectNewMudra();
                setShowCelebration(false);
              }, 2000);
            }
          }
        } else {
          // Wrong mudra or low confidence
          if (detected !== lastDetectedMudra) {
            setAttemptsCount(prev => prev + 1);
            setConsecutiveMatches(0);
            setFeedback(`Detected: ${detected}. Try: ${targetMudra}`);
            setFeedbackType("trying");
            setLastDetectedMudra(detected);
          }
        }
      } else {
        // No hand detected
        if (lastDetectedMudra !== "") {
          setFeedback("Show your hand to the camera");
          setFeedbackType("neutral");
          setLastDetectedMudra("");
        }
      }
    } catch (err) {
      console.error("Detection error:", err);
    } finally {
      isDetectingRef.current = false;
    }
  };

  // Start periodic detection
  useEffect(() => {
    if (isWebcamActive && gameStarted) {
      detectInterval.current = setInterval(() => {
        captureAndDetect();
      }, 500);

      return () => {
        if (detectInterval.current) {
          clearInterval(detectInterval.current);
        }
      };
    }
  }, [isWebcamActive, gameStarted, targetMudra, difficulty]);

  // Start game
  const handleStartGame = async () => {
    setGameStarted(true);
    setSuccessCount(0);
    setStreak(0);
    setShowTargetImage(difficulty === "easy" || difficulty === "medium");
    selectNewMudra();
    await startWebcam();
  };

  // Reset game
  const handleResetGame = () => {
    stopWebcam();
    setGameStarted(false);
    setIsWebcamActive(false);
    setSuccessCount(0);
    setStreak(0);
    setTargetMudra("");
    setFeedback("Get ready!");
    setFeedbackType("neutral");
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 p-4">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">
              🎭 Mudra Practice Mode
            </h1>
            <p className="text-muted-foreground text-lg">
              Learn mudras through interactive practice with real-time AI feedback
            </p>
          </motion.div>

          {/* Difficulty Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gold-subtle bg-gradient-to-br from-card to-card/50 p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Select Difficulty Level
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level as DifficultyLevel)}
                  className={`rounded-lg p-4 transition-all ${
                    difficulty === level
                      ? "bg-[#f0c96d] text-[#1a1a1a] border-[#f0c96d]"
                      : "bg-card border border-gold-subtle/30 text-foreground hover:border-gold-subtle"
                  }`}
                >
                  <div className="text-sm font-semibold capitalize mb-2">{level}</div>
                  <div className="text-xs text-muted-foreground">
                    {level === "easy" && "60% - Show Image"}
                    {level === "medium" && "75% - Show Image"}
                    {level === "hard" && "88% - Hide Image"}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {DIFFICULTY_SETTINGS[level as DifficultyLevel].requireConsecutive} holds
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gold-subtle/30 bg-card/30 p-6 mb-8"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#f0c96d]" />
              How It Works
            </h3>
            <ul className="space-y-2 text-sm text-black">
              <li>✓ A mudra will be displayed on screen (Easy/Medium) or as text (Hard)</li>
              <li>✓ Perform the mudra gesture with your hand</li>
              <li>✓ AI detects your gesture in real-time</li>
              <li>✓ Hold the mudra steady for required consecutive detections</li>
              <li>✓ Easy: 1 hold | Medium: 2 holds | Hard: 3 holds + no image</li>
              <li>✓ Build your streak by successive correct attempts</li>
            </ul>
          </motion.div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleStartGame}
            className="w-full rounded-lg bg-gradient-to-r from-[#f0c96d] to-[#e6b347] px-6 py-4 font-semibold text-[#1a1a1a] transition-all hover:shadow-lg hover:shadow-[#f0c96d]/30 active:scale-95 flex items-center justify-center gap-2 text-lg"
          >
            <Camera className="h-6 w-6" />
            Start Practice Mode
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 p-4">
      <div className="mx-auto max-w-5xl">
        {/* Header with stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              🎭 Mudra Practice
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
            </p>
          </div>

          <div className="flex gap-4">
            <div className="rounded-lg bg-card border border-gold-subtle p-4 text-center">
              <div className="text-2xl font-bold text-[#f0c96d]">{successCount}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="rounded-lg bg-card border border-gold-subtle p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{streak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
          </div>

          <button
            onClick={handleResetGame}
            className="rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-2 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            End Session
          </button>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Target Mudra */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-gold-subtle bg-gradient-to-br from-card to-card/50 p-6"
          >
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
              {difficulty === "hard" ? "Challenge" : "Target Mudra"}
            </h2>

            {showTargetImage ? (
              <div className="aspect-square bg-black rounded-lg overflow-hidden border border-gold-subtle/50 mb-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={targetMudra}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    src={getMudraImageUrl(targetMudra)}
                    alt={targetMudra}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-card/50 to-card rounded-lg border border-gold-subtle/50 mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">❓</div>
                  <p className="text-muted-foreground text-sm">Image hidden</p>
                  <p className="text-muted-foreground text-xs mt-1">Use the reveal button below</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1 text-center">
                <p className="text-muted-foreground text-sm mb-1">Perform:</p>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {targetMudra}
                </h3>
              </div>
              
              {difficulty === "hard" && (
                <button
                  onClick={() => setShowTargetImage(!showTargetImage)}
                  className="px-3 py-2 rounded-lg bg-[#f0c96d]/20 border border-[#f0c96d] text-[#f0c96d] hover:bg-[#f0c96d]/30 transition-all text-sm font-medium"
                  title={showTargetImage ? "Hide image" : "Show image"}
                >
                  {showTargetImage ? "🙈 Hide" : "👁️ Show"}
                </button>
              )}
            </div>
          </motion.div>

          {/* Right: Webcam */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-gold-subtle bg-gradient-to-br from-card to-card/50 p-6"
          >
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <Camera className="h-6 w-6 text-[#f0c96d]" />
              Your Gesture
            </h2>

            <div className="relative mb-4 overflow-hidden rounded-lg border border-gold-subtle/50 bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />

              {!isWebcamActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <Camera className="mx-auto mb-2 h-12 w-12 text-[#f0c96d]" />
                    <p className="text-sm text-gray-300">Webcam not active</p>
                  </div>
                </div>
              )}

              {/* Celebration overlay */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-emerald-500/30 backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: 2 }}
                    >
                      <Check className="h-20 w-20 text-emerald-300" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Feedback */}
            <div
              className={`rounded-lg p-4 text-center font-medium ${
                feedbackType === "success"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                  : feedbackType === "trying"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                  : "bg-card border border-gold-subtle/30 text-muted-foreground"
              }`}
            >
              {feedback}
            </div>

            {/* Detected Mudra Info */}
            {detectedMudra && (
              <div className="mt-3 text-xs text-muted-foreground text-center">
                <p>Confidence: {(detectedMudra.confidence * 100).toFixed(0)}%</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
