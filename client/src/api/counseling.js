import apiClient from "./apiClient";

const counselingAPI = {
  getCounselings: async () => {
    return await apiClient.get("/counselings");
  },

  countCounglings: async () => {
    return await apiClient.get("/counselings/count");
  },

  createCounseling: async (formData) => {
    return await apiClient.post("/counselings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getCounselors: async () => {
    return await apiClient.get("/counselings/users");
  },

  getCounselingDetail: async (reportCode) => {
    return await apiClient.get(`/counselings/${reportCode}`);
  },

  updateCounseling: async (reportCode, formData) => {
    return await apiClient.put(`/counselings/${reportCode}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCounselingStatus: async (reportCode, status) => {
    return await apiClient.patch(`/counselings/${reportCode}/status`, {
      status,
    });
  },
};

export default counselingAPI;
