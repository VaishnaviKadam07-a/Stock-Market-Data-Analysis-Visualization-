import React from "react";
import {  NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">FinSight</div>
      <ul className="nav-links">
        <li><NavLink to="/" exact activeclassname="active">Home</NavLink></li>
        <li><NavLink to="/stocks" activeclassname="active">Stocks</NavLink></li>
        <li><NavLink to="/analysis" activeclassname="active">Analysis</NavLink></li>
        <li><NavLink to="/chatbot" activeclassname="active">Chatbot</NavLink></li>
        <li><NavLink to="/dashboard" activeclassname="active">Dashboard</NavLink></li>
      
        <li><NavLink to="/about" activeclassname="active">About</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
