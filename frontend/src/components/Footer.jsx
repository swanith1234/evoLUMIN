// src/components/Footer.jsx
import React from 'react';
import './Footer.css'; // Import the CSS for footer styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <a href="/agro-connect">Agro Connect</a>
                    <a href="/agro-market">Agro Market</a>
                    <a href="/browse-websites">Browse Websites</a>
                    <a href="/agro-tools">Agro Tools</a>
                </div>
                <div className="footer-info">
                    <p>&copy; {new Date().getFullYear()} AgroNexus. All rights reserved.</p>
                    <p>Privacy Policy | Terms of Service</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
