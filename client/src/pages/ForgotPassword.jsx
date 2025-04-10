import React, { useEffect } from "react";
import { usePageLoading } from "../hooks/usePageLoading";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import RoundedButton from "../components/RoundedButton";
import LoadingScreen from "../components/LoadingScreen";

const ForgotPassword = () => {
  // Loading from hooks
  const isLoading = usePageLoading("forgotPasswordPage");

  // Page Title
  useEffect(() => {
    document.title = "Lupa Password - SPEAK";
  });

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
                  src="/images/forgot-password-illustration.png"
                  alt="Forgot Password Ilustration"
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
                  Lupa Password
                </h2>
                <p className="text-sm text-black mb-6">
                  Jangan biarkan lupa password menghentikanmu! Pulihkan sekarang
                </p>
                <form className="space-y-4">
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
                      className="w-full bg-[#AC1754] text-white hover:bg-[#A4144F]"
                    >
                      Kirim
                    </RoundedButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
