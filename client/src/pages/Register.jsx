import React, { useState, useEffect, useRef } from "react";
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

  const [handphone, setHandphone] = useState("");
  const phoneInputRef = useRef(null);

  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!values.name.trim()) {
      setError("Nama harus diisi");
      return false;
    }
    if (!values.email.trim()) {
      setError("Email harus diisi");
      return false;
    }
    if (!handphone || handphone.length < 3) {
      setError("Nomor HP harus diisi");
      return false;
    }
    if (handphone.length < 12) {
      setError("Nomor HP harus terdiri dari 12 digit");
      return false;
    }
    if (!handphone.startsWith("08")) {
      setError("Nomor HP harus diawali dengan 08");
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
    name: "",
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle phone input focus
  const handlePhoneFocus = () => {
    // If the field is empty, automatically add "08"
    if (!handphone) {
      setHandphone("08");
    }
  };

  // Handle phone input
  const handleNumberPhone = (e) => {
    let value = e.target.value;

    // Only allow numbers
    value = value.replace(/[^0-9]/g, "");

    // If user deleted all input including "08", we'll add it back
    if (value === "" || value.length < 2) {
      value = "08";

      // Set cursor position after "08"
      setTimeout(() => {
        if (phoneInputRef.current) {
          phoneInputRef.current.selectionStart = 2;
          phoneInputRef.current.selectionEnd = 2;
        }
      }, 0);
    }
    // If user is typing and doesn't start with "08", force it
    else if (!value.startsWith("08")) {
      value = "08" + value.substring(value.length - Math.min(value.length, 10));
    }

    // Limit to 12 digits (including the "08" prefix)
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    setHandphone(value);

    // Update the values state with the handphone number
    setValues((prevValues) => ({
      ...prevValues,
      handphone: value,
    }));
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
      const response = await axios.post("/api/auth/register", values);
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
      console.error("Gagal:", error.response?.data || error.message);
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
                          name="name"
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
                  {/* Phone Input */}
                  <div className="bg-white rounded-xs shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
                    <div className="flex items-center p-4">
                      <img
                        src="/images/icons/smartphone-icon.svg"
                        className="w-6 h-6 mr-4"
                        alt="Phone Icon"
                      />
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-bold text-[#AC1754] block">
                          No HP / WhatsApp
                        </label>
                        <input
                          ref={phoneInputRef}
                          type="text"
                          name="handphone"
                          onChange={handleNumberPhone}
                          onFocus={handlePhoneFocus}
                          value={handphone}
                          pattern="08[0-9]{8,11}"
                          placeholder="08xxxxxxxxxx"
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
                            minLength={8}
                            pattern="^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"
                            title="Password minimal 8 karakter, harus mengandung huruf kapital, angka, dan karakter spesial"
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
            <div className="fixed inset-x-0 top-25 flex justify-center px-4 z-50 animate-fade-in-down">
              <div className="w-full max-w-sm sm:max-w-md rounded-lg bg-white shadow-xl relative flex items-center justify-around gap-2 sm:gap-4 px-3 sm:px-4 py-3 overflow-hidden">
                <svg
                  className="absolute transform rotate-90 -left-8 top-8 w-16 sm:w-20 fill-red-100"
                  viewBox="0 0 1440 320"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"></path>
                </svg>

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

export default Register;
