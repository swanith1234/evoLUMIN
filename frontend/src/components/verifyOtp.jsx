import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(""); // Initialize as an empty string
  const location = useLocation();
  const phone = location.state; // Access phone from location's state
  console.log(phone);
  const verifyingOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/users/auth/phone/verify",
        { otp, phone } // Send both OTP and phone in request body
      );
      console.log(res.data);
      localStorage.setItem("token", res.data.token); // Log the data part of the response
    } catch (error) {
      console.error("Error verifying OTP:", error); // Handle error properly
    }
  };

  return (
    <div
      className="w-full h-full flex justify-center items-center"
      style={{ width: "100vw", height: "100vh", display: "inline-flex" }}
    >
      <input
        type="number"
        className="otp border-2"
        placeholder="Enter OTP"
        onChange={(event) => setOtp(event.target.value)} // Update otp state on change
      />
      <button onClick={verifyingOtp}>Verify</button>
    </div>
  );
}
