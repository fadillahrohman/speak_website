import React, { useState, useEffect } from "react";
import { Eraser } from "lucide-react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  reportCode,
  onDelete,
  loading,
}) => {
  const [inputValue, setInputValue] = useState("");
  // Required confirmation text, dynamic based on reportCode
  const requiredConfirmationText = `Hapus ${reportCode}`;

  // Effect to reset input fields when modal is opened or reportCode changes
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen, reportCode]); // Add reportCode as a dependency

  if (!isOpen) return null;

  // Check if user input matches the required confirmation text
  const isConfirmationMatched = inputValue === requiredConfirmationText;

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-60 z-40"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="p-6">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Hapus Laporan
            </h3>
            <p className="text-gray-600 mb-4">
              Kamu yakin ingin menghapus laporan dengan kode{" "}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                {reportCode}
              </span>
              ?
            </p>
            <div className="mb-6">
              <label
                htmlFor="deleteConfirmInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Untuk mengonfirmasi, isi dengan "
                <span className="font-semibold text-gray-800">
                  {requiredConfirmationText}
                </span>
                "
              </label>
              <input
                type="text"
                id="deleteConfirmInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={requiredConfirmationText}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-800 focus:border-pink-800 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={loading}
                aria-required="true"
              />
            </div>

            {/* Button Action */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onDelete}
                className={`px-4 py-2.5 text-white rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-center gap-1 ${
                  !isConfirmationMatched
                    ? "bg-[#AC1754] opacity-30 cursor-not-allowed" 
                    : loading
                    ? "bg-[#AC1754] cursor-wait"
                    : "bg-[#AC1754] hover:bg-pink-800 cursor-pointer"
                }`}
                disabled={loading || !isConfirmationMatched}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Menghapus..</span>
                  </>
                ) : (
                  <>
                    <Eraser size={16} className="mr-1" />
                    <span>Hapus</span>
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

export default DeleteConfirmationModal;
