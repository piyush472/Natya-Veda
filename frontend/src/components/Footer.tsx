const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto max-w-1200 px-6">
        <p className="font-display text-lg font-semibold text-main-bg mb-2">NatyaVeda</p>
        <p className="text-sm">
          © {new Date().getFullYear()} NatyaVeda. Preserving the art of Indian classical dance.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
