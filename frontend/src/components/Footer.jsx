import React from "react";
import { Twitter, LinkedIn } from "@mui/icons-material"; // Import icons from Material UI
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>Agro Nexus</h2>
          <p>
            AgroNexus is a platform designed to revolutionize agriculture
            through empowering farmers and building community.
          </p>
        </div>
        <div className="footer-section links">
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li>Agro Connect</li>
            <li>Agro Market</li>
            <li>Digital Tools</li>
            <li>Agro Tools</li>
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Connect with us</h3>
          <div className="social-icons">
            <Twitter className="social-icon" />
            <LinkedIn className="social-icon" />
            {/* Add other icons as needed */}
          </div>
        </div>
        <div className="footer-section legal">
          <h3>Legal</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2024 All Rights Reserved | AgroNexus</p>
        <button className="rate-button">Rate Us</button>
      </div>
    </footer>
  );
};

export default Footer;
