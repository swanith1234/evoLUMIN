import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import "./ProfileDropdown.css";
import { AuthContext } from "./authContext";
import AuthCard from "./registration";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, userInfo } = useContext(AuthContext);
  const dropdownRef = useRef(null); // Reference for the dropdown

  // Function to toggle dropdown
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle clicks outside the dropdown and close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    console.log("Logout");
    // Add your logout functionality here
  };

  // Get the first letter of the user's email
  const avatarLetter = userInfo && userInfo.user.email.charAt(0).toUpperCase();

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
          {token ? (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              {/* Display first letter of the user's email instead of the icon */}
              <div className="profile-icon" onClick={handleDropdownToggle}>
                {avatarLetter}
              </div>
              
              {/* Dropdown Menu */}
              {isOpen && userInfo && (
                <div className="dropdown-menu">
                  {/* Avatar */}
                  <div className="profile-avatar-container">
                    <div className="profile-avatar">{avatarLetter}</div>
                  </div>

                  {/* User Info */}
                  <div className="profile-info">
                    <strong>{userInfo.user.name}</strong>
                    <p>{userInfo.user.email}</p>
                  </div>

                  {/* My Services Link */}
                  <div className="dropdown-links">
                    <Link to="/my-services" className="dropdown-item">
                      My Services
                    </Link>
                    <Link to="/profile" className="dropdown-item">
                      View Profile
                    </Link>
                    <button className="dropdown-item logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
        <Link to='/auth'>    <button className="login-button">Login</button></Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
