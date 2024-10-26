import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AgroConnect from "./components/Community/AgroConnect";
import AgroMarket from "./components/AgroMarket";  // AgroMarket component
import AgroMarkets from "./components/AgroMarkets";  // AgroMarkets component for AgroMarket1
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

import './App.css';
import './index.css';
import './components/AgroMarkets.css';

function App() {
  const location = useLocation(); // Use useLocation to get current path

  return (
    <div className="app-container">
      {/* Conditionally render Navbar - Hide on the AgroConnect page */}
      {location.pathname !== "/agro-connect" && (
        <div className="navbar-with-profile">
          <Navbar /> {/* Navbar appears on every page except AgroConnect */}
          <Navbar /> {/* Navbar appears on every page */}
          {/* Profile dropdown in the navbar */}
        </div>
      )}

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

      {/* Conditionally render Footer - Hide on the AgroConnect page */}
      {location.pathname !== "/agro-connect" && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Other routes */}
          <Route path="/auth" element={<AuthCard />} />
          <Route path="/agro-connect" element={<AgroConnect />} />
          <Route path="/agro-market" element={<AgroMarket />} />
          <Route path="/browse-websites" element={<BrowseWebsites />} />
          <Route path="/agro-tools" element={<AgroTools />} />
          <Route path="/sendOtp" element={<SendOtp></SendOtp>}></Route>
          <Route path="/verify" element={<VerifyOtp></VerifyOtp>}></Route>
          <Route
            path="/tool/:crop/:productionStage/:title"
            element={<ToolDetails></ToolDetails>}
          ></Route>
        </Routes>
        {/* Footer Section */}
        <Footer /> {/* Footer appears on every page */}
      </div>
    </Router>
  );
}
