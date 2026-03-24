import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dances from "./pages/Dances";
import DanceDetail from "./pages/DanceDetail";
import MudraDetection from "./pages/MudraDetection";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dances" element={<Dances />} />
          <Route path="/dances/:id" element={<DanceDetail />} />
          <Route path="/mudra-detection" element={<MudraDetection />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
