import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import RoundedButton from "./RoundedButton";
import { TbMenu } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Add location.pathname as a dependency to trigger auth check whenever the route changes.
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/auth/verify", {
          withCredentials: true,
        });

        // There will be no error, always status 200
        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // This will only be executed if there is a problem connecting to the server.
        console.error("Server connection error:", error);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, [location.pathname]); // Memicu pemeriksaan setiap kali route berubah

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to delete cookies on the server
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      // Set user to null
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect to login even if error
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Custom wrapped buttons that close sidebar when clicked
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

  return (
    <nav className="sticky top-0 z-30 flex justify-between items-center p-4 bg-white w-full">
      {/* Logo */}
      <div className="flex">
        <Link to="/" className="cursor-pointer">
          <img
            src="/images/speak-logo.png"
            className="w-[114px] h-[46px]"
            alt="Speak Logo"
          />
        </Link>
      </div>
      {/* Menu for Mobile */}
      <div className="md:hidden">
        <button onClick={toggleSidebar} className="p-2 focus:outline-none">
          <TbMenu className="w-8 h-8 text-black" />
        </button>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          // Show username and logout button when user is logged in
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-gray-700" size={25} />
              <span className="font-medium text-gray-700">
                {user.name || user.username || "User"}
              </span>
            </div>
            <RoundedButton
              typeButton="button"
              onClick={handleLogout}
              className="bg-[#AC1754] text-white hover:bg-[#A4144F] flex items-center gap-1"
            >
              <HiOutlineLogout className="w-5 h-5" />
              Logout
            </RoundedButton>
          </div>
        ) : (
          // Show login and register buttons when user is not logged in
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
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="float-right p-2 focus:outline-none"
          >
            <IoCloseOutline className="w-8 h-8 text-black" />
          </button>
          {/* Sidebar Content with buttons that close sidebar when clicked */}
          <div className="mt-12 flex flex-col space-y-4">
            {user ? (
              // Show username and logout button when user is logged in
              <>
                <div className="flex flex-col items-center mb-4">
                  <FaUserCircle className="text-gray-700 mb-2" size={40} />
                  <span className="font-medium text-gray-700 text-lg">
                    {user.name || user.username || "User"}
                  </span>
                </div>
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
              // Show login and register buttons when user is not logged in
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
      {/* Overlay when sidebar is open */}
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
