import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import ContentReportDetail from "../components/ReportDetail/ContentReportDetail";
import StatusProgress from "../components/Report/StatusProgress";

import UserActions from "../components/ReportDetail/UserActions";
import CounselingDetail from "../components/ReportDetail/CounselingDetail";
import StatusUpdateModal from "../components/ReportDetail/Modal/StatusUpdateModal";
import DeleteConfirmationModal from "../components/ReportDetail/Modal/DeleteConfirmationModal";
import CounselingCreateModal from "../components/ReportDetail/Modal/CounselingCreateModal";
import CounselingStatusUpdateModal from "../components/ReportDetail/Modal/CounselingStatusUpdateModal";
import CounselingDetailsUpdateModal from "../components/ReportDetail/Modal/CounselingDetailsUpdateModal";

import reportAPI from "../api/report";
import counselingAPI from "../api/counseling";
import Error from "../components/Error";

const ReportDetail = () => {
  // Page title
  useEffect(() => {
    document.title = "Detail Laporan";
  });

  const { reportCode } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, checkingAuth, user } = useAuth();

  // Modal states
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [isCounselingStatusModalOpen, setIsCounselingStatusModalOpen] =
    useState(false);
  const [isCounselingDetailsModalOpen, setIsCounselingDetailsModalOpen] =
    useState(false);

  // Status update states
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Counseling states
  const [counseling, setCounseling] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [counselingLoading, setCounselingLoading] = useState(false);
  const [counselingError, setCounselingError] = useState(null);

  // Counseling status update states
  const [newCounselingStatus, setNewCounselingStatus] = useState("");
  const [counselingStatusUpdateLoading, setCounselingStatusUpdateLoading] =
    useState(false);

  // Counseling details update states
  const [counselingDetailsLoading, setCounselingDetailsLoading] =
    useState(false);
  const [counselingDate, setCounselingDate] = useState("");
  const [counselingReason, setCounselingReason] = useState("");

  // Reporter details state
  const [reporterDetails, setReporterDetails] = useState(null);

  const isAdmin = user?.role === "admin";
  const isCounselor = user?.role === "counselor";
  const currentUser = user;

  const fetchReporterDetails = async (reportCode) => {
    try {
      // FETCH REPORTS DATA - API
      const reportsResponse = await reportAPI.getReports();
      const reportWithReporter = reportsResponse.data.data.find(
        (r) => r.code === reportCode
      );

      if (reportWithReporter && reportWithReporter.reporter) {
        setReporterDetails(reportWithReporter.reporter);
        return reportWithReporter.reporter;
      }

      return null;
    } catch (err) {
      console.error("Failed to fetch reporter details:", err);
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated && !checkingAuth) {
      const fetchReportDetail = async () => {
        try {
          setLoading(true);
          // FETCH DETAIL REPORT DATA - API
          const response = await reportAPI.detailReport(reportCode);
          // Handle different response structures
          let reportData;
          if (response.data.data && Array.isArray(response.data.data)) {
            reportData = response.data.data[0];
          } else if (
            response.data.data &&
            typeof response.data.data === "object"
          ) {
            reportData = response.data.data;
          } else {
            reportData = response.data;
          }
          setReport(reportData);
          setNewStatus(reportData.status);

          // If reporter data is incomplete, fetch it from another endpoint
          if (!reportData.reporter || !reportData.reporter.name) {
            const reporterDetails = await fetchReporterDetails(reportCode);
            if (reporterDetails) {
              setReport((prev) => ({
                ...prev,
                reporter: reporterDetails,
              }));
            }
          } else {
            setReporterDetails(reportData.reporter);
          }

          // FETCH COUNSELINGS DATA - API
          const counselingResponse = await counselingAPI.getCounselings();
          const counselingData = counselingResponse.data.data.find(
            (counsel) => counsel.report_code === reportCode
          );
          if (counselingData) {
            setCounseling(counselingData);
            setNewCounselingStatus(counselingData.status);
            setCounselingDate(
              counselingData.date ? counselingData.date.split("T")[0] : ""
            );
            setCounselingReason(counselingData.reason || "");
          }
        } catch (err) {
          console.error("Failed to fetch report detail:", err);
          setError("Gagal memuat detail laporan.");
        } finally {
          setLoading(false);
        }
      };

      fetchReportDetail();
    }
  }, [isAuthenticated, checkingAuth, reportCode]);

  const fetchCounselors = async () => {
    try {
      /// FETCH COUNSELORS DATA - API
      const response = await counselingAPI.getCounselors();
      if (response.data && response.data.data) {
        setCounselors(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch counselors:", err);
      setCounselingError("Gagal memuat daftar konselor.");
    }
  };

  // Modal handlers
  const openStatusModal = () => setIsStatusModalOpen(true);
  const closeStatusModal = () => setIsStatusModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openCounselingStatusModal = () => setIsCounselingStatusModalOpen(true);
  const closeCounselingStatusModal = () => {
    setIsCounselingStatusModalOpen(false);
    setCounselingError(null);
  };
  const openCounselingDetailsModal = () => {
    setIsCounselingDetailsModalOpen(true);
    setCounselingError(null);
  };
  const closeCounselingDetailsModal = () => {
    setIsCounselingDetailsModalOpen(false);
    setCounselingError(null);
  };

  const openCounselingModal = async () => {
    if (isAdmin) {
      try {
        await fetchCounselors();
        setIsCounselingModalOpen(true);
      } catch (err) {
        console.error("Failed to prepare counseling modal:", err);
      }
    }
  };

  const closeCounselingModal = () => {
    setIsCounselingModalOpen(false);
    setSelectedCounselor("");
    setCounselingError(null);
  };

  // Action handlers
  const updateReportStatus = async () => {
    if (!newStatus) return;

    try {
      setStatusUpdateLoading(true);
      // UPDATE REPORT STATUS - API
      await reportAPI.updateReportStatus(reportCode, newStatus);
      setReport({
        ...report,
        status: newStatus,
      });

      closeStatusModal();
    } catch (err) {
      console.error("Gagal mengupdate status laporan:", err);
      setError("Gagal mengubah status laporan. Silakan coba lagi nanti.");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const deleteReport = async () => {
    try {
      setDeleteLoading(true);
      await reportAPI.deleteReport(reportCode);
      navigate("/reports", { replace: true });
    } catch (err) {
      console.error("Failed to delete report:", err);
      setError("Gagal menghapus laporan. Silakan coba lagi nanti.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const createCounseling = async () => {
    if (!selectedCounselor) {
      setCounselingError("Silakan pilih konselor terlebih dahulu.");
      return;
    }
    try {
      setCounselingLoading(true);
      let reporterId = report.reporter?.id || reporterDetails?.id;

      if (!reporterId) {
        // If still not there, try fetching it again from the reports endpoint
        const reporterData = await fetchReporterDetails(reportCode);
        if (reporterData && reporterData.id) {
          reporterId = reporterData.id;
        } else {
          throw new Error("Reporter ID tidak ditemukan");
        }
      }

      const formData = new FormData();
      formData.append("report_code", reportCode);
      formData.append("reporter_id", reporterId);
      formData.append("counselor_id", parseInt(selectedCounselor));

      // CREATE COUNSELING (ADMIN) - API
      const response = await counselingAPI.createCounseling(formData);

      // UPDATE REPORT STATUS TO 'COUNSELING' - API
      await reportAPI.updateReportStatus(reportCode, "counseling");

      // Update states
      setCounseling(response.data.data);
      setReport({
        ...report,
        status: "counseling",
      });

      closeCounselingModal();
    } catch (err) {
      console.error("Failed to create counseling:", err);
      setCounselingError(
        "Gagal membuat sesi konseling. Silakan coba lagi nanti."
      );
    } finally {
      setCounselingLoading(false);
    }
  };

  const updateCounselingStatus = async () => {
    if (!newCounselingStatus) return;

    try {
      setCounselingStatusUpdateLoading(true);

      // UPDATE COUNSELING STATUS - API
      await counselingAPI.updateCounselingStatus(
        reportCode,
        newCounselingStatus
      );

      // Update counseling state
      setCounseling({
        ...counseling,
        status: newCounselingStatus,
      });

      // Auto-update report status to "closed" when counseling status is "closed"
      if (newCounselingStatus === "closed") {
        try {
          // UPDATE REPORT STATUS - API
          await reportAPI.updateReportStatus(reportCode, "closed");

          setReport({
            ...report,
            status: "closed",
          });

          // Update newStatus state for consistency
          setNewStatus("closed");

          console.log("Report status automatically updated to 'closed'");
        } catch (reportUpdateErr) {
          console.error(
            "Failed to auto-update report status:",
            reportUpdateErr
          );
          setCounselingError(
            "Status konseling berhasil diubah, tetapi gagal mengubah status laporan secara otomatis."
          );
        }
      }

      closeCounselingStatusModal();
    } catch (err) {
      console.error("Failed to update counseling status:", err);
      setCounselingError(
        "Gagal mengubah status konseling. Silakan coba lagi nanti."
      );
    } finally {
      setCounselingStatusUpdateLoading(false);
    }
  };

  const updateCounselingDetails = async () => {
    if (!counselingDate || !counselingReason.trim()) {
      setCounselingError("Tanggal dan alasan konseling harus diisi.");
      return;
    }

    try {
      setCounselingDetailsLoading(true);

      const formData = new FormData();
      formData.append("date", counselingDate);
      formData.append("reason", counselingReason.trim());

      const response = await counselingAPI.updateCounseling(
        reportCode,
        formData
      );

      // Update counseling state with new details
      setCounseling({
        ...counseling,
        date: response.data.data.date,
        reason: response.data.data.reason,
      });

      closeCounselingDetailsModal();
    } catch (err) {
      console.error("Failed to update counseling details:", err);
      if (err.response?.status === 403) {
        setCounselingError(
          "Akses ditolak. Hanya konselor yang dapat mengupdate detail konseling."
        );
      } else {
        setCounselingError(
          "Gagal mengupdate detail konseling. Silakan coba lagi nanti."
        );
      }
    } finally {
      setCounselingDetailsLoading(false);
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      const options = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("id-ID", options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "-";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";

      // Determine the Indonesian time zone
      const timezoneOffset = date.getTimezoneOffset();
      let timezone = "";

      // Indonesia has 3 time zones:
      // WIB (UTC+7), WITA (UTC+8), WIT (UTC+9)
      if (timezoneOffset === -420) {
        // UTC+7
        timezone = " WIB";
      } else if (timezoneOffset === -480) {
        // UTC+8
        timezone = " WITA";
      } else if (timezoneOffset === -540) {
        // UTC+9
        timezone = " WIT";
      } else {
        timezone = "";
      }

      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      return date.toLocaleDateString("id-ID", options) + timezone;
    } catch (error) {
      console.error("DateTime formatting error:", error);
      return "-";
    }
  };

  const getReporterName = () => {
    return (
      report.reporter?.name || reporterDetails?.name || currentUser?.name || "-"
    );
  };

  const getCounselingStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex justify-start">
            <img
              src="/images/status/status-pending.svg"
              alt="Menunggu"
              className="h-10 w-auto"
            />
          </div>
        );
      case "process":
        return (
          <div className="flex justify-start">
            <img
              src="/images/status/status-process.svg"
              alt="Diproses"
              className="h-10 w-auto"
            />
          </div>
        );
      case "counseling":
        return (
          <div className="flex justify-start">
            <img
              src="/images/status/status-counseling.svg"
              alt="Konseling"
              className="h-10 w-auto"
            />
          </div>
        );
      case "rejected":
        return (
          <div className="flex justify-start">
            <img
              src="/images/status/status-rejected.svg"
              alt="Ditolak"
              className="h-10 w-auto"
            />
          </div>
        );
      case "closed":
        return (
          <div className="flex justify-start">
            <img
              src="/images/status/status-closed.svg"
              alt="Selesai"
              className="h-10 w-auto"
            />
          </div>
        );
      default:
        return (
          <div className="flex justify-start">
            <img
              src="/images/status/status-pending.svg"
              alt="Unknown"
              className="h-10 w-auto"
            />
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <Error />;
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Laporan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-10xl mx-auto px-4">
        {/* Admin Actions */}
        <UserActions
          isAdmin={isAdmin}
          counseling={counseling}
          reportStatus={report.status}
          onCounselingCreate={openCounselingModal}
          onStatusUpdate={openStatusModal}
          onBack={() => navigate(-1)}
          onDelete={openDeleteModal}
          reportCode={report.code || reportCode}
          createdAt={report.createdAt || report.date}
          formatDateTime={formatDateTime}
        />

        {/* Status Progress */}
        <StatusProgress report={report} formatDateTime={formatDateTime} />

        {/* Counseling Detail */}
        <CounselingDetail
          counseling={counseling}
          isCounselor={isCounselor}
          getReporterName={getReporterName}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          getCounselingStatusDisplay={getCounselingStatusDisplay}
          onDetailsUpdate={openCounselingDetailsModal}
          onStatusUpdate={openCounselingStatusModal}
        />

        {/* Report Detail */}
        <ContentReportDetail report={report} />
      </div>
      {/* Modals */}
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={closeStatusModal}
        reportCode={reportCode}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        onUpdate={updateReportStatus}
        loading={statusUpdateLoading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        reportCode={reportCode}
        onDelete={deleteReport}
        loading={deleteLoading}
      />

      <CounselingCreateModal
        isOpen={isCounselingModalOpen}
        onClose={closeCounselingModal}
        reportCode={reportCode}
        counselors={counselors}
        selectedCounselor={selectedCounselor}
        setSelectedCounselor={setSelectedCounselor}
        onCreate={createCounseling}
        loading={counselingLoading}
        error={counselingError}
      />

      <CounselingStatusUpdateModal
        isOpen={isCounselingStatusModalOpen}
        onClose={closeCounselingStatusModal}
        reportCode={reportCode}
        newCounselingStatus={newCounselingStatus}
        setNewCounselingStatus={setNewCounselingStatus}
        onUpdate={updateCounselingStatus}
        loading={counselingStatusUpdateLoading}
        error={counselingError}
      />

      <CounselingDetailsUpdateModal
        isOpen={isCounselingDetailsModalOpen}
        onClose={closeCounselingDetailsModal}
        reportCode={reportCode}
        counselingDate={counselingDate}
        setCounselingDate={setCounselingDate}
        counselingReason={counselingReason}
        setCounselingReason={setCounselingReason}
        onUpdate={updateCounselingDetails}
        loading={counselingDetailsLoading}
        error={counselingError}
      />
    </div>
  );
};

export default ReportDetail;
