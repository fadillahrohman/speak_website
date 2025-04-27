import React, { useEffect, useState } from "react";
import { usePageLoading } from "../hooks/usePageLoading";
import RoundedButton from "../components/RoundedButton";
import LoadingScreen from "../components/LoadingScreen";
import axios from "axios";

function ResendEmail() {
  // Page Title
  useEffect(() => {
    document.title = "Lupa Password - SPEAK";
  }, []); //

  // Loading from hooks
  const isLoading = usePageLoading("forgotPasswordPage");

  // Loading for submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
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
      setError("Email harus diisi");
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
      const response = await axios.post(
        "/api/auth/resend-verification",
        { email: values.email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setShowSuccess(true);
        // Hide success message after 10 seconds
        setTimeout(() => setShowSuccess(false), 10000);
      } else {
        setMessage(data.message);
        setError(data.message);
        setShowError(true);
        // Hide error after 10 seconds
        setTimeout(() => setShowError(false), 10000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while resending the verification email");
      setError("An error occurred while resending the verification email");
      setShowError(true);
      // Hide error after 10 seconds
      setTimeout(() => setShowError(false), 10000);
    } finally {
      setIsSubmitting(false); // Added to ensure isSubmitting is reset
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
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
            <div className="fixed inset-x-0 top-25 flex justify-center px-4 z-50 animate-fade-in-down">
              <div className="w-full max-w-sm sm:max-w-md rounded-lg bg-white shadow-xl relative flex items-center justify-around gap-2 sm:gap-4 px-3 sm:px-4 py-3 overflow-hidden">
                {/* Icon Container */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center bg-red-100 rounded-full ml-1 sm:ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    strokeWidth="0"
                    fill="currentColor"
                    stroke="currentColor"
                    className="w-4 h-4 text-red-600"
                  >
                    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"></path>
                  </svg>
                </div>

                {/* Message Text Container */}
                <div className="flex flex-col justify-center items-start flex-grow">
                  <p className="m-0 text-red-600 text-base sm:text-lg font-bold cursor-default">
                    Terjadi Kesalahan
                  </p>
                  <p className="m-0 text-xs sm:text-sm text-gray-600 cursor-default line-clamp-2">
                    {error}
                  </p>
                </div>
                {/* Close Icon */}
                <svg
                  onClick={() => setShowError(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 15 15"
                  strokeWidth="0"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 cursor-pointer flex-shrink-0"
                >
                  <path
                    fill="currentColor"
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          )}

          {/* Toast Success */}
          {showSuccess && (
            <div className="fixed inset-x-0 top-25 flex justify-center px-4 z-50 animate-fade-in-down">
              <div className="w-full max-w-sm sm:max-w-md rounded-lg bg-white shadow-xl relative flex items-center justify-around gap-2 sm:gap-4 px-3 sm:px-4 py-3 overflow-hidden">
                {/* Icon Container */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center bg-green-100 rounded-full ml-1 sm:ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    strokeWidth="0"
                    fill="currentColor"
                    stroke="currentColor"
                    className="w-4 h-4 text-green-600"
                  >
                    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
                  </svg>
                </div>

                {/* Message Text Container */}
                <div className="flex flex-col justify-center items-start flex-grow">
                  <p className="m-0 text-green-600 text-base sm:text-lg font-bold cursor-default">
                    Berhasil
                  </p>
                  <p className="m-0 text-xs sm:text-sm text-gray-600 cursor-default line-clamp-2">
                    {message}
                  </p>
                </div>
                {/* Close Icon */}
                <svg
                  onClick={() => setShowError(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 15 15"
                  strokeWidth="0"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 cursor-pointer flex-shrink-0"
                >
                  <path
                    fill="currentColor"
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ResendEmail;
