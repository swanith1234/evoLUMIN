// AuthContext.js
import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // Optional, if you use cookies

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const clearContext = () => {
    setToken(null);
    setUserInfo(null);
  };
  // Function to retrieve token and user info
  const fetchToken = () => {
    const localToken = localStorage.getItem("token") || Cookies.get("token");
    setToken(localToken);
    // Fetch user info from an API using the token
    if (localToken) {
      // Example API call
      fetchUserInfo(localToken);
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/login/${token}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = await response.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, userInfo, clearContext }}>
      {children}
    </AuthContext.Provider>
  );
};
