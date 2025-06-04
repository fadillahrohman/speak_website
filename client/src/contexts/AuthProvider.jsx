import { useState, useEffect } from "react";
import authAPI from "../api/auth"; // Pastikan path ini benar
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await authAPI.verify();
      if (response.data && response.data.user) {
      
        const userWithRole = {
          ...response.data.user,
          role: response.data.user.role || "counselor"
        }
        setUser(userWithRole)
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.error("Auth check failed:", error); 
    } finally {
      setCheckingAuth(false);
    }
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        checkingAuth,
        checkAuth,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
