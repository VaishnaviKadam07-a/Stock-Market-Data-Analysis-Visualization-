import React, { useEffect, useState } from "react";
import StockChart from "./Stockchart";

function Dashboard() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_stocks")
      .then((res) => res.json())
      .then((data) => setStocks(data));
  }, []);

  // Group by company for chart
  const groupByCompany = (company) =>
    stocks.filter((s) => s.company === company);

  const companies = [...new Set(stocks.map((s) => s.company))];

  return (
    <div>
      <h2>Stock Trends</h2>
      {companies.map((company, idx) => (
        <div key={idx} style={{ marginBottom: "40px" }}>
          <h3>{company}</h3>
          <StockChart data={groupByCompany(company)} />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
