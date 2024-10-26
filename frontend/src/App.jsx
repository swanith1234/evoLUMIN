import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AgroConnect from "./components/AgroConnect";
import AgroMarket from "./components/AgroMarket";  // AgroMarket component
import AgroMarkets from "./components/AgroMarkets";  // AgroMarkets component for AgroMarket1
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

import './App.css';
import './index.css';
import './components/AgroMarkets.css';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar-with-profile">
          <Navbar />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthCard />} />
          <Route path="/agro-connect" element={<AgroConnect />} />
          <Route path="/agro-market" element={<AgroMarkets />} /> {/* Main AgroMarket page */}
          <Route path="/agro-market1" element={<AgroMarkets />} /> {/* Additional AgroMarket1 page */}
          <Route path="/agro-tools" element={<AgroTools />} />
          <Route path="/sendOtp" element={<SendOtp />} />
          <Route path="/verify" element={<VerifyOtp />} />
          <Route path="/tool/:crop/:productionStage/:title" element={<ToolDetails />} />
          <Route path="/website-tours" element={<WebsiteTours />} />
          <Route path="/website-tour/:id" element={<WebsiteTourDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
