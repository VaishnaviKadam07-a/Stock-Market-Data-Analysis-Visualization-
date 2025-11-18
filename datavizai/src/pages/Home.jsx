import React from "react";
import "./Home.css";

const companies = [
  {
    name: "Tata Motors",
    image: "/images/tata.png",
    tagline: "Driving Innovation",
    info: "Tata Motors is a leading automotive manufacturer in India, innovating mobility for a sustainable future.",
    city: "Pune",
    bgColor: "#e0f2fe" // light blue
  },
  {
    name: "Infosys",
    image: "/images/infosys.png",
    tagline: "Tech Transformation",
    info: "Infosys is a global leader in technology services and consulting, transforming enterprises with innovation.",
    city: "Pune",
    bgColor: "#d1fae5" // light green
  },
  {
    name: "Reliance",
    image: "/images/reliance.png",
    tagline: "Empowering India",
    info: "Reliance Industries is a conglomerate focusing on energy, retail, and digital services, shaping India’s economy.",
    city: "Mumbai",
    bgColor: "#fff7ed" // light orange
  },
  {
    name: "Mahindra",
    image: "/images/mahindra.png",
    tagline: "Sustainable Growth",
    info: "Mahindra Group operates in automotive, farm equipment, and IT sectors, promoting sustainable growth.",
    city: "Mumbai",
    bgColor: "#fce7f3" // light pink
  },
  {
    name: "Wipro",
    image: "/images/wipro.png",
    tagline: "Digital Evolution",
    info: "Wipro is a multinational corporation providing IT, consulting, and business process services.",
    city: "Mumbai",
    bgColor: "#f1f5f9" // light gray
  }
];

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to FinSight</h1>
      <p className="subtitle">AI-Powered Finance Insights for Top Companies 🚀</p>

      <div className="cards-container">
        {companies.map((c) => (
          <div
            className="company-card"
            key={c.name}
            style={{ backgroundColor: c.bgColor }}
          >
            <img src={c.image} alt={c.name} />
            <h2>{c.name}</h2>
            <p className="tagline">{c.tagline}</p>
            <p className="info">{c.info}</p>
            <p className="city">📍 {c.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
