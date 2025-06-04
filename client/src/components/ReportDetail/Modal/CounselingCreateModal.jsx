import React from "react";
import { HandHeart } from "lucide-react";

const CounselingCreateModal = ({
  isOpen,
  onClose,
  reportCode,
  counselors,
  selectedCounselor,
  setSelectedCounselor,
  onCreate,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-60 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Buat Sesi Konseling
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
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Konselor:
              </label>
              <select
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AC1754] focus:border-[#AC1754] focus:outline-none transition"
              >
                <option value="">Pilih Konselor</option>
                {counselors.map((counselor) => (
                  <option key={counselor.id} value={counselor.id}>
                    {counselor.name}
                  </option>
                ))}
              </select>
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
                onClick={onCreate}
                className="px-4 py-2.5 bg-[#AC1754] text-white rounded-lg hover:bg-pink-800 transition flex items-center gap-1 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Membuat..</span>
                  </>
                ) : (
                  <>
                    <HandHeart size={16} />
                    <span>Buat Konseling</span>
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

export default CounselingCreateModal;
