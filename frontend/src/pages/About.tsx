import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            About <span className="text-gradient-gold">NatyaVeda</span>
          </h1>

          <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
            <p>
              NatyaVeda is a cultural learning platform dedicated to preserving and exploring the rich
              traditions of Indian classical dance. Our mission is to make centuries of artistic heritage
              accessible through modern technology.
            </p>
            <p>
              The platform combines a cultural knowledge graph, historical research, and AI-powered
              mudra detection to create an immersive learning experience. Whether you're a student,
              practitioner, or enthusiast, NatyaVeda offers tools to deepen your understanding of these
              sacred art forms.
            </p>
            <p>
              From Bharatanatyam's temple sculptures to Kathak's rhythmic storytelling, from Odissi's
              lyrical grace to Kathakali's dramatic power — each tradition carries a universe of meaning
              waiting to be explored.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-gold-subtle bg-card p-8 text-center">
            <p className="font-display text-lg text-foreground">
              "Where tradition meets technology"
            </p>
            <p className="mt-2 text-sm text-muted-foreground">— NatyaVeda</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
