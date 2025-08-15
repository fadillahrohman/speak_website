import apiClient from "./apiClient";

const authAPI = {
  login: async (credentials) => {
    return await apiClient.post("/auth/login", credentials);
  },

  verify: async () => {
    return await apiClient.get("/auth/verify", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  },

  logout: async (credentials) => {
    return await apiClient.post("/auth/logout", credentials);
  },

  register: async (credentials) => {
    return await apiClient.post("/auth/register", credentials);
  },

  resendVerification: async (email) => {
    return await apiClient.post(
      "/auth/resend-verification",
      { email },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  },

  validateToken: async (token) => {
    return await apiClient.get("/auth/validate-success-token", {
      params: { token },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  },
};

export default authAPI;
