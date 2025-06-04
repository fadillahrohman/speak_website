import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BadgeCheck,
  Option,
  Scaling,
  ChevronDown,
  ChevronUp,
  OctagonX,
  X,
} from "lucide-react";
import reportAPI from "../api/report";
import LoadingScreen from "../components/LoadingScreen";
import ErrorToast from "../components/Toast/ErrorToast";
import SuccessToast from "../components/Toast/SuccessToast";

const CreateReport = () => {
  // Page title
  useEffect(() => {
    document.title = "Lapor dengan SPEAK";
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [values, setValues] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isAuthenticated, checkingAuth } = useAuth();

  // Authentication check
  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, checkingAuth, navigate]);

  // Handle input changes
  const handlingInputChanges = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // Toggle file input visibility
  const toggleFileInput = () => {
    setShowFileInput(!showFileInput);
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL for the image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validation form
  const validateForm = () => {
    if (!values.title.trim()) {
      setErrorMessage("Judul wajib diisi");
      return false;
    }
    if (!values.date) {
      setErrorMessage("Tanggal kejadian wajib diisi");
      return false;
    }
    if (!values.description.trim()) {
      setErrorMessage("Deskripsi wajib diisi");
      return false;
    }
    return true;
  };

  // Handle form initial submit - Show confirmation modal
  const handleInitialSubmit = (e) => {
    e.preventDefault();

    // Check authentication before submitting
    if (!isAuthenticated) {
      setErrorMessage("Anda harus login terlebih dahulu");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        navigate("/login");
      }, 2000);
      return;
    }

    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  // Submit form after confirmation
  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("date", new Date(values.date).toISOString());

      if (selectedFile) {
        formData.append("proof", selectedFile);
      }

      await reportAPI.createReport(formData);

      setSuccessMessage("Laporan berhasil dikirim.");
      setValues({ title: "", date: "", description: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/reports");
      }, 3000);
    } catch (err) {
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
        console.error("Data (body):", err.response.data);

        // Handle authentication errors
        if (err.response.status === 401) {
          setErrorMessage("Sesi Anda telah berakhir. Silakan login kembali.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setErrorMessage(
            err.response?.data?.message ||
              "Terjadi kesalahan saat mengirim laporan"
          );
        }
      } else {
        console.error("Error message:", err.message);
        setErrorMessage("Terjadi kesalahan saat mengirim laporan");
      }
      setShowError(true);
      setTimeout(() => setShowError(false), 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  return (
    <div className="max-w-screen-lg mx-auto p-5">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-60 z-40"></div>
          {/* Modal content */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Konfirmasi Pengiriman
                </h3>
                <button
                  onClick={cancelSubmit}
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                  title="Tutup"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-5">
                <p className="text-gray-600">
                  Pastikan semua data sudah benar sebelum mengirim. Laporan yang
                  sudah dikirim tidak dapat diubah.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelSubmit}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer"
                  title="Batalkan pengiriman"
                >
                  Batal
                </button>
                <button
                  onClick={confirmSubmit}
                  className="bg-[#AC1754] hover:bg-[#A4144F] text-white font-bold py-2 px-4 rounded cursor-pointer"
                  title="Konfirmasi pengiriman laporan"
                >
                  Ya, Kirim
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 border border-gray-300">
        <div className="bg-[#AC1754] md:col-span-4 p-10 text-white relative">
          <img src="/images/speak-report.svg" alt="Speak Report Illustration" />
          <p className="mt-3 text-sm font-bold leading-7 font-regular uppercase">
            Saatnya
          </p>
          <h3 className="leading-normal font-extrabold tracking-tight text-xl lg:text-3xl">
            #BERANI <span className="bg-white text-[#AC1754] px-2">Lapor!</span>
          </h3>
          <p className="mt-4 leading-7 text-gray-200 text-sm sm:text-md lg:text-base">
            Melapor langkah berani untuk memperjuangkan keadilan dan menciptakan
            lingkungan yang lebih aman bagi semua orang.
          </p>
        </div>
        <form className="md:col-span-8 p-10" onSubmit={handleInitialSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex gap-2 items-center">
                Judul Laporan <BadgeCheck size={20} color="#00ec6a" />
              </label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="title"
                value={values.title}
                onChange={handlingInputChanges}
                placeholder="Kasus yang dialami"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex gap-2 items-center">
                Tanggal Kejadian <BadgeCheck size={20} color="#00ec6a" />
              </label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white cursor-pointer"
                type="date"
                name="date"
                max={getTodayDate()}
                value={values.date}
                onChange={handlingInputChanges}
                placeholder="Pilih Tanggal Kejadian"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex gap-2 items-center">
                Unggah Bukti <Option size={20} color="#fcc00a" />
              </label>
              {/* Toggle button for file upload */}
              <button
                type="button"
                onClick={toggleFileInput}
                className="mb-3 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded transition-all duration-300 cursor-pointer"
              >
                <img
                  src="/images/icons/upload-icon.svg"
                  className="w-10 h-10"
                  alt=""
                />
                {showFileInput ? "Tutup Pilihan File" : "Pilih File"}
                {showFileInput ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              <p className="text-gray-400 text-sm mb-1 italic">Opsional</p>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {/* Animated custom file upload area */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showFileInput ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {!previewUrl ? (
                  <div
                    onClick={handleButtonClick}
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg py-8 px-4 flex flex-col items-center justify-center mb-3"
                  >
                    <div className="mb-4">
                      <img
                        src="/images/icons/file-icon.svg"
                        className="w-20 h-20"
                        alt=""
                      />
                    </div>
                    <button
                      type="button"
                      className="bg-[#AC1754] hover:bg-[#A4144F] text-white font-bold py-2 px-6 rounded uppercase text-sm cursor-pointer"
                    >
                      Pilih File
                    </button>
                    <p className="text-gray-500 text-xs mt-4">
                      format file png, jpg, jpeg, webp - max 10mb
                    </p>
                  </div>
                ) : (
                  <div className="relative mb-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex flex-col items-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-64 rounded"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          {selectedFile && selectedFile.name}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={removeFile}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm cursor-pointer"
                          >
                            <OctagonX size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={handleButtonClick}
                            className="bg-[#AC1754] hover:bg-[#A4144F] text-white py-1 px-3 rounded text-sm cursor-pointer"
                          >
                            Ganti File
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex gap-2 items-center">
                Deskripsi Kejadian <BadgeCheck size={20} color="#00ec6a" />
              </label>
              <textarea
                rows="10"
                name="description"
                value={values.description}
                onChange={handlingInputChanges}
                placeholder="Kronologi peristiwa"
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              ></textarea>
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full px-3 gap-3">
              <Link to="#">
                <button
                  type="button"
                  className="w-full md:w-auto bg-[#AC1754] hover:bg-[#A4144F] text-white text-xs p-2 rounded flex items-center justify-center cursor-pointer"
                >
                  Petunjuk Laporan <Scaling size={15} />
                </button>
              </Link>
              <button
                className="w-full md:w-auto bg-[#AC1754] hover:bg-[#A4144F] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* Error message */}
      {showError && (
        <ErrorToast error={errorMessage} onClose={() => setShowError(false)} />
      )}
      {/* Success message */}
      {showSuccess && (
        <SuccessToast
          success={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default CreateReport;
