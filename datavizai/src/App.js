import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import your pages
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Analysis from "./pages/Analysis";
import Chatbot from "./pages/Chatbot";
import About from "./pages/About";
import FinanceDashboard from "./pages/FinanceDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<FinanceDashboard />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
