// src/pages/FinanceDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FinanceDashboard.css";

// ---------- Users Component ----------
const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="table-container">
      <h2>Registered Users</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------- Transactions Component ----------
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/transactions")
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="table-container">
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>User</th>
            <th>Company</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.txn_id}>
              <td>{t.txn_id}</td>
              <td>{t.user_name}</td>
              <td>{t.company}</td>
              <td>{t.quantity}</td>
              <td>₹{t.price}</td>
              <td>{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------- Portfolio Component ----------
const Portfolio = ({ userId }) => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://127.0.0.1:5000/portfolio/${userId}`)
      .then(res => setPortfolio(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="table-container">
      <h2>User Portfolio {userId ? `(User ID: ${userId})` : ""}</h2>
      {portfolio.length === 0 ? (
        <p>No portfolio data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Total Shares</th>
              <th>Average Price</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((p, index) => (
              <tr key={index}>
                <td>{p.company}</td>
                <td>{p.total_shares}</td>
                <td>₹{Number(p.avg_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ---------- Main FinanceDashboard Component ----------
const FinanceDashboard = () => {
  const [selectedUserId, setSelectedUserId] = useState(1); // Default user ID for Portfolio

  return (
    <div className="finance-dashboard">
      <h1>💰 Finance Dashboard</h1>

      <div className="section">
        <Users />
      </div>

      <div className="section">
        <Transactions />
      </div>

      <div className="section">
        <div className="user-selector">
          <label>Select User ID for Portfolio: </label>
          <input
            type="number"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            min="1"
          />
        </div>
        <Portfolio userId={selectedUserId} />
      </div>
    </div>
  );
};

export default FinanceDashboard;
