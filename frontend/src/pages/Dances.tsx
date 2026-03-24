import DanceCard from "@/components/DanceCard";
import { dances } from "@/data/dances";

const Dances = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Classical Dance Forms
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Explore the diverse traditions of Indian classical dance, each carrying centuries of cultural heritage.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dances.map((dance, i) => (
            <DanceCard key={dance.id} dance={dance} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dances;
