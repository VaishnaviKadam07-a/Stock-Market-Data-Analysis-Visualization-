import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Stocks.css";

const companies = [
  { name: "Tata Motors", image: "/images/tata.png", tagline: "Driving Innovation", bgColor: "#e0f2fe" },
  { name: "Infosys", image: "/images/infosys.png", tagline: "Tech Transformation", bgColor: "#d1fae5" },
  { name: "Reliance", image: "/images/reliance.png", tagline: "Empowering India", bgColor: "#fff7ed" },
  { name: "Mahindra", image: "/images/mahindra.png", tagline: "Sustainable Growth", bgColor: "#fce7f3" },
  { name: "Wipro", image: "/images/wipro.png", tagline: "Digital Evolution", bgColor: "#f1f5f9" },
];

const Stocks = () => {
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    companies.forEach(async (c) => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/company/${c.name}`);
        // Map API response to include open, close, volume if available
        const formatted = res.data.map((d) => ({
          date: d.date,
          price: d.price,       // close_price
          open: d.open_price,   // optional, if returned by backend
          volume: d.volume,     // optional, if returned by backend
        }));
        setStockData((prev) => ({ ...prev, [c.name]: formatted }));
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  return (
    <div className="stocks-container">
      <h1>Company Stocks Dashboard</h1>
      <div className="stocks-cards">
        {companies.map((c) => (
          <div
            className="stock-card"
            key={c.name}
            style={{ backgroundColor: c.bgColor }}
          >
            <img src={c.image} alt={c.name} />
            <h2>{c.name}</h2>
            <p className="tagline">{c.tagline}</p>
            <div className="chart-container">
              {stockData[c.name] ? (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={stockData[c.name]}>
                      <XAxis dataKey="date" hide />
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="stock-info">
                    <p>Latest Close: ₹{stockData[c.name][stockData[c.name].length - 1].price}</p>
                    {/* Optional display */}
                    {/* <p>Open: ₹{stockData[c.name][stockData[c.name].length - 1].open}</p>
                    <p>Volume: {stockData[c.name][stockData[c.name].length - 1].volume}</p> */}
                  </div>
                </>
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stocks;
