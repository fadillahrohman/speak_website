import React from "react";
import { CalendarClock, CircleEllipsis, ShieldCheck } from "lucide-react";

const CounselingDetail = ({
  counseling,
  isCounselor,
  getReporterName,
  formatDate,
  formatDateTime,
  getCounselingStatusDisplay,
  onDetailsUpdate,
  onStatusUpdate,
}) => {
  if (!counseling) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 relative">
      {/* Stamp when status is closed */}
      {counseling.status === "closed" && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-50">
          <div className="transform rotate-12 opacity-40">
            <div
              className="flex items-center justify-center gap-2 px-4 py-2 
                    text-5xl font-semibold text-[#45a834] border-8 border-[#45a834]
                    sm:text-6xl sm:border-8 sm:px-6 sm:py-3
                    md:text-7xl md:border-10 md:px-8 md:py-4
                    lg:text-8xl lg:border-12 lg:px-10 lg:py-5
                    xl:text-9xl xl:border-12 xl:px-12 xl:py-6"
            >
              <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32" />
              SELESAI
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h2 className="text-md text-white font-medium bg-[#AC1754] rounded inline-block p-1 mb-4 md:mb-6">
          Detail Konseling
        </h2>
        <div className="flex w-full flex-col items-stretch gap-2 mb-7 md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-3 md:justify-end">
          {isCounselor && counseling.status !== "closed" && (
            <>
              {/* Tampilkan tombol Jadwalkan Konseling hanya jika status adalah 'process' */}
              {counseling.status === "process" && (
                <button
                  onClick={onDetailsUpdate}
                  className="px-3 py-2 md:px-4 text-xs md:text-sm bg-[#AC1754] text-white rounded border-b-4 border-pink-200 hover:border-pink-300 flex items-center justify-center transition-colors duration-150 cursor-pointer"
                >
                  <CalendarClock size={20} className="mr-2" />
                  Jadwalkan Konseling
                </button>
              )}
              <button
                onClick={onStatusUpdate}
                className="px-3 py-2 md:px-4 text-xs md:text-sm bg-[#AC1754] text-white rounded border-b-4 border-pink-200 hover:border-pink-300 flex items-center justify-center transition-colors duration-150 cursor-pointer"
              >
                <CircleEllipsis size={20} className="mr-2" />
                Proses Konseling
              </button>
            </>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-black mb-1">Status Konseling</p>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center ${getCounselingStatusDisplay(
                counseling.status
              )}`}
            >
              {getCounselingStatusDisplay(counseling.status)}
            </span>
          </div>
        </div>
        <div>
          <p className="text-black mb-1">Konselor</p>
          <p className="font-medium bg-gray-100 border border-gray-200 text-gray-600 inline-block px-2 py-0.5 rounded">
            {counseling.counselor?.name || "-"}
          </p>
        </div>
        <div>
          <p className="text-black mb-1">Pelapor</p>
          <p className="font-medium bg-gray-100 border border-gray-200 text-gray-600 inline-block px-2 py-0.5 rounded  ">
            {getReporterName()}
          </p>
        </div>
        <div>
          <p className="text-black mb-1">Kode Laporan</p>
          <p className="font-medium bg-gray-100 border border-gray-200 text-gray-600 inline-block px-2 py-0.5 rounded">
            {counseling.report.code}
          </p>
        </div>
        <div>
          <p className="text-black mb-1">Tanggal Konseling</p>
          <p className="font-medium bg-gray-100 border border-gray-200 text-gray-600 inline-block px-2 py-0.5 rounded">
            {counseling.date ? formatDate(counseling.date) : "Menunggu.."}
          </p>
        </div>
        <div>
          <p className="text-black mb-1">Konseling Dibuat</p>
          <p className="font-medium bg-gray-100 border border-gray-200 text-gray-600 inline-block px-2 py-0.5 rounded">
            {formatDateTime(counseling.report?.createdAt)}
          </p>
        </div>

        {counseling.reason && (
          <div className="md:col-span-2">
            <p className="text-black mb-1">Deskripsi Konseling</p>
            <div className="font-medium bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded whitespace-pre-line">
              {counseling.reason}
            </div>
          </div>
        )}
        <div>
          <p className="text-gray-600 mb-1">Konseling Diperbarui</p>
          <p className="font-medium bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded inline-block whitespace-pre-line">
            {formatDateTime(counseling.report?.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CounselingDetail;