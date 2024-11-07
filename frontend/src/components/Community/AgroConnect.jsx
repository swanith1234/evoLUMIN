import React from "react";
import Navbar from "../Navbar";
import LeftProfile from "./LeftProfile";
import SuggestionProfiles from "./SuggestionProfiles";
 
import Posts from "./Posts";

const AgroConnect = () => {
  const containerStyle = {
     
    margin: "0 auto",
    display: "flex",
    marginTop: "1.5rem",
    gap: "1rem",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    backgroundColor: "#e5e7eb",
    backgroundImage: "url('../../assets/bgHero.png')",  
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  
  return (
    <div style={{ backgroundColor: "#f7fafc", minHeight: "100vh" }}>
      <Navbar />
      <div style={containerStyle}>
        <aside style={{ width: "25%" }}>
          <LeftProfile />
        </aside>
        <main style={{ width: "50%" }}>
          <Posts />
        </main>
        <aside style={{width: "25%"}}>
         <SuggestionProfiles/> 
        </aside>
        
      </div>
    </div>
  );
};

export default AgroConnect;

