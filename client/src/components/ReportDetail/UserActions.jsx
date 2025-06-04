import React from "react";
import { RefreshCw, Eraser, HandHeart } from "lucide-react";
import { ArrowLeft } from "lucide-react";

const UserActions = ({
  isAdmin,
  counseling,
  reportStatus,
  onCounselingCreate,
  onStatusUpdate,
  onBack,
  onDelete,
  reportCode,
  createdAt,
  formatDateTime,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mt-5 mb-6">
      {/* Main container for Left and Right sections */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Left Section: Back Button, Title, and Date */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-[#AC1754] text-white hover:bg-pink-800 transition-colors duration-150 flex items-center justify-center cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Laporan {reportCode}
            </h2>
            <p className="text-xs text-gray-500">
              Dibuat pada {formatDateTime(createdAt)}
            </p>
          </div>
        </div>
        {/* Right Section: Action Buttons */}
        <div className="flex w-full flex-col items-stretch gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-3 md:justify-end">
          {isAdmin && !counseling && reportStatus === "process" && (
            <button
              onClick={onCounselingCreate}
              className="px-3 py-2 md:px-4 text-xs md:text-sm bg-[#AC1754] text-white rounded border-b-4 border-pink-200 hover:border-pink-300 flex items-center justify-center transition-colors duration-150 cursor-pointer"
            >
              <HandHeart size={20} className="mr-1 md:mr-2" />
              Buat Konseling
            </button>
          )}
          {isAdmin &&
            reportStatus !== "closed" &&
            reportStatus !== "counseling" &&
            reportStatus !== "process" && (
              <button
                onClick={onStatusUpdate}
                className="px-3 py-2 md:px-4 text-xs md:text-sm bg-[#AC1754] text-white rounded border-b-4 border-pink-200 hover:border-pink-300 flex items-center justify-center transition-colors duration-150 cursor-pointer"
              >
                <RefreshCw size={20} className="mr-1 md:mr-2" />
                Proses Laporan
              </button>
            )}
          <button
            onClick={onDelete}
            className="px-3 py-2 md:px-4 text-xs md:text-sm bg-[#AC1754] text-white rounded border-b-4 border-pink-200 hover:border-pink-300 flex items-center justify-center transition-colors duration-150 cursor-pointer"
          >
            <Eraser size={20} className="mr-1 md:mr-2" />
            Hapus Laporan
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActions;
