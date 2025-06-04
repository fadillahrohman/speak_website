import React from "react";
import { CalendarClock } from "lucide-react";

const CounselingDetailsUpdateModal = ({
  isOpen,
  onClose,
  reportCode,
  counselingDate,
  setCounselingDate,
  counselingReason,
  setCounselingReason,
  onUpdate,
  loading,
  error
}) => {
  if (!isOpen) return null;

  const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-60 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Jadwalkan Konseling
            </h3>
            <p className="text-gray-600 mb-5">
              Kode Laporan:{" "}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {reportCode}
              </span>
            </p>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded-md text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Konseling:
              </label>
              <input
                type="date"
                min={getTodayDate()}
                value={counselingDate}
                onChange={(e) => setCounselingDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-800 focus:border-pink-800 focus:outline-none transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Konseling:
              </label>
              <textarea
                value={counselingReason}
                onChange={(e) => setCounselingReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-800 focus:border-pink-800 focus:outline-none transition resize-none"
                placeholder="Masukkan deskripsi konseling..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                disabled={loading}
              >
                Batal
              </button>
              <button
                onClick={onUpdate}
                className="px-4 py-2.5 bg-[#AC1754] text-white rounded-lg hover:bg-pink-800 transition flex items-center gap-1 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Menyimpan..</span>
                  </>
                ) : (
                  <>
                    <CalendarClock size={16} />
                    <span>Jadwalkan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CounselingDetailsUpdateModal;