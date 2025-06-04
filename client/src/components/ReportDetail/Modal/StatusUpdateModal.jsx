import React from "react";
import { Trash2, Save } from "lucide-react";

const StatusUpdateModal = ({
  isOpen,
  onClose,
  reportCode,
  newStatus,
  setNewStatus,
  onUpdate,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-60 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ubah Status Laporan
            </h3>
            <p className="text-gray-600 mb-5">
              Kode Laporan:{" "}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {reportCode}
              </span>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Baru:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AC1754] focus:border-[#AC1754] focus:outline-none transition"
              >
                <option value="pending" className="hidden">
                  Menunggu
                </option>
                <option value="process">Diproses</option>
                <option value="rejected">Ditolak</option>
                <option value="counseling" className="hidden">
                  Konseling
                </option>
                <option value="closed" className="hidden">
                  Selesai
                </option>
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
                onClick={onUpdate}
                className="px-4 py-2.5 bg-[#AC1754] hover:bg-pink-800 transition rounded-lg text-white flex items-center gap-1 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Menyimpan..</span>
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-1" />
                    <span>Simpan</span>
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

export default StatusUpdateModal;
