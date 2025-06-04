import axios from "axios";

const reportAPI = {
  getReports: async () => {
    return await axios.get("/api/reports");
  },

  createReport: async (formData) => {
    return await axios.post("/api/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
  },

  detailReport: async (reportCode) => {
    return await axios.get(`/api/reports/${reportCode}`);
  },

  deleteReport: async (reportCode) => {
    return await axios.delete(`/api/reports/${reportCode}`);
  },

  updateReportStatus: async (reportCode, newStatus) => {
    return await axios.patch(`/api/reports/${reportCode}/status`, {
      status: newStatus,
    });
  },
};

export default reportAPI;
