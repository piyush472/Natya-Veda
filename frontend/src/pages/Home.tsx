import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import { Network, History, Hand, PlayCircle, Zap } from "lucide-react";

const features = [
  {
    icon: Network,
    title: "Cultural Knowledge Graph",
    description: "Discover interconnected relationships between dances, mudras, rasas, and deities.",
  },
  {
    icon: History,
    title: "Dance History Explorer",
    description: "Journey through centuries of tradition, evolution, and artistic mastery.",
  },
  {
    icon: Hand,
    title: "Mudra Detection",
    description: "Use AI-powered hand gesture recognition to identify classical dance mudras.",
  },
  {
    icon: Zap,
    title: "Interactive Practice Mode",
    description: "Learn mudras through gamified practice with real-time AI feedback and scoring.",
  },
];

const Home = () => {
  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section className="content-section content-section-blend bg-section-bg">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-primary-text">
              Platform Features
            </h2>
            <p className="mt-3 text-secondary-text text-lg">
              Tools and experiences designed for cultural exploration
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
