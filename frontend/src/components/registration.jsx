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
    coordination: "",
    state: "",
    district: "",
    mandal: "",
    place: "",
    role: "",
    crop: "",
    productionStage: "",
    language: "",
  });
  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);

  const locationInfo = {
    "Andhra Pradesh": {
      districts: {
        Chittoor: ["Mandal 1", "Mandal 2"],
        Kadapa: ["Mandal 3", "Mandal 4"],
        Anantapur: ["Mandal 5", "Mandal 6"],
        Kurnool: ["Mandal 7", "Mandal 8"],
      },
      language: "Telugu",
    },
    Karnataka: {
      districts: {
        Bangalore: ["Mandal 9", "Mandal 10"],
        Mysore: ["Mandal 11", "Mandal 12"],
        Hubli: ["Mandal 13", "Mandal 14"],
      },
      language: "Kannada",
    },
    "Tamil Nadu": {
      districts: {
        Chennai: ["Mandal 15", "Mandal 16"],
        Coimbatore: ["Mandal 17", "Mandal 18"],
        Madurai: ["Mandal 19", "Mandal 20"],
      },
      language: "Tamil",
    },

    Kerala: {
      districts: {
        Alappuzha: [
          "Ambalappuzha",
          "Chengannur",
          "Karthikappally",
          "Cherthala",
          "Mavelikkara",
        ],
        Ernakulam: [
          "Aluva",
          "Kochi",
          "Kunnathunad",
          "Kothamangalam",
          "Muvattupuzha",
        ],
        Idukki: ["Devikulam", "Peerumedu", "Thodupuzha", "Udumbanchola"],
        Kannur: ["Iritty", "Thalassery", "Taliparamba", "Kannur"],
        Kasaragod: ["Hosdurg", "Manjeshwaram", "Kasaragod", "Vellarikundu"],
        Kollam: ["Kottarakkara", "Pathanapuram", "Kollam", "Karunagappally"],
        Kottayam: [
          "Changanassery",
          "Kanjirappally",
          "Kottayam",
          "Meenachil",
          "Vaikom",
        ],
        Kozhikode: ["Koyilandy", "Kozhikode", "Thamarassery", "Vatakara"],
        Malappuram: [
          "Eranad",
          "Nilambur",
          "Perinthalmanna",
          "Tirur",
          "Ponnani",
        ],
        Palakkad: ["Alathur", "Chittur", "Mannarkkad", "Ottapalam", "Palakkad"],
        Pathanamthitta: ["Adoor", "Kozhenchery", "Ranni", "Tiruvalla"],
        Thiruvananthapuram: [
          "Chirayinkeezhu",
          "Nedumangad",
          "Neyyattinkara",
          "Thiruvananthapuram",
          "Varkala",
        ],
        Thrissur: [
          "Chalakudy",
          "Kodungallur",
          "Mukundapuram",
          "Thalapilly",
          "Thrissur",
        ],
        Wayanad: ["Mananthavady", "Sultan Bathery", "Vythiri"],
      },
      language: "Malayalam",
    },

    // Add more states and districts as needed
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSignupDetails({
      ...signupDetails,
      state: selectedState,
      district: "",
      mandal: "",
    });
    if (selectedState) {
      setDistricts(Object.keys(locationInfo[selectedState].districts));
    } else {
      setDistricts([]);
      setMandals([]);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setSignupDetails({
      ...signupDetails,
      district: selectedDistrict,
      mandal: "",
    });
    if (selectedDistrict) {
      setMandals(locationInfo[signupDetails.state].districts[selectedDistrict]);
    } else {
      setMandals([]);
    }
  };

  const handleMandalChange = (e) => {
    const selectedMandal = e.target.value;
    setSignupDetails({ ...signupDetails, mandal: selectedMandal });
  };
  const getHumanReadableLocation = async (lat, lon) => {
    console.log(lat, lon);
    try {
      // Replace with your OpenCage API key
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=b065176c1347425aa244dbe4ae16ef3d`
      );

      const properties = response.data.features[0].properties;

      // Extracting the required location data
      const place = properties.suburb;
      const mandal = properties.county;
      const district = properties.district;
      const state = properties.state;
      const language = locationInfo[state]?.language || "";

      // Updating signupDetails state in one go
      setSignupDetails((prevDetails) => ({
        ...prevDetails,
        place: place || prevDetails.place, // fallback to previous value if unavailable
        mandal: mandal || prevDetails.mandal,
        district: district || prevDetails.district,
        state: state || prevDetails.state,
        language: language,
      }));

      console.log("Place:", place);
      console.log("Mandal:", mandal);
      console.log("District:", district);
      console.log("State:", state);
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
          console.log(position.coords);

          const location = await getHumanReadableLocation(latitude, longitude);
          setSignupDetails((prevDetails) => ({
            ...prevDetails,
            location,
            coordinates: { type: "Point", coordinates: [longitude, latitude] },
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
          "http://localhost:3000/api/v1/users/login",
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
          "http://localhost:3000/api/v1/users/register",
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
                <label htmlFor="signup-state">State</label>
                <select
                  id="signup-state"
                  name="state"
                  value={signupDetails.state}
                  onChange={handleStateChange}
                  required
                >
                  <option value={signupDetails.state}>
                    {signupDetails.state}
                  </option>
                  {Object.keys(locationInfo).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="signup-district">District</label>
                <select
                  id="signup-district"
                  name="district"
                  value={signupDetails.district}
                  onChange={handleDistrictChange}
                  required
                  disabled={!signupDetails.state}
                >
                  <option value="">{signupDetails.district}</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="signup-mandal">Mandal</label>
                <select
                  id="signup-mandal"
                  name="mandal"
                  value={signupDetails.mandal}
                  onChange={handleMandalChange}
                  required
                  disabled={!signupDetails.district}
                >
                  <option value="">{signupDetails.mandal}</option>
                  {mandals.map((mandal) => (
                    <option key={mandal} value={mandal}>
                      {mandal}
                    </option>
                  ))}
                </select>
              </div>
              {/* Language Field */}
              <div className="form-group">
                <label htmlFor="signup-language">Language</label>
                <input
                  type="text"
                  id="signup-language"
                  name="language"
                  placeholder="Language"
                  value={signupDetails.language}
                  onChange={handleSignupChange}
                  readOnly
                  required
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
                  placeholder="Enter your password"
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
