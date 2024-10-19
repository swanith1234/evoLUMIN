import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function SendOtp() {
  const [phone, setPhone] = useState();
  const navigate = useNavigate();
  const sendOtp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/users/auth/phone/sendOtp",
        { phone }
      );
      console.log(res);
      if (res) {
        navigate("/verify", { state: phone });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="w-full h-full flex justify-center items-center"
      style={{ width: "100vw", height: "100vh", display: "inline-flex" }}
    >
      <input
        type="phone"
        className="phone border-2"
        onChange={(event) => setPhone(event.target.value)}
      />
      <button onClick={sendOtp}>SendOtp</button>
    </div>
  );
}
