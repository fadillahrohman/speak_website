import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  BadgeCheck,
  Option,
  Scaling,
  ChevronDown,
  ChevronUp,
  OctagonX,
} from "lucide-react";

// Make sure axios always send credentials (cookie JWT/session)
axios.defaults.withCredentials = true;

const Report = () => {
  // Page title
  useEffect(() => {
    document.title = "Lapor dengan SPEAK";
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // User state
  const [user, setUser] = useState(null);

  const [values, setValues] = useState({
    title: "",
    date: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/verify");
        if (res.data.authenticated) {
          setUser(res.data.user);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Verify failed", err);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
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

  // Validation
  const validateForm = () => {
    if (!values.title.trim()) {
      setError("Judul wajib diisi");
      return false;
    }
    if (!values.date) {
      setError("Tanggal kejadian wajib diisi");
      return false;
    }
    if (!values.description.trim()) {
      setError("Deskripsi wajib diisi");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("date", new Date(values.date).toISOString());

      if (selectedFile) {
        formData.append("proof", selectedFile);
      }

      await axios.post("/api/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSuccessMessage("Laporan berhasil dikirim!");
      setShowSuccess(true);
      setValues({ title: "", date: "", description: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
        console.error("Data (body):", err.response.data);
      } else {
        console.error("Error message:", err.message);
      }
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat mengirim laporan"
      );
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not check auth, show loading
  if (user === null) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Memeriksa autentikasi…</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-5">
      {/* Error message */}
      {showError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{successMessage}</p>
        </div>
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
        <form className="md:col-span-8 p-10" onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
                value={values.date}
                onChange={handleChange}
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
                onChange={handleChange}
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
    </div>
  );
};

export default Report;
