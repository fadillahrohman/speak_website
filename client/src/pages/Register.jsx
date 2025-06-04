import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import RoundedButton from "../components/RoundedButton";
import ErrorToast from "../components/Toast/ErrorToast";
import SuccessToast from "../components/Toast/SuccessToast";
import authAPI from "../api/auth";

const Register = () => {
  // Page title
  useEffect(() => {
    document.title = "Daftar Akun - Speak";
  });

  // View password to register
  const [showPassword, setShowPassword] = useState(false);
  // Loading for submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [handphone, setHandphone] = useState("");
  // const phoneInputRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!values.name.trim()) {
      setErrorMessage("Nama harus diisi");
      return false;
    }
    if (!values.email.trim()) {
      setErrorMessage("Email harus diisi");
      return false;
    }
    // if (!handphone || handphone.length < 3) {
    //   setErrorMessage("Nomor HP harus diisi");
    //   return false;
    // }
    // if (handphone.length < 12) {
    //   setErrorMessage("Nomor HP harus terdiri dari 12 digit");
    //   return false;
    // }
    // if (!handphone.startsWith("08")) {
    //   setErrorMessage("Nomor HP harus diawali dengan 08");
    //   return false;
    // }
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
    name: "",
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle phone input focus
  // const handlePhoneFocus = () => {
  //   // If the field is empty, automatically add "08"
  //   if (!handphone) {
  //     setHandphone("08");
  //   }
  // };

  // Handle phone input
  // const handleNumberPhone = (e) => {
  //   let value = e.target.value;

  //   // Only allow numbers
  //   value = value.replace(/[^0-9]/g, "");

  //   // If user deleted all input including "08", we'll add it back
  //   if (value === "" || value.length < 2) {
  //     value = "08";

  //     // Set cursor position after "08"
  //     setTimeout(() => {
  //       if (phoneInputRef.current) {
  //         phoneInputRef.current.selectionStart = 2;
  //         phoneInputRef.current.selectionEnd = 2;
  //       }
  //     }, 0);
  //   }
  //   // If user is typing and doesn't start with "08", force it
  //   else if (!value.startsWith("08")) {
  //     value = "08" + value.substring(value.length - Math.min(value.length, 10));
  //   }

  //   // Limit to 12 digits (including the "08" prefix)
  //   if (value.length > 12) {
  //     value = value.slice(0, 12);
  //   }

  //   setHandphone(value);

  //   // Update the values state with the handphone number
  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     handphone: value,
  //   }));
  // };

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
      // AUTH API (REGISTER)
      const response = await authAPI.register(values);
      if (response.status === 200) {
        setIsSubmitting(false);
        setSuccessMessage("Pendaftaran berhasil, Verifikasi Email kamu untuk akses akun.");
        setShowSuccess(true);
        
        // Hide success toast after 10 seconds and navigate to login
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/login");
        }, 10000);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "Terjadi kesalahan saat mendaftar"
        );
      } else {
        setErrorMessage(
          "Terjadi kesalahan pada server. Silakan coba lagi nanti."
        );
      }
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      console.error("Gagal:", error.response?.data || error.message);
    }
  };

  return (
    <>
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
                {/* <div className="bg-white rounded-xs shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
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
                  </div> */}
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
                          // minLength={8}
                          // pattern="^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"
                          // title="Password minimal 8 karakter, harus mengandung huruf kapital, angka, dan karakter spesial"
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

export default Register;