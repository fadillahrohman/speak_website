import axios from "axios";

const authAPI = {
  login: async (credentials) => {
    return await axios.post("/api/auth/login", credentials);
  },

  verify: async () => {
    return await axios.get("/api/auth/verify", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  },

  logout: async (credentials) => {
    return await axios.post("/api/auth/logout", credentials);
  },

  register: async (credentials) => {
    return await axios.post("/api/auth/register", credentials);
  },

  resendVerification: async (email) => {
    return await axios.post(
      "/api/auth/resend-verification",
      { email },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  },

  validateToken: async (token) => {
    return await axios.get("/api/auth/validate-success-token", {
      params: { token },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  },
};

export default authAPI;
