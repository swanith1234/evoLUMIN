// src/components/Navbar.jsx

import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import { AuthContext } from "./authContext";
const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { token, userInfo } = useContext(AuthContext);
  console.log("token", token);
  return (
    <nav className="navbar">
      <div className="navbar-brand">AgroNexus</div>
      <ul className="navbar-links">
        <li>
          <Link to="/agro-connect">Agro Connect</Link>
        </li>
        <li>
          <Link to="/agro-market">Agro Market</Link>
        </li>
        <li>
          <Link to="/browse-websites">Browse Websites</Link>
        </li>
        <li>
          <Link to="/agro-tools">Agro Tools</Link>
        </li>
        <li className="login">
          {token != null ? (
            <i className="fa-solid fa-user"></i>
          ) : (
            <button>Login</button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
