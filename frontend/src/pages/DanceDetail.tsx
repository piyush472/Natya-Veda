import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Network } from "lucide-react";
import { motion } from "framer-motion";
import natarajaVisual from "@/assets/download (1).jpg";
import { useEffect, useState } from "react";
import { getDanceDetail } from "@/lib/api";
import bharatanatyamImg from "@/assets/bharatanatyam.jpg";
import kathakImg from "@/assets/kathak.jpg";
import odissiImg from "@/assets/odissi.jpg";
import kathakaliImg from "@/assets/kathakali.jpg";
import { KnowledgeGraphVisualization } from "@/components/KnowledgeGraphVisualization";
import { AudioNarrationPlayer } from "@/components/AudioNarrationPlayer";
import { danceKnowledgeById } from "@/data/danceKnowledge";

interface CompleteHistory {
  ancientOrigins: string;
  templeHeritage: string;
  devadasiTradition: string;
  modernRevival: string;
  contemporaryEra: string;
}

interface Dance {
  id: string;
  name: string;
  origin: string;
  shortDescription: string;
  description?: string;
  history?: string;
  completeHistory?: CompleteHistory;
  templeTraitions?: string;
  philosophy?: string;
  famousMudras: string[];
  historySoundUrl?: string;
  imageUrl?: string;
  audioNarration?: {
    english?: string;
    hindi?: string;
  };
}

// Map dance IDs to image assets
const danceImages: Record<string, string> = {
  bharatanatyam: bharatanatyamImg,
  kathak: kathakImg,
  odissi: odissiImg,
  kathakali: kathakaliImg,
};

const detailStars = [
  { left: "8%", top: "10%", delay: "0.3s", duration: "2.1s" },
  { left: "14%", top: "18%", delay: "1.2s", duration: "2.4s" },
  { left: "22%", top: "9%", delay: "0.9s", duration: "2.2s" },
  { left: "28%", top: "23%", delay: "1.7s", duration: "2.6s" },
  { left: "36%", top: "14%", delay: "0.5s", duration: "2.3s" },
  { left: "43%", top: "7%", delay: "1.4s", duration: "2.5s" },
  { left: "49%", top: "21%", delay: "0.7s", duration: "2.2s" },
  { left: "56%", top: "12%", delay: "1.8s", duration: "2.7s" },
  { left: "63%", top: "8%", delay: "0.4s", duration: "2.1s" },
  { left: "71%", top: "20%", delay: "1.3s", duration: "2.6s" },
  { left: "78%", top: "11%", delay: "0.8s", duration: "2.3s" },
  { left: "86%", top: "16%", delay: "1.9s", duration: "2.5s" },
  { left: "93%", top: "8%", delay: "1.1s", duration: "2.2s" },
];

const DanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [dance, setDance] = useState<Dance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchDance = async () => {
      try {
        if (!id) {
          setError("Dance ID not found");
          setLoading(false);
          return;
        }
        setLoading(true);
        const data = await getDanceDetail(id);
        if (!data) {
          setError("Dance not found");
        } else {
          setDance(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dance");
      } finally {
        setLoading(false);
      }
    };

    fetchDance();
  }, [id]);



  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-[#d9ccac]">Loading...</p>
      </div>
    );
  }

  if (error || !dance) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Dance not found</h1>
          <Link to="/dances" className="mt-4 inline-flex text-sm text-primary hover:text-gold-light">
            ← Back to Dances
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = danceImages[dance.id] || bharatanatyamImg;

  return (
    <div className="dances-page min-h-screen pt-24 pb-16">
      <img
        src={natarajaVisual}
        alt="Nataraja-inspired background"
        className="dances-page-bg-fill"
      />
      <img
        src={natarajaVisual}
        alt="Shiva Nataraja motif"
        className="dances-page-bg-motif"
      />
      <div className="dances-page-overlay" />
      <div className="dance-detail-stars" aria-hidden="true">
        {detailStars.map((star, index) => (
          <span
            key={`${star.left}-${star.top}-${index}`}
            className={`dance-detail-star ${index % 4 === 0 ? "dance-detail-star--bright" : ""}`}
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <Link
          to="/dances"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#d9ccac] transition-colors hover:text-[#f2d98f]"
        >
          <ArrowLeft size={16} />
          Back to Dances
        </Link>

        {/* Small Image Between Back Link and Content */}
        <div className="mb-8 flex justify-start">
          <div className="dance-card-media w-56 h-56 overflow-hidden rounded-xl">
            <img src={imageUrl} alt={dance.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero - Background Cover */}
          <div className="relative flex flex-col justify-center mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#f0c96d]">{dance.origin}</p>
              <h1 className="mt-2 font-display text-4xl font-bold text-[#eadcb2] sm:text-5xl">
                {dance.name}
              </h1>
              <p className="mt-4 leading-relaxed text-[#d9ccac] max-w-lg">{dance.description}</p>
            </div>
          </div>

          {/* Comprehensive History Section */}
          {dance.completeHistory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-12 rounded-xl border border-gold-subtle bg-card p-8"
            >
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold text-foreground">Complete History</h2>
              </div>

              {/* Vertical Stack Layout */}
              <div className="flex flex-col gap-6">
                  {/* Ancient Origins */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="rounded-lg border border-gold-subtle bg-card p-6 transition-all hover:border-[#b8860b] hover:shadow-lg hover:shadow-[#b8860b]/20">
                      <h3 className="font-display text-lg font-semibold bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent mb-2">Ancient Origins</h3>
                      <p className="text-xs font-medium mb-3 bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent">2,000 BCE - Present</p>
                      <p className="text-sm text-black leading-relaxed">{dance.completeHistory.ancientOrigins}</p>
                    </div>
                  </motion.div>

                  {/* Temple Heritage */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="rounded-lg border border-gold-subtle bg-card p-6 transition-all hover:border-[#b8860b] hover:shadow-lg hover:shadow-[#b8860b]/20">
                      <h3 className="font-display text-lg font-semibold bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent mb-2">Temple Heritage</h3>
                      <p className="text-xs font-medium mb-3 bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent">Sacred Temples</p>
                      <p className="text-sm text-black leading-relaxed">{dance.completeHistory.templeHeritage}</p>
                    </div>
                  </motion.div>

                  {/* Devadasi Tradition */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="rounded-lg border border-gold-subtle bg-card p-6 transition-all hover:border-[#b8860b] hover:shadow-lg hover:shadow-[#b8860b]/20">
                      <h3 className="font-display text-lg font-semibold bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent mb-2">Devadasi Tradition</h3>
                      <p className="text-xs font-medium mb-3 bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent">1,500 Year Lineage</p>
                      <p className="text-sm text-black leading-relaxed">{dance.completeHistory.devadasiTradition}</p>
                    </div>
                  </motion.div>

                  {/* Modern Revival */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="rounded-lg border border-gold-subtle bg-card p-6 transition-all hover:border-[#b8860b] hover:shadow-lg hover:shadow-[#b8860b]/20">
                      <h3 className="font-display text-lg font-semibold bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent mb-2">Modern Revival</h3>
                      <p className="text-xs font-medium mb-3 bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent">1930s - 1940s</p>
                      <p className="text-sm text-black leading-relaxed">{dance.completeHistory.modernRevival}</p>
                    </div>
                  </motion.div>

                  {/* Contemporary Era */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="rounded-lg border border-gold-subtle bg-card p-6 transition-all hover:border-[#b8860b] hover:shadow-lg hover:shadow-[#b8860b]/20">
                      <h3 className="font-display text-lg font-semibold bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent mb-2">Contemporary Era</h3>
                      <p className="text-xs font-medium mb-3 bg-gradient-to-r from-[#c4a052] to-[#8b6914] bg-clip-text text-transparent">Present Day</p>
                      <p className="text-sm text-black leading-relaxed">{dance.completeHistory.contemporaryEra}</p>
                    </div>
                  </motion.div>
                </div>
            </motion.div>
          )}

          {/* Temple Traditions Section */}
          {dance.templeTraitions && (
            <div className="mt-12 rounded-xl border border-gold-subtle bg-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-10 w-1 bg-gradient-to-b from-[#c4a052] to-[#8b6914]" />
                <h2 className="font-display text-2xl font-bold text-foreground">Temple Traditions</h2>
              </div>
              <p className="leading-relaxed text-black">{dance.templeTraitions}</p>
            </div>
          )}

          {/* Philosophy & Aesthetics Section */}
          {dance.philosophy && (
            <div className="mt-8 rounded-xl border border-gold-subtle bg-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-10 w-1 bg-gradient-to-b from-[#c4a052] to-[#8b6914]" />
                <h2 className="font-display text-2xl font-bold text-foreground">Philosophy & Aesthetics</h2>
              </div>
              <p className="leading-relaxed text-black">{dance.philosophy}</p>
            </div>
          )}

          {/* Famous Mudras */}
          <div className="mt-8 rounded-xl border border-gold-subtle bg-card p-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Famous Mudras</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {dance.famousMudras.map((mudra) => (
                <span
                  key={mudra}
                  className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  {mudra}
                </span>
              ))}
            </div>
          </div>

          {/* Audio Narration Player */}
          <AudioNarrationPlayer
            englishAudioUrl={dance.audioNarration?.english}
            hindiAudioUrl={dance.audioNarration?.hindi}
            danceName={dance?.name || "Dance"}
          />

          {/* Knowledge Graph */}
          {id && danceKnowledgeById[id] && (
            <div className="mt-12 space-y-4">
              <KnowledgeGraphVisualization
                danceKnowledge={danceKnowledgeById[id]}
                danceName={dance?.name || "Dance"}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DanceDetail;
