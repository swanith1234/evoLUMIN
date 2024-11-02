import { useGoogleLogin } from "@react-oauth/google";
import { GoogleOauthProvider } from "@react-oauth/google";
export default function App() {
  const responseGoogle = (authResult) => {
    try {
      console.log(authResult);
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
    <GoogleOauthProvider clientId="33824761098-qpbdicbicv0536fv2l4sldshukq6jbtj.apps.googleusercontent.com">
      <div>
        <button onClick={googleLogin}>Login </button>
      </div>
    </GoogleOauthProvider>
  );
}
