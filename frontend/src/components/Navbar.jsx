// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">AgroNexus</div>
            <ul className="navbar-links">
                <li><Link to="/agro-connect">Agro Connect</Link></li>
                <li><Link to="/agro-market">Agro Market</Link></li>
                <li><Link to="/browse-websites">Browse Websites</Link></li>
                <li><Link to="/agro-tools">Agro Tools</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
