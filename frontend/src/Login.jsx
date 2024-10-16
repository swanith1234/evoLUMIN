import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
export default function Login() {
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const res = await axios.post(
          `http://localhost:5000/api/v1/users/auth/google?code=${authResult["code"]}`
        );
        const { email, name, avatar } = res.data.user;
        console.log(email, name, avatar);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div>
      <button onClick={googleLogin}>Login </button>
    </div>
  );
}
