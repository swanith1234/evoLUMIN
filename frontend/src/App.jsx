import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import AgroConnect from "./components/AgroConnect";
import AgroMarket from "./components/AgroMarket";
import BrowseWebsites from "./components/BrowseWebsites";
import AgroTools from "./components/AgroTools";
import GetStartedButton from "./components/GetStartedButton";
import AuthCard from "./components/registration";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="homepage">
        {/* Navbar Component with Navigation Links */}
        <Navbar />

        {/* Header Section */}

        {/* Get Started Button */}

        {/* Routes for different pages */}
        <Routes>
          <Route
            path="/"
            element={
              <header className="header">
                <h1 className="header-title">Welcome to AgroNexus</h1>
                <div className="get-started">
                  <Link to="/auth">
                    <GetStartedButton />
                  </Link>
                </div>
              </header>
            }
          ></Route>
          <Route path="/auth" element={<AuthCard />} />
          <Route path="/agro-connect" element={<AgroConnect />} />
          <Route path="/agro-market" element={<AgroMarket />} />
          <Route path="/browse-websites" element={<BrowseWebsites />} />
          <Route path="/agro-tools" element={<AgroTools />} />
          {/* Optional: Add a Not Found route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
