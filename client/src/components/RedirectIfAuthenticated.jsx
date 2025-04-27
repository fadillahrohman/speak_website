import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RedirectIfAuthenticated({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/auth/verify", {
          withCredentials: true,
        });

        if (response.data.authenticated) {
          navigate("/");
        }
      } catch (error) {
        console.log("Not authenticated", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return children;
}
