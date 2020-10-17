import React from "react";

import { Link } from "react-router-dom";

import "./Navbar.css";

const Navbar = (props) => {
  return (
    <div className="navbar">
      <Link id="nav-title" className="nav-item" to="/">
        Dashboard
      </Link>
      <Link className="nav-item" to="/">
        Dashboard
      </Link>
      <Link className="nav-item" to="/patients">
        Patients
      </Link>
      <Link className="nav-item" to="/metrics">
        Metrics
      </Link>
      <Link className="nav-item" to="account">
        Account Management
      </Link>
    </div>
  );
};

export default Navbar;
