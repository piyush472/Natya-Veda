import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bharatanatyamImg from "@/assets/bharatanatyam.jpg";
import kathakImg from "@/assets/kathak.jpg";
import odissiImg from "@/assets/odissi.jpg";
import kathakaliImg from "@/assets/kathakali.jpg";

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

interface DanceCardProps {
  dance: Dance;
  index?: number;
}

// Map dance IDs to image assets
const danceImages: Record<string, string> = {
  bharatanatyam: bharatanatyamImg,
  kathak: kathakImg,
  odissi: odissiImg,
  kathakali: kathakaliImg,
};

const DanceCard = ({ dance, index = 0 }: DanceCardProps) => {
  const imageUrl = danceImages[dance.id] || bharatanatyamImg;
  
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
            src={imageUrl}
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
