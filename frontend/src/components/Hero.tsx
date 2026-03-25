import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroVisual from "@/assets/download (1).jpg";

const heroStars = [
  { left: "6%", top: "10%", delay: "0.2s", duration: "2.6s" },
  { left: "12%", top: "18%", delay: "1.3s", duration: "3.1s" },
  { left: "18%", top: "8%", delay: "0.8s", duration: "2.7s" },
  { left: "24%", top: "22%", delay: "1.6s", duration: "3.2s" },
  { left: "31%", top: "13%", delay: "0.5s", duration: "2.8s" },
  { left: "38%", top: "7%", delay: "1.7s", duration: "3s" },
  { left: "45%", top: "21%", delay: "1.1s", duration: "3.3s" },
  { left: "52%", top: "12%", delay: "0.6s", duration: "2.6s" },
  { left: "59%", top: "6%", delay: "1.9s", duration: "3.1s" },
  { left: "66%", top: "19%", delay: "0.4s", duration: "2.9s" },
  { left: "73%", top: "10%", delay: "1.4s", duration: "3.2s" },
  { left: "80%", top: "16%", delay: "0.9s", duration: "2.8s" },
  { left: "86%", top: "7%", delay: "1.8s", duration: "3.1s" },
  { left: "92%", top: "20%", delay: "0.3s", duration: "2.7s" },
];

const heroMeteors = [
  { left: "18%", top: "8%", delay: "0.8s", duration: "8.8s" },
  { left: "52%", top: "4%", delay: "3.4s", duration: "9.6s" },
  { left: "78%", top: "10%", delay: "6.2s", duration: "10.4s" },
];

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="hero-eyebrow">
            Classical Heritage Experience
          </p>

          <h1 className="hero-title">
            Step Into The Story of Natya
          </h1>

          <p className="hero-description">
            Experience the depth of Indian classical dance through tradition,
            expression, mudras, and timeless performance wisdom.
          </p>

          <div className="hero-actions">
            <Link to="/dances" className="hero-explore-btn">
              Explore
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.img
        src={heroVisual}
        alt="Nataraja-inspired classical dance visual"
        className="hero-background-fill"
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1 }}
      />

      <motion.img
        src={heroVisual}
        alt="Nataraja full figure"
        className="hero-background-image"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.15, delay: 0.1 }}
      />

      <div className="hero-overlay" />

      <div className="hero-celestial-layer" aria-hidden="true">
        {heroStars.map((star, index) => (
          <span
            key={`${star.left}-${star.top}-${index}`}
            className={`hero-star ${index % 5 === 0 ? "hero-star--bright" : ""}`}
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}

        {heroMeteors.map((meteor, index) => (
          <span
            key={`${meteor.left}-${meteor.top}-${index}`}
            className="hero-meteor"
            style={{
              left: meteor.left,
              top: meteor.top,
              animationDelay: meteor.delay,
              animationDuration: meteor.duration,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
