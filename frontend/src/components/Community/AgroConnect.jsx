import Navbar from "../Navbar";
import LeftProfile from "./LeftProfile";
import SuggestionProfiles from "./SuggestionProfiles";
import { Routes, Route } from "react-router";
import Posts from "./Posts";
import LikedPosts from "./likedPosts";
import SavedPosts from "./savedPosts";
import MenuIcon from "@mui/icons-material/Menu";
import "./AgroConnect.css";
import { useState } from "react";
const AgroConnect = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const containerStyle = {
    margin: "0 auto",
    display: "flex",
    marginTop: "2rem",
    gap: "1rem",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    backgroundColor: "#e5e7eb",
    backgroundImage: "url('../../assets/bgHero.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100vh",
    overflow: "hidden",
  };
  const toggleNavbar = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <div
      className="agroConnect-body"
      style={{ backgroundColor: "#f7fafc", minHeight: "100vh" }}
    >
      <Navbar />

      <div className="agroConnect-container" style={containerStyle}>
        <aside>
          {/* Mobile Navbar Toggle Button */}

          {isNavOpen ? (
            <button className="mobile-menu-btn" onClick={toggleNavbar}>
              <i class="fa-solid fa-xmark"></i>
            </button>
          ) : (
            <button className="mobile-menu-btn" onClick={toggleNavbar}>
              <MenuIcon fontSize="large" />
            </button>
          )}

          <div
            className={`agroConnect-sidebar ${
              isNavOpen ? "side-bar-open" : "side-bar-close"
            }`}
          >
            <LeftProfile />
          </div>
        </aside>
        <main>
          <Routes>
            <Route path="/" element={<Posts></Posts>}></Route>
            <Route
              path="likedPosts"
              element={<LikedPosts></LikedPosts>}
            ></Route>
            <Route
              path="savedPosts"
              element={<SavedPosts></SavedPosts>}
            ></Route>
          </Routes>
        </main>
        <aside className="suggestion-profiles">
          <SuggestionProfiles />
        </aside>
      </div>
    </div>
  );
};

export default AgroConnect;
