import React, { useState, useEffect } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import RoundedButton from "../components/RoundedButton";
import LoadingScreen from "../components/LoadingScreen";
import ErrorToast from "../components/Toast/ErrorToast";
import SuccessToast from "../components/Toast/SuccessToast";
import { useNavigate, Link } from "react-router-dom";
import authAPI from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  // Page title
  useEffect(() => {
    document.title = "Login - Speak";
  });

  const { checkAuth } = useAuth();

  // View password to login
  const [showPassword, setShowPassword] = useState(false);
  // Loading for submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Check mark remember me
  const [isChecked, setChecked] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!values.email.trim()) {
      setErrorMessage("Email harus diisi");
      return false;
    }
    if (!values.password.trim()) {
      setErrorMessage("Password harus diisi");
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

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 10000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authAPI.login(values);

      if (response.status === 200) {
        await checkAuth();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setIsSubmitting(false);

      if (error.response) {
        // Handle case when email is not verified
        if (
          error.response.status === 401 &&
          error.response.data.message ===
            "Silahkan verifikasi email kamu sebelum login"
        ) {
          setSuccessMessage("Email terkirim, Verifikasi email sebelum login");
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 10000);
          return;
        }

        // Handle incorrect credentials
        if (
          error.response.status === 404 &&
          error.response.data.message === "User tidak ditemukan"
        ) {
          setErrorMessage("Email atau password salah!");
        } else {
          // Handle other errors
          setErrorMessage(error.response.data.message || "Terjadi kesalahan.");
        }

        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      } else {
        setErrorMessage("Tidak dapat terhubung ke server.");
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    }
  };
  return (
    <>
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
              <h2 className="text-3xl font-bold text-[#AC1754] mb-1">Masuk</h2>
              <p className="text-sm text-black mb-6">
                Masuk dan dapatkan dukungan yang kamu butuhkan!
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
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
};

export default Login;
