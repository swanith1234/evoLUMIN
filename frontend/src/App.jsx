import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AgroConnect from "./components/Community/AgroConnect";
import AgroMarket from "./components/AgroMarket";
import BrowseWebsites from "./components/BrowseWebsites";
import AgroTools from "./components/AgroTools";
import AuthCard from "./components/registration";
import Footer from "./components/Footer";
import Home from "./home";
import SendOtp from "./components/sendOtp";
import VerifyOtp from "./components/verifyOtp";
import ToolDetails from "./components/ToolDetails";
import './App.css'
function App() {
  const location = useLocation(); // Get the current route

  return (
    <div className="app-container">
      {/* Conditionally render Navbar - Hide on the AgroConnect page */}
      {location.pathname !== "/agro-connect" && (
        <div className="navbar-with-profile">
          <Navbar /> {/* Navbar appears on every page except AgroConnect */}
        </div>
      )}

      {/* Routes for different pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthCard />} />
        <Route path="/agro-connect" element={<AgroConnect />} />
        <Route path="/agro-market" element={<AgroMarket />} />
        <Route path="/browse-websites" element={<BrowseWebsites />} />
        <Route path="/agro-tools" element={<AgroTools />} />
        <Route path="/sendOtp" element={<SendOtp />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route
          path="/tool/:crop/:productionStage/:title"
          element={<ToolDetails />}
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
