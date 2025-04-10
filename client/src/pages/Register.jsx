import React, { useState, useEffect } from "react";
import { usePageLoading } from "../hooks/usePageLoading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import RoundedButton from "../components/RoundedButton";
import LoadingScreen from "../components/LoadingScreen";

const Register = () => {
  // Page title
  useEffect(() => {
    document.title = "Daftar Akun - Speak";
  });

  // View password to register
  const [showPassword, setShowPassword] = useState(false);
  // Loading for submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Loading from hooks
  const isLoading = usePageLoading("registerPage");

  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!values.username.trim()) {
      setError("Nama harus diisi");
      return false;
    }
    if (!values.email.trim()) {
      setError("Email harus diisi");
      return false;
    }
    if (!values.password.trim()) {
      setError("Password harus diisi");
      return false;
    }
    return true;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    if (!validateForm()) {
      setShowError(true);
      // Hide errors after 10 seconds
      setTimeout(() => setShowError(false), 10000);
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        values
      );
      if (response.status === 200) {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.data) {
        setError(
          error.response.data.message || "Terjadi kesalahan saat mendaftar"
        );
      } else {
        setError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
      }
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
              <div className="relative w-full max-w-lg">
                <img
                  src="/images/register-illustration.png"
                  alt="Register Ilustrator"
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
                  Mulai Sekarang
                </h2>
                <p className="text-sm text-black mb-6">
                  Daftar akunmu dan dapatkan perlindungan serta dukungan!
                </p>
                <form onSubmit={registerSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="bg-white rounded-xs shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
                    <div className="flex items-center p-4">
                      <img
                        src="/images/icons/user-icon.svg"
                        className="w-6 h-6 mr-4"
                        alt="User Icon"
                      />
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-bold text-[#AC1754] block">
                          Nama
                        </label>
                        <input
                          type="text"
                          name="username"
                          onChange={handleChanges}
                          placeholder="Masukkan nama"
                          className="block w-full border-0 p-0 focus:ring-0 focus:outline-none text-gray-800 placeholder:text-xs"
                        />
                      </div>
                    </div>
                  </div>
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
                          onChange={handleChanges}
                          placeholder="Masukkan email"
                          className="block w-full border-0 p-0 focus:ring-0 focus:outline-none text-gray-800 placeholder:text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Password Input */}
                  <div className="bg-white rounded-xs shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
                    <div className="flex items-center p-4">
                      <img
                        src="/images/icons/padlock-icon.svg"
                        className="w-6 h-6 mr-4"
                        alt="Padlock Icon"
                      />
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-bold text-[#AC1754] block">
                          Password
                        </label>
                        <div className="flex items-center justify-between">
                          <input
                            name="password"
                            onChange={handleChanges}
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            className="block w-full border-0 p-0 focus:ring-0 focus:outline-none text-gray-800 placeholder:text-xs"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-[#AC1754] focus:outline-none"
                          >
                            {showPassword ? (
                              <PiEye className="w-6 h-6 cursor-pointer" />
                            ) : (
                              <PiEyeClosed className="h-6 w-6 cursor-pointer" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Button */}
                  <div className="flex items-center pt-4 space-x-2">
                    <RoundedButton
                      typeButton="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#AC1754] text-white hover:bg-[#A4144F]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Mendaftar...</span>
                        </div>
                      ) : (
                        "Mendaftar"
                      )}
                    </RoundedButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* Toast Error */}
          {showError && (
            <div className="fixed inset-x-0 top-4 mx-auto max-w-md bg-red-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center z-50 animate-fade-in-down">
              <div className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span>{error}</span>
              <button
                onClick={() => setShowError(false)}
                className="ml-2 text-white"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Register;
