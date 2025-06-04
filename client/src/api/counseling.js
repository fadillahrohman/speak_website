import axios from "axios";

const counselingAPI = {
  getCounselings: async () => {
    return await axios.get("/api/counselings");
  },

  countCounglings: async () => {
    return await axios.get("/api/counselings/count");
  },

  createCounseling: async (formData) => {
    return await axios.post("/api/counselings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getCounselors: async () => {
    return await axios.get("/api/counselings/users");
  },

  getCounselingDetail: async (reportCode) => {
    return await axios.get(`/api/counselings/${reportCode}`);
  },

  updateCounseling: async (reportCode, formData) => {
    return await axios.put(`/api/counselings/${reportCode}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCounselingStatus: async (reportCode, status) => {
    return await axios.patch(`/api/counselings/${reportCode}/status`, {
      status,
    });
  },
};

export default counselingAPI;
