import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AgroConnect from "./components/AgroConnect";
import AgroMarket from "./components/AgroMarket";
import BrowseWebsites from "./components/BrowseWebsites";
import AgroTools from "./components/AgroTools";
import AuthCard from "./components/registration";
import Footer from "./components/Footer";
import Home from "./home";
import SendOtp from "./components/sendOtp";
import VerifyOtp from "./components/verifyOtp";
import ToolDetails from "./components/ToolDetails";
import "./App.css";
export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <div className="navbar-with-profile">
          <Navbar /> {/* Navbar appears on every page */}
          {/* Profile dropdown in the navbar */}
        </div>
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
