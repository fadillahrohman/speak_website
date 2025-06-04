import React from "react";
import {
  Search,
  Filter,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  TextSearch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";

const Tables = ({
  currentItems,
  filteredReports,
  formatDate,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  user,
  counselingData,
  allReports,
}) => {
  const navigate = useNavigate();

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleDetailClick = (reportCode) => {
    navigate(`/report-detail/${reportCode}`);
  };

  const getStatusBadge = (status) => {
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

  //  to get unique status based on role
  const getAvailableStatuses = () => {
    if (user === "counselor") {
      // Get unique status from counselingData
      const counselingStatuses = [
        ...new Set(counselingData.map((item) => item.status).filter(Boolean)),
      ];
      return counselingStatuses;
    } else {
      // Get unique status from all Reports data (not current Items which is already filtered)
      const reportStatuses = [
        ...new Set(allReports.map((item) => item.status).filter(Boolean)),
      ];
      return reportStatuses;
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: "Menunggu",
      process: "Diproses",
      counseling: "Konseling",
      closed: "Selesai",
      rejected: "Ditolak",
    };
    return statusLabels[status] || status;
  };

  const columnName = {
    statusByRole: user === "counselor" ? "Status Konseling" : "Status Laporan",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="flex items-center font-semibold text-sm lg:text-base mb-2 lg:mb-0 w-40 text-white text-center bg-[#AC1754] p-1 rounded">
            <TextSearch />
            <span className="flex-1">Data Laporan</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search bar */}
            <div className="relative flex-grow lg:min-w-[280px] xl:min-w-[320px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari laporan"
                className="block w-full pl-8 lg:pl-10 pr-8 lg:pr-10 py-2 lg:py-2.5 text-xs lg:text-sm xl:text-base text-gray-500 rounded-lg border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 lg:pr-4 flex items-center text-gray-400 cursor-pointer"
                >
                  <X className="h-4 w-4 lg:h-5 lg:w-5" />
                </button>
              )}
            </div>
            {/* Status filter*/}
            <div className="relative min-w-[160px] lg:min-w-[180px] xl:min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-8 lg:pl-10 pr-8 py-2 lg:py-2.5 text-xs lg:text-sm xl:text-base border text-gray-500 border-gray-300 rounded-lg cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                {getAvailableStatuses().map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="block w-full overflow-hidden">
        {/* Desktop/Tablet View - Regular Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr className="text-left text-gray-500 text-xs lg:text-sm uppercase">
                <th className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 font-medium min-w-[120px]">
                  KODE LAPORAN
                </th>
                <th className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 font-medium min-w-[200px] lg:min-w-[250px]">
                  JUDUL LAPORAN
                </th>
                <th className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 font-medium min-w-[140px]">
                  PELAPOR
                </th>
                <th className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 font-medium min-w-[120px]">
                  TANGGAL KEJADIAN
                </th>
                <th className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 font-medium min-w-[120px]">
                  TANGGAL MELAPOR
                </th>
                <th className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 font-medium min-w-[100px]">
                  {columnName.statusByRole}
                </th>
                <th className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 font-medium min-w-[80px]">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((report, index) => (
                  <tr
                    key={report.code || `report-${index}`}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 text-sm lg:text-base text-gray-800 font-medium">
                      {report.code}
                    </td>
                    <td className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 text-sm lg:text-base text-gray-800">
                      <div
                        className="max-w-[200px] lg:max-w-[250px] xl:max-w-[300px] truncate"
                        title={report.title}
                      >
                        {report.title}
                      </div>
                    </td>
                    <td className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6">
                      <div className="flex items-center">
                        <div>
                          <p
                            className="text-sm lg:text-base text-gray-800 truncate max-w-[120px] lg:max-w-[140px]"
                            title={report.reporter?.name || "-"}
                          >
                            {report.reporter?.name || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 text-sm lg:text-base text-gray-800">
                      {formatDate(report.date)}
                    </td>
                    <td className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6 text-sm lg:text-base text-gray-800">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6">
                      {/* Show appropriate status based on user role */}
                      {getStatusBadge(
                        user === "counselor"
                          ? report.counselingStatus || report.status
                          : report.status
                      )}
                    </td>
                    <td className="py-3 lg:py-4 px-3 lg:px-4 xl:px-6">
                      <button
                        onClick={() => handleDetailClick(report.code)}
                        className="text-[#AC1754] hover:text-pink-900 text-sm lg:text-base font-medium cursor-pointer hover:underline transition-all"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-8 lg:py-12 px-3 lg:px-4 xl:px-6 text-center text-sm lg:text-base text-gray-500"
                  >
                    Tidak ada laporan yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden">
          {currentItems.length > 0 ? (
            currentItems.map((report, index) => (
              <div
                key={report.code || `report-${index}`}
                className="bg-white border border-gray-200 mb-4 p-3 sm:p-4"
              >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="font-bold text-sm sm:text-base text-gray-800">
                    {report.code}
                  </span>
                  {/* Show appropriate status based on user role */}
                  {getStatusBadge(
                    user === "counselor"
                      ? report.counselingStatus || report.status
                      : report.status
                  )}
                </div>

                <div className="space-y-2">
                  <div className="mb-3 border border-gray-300 p-1 rounded">
                    <p className="text-xs sm:text-sm text-gray-500">
                      JUDUL LAPORAN
                    </p>
                    <p
                      className="text-sm sm:text-base text-gray-800"
                      title={report.title}
                    >
                      {report.title}
                    </p>
                  </div>

                  <div className="mb-3 border border-gray-300 p-1 rounded">
                    <p className="text-xs sm:text-sm text-gray-500">PELAPOR</p>
                    <p
                      className="text-sm sm:text-base text-gray-800"
                      title={report.reporter?.name || "-"}
                    >
                      {report.reporter?.name || "-"}
                    </p>
                  </div>

                  <div className="mb-3 border border-gray-300 p-1 rounded">
                    <p className="text-xs sm:text-sm text-gray-500">
                      TANGGAL KEJADIAN
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {formatDate(report.date)}
                    </p>
                  </div>
                  <div className="mb-3 border border-gray-300 p-1 rounded">
                    <p className="text-xs sm:text-sm text-gray-500">
                      TANGGAL MELAPOR
                    </p>
                    <p className="text-sm sm:text-base text-gray-800">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => handleDetailClick(report.code)}
                    className="text-[#AC1754] hover:text-pink-900 text-sm sm:text-base font-medium"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">
              Tidak ada laporan yang ditemukan
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredReports.length > 0 && (
        <div className="text-xs lg:text-sm xl:text-base">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredReports.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Tables;
