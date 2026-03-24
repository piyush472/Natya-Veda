import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container relative z-10 mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-6xl md:text-7xl font-bold text-primary-text mb-6">
            NatyaVeda
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg md:text-xl text-secondary-text mb-10">
            Explore the Cultural Intelligence of Indian Classical Dance
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/dances"
              className="btn-primary"
            >
              Explore Dances
            </Link>
            <Link
              to="/mudra-detection"
              className="btn-secondary"
            >
              Try Mudra Detection
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
