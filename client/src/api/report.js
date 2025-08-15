import apiClient from "./apiClient";

const reportAPI = {
  getReports: async () => {
    return await apiClient.get("/reports");
  },

  createReport: async (formData) => {
    return await apiClient.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
  },

  detailReport: async (reportCode) => {
    return await apiClient.get(`/reports/${reportCode}`);
  },

  deleteReport: async (reportCode) => {
    return await apiClient.delete(`/reports/${reportCode}`);
  },

  updateReportStatus: async (reportCode, newStatus) => {
    return await apiClient.patch(`/reports/${reportCode}/status`, {
      status: newStatus,
    });
  },
};

export default reportAPI;
