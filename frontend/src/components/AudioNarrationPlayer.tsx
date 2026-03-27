import React, { useState } from "react";
import { Volume2 } from "lucide-react";

interface AudioNarrationPlayerProps {
  englishAudioUrl?: string;
  hindiAudioUrl?: string;
  danceName: string;
}

export const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({
  englishAudioUrl,
  hindiAudioUrl,
  danceName,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hindi">(
    englishAudioUrl ? "english" : "hindi"
  );

  const currentAudio =
    selectedLanguage === "english" ? englishAudioUrl : hindiAudioUrl;

  if (!englishAudioUrl && !hindiAudioUrl) {
    return null;
  }

  return (
    <div className="mt-8 rounded-xl border border-gold-subtle bg-gradient-to-br from-card to-card/50 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Volume2 className="h-6 w-6 text-[#f0c96d]" />
        <h2 className="font-display text-xl font-semibold text-foreground">
          Listen to {danceName} History
        </h2>
      </div>

      {/* Language Selector */}
      <div className="mb-6 flex gap-3">
        {englishAudioUrl && (
          <button
            onClick={() => setSelectedLanguage("english")}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedLanguage === "english"
                ? "bg-[#f0c96d] text-[#1a1a1a] shadow-md"
                : "border border-gold-subtle bg-transparent text-foreground hover:bg-card/50"
            }`}
          >
            🇬🇧 English
          </button>
        )}
        {hindiAudioUrl && (
          <button
            onClick={() => setSelectedLanguage("hindi")}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedLanguage === "hindi"
                ? "bg-[#f0c96d] text-[#1a1a1a] shadow-md"
                : "border border-gold-subtle bg-transparent text-foreground hover:bg-card/50"
            }`}
          >
            🇮🇳 Hindi
          </button>
        )}
      </div>

      {/* Audio Player */}
      {currentAudio ? (
        <div className="flex flex-col gap-4">
          <div className="w-full rounded-lg bg-card/50 p-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {selectedLanguage === "english"
                ? "English Narration"
                : "Hindi Narration"}
            </p>
            <audio
              controls
              src={currentAudio}
              className="w-full"
              controlsList="nodownload"
            />
          </div>

          {/* Info message */}
          <div className="rounded-lg border border-gold-subtle/30 bg-card/30 p-3 text-xs text-muted-foreground">
            <p>
              {selectedLanguage === "english"
                ? "Listen to the detailed history of this dance form in English"
                : "इस नृत्य रूप का विस्तृत इतिहास हिंदी में सुनें"}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gold-subtle bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Audio narration for{" "}
            {selectedLanguage === "english" ? "English" : "Hindi"} coming soon
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioNarrationPlayer;
