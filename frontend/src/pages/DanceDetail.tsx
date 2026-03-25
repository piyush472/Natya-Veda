import { useParams, Link } from "react-router-dom";
import { dances } from "@/data/dances";
import { ArrowLeft, Network } from "lucide-react";
import { motion } from "framer-motion";
import natarajaVisual from "@/assets/download (1).jpg";

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
  const dance = dances.find((d) => d.id === id);

  if (!dance) {
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

  const sections = [
    { title: "History", content: dance.history },
    { title: "Temple Traditions", content: dance.templeTraitions },
    { title: "Philosophy", content: dance.philosophy },
  ];

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            <div className="dance-card-media aspect-[4/3] overflow-hidden rounded-xl">
              <img src={dance.imageUrl} alt={dance.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-[#f0c96d]">{dance.origin}</p>
              <h1 className="mt-2 font-display text-4xl font-bold text-[#eadcb2] sm:text-5xl">
                {dance.name}
              </h1>
              <p className="mt-4 leading-relaxed text-[#d9ccac]">{dance.description}</p>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid gap-6 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title} className="rounded-xl border border-gold-subtle bg-card p-6">
                <h2 className="font-display text-xl font-semibold text-foreground">{section.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

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

          {/* Knowledge Graph Placeholder */}
          <div className="mt-8 rounded-xl border border-dashed border-gold-subtle bg-card p-12 text-center">
            <Network className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              Interactive Knowledge Graph
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore connections between Dance → Mudra → Rasa → Deity
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">Coming soon</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DanceDetail;
