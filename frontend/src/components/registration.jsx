import { useState, useEffect } from "react";
import PasswordRecoveryModal from "./PasswordRecoveryModal";
import "./registration.css";
import axios from "axios";
import Login from "./Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Link } from "react-router-dom";

const AuthCard = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "",
    crop: "",
    productionStage: "",
  });
  const locationInfo = {
    "Andhra Pradesh": {
      districts: [
        "Chittoor",
        "Kadapa",
        "Anantapur",
        "Kurnool" /* add more districts */,
      ],
      language: "Telugu",
    },
    Karnataka: {
      districts: ["Bangalore", "Mysore", "Hubli" /* add more districts */],
      language: "Kannada",
    },
    "Tamil Nadu": {
      districts: ["Chennai", "Coimbatore", "Madurai" /* add more districts */],
      language: "Tamil",
    },
    // Add more states and districts as needed
  };

  const parseAddress = (address) => {
    // Example: "Unnamed road, Tirupati, Tirupati - 517500, Andhra Pradesh, India"
    const addressParts = address.split(",");

    let state = "";
    let district = "";
    let mandal = "";

    // Parse the state from the address using Object.prototype.hasOwnProperty
    for (let part of addressParts) {
      part = part.trim();
      if (Object.prototype.hasOwnProperty.call(locationInfo, part)) {
        state = part;
        break;
      }
    }

    // Parse the district based on known districts in the state
    if (state) {
      for (let part of addressParts) {
        part = part.trim();
        if (locationInfo[state].districts.includes(part)) {
          district = part;
          break;
        }
      }
    }

    // The first part of the address could be the mandal
    mandal = addressParts[1].trim(); // Assuming the mandal is the second part (you can adjust based on the address format)

    // Fetch the language based on the state
    const language = state ? locationInfo[state].language : "Unknown";

    return {
      state,
      district,
      mandal,
      language,
    };
  };
  const getHumanReadableLocation = async (lat, lon) => {
    try {
      // Replace with your OpenCage API key
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=b065176c1347425aa244dbe4ae16ef3d`
      );
      console.log(response);
      const location = response.data.results[0].formatted; // Get the formatted address
      console.log("address", parseAddress(location));
      return location;
    } catch (error) {
      console.error("Error fetching location:", error);
      return "Unable to retrieve location";
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = await getHumanReadableLocation(latitude, longitude);
          setSignupDetails((prevDetails) => ({
            ...prevDetails,
            location,
          }));
        },
        (error) => {
          console.error("Location error: ", error);
          setSignupDetails((prevDetails) => ({
            ...prevDetails,
            location: "Unable to detect location",
          }));
        }
      );
    }
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLoginChange = (e) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {
    setSignupDetails({
      ...signupDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(loginDetails.email)) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/login",
          loginDetails
        );
        if (response) {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          setSuccessMessage("Login successful!");
          setTimeout(() => setSuccessMessage(""), 3000);
          window.history.back();
        }
      } catch (error) {
        console.error("Login error: ", error);
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = signupDetails;

    if (validateEmail(email) && password === confirmPassword) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/users/register",
          signupDetails
        );
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        setSuccessMessage("Signup successful!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Signup error: ", error);
      }
    } else {
      console.error("Signup validation failed");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Welcome to AgroNexus</div>
        <div className="card-description">
          Empowering Agriculture, One Step at a Time
        </div>
      </div>
      <div className="tabs">
        <button
          type="button"
          className={`tab-link ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`tab-link ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
      </div>

      <div className="tab-container">
        {activeTab === "login" && (
          <div className="tab-content active" id="login">
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginDetails.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginDetails.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <button type="submit" className="btn">
                Login
              </button>
              {successMessage && (
                <div className="success">{successMessage}</div>
              )}
            </form>
            <div className="or flex  justify-center p-2">Or</div>
            <div className="other-login">
              <GoogleOAuthProvider clientId="33824761098-qpbdicbicv0536fv2l4sldshukq6jbtj.apps.googleusercontent.com">
                <Login />
              </GoogleOAuthProvider>

              <Link to="/sendOtp">
                <div className="loginWithPhone ">
                  <i className="fa-solid fa-phone"></i>
                  <span> Login With Phone</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {activeTab === "signup" && (
          <div className="tab-content active" id="signup">
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signup-name">Name</label>
                <input
                  type="text"
                  id="signup-name"
                  name="name"
                  placeholder="Enter your name"
                  value={signupDetails.name}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-phone">Phone Number</label>
                <input
                  type="tel"
                  id="signup-phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={signupDetails.phone}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  placeholder="Enter your email"
                  value={signupDetails.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-location">Location</label>
                <input
                  type="text"
                  id="signup-location"
                  name="location"
                  placeholder="Detecting location..."
                  value={signupDetails.location}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-role">Role</label>
                <select
                  id="signup-role"
                  name="role"
                  value={signupDetails.role}
                  onChange={handleSignupChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="farmer">Farmer</option>
                  <option value="expert">Expert</option>
                  <option value="Retailer">Retailer</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="signup-crop">Crop</label>
                <input
                  type="text"
                  id="signup-crop"
                  name="crop"
                  placeholder="Enter the crop you work on"
                  value={signupDetails.crop}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-production-stage">
                  Production Stage
                </label>
                <select
                  id="signup-production-stage"
                  name="productionStage"
                  value={signupDetails.productionStage}
                  onChange={handleSignupChange}
                  required
                >
                  <option value="">Select Stage</option>
                  <option value="Sowing">Sowing</option>
                  <option value="Growing">Growing</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="Post-Harvest">Post-Harvest</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  placeholder="Create a password"
                  value={signupDetails.password}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-confirm-password">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="signup-confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={signupDetails.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <button type="submit" className="btn">
                Sign Up
              </button>
              {successMessage && (
                <div className="success">{successMessage}</div>
              )}
            </form>
          </div>
        )}
      </div>
      {isModalOpen && (
        <PasswordRecoveryModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default AuthCard;
