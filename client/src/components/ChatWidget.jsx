import React from 'react';
import { Link } from "react-router-dom";
const ChatWidget = () => {
  return (
    <Link to="/">
    <button className="fixed bottom-6 right-6 w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30 flex justify-center items-center transition-all duration-300 ease-out group z-50 hover:scale-105 active:scale-95 cursor-pointer">
      <div className="absolute -right-1 -top-1 z-10">
        <div className="flex h-6 w-6 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-600 opacity-75" />
          <span className="relative inline-flex h-6 w-10 items-center justify-center rounded-full bg-[#AC1754] text-sm font-bold text-white">
            Hi!
          </span>
        </div>
      </div>
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 lg:w-36 lg:h-36">
        <img src="/images/chatbot.svg" alt="" />
      </div>
      <span className="absolute inset-0 rounded-full scale-100 animate-pulse" />
      <div className="absolute right-full mr-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
        <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow-lg">
        Ada yang bisa kubantu?
        </div>
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
      </div>
    </button>
    </Link>
  );
}

export default ChatWidget;