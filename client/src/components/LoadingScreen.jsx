import React from "react";

const Loading = ({ isFullScreen = true }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        isFullScreen ? "fixed inset-0 bg-white z-10" : ""
      }`}
    >
      {/* Spinner animation */}
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#AC1754] rounded-full animate-spin"></div>
      </div>
      {/* Loading text */}
      <p className="mt-4 text-lg font-medium text-gray-700">Memuat...</p>
    </div>
  );
};

export default Loading;