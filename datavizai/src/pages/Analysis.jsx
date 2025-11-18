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
import "./Analysis.css";

const companies = [
  { name: "Tata Motors" },
  { name: "Infosys" },
  { name: "Reliance" },
  { name: "Mahindra" },
  { name: "Wipro" }  // Added Wipro
];

const Analysis = () => {
  const [selectedCompany, setSelectedCompany] = useState(companies[0].name);
  const [historicalData, setHistoricalData] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [stats, setStats] = useState({});
  const [recommendation, setRecommendation] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async (company) => {
    setLoading(true);
    setError("");
    try {
      // Fetch historical data
      const res = await axios.get(
        `http://127.0.0.1:5000/company/${encodeURIComponent(company)}`
      );
      const data = res.data.map(d => ({
        date: d.date,
        price: d.price,          // close_price
        open: d.open_price,      // optional, for extra info
        volume: d.volume         // optional, for extra info
      }));
      setHistoricalData(data);

      if (data.length > 0) {
        const prices = data.map((d) => d.price);
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        const avg = (
          prices.reduce((a, b) => a + b, 0) / prices.length
        ).toFixed(2);
        const pctChange = (
          ((prices[prices.length - 1] - prices[0]) / prices[0]) *
          100
        ).toFixed(2);

        setStats({ max, min, avg, pctChange });
      } else {
        setStats({});
      }

      // Fetch predicted price + sentiment + recommendation
      const predRes = await axios.get(
        `http://127.0.0.1:5000/predict/${encodeURIComponent(company)}`
      );

      if (predRes.data.error) {
        setError(predRes.data.error);
      } else {
        setPredictedPrice(predRes.data.predicted_price);
        setSentiment(predRes.data.sentiment || "Neutral");
        setRecommendation(predRes.data.recommendation || "No advice available.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCompany);
  }, [selectedCompany]);

  return (
    <div className="analysis-container">
      <h1>📊 Stock Market AI Analysis</h1>
      <p className="subtitle">
        Get predictions, insights, and recommendations for your selected company.
      </p>

      {/* Company Selector */}
      <div className="company-selector">
        <label>Select Company:</label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {companies.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          {/* Chart */}
          <div className="chart-section">
            {historicalData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No historical data to display</p>
            )}
          </div>

          {/* Stats + Prediction */}
          <div className="stats-section">
            <div className="card">
              <h3>Predicted Price</h3>
              <p>{predictedPrice ? `₹${predictedPrice}` : "-"}</p>
            </div>
            <div className="card">
              <h3>Max Price</h3>
              <p>{stats.max ? `₹${stats.max}` : "-"}</p>
            </div>
            <div className="card">
              <h3>Min Price</h3>
              <p>{stats.min ? `₹${stats.min}` : "-"}</p>
            </div>
            <div className="card">
              <h3>Average Price</h3>
              <p>{stats.avg ? `₹${stats.avg}` : "-"}</p>
            </div>
            <div className="card">
              <h3>% Change</h3>
              <p>{stats.pctChange ? `${stats.pctChange}%` : "-"}</p>
            </div>
          </div>

          {/* Optional: Display latest open price / volume */}
          {historicalData.length > 0 && (
            <div className="extra-info">
              <p>Latest Open Price: ₹{historicalData[historicalData.length - 1].open}</p>
              <p>Latest Volume: {historicalData[historicalData.length - 1].volume}</p>
            </div>
          )}

          {/* Sentiment + AI Recommendation */}
          <div className="recommendation-section">
            <h3>Market Sentiment:</h3>
            <p>{sentiment}</p>

            <h3>AI Recommendation:</h3>
            <p>{recommendation}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Analysis;
