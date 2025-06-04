import React, { useEffect, useState } from "react";

import RoundedButton from "../components/RoundedButton";
import LoadingScreen from "../components/LoadingScreen";
import ErrorToast from "../components/Toast/ErrorToast";
import SuccessToast from "../components/Toast/SuccessToast";

import authAPI from "../api/auth";

function ResendEmail() {
  // Page Title
  useEffect(() => {
    document.title = "Verifikasi Email - SPEAK";
  }, []); //

  // Loading for submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Single state for email
  const [values, setValues] = useState({
    email: "",
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!values.email.trim()) {
      setErrorMessage("Email harus diisi");
      return false;
    }
    return true;
  };

  const resendVerificationEmail = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 10000);
      return;
    }

    setIsSubmitting(true);

    try {
      // AUTH API (RESEND EMAIL)
      const response = await authAPI.resendVerification(values.email);
      const data = response.data;

      if (response.status === 200) {
        setSuccessMessage(data.message);
        setShowSuccess(true);
        // Hide success message after 10 seconds
        setTimeout(() => setShowSuccess(false), 10000);
      } else {
        setSuccessMessage(data.message);
        setErrorMessage(data.message);
        setShowError(true);
        // Hide error after 10 seconds
        setTimeout(() => setShowError(false), 10000);
      }
    } catch (error) {
      console.error("Error:", error);
      // Menggunakan error message dari response jika ada
      const errorMsg =
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengirim email verifikasi";
      setSuccessMessage(errorMsg);
      setErrorMessage(errorMsg);
      setShowError(true);
      // Hide error after 10 seconds
      setTimeout(() => setShowError(false), 10000);
    } finally {
      setIsSubmitting(false); // Added to ensure isSubmitting is reset
    }
  };

  return (
    <>
      <div className="bg-[#AC1754] flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row mx-auto my-auto bg-white rounded-none md:rounded-lg overflow-hidden w-full max-w-4xl m-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          {/* Left Section - Illustration */}
          <div className="w-full md:w-3/5 bg-pink-200 p-6 pb-11 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <img
                src="/images/resend-email-illustration.png"
                alt="Resend Email Ilustration"
              />
            </div>
          </div>
          {/* Right Section - Form */}
          <div className="w-full md:w-2/5 p-6 pb-11 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full px-4">
              <div className="mb-4 mt-2">
                <img
                  src="/images/speak-logo.png"
                  className="w-[116px] h-[46px]"
                  alt=""
                />
              </div>
              <h2 className="text-3xl font-bold text-[#AC1754] mb-1">
                Verifikasi Email
              </h2>
              <p className="text-sm text-black mb-6">
                Terima kasih telah mendaftar! Yuk verifikasi Email akun kamu.
              </p>
              <form onSubmit={resendVerificationEmail} className="space-y-4">
                {/* Email Input */}
                <div className="bg-white rounded-xs shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
                  <div className="flex items-center p-4">
                    <img
                      src="/images/icons/email-icon.svg"
                      className="w-6 h-6 mr-4"
                      alt="Email Icon"
                    />
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-bold text-[#AC1754] block">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChanges}
                        placeholder="Masukkan email"
                        className="block w-full border-0 p-0 focus:ring-0 focus:outline-none text-gray-800 placeholder:text-xs"
                      />
                    </div>
                  </div>
                </div>
                {/* Send Button*/}
                <div className="flex items-center pt-4 space-x-2">
                  <RoundedButton
                    typeButton="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#AC1754] text-white hover:bg-[#A4144F]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Mengirim Email...</span>
                      </div>
                    ) : (
                      "Kirim Email Verifikasi"
                    )}
                  </RoundedButton>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Toast Error */}
        {showError && (
          <ErrorToast
            error={errorMessage}
            onClose={() => setShowError(false)}
          />
        )}

        {/* Toast Success */}
        {showSuccess && (
          <SuccessToast
            success={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </>
  );
}

export default ResendEmail;
