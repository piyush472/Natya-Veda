import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Dance } from "@/data/dances";

interface DanceCardProps {
  dance: Dance;
  index?: number;
}

const DanceCard = ({ dance, index = 0 }: DanceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="dance-card h-full">
        <div className="dance-card-media aspect-[16/10] overflow-hidden rounded-lg">
          <img
            src={dance.imageUrl}
            alt={dance.name}
            className="h-full w-full object-cover transition-transform duration-500"
          />
        </div>

        <div className="mt-3">
          <h3 className="font-display text-lg font-semibold text-black">
            {dance.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-[#D4A63A]">{dance.origin}</p>
          <p className="mt-2 text-[0.95rem] text-black line-clamp-2">
            {dance.shortDescription}
          </p>
          <Link
            to={`/dances/${dance.id}`}
            className="mt-3 inline-flex text-sm font-medium text-[#D4A63A] transition-colors hover:text-[#E3BF66]"
          >
            Explore →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DanceCard;
