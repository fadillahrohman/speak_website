import React, { useState, useEffect } from "react";
import { usePageLoading } from "../hooks/usePageLoading";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import RoundedButton from "../components/RoundedButton";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  // Page title
  useEffect(() => {
    document.title = "Login - Speak";
  }, []);

  // View password to login
  const [showPassword, setShowPassword] = useState(false);
  // Loading for submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Check mark remember me
  const [isChecked, setChecked] = useState(false);

  // Loading from hooks
  const isLoading = usePageLoading("loginPage");

  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
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
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      setShowError(true);
      // Hide errors after 10 seconds
      setTimeout(() => setShowError(false), 10000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Use withCredentials so that cookies can be set by the server
      const response = await axios.post("/api/auth/login", values, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // If response contains redirect (for unverified emails)
        if (
          response.data.redirect &&
          response.data.redirect === "/resend-verification"
        ) {
          navigate(
            `/resend-verification?email=${encodeURIComponent(
              response.data.email || ""
            )}`
          );
          setIsSubmitting(false);
          return;
        }

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setIsSubmitting(false);

      if (error.response) {
        // Check if redirect is needed for unverified emails
        if (error.response.data && error.response.data.redirect) {
          navigate(
            `${error.response.data.redirect}?email=${encodeURIComponent(
              error.response.data.email || values.email
            )}`
          );
          return;
        }

        if (error.response.status === 401) {
          setError("Email atau password salah!");
        } else {
          setError(error.response.data.message || "Terjadi kesalahan.");
        }
      } else {
        setError("Tidak dapat terhubung ke server.");
      }

      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
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
            <div className="w-full md:w-3/5  bg-pink-200 p-6 pb-11 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src="/images/login-illustration.png"
                  alt="Login Ilustration"
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
                    alt="Speak Logo"
                  />
                </div>
                <h2 className="text-3xl font-bold text-[#AC1754] mb-1">
                  Masuk
                </h2>
                <p className="text-sm text-black mb-6">
                  Masuk dan dapatkan dukungan yang kamu butuhkan!
                </p>
                <form onSubmit={loginSubmit} className="space-y-4">
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
                          name="email"
                          onChange={handleChanges}
                          type="email"
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
                  {/* Option Checked */}
                  <div className="flex justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setChecked(!isChecked)}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 border-[2.3px] rounded-full flex items-center justify-center ${
                          isChecked
                            ? "bg-transparent border-[#919191]"
                            : "border-[#919191]"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-5 h-5 text-[#919191]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.3px"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-[#919191] select-none">
                        Ingat Saya
                      </span>
                    </label>
                    {/* Forgot Password */}
                    <Link to="/forgot-password" className="select-none">
                      <span className="text-sm text-[#919191]">
                        Lupa Password?
                      </span>
                    </Link>
                  </div>
                  {/* Buttons */}
                  <div className="flex items-center pt-4 space-x-2">
                    <RoundedButton
                      typeButton="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#AC1754] text-white hover:bg-[#A4144F]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Login...</span>
                        </div>
                      ) : (
                        "Login"
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
        </div>
      )}
    </>
  );
};

export default Login;
