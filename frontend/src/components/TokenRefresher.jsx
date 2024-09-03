import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const TokenRefresher = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.get(
          "https://goodreadsmern-production.up.railway.app/api/refresh",
          {
            withCredentials: true,
            headers: {
              "x-access-token": token,
            },
          }
        );
      } catch (error) {
        console.error("Failed to refresh token", error);
        // Remove the token from local storage
        localStorage.removeItem("token");
        // Cookies.remove("tokenExists");
        // Redirect to login if token refresh fails
        navigate("/login");
      }
    };
    refreshAccessToken();
    // Refresh the token every 4.5 minutes
    const intervalId = setInterval(refreshAccessToken, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigate]);

  return <>{children}</>;
};

export default TokenRefresher;
