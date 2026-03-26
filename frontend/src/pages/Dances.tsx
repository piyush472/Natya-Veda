import DanceCard from "@/components/DanceCard";
import natarajaVisual from "@/assets/download (1).jpg";
import { useEffect, useState } from "react";
import { getDances } from "@/lib/api";

interface Dance {
  id: string;
  name: string;
  origin: string;
  shortDescription: string;
  description?: string;
  history?: string;
  templeTraitions?: string;
  philosophy?: string;
  famousMudras: string[];
}

const stars = [
  { left: "6%", top: "12%", delay: "0.2s", duration: "2.3s" },
  { left: "12%", top: "20%", delay: "1.1s", duration: "2.7s" },
  { left: "18%", top: "10%", delay: "0.6s", duration: "2.2s" },
  { left: "24%", top: "26%", delay: "1.8s", duration: "2.9s" },
  { left: "31%", top: "14%", delay: "0.9s", duration: "2.5s" },
  { left: "38%", top: "8%", delay: "1.5s", duration: "2.4s" },
  { left: "44%", top: "24%", delay: "0.4s", duration: "2.8s" },
  { left: "51%", top: "16%", delay: "1.2s", duration: "2.1s" },
  { left: "58%", top: "9%", delay: "1.7s", duration: "2.6s" },
  { left: "64%", top: "22%", delay: "0.3s", duration: "2.3s" },
  { left: "70%", top: "13%", delay: "1.4s", duration: "2.9s" },
  { left: "76%", top: "6%", delay: "0.8s", duration: "2.2s" },
  { left: "82%", top: "19%", delay: "1.9s", duration: "2.7s" },
  { left: "88%", top: "11%", delay: "0.5s", duration: "2.4s" },
  { left: "93%", top: "25%", delay: "1.6s", duration: "2.8s" },
];

const Dances = () => {
  const [dances, setDances] = useState<Dance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDances = async () => {
      try {
        setLoading(true);
        const data = await getDances();
        console.log("Fetched dances:", data);
        setDances(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch dances";
        console.error("Error fetching dances:", errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchDances();
  }, []);

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
      <div className="dances-page-stars" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            key={`${star.left}-${star.top}-${index}`}
            className={`twinkle-star ${index % 5 === 0 ? "twinkle-star--bright" : ""}`}
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
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold text-[#eadcb2] sm:text-5xl">
            Classical Dance Forms
          </h1>
          <p className="mt-3 max-w-xl text-[#d9ccac]">
            Explore the diverse traditions of Indian classical dance, each carrying centuries of cultural heritage.
          </p>
        </div>

        {loading && <p className="text-[#d9ccac]">Loading dances...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dances.map((dance, i) => (
              <DanceCard key={dance.id} dance={dance} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dances;
