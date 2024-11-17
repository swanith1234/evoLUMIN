import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import AgroConnect from "./components/Community/AgroConnect";

import AgroMarkets from "./components/AgroMarkets";
import BrowseWebsites from "./components/BrowseWebsites";
import AgroTools from "./components/AgroTools";
import AuthCard from "./components/registration";
import Footer from "./components/Footer";
import Home from "./home";
import SendOtp from "./components/sendOtp";
import VerifyOtp from "./components/verifyOtp";
import ToolDetails from "./components/ToolDetails";
import WebsiteTours from "./components/WebsiteTours";
import WebsiteTourDetail from "./components/WebsiteTourDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";
import LocationTracker from "./components/locationTracker";
import "./App.css";
import "./index.css";
import "./components/AgroMarkets.css";

// Voice navigation component
const VoiceNavigator = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  const navigate = useNavigate();

  useEffect(() => {
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
      } else {
        console.log("Command not recognized");
      }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
    };
  }, [recognition, navigate]);

  const startListening = () => {
    recognition.start();
    console.log("Voice recognition started");
  };

  return (
    <div style={{ display: "none", height: "0" }}>
      <button onClick={startListening}>Navigate by Voice</button>
    </div>
  );
};

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Conditionally render Navbar - Hide on the AgroConnect page */}
      {location.pathname !== "/agro-connect" && (
        <div className="navbar-with-profile">
          <Navbar />
        </div>
      )}

      {/* Include Voice Navigator */}
      <VoiceNavigator />
      <LocationTracker></LocationTracker>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthCard />} />
        <Route path="/agro-connect/*" element={<AgroConnect />} />
        <Route path="/agro-market" element={<AgroMarkets />} />
        <Route path="/agro-market1" element={<AgroMarkets />} />
        <Route path="/agro-tools" element={<AgroTools />} />
        <Route path="/sendOtp" element={<SendOtp />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route
          path="/tool/:crop/:productionStage/:title"
          element={<ToolDetails />}
        />
        <Route path="/browse-websites" element={<WebsiteTours />} />
        <Route path="/browse-website/:name" element={<WebsiteTourDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/login"
          element={
            <GoogleOAuthProvider clientId="33824761098-qpbdicbicv0536fv2l4sldshukq6jbtj.apps.googleusercontent.com">
              <Login />
            </GoogleOAuthProvider>
          }
        />
      </Routes>

      {/* Conditionally render Footer - Hide on the AgroConnect page */}
      {location.pathname !== "/agro-connect" && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
