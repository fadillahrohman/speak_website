import React from "react";

const ErrorToast = ({ error, onClose }) => {
  return (
    <div className="fixed inset-x-0 top-30 flex justify-center px-4 z-50 animate-fade-in-down">
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
          onClick={onClose}
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
  );
};

export default ErrorToast;
