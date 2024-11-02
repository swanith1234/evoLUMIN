import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import "./ProfileDropdown.css";
import { AuthContext } from "./authContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // For dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile menu
  const { token, userInfo } = useContext(AuthContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const avatarLetter = userInfo?.user?.email?.charAt(0).toUpperCase() || "";

  // Voice navigation setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep recognition active
    recognition.interimResults = false; // Capture full sentences only

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Transcript:", transcript);

      // Voice-based navigation logic
      if (transcript.includes("home")) {
        navigate("/");
      } else if (transcript.includes("tools")) {
        navigate("/agro-tools");
      } else if (transcript.includes("profile")) {
        navigate("/profile");
      } else if (transcript.includes("market")) {
        navigate("/agro-market");
      } else if (transcript.includes("connect")) {
        navigate("/agro-connect");
      } else if (transcript.includes("digital")) {
        navigate("/browse-websites");
      } else {
        console.log("Command not recognized");
      }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
    };

    // Start listening on mount
    recognition.start();

    // Restart listening on page change
    const restartRecognition = () => {
      recognition.stop();
      setTimeout(() => recognition.start(), 500);
    };

    // Listen for page changes
    window.addEventListener("popstates", restartRecognition);

    // Cleanup
    return () => {
      recognition.stop();
      window.removeEventListener("popstate", restartRecognition);
    };
  }, [navigate]);

  // Dropdown and mobile menu functions
  const handleDropdownToggle = () => setIsOpen(!isOpen);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="AgroNexus Logo" className="navbar-logo" />
        <div className="navbar-brand">AgroNexus</div>
      </div>
      <button className="mobile-menu-icon" onClick={handleMobileMenuToggle}>
        ☰ {/* Hamburger icon for mobile */}
      </button>
      <ul className={`navbar-links ${isMobileMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/agro-connect">Agro Connect</Link>
        </li>
        <li>
          <Link to="/agro-market">Agro Market</Link>
        </li>
        <li>
          <Link to="/browse-websites">Digital Tools</Link>
        </li>
        <li>
          <Link to="/agro-tools">Agro Tools</Link>
        </li>
      </ul>
      <div className="navbar-right">
        {token ? (
          <div className="profile-dropdown-container" ref={dropdownRef}>
            <div className="profile-icon" onClick={handleDropdownToggle}>
              {avatarLetter}
            </div>
            {isOpen && userInfo && (
              <div className="dropdown-menu">
                <div className="profile-avatar-container">
                  <div className="profile-avatar">{avatarLetter}</div>
                </div>
                <div className="profile-info">
                  <strong>{userInfo.user.name}</strong>
                  <p>{userInfo.user.email}</p>
                </div>
                <div className="dropdown-links">
                  <Link to="/my-services" className="dropdown-item">
                    My Services
                  </Link>
                  <Link to="/profile" className="dropdown-item">
                    View Profile
                  </Link>
                  <button
                    className="dropdown-item logout-button"
                    onClick={() => console.log("Logout")}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth">
            <button className="login-button">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
