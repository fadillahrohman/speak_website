import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TbMenu } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import RoundedButton from "./RoundedButton";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, checkingAuth, logout } = useAuth();

  // Don't render anything during auth checking
  if (checkingAuth) {
    return (
      <nav className="sticky top-0 z-30 flex justify-between items-center p-4 bg-white w-full">
        <Link to="/">
          <img
            src="/images/speak-logo.png"
            className="w-[114px] h-[46px]"
            alt="Speak Logo"
          />
        </Link>
      </nav>
    );
  }
  const getUserAvatar = (user) => {
    const initials = (user?.name || user?.username || "U")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    return `https://ui-avatars.com/api/?name=${initials}&background=AC1754&color=fff&size=128&rounded=true&bold=true`;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const SidebarRoundedButton = (props) => (
    <div onClick={closeSidebar}>
      <RoundedButton
        {...props}
        className={`${
          props.className || ""
        } bg-[#AC1754] text-white hover:bg-[#A4144F]`}
      >
        {props.children}
      </RoundedButton>
    </div>
  );

  const optionsMenu = [
    ...(!user?.role || user?.role?.toLowerCase() === "user"
      ? [
          {
            title: "Buat Laporan",
            description:
              "Mulai dari sini, langkah kecil untuk keberanian besar.",
            icon: "/images/icons/option-report.svg",
            link: "/create-report",
          },
        ]
      : []),
    {
      title: "Semua Laporan",
      description: "Lihat laporan untuk meninjau langkah yang sudah dilakukan.",
      icon: "/images/icons/option-myreport.svg",
      link: "/reports",
    },
  ];

  return (
    <nav className="sticky top-0 z-30 flex justify-between items-center p-4 bg-white w-full">
      {/* Logo and Dropdown */}
      <div className="flex items-center">
        <Link to="/" className="cursor-pointer">
          <img
            src="/images/speak-logo.png"
            className="w-[114px] h-[46px]"
            alt="Speak Logo"
          />
        </Link>

        {/* Desktop Dropdown */}
        {isAuthenticated && (
          <div className="hidden md:block ml-8 relative dropdown-container">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-gray-700 hover:text-[#AC1754] transition-colors dropdown-trigger cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={getUserAvatar(user)}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-gray-700">
                  {user?.name || user?.username || "User"}
                </span>
              </div>
              <FaChevronDown
                className={`transition-transform cursor-pointer ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                className={`absolute left-0 mt-2 ${
                  optionsMenu.length === 1 ? "w-[350px]" : "w-[700px]"
                } bg-white rounded-lg shadow-xl border border-gray-200 z-50`}
              >
                <div className="p-4">
                  <div
                    className={`grid ${
                      optionsMenu.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    } gap-4`}
                  >
                    {optionsMenu.map((item, index) => (
                      <Link
                        to={item.link}
                        key={index}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block"
                      >
                        <div className="p-3 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors flex items-start gap-3">
                          <img
                            src={item.icon}
                            alt={item.title}
                            className="w-16 h-16 object-contain"
                          />
                          <div>
                            <h4 className="font-medium text-md text-gray-900">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={toggleSidebar} className="p-2 focus:outline-none">
          <TbMenu className="w-8 h-8 text-black" />
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <RoundedButton
            typeButton="button"
            onClick={handleLogout}
            className="bg-[#AC1754] text-white hover:bg-[#A4144F] flex items-center gap-1"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </RoundedButton>
        ) : (
          <>
            <RoundedButton
              typeButton="button"
              to="/login"
              className="bg-[#AC1754] text-white hover:bg-[#A4144F]"
            >
              Login
            </RoundedButton>
            <RoundedButton
              typeButton="button"
              to="/register"
              className="bg-[#AC1754] text-white hover:bg-[#A4144F]"
            >
              Daftar
            </RoundedButton>
          </>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="float-right p-2 focus:outline-none"
          >
            <IoCloseOutline className="w-8 h-8 text-black" />
          </button>

          <div className="mt-12 flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                {/* User Info - Mobile */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <img
                    src={getUserAvatar(user)}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium text-sm text-gray-700">
                    {user?.name || user?.username || "User"}
                  </span>
                </div>

                {/* Menu Items - Mobile */}
                <div className="space-y-3 mt-4">
                  {optionsMenu.map((item, index) => (
                    <Link
                      to={item.link}
                      key={index}
                      onClick={closeSidebar}
                      className="block p-3 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Logout Button - Mobile */}
                <SidebarRoundedButton
                  typeButton="button"
                  onClick={handleLogout}
                  className="w-full flex justify-center items-center gap-2"
                >
                  <HiOutlineLogout className="w-5 h-5" />
                  Logout
                </SidebarRoundedButton>
              </>
            ) : (
              <>
                <SidebarRoundedButton
                  typeButton="button"
                  to="/login"
                  className="w-full"
                >
                  Login
                </SidebarRoundedButton>
                <SidebarRoundedButton
                  typeButton="button"
                  to="/register"
                  className="w-full"
                >
                  Daftar
                </SidebarRoundedButton>
              </>
            )}
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
