import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Charts from "../components/Report/Charts";
import Tables from "../components/Report/Tables";
import reportAPI from "../api/report";
import LoadingScreen from "../components/LoadingScreen";
import counselingAPI from "../api/counseling";

const Reports = () => {
  // Page title
  useEffect(() => {
    document.title = "Semua Laporan";
  });

  const { isAuthenticated, checkingAuth, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [counselingData, setCounselingData] = useState([]);
  const [loading, setLoading] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeframe] = useState("7d"); // Default timeframe: 7 days

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [reportRes, counselingRes] = await Promise.all([
        reportAPI.getReports(),
        counselingAPI.getCounselings(),
      ]);

      const reportsData = Array.isArray(reportRes.data)
        ? reportRes.data
        : reportRes.data?.data || [];
      const counselingData = Array.isArray(counselingRes.data)
        ? counselingRes.data
        : counselingRes.data?.data || [];

      // Create counseling mapping based on report code
      const counselingStatusMap = counselingData.reduce((acc, counseling) => {
        const reportCode =
          counseling.reportCode || counseling.code || counseling.report_code;
        if (reportCode) {
          acc[reportCode] = counseling.status;
        }
        return acc;
      }, {});

      // Add counseling status to reports
      const enrichedReports = reportsData.map((report) => ({
        ...report,
        counselingStatus: counselingStatusMap[report.code] || null,
      }));

      setReports(enrichedReports);

      // Save counseling data for filter options
      setCounselingData(counselingData);
    } catch (err) {
      console.error("Failed to fetch reports and counselings:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (user && user.role === "counselor") {
  //     setStatusFilter("pending");
  //   } else {
  //     setStatusFilter("all"); // dafault
  //   }
  // }, [user]);

  const chartReports =
    user?.role === "counselor"
      ? reports.filter(
          (report) => report.counselingStatus || report.status === "counseling"
        )
      : reports;

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

  const filteredReports = Array.isArray(reports)
    ? reports
        .filter((report) => {
          // For counselors, only display reports whose report status is "counseling"
          if (user?.role === "counselor" && report.status !== "counseling") {
            return false;
          }

          // Determine the status to be used for filtering.
          const statusToCheck =
            user?.role === "counselor"
              ? report.counselingStatus || "pending" // default pending if there is no counselingStatus
              : report.status;

          if (statusFilter !== "all" && statusToCheck !== statusFilter) {
            return false;
          }

          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
              report.title?.toLowerCase().includes(term) ||
              report.description?.toLowerCase().includes(term) ||
              report.code?.toLowerCase().includes(term)
            );
          }
          return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Get current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch reports only when authenticated
  useEffect(() => {
    if (isAuthenticated && !checkingAuth) {
      fetchReports();
    }
  }, [isAuthenticated, checkingAuth]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-6">
          {/* Charts Area */}
          <Charts
            reports={chartReports}
            user={user.role}
            timeframe={timeframe}
            counselingData={counselingData}
          />
          {/* Tables Area */}
          <Tables
            user={user.role}
            currentItems={currentItems}
            filteredReports={filteredReports}
            formatDate={formatDate}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            counselingData={counselingData}
            allReports={reports}
          />
        </div>
      </div>
    </>
  );
};

export default Reports;
