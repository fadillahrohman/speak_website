import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { usePageLoading } from "../hooks/usePageLoading";
import LoadingScreen from "../components/LoadingScreen";
import {
  ShieldUser,
  DatabaseZap,
  ClockArrowUp,
  MessageSquareDiff,
  FileText,
  Bot,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  // Page title
  useEffect(() => {
    document.title = "Pengaduan Aman - Cegah Kekerasan";
  }, []);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Loading from hooks
  const isLoading = usePageLoading("loginPage");

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify", {
          withCredentials: true,
        });

        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Server connection error:", error);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleReportClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="flex flex-col items-center bg-white min-h-screen p-6">
          {/* Hero Section */}
          <div className="w-full max-w-8xl bg-pink-200 rounded-lg overflow-hidden mb-8">
            <div className="flex flex-col lg:flex-row">
              {/* Left Content */}
              <div className="bg-white p-6 md:p-8 lg:w-1/2 rounded-lg m-4 md:m-10">
                <h2 className="text-pink-600 font-bold text-xs sm:text-sm md:text-base mb-1 md:mb-2">
                  STOP KEKERASAN SEKSUAL
                </h2>
                <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-7xl font-bold mb-2 md:mb-4">
                  Bersama, kita bisa menghentikan kekerasan seksual.
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 md:mb-6 lg:mb-8 max-w-xl">
                  Mari bergerak untuk kebaikan lingkungan kita yang aman dari kekerasan.
                </p>
                <Link
                  to={user ? "/create-report" : "/login"}
                  onClick={() => (user ? null : navigate("/login"))}
                >
                  <button className="bg-[#AC1754] text-white px-2 py-2 sm:px-2 sm:py-2 md:px-3 md:py-3 lg:px-5 lg:py-4 rounded-full text-xs sm:text-sm md:text-base flex items-center hover:bg-pink-700 transition-colors cursor-pointer">
                    Mulai Membuat Laporan
                    <span className="bg-white rounded-full p-0.5 sm:p-1 md:p-1.5 ml-2 md:ml-3">
                      <ChevronRight
                        size={12}
                        className="text-pink-600 sm:w-4 sm:h-4 md:w-5 md:h-5"
                      />
                    </span>
                  </button>
                </Link>
              </div>
              {/* Right Content */}
              <div className="lg:w-1/2 flex items-center justify-center p-6">
                <div className="relative">
                  <img
                    src="/images/home-illustration.png"
                    alt="No Sexual Harassment Illustration"
                    className="w-full h-auto max-w-md"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Services */}
          <div className="flex flex-col md:flex-row justify-between gap-4 px-4 pb-4">
            <div className="bg-white border border-gray-200 lg:w-80 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-full">
                <ShieldUser size={35} className="text-[#AC1754]" />
              </div>
              <div>
                <h3 className="font-bold text-md">Aman dan Terjamin</h3>
                <p className="text-xs text-gray-600">
                  Kerahasiaan data terlindungi
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 lg:w-80 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-full">
                <DatabaseZap size={30} className="text-[#AC1754]" />
              </div>
              <div>
                <h3 className="font-bold text-md">Mudah dan Cepat</h3>
                <p className="text-xs text-gray-600">
                  Proses pelaporan yang efisien
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 lg:w-80 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-full">
                <ClockArrowUp size={30} className="text-[#AC1754]" />
              </div>
              <div>
                <h3 className="font-bold text-md">Dukungan 24/7</h3>
                <p className="text-xs text-gray-600">
                  Pendampingan profesional tersedia
                </p>
              </div>
            </div>
          </div>
          {/* Call to Action */}
          <div className="w-full max-w-4xl text-center my-6">
            <h2 className="text-3xl lg:text-4xl font-kaushan mb-1">
              Saling Jaga
            </h2>
            <h2 className="text-3xl lg:text-5xl font-kaushan mb-8">
              Saling Peduli
            </h2>
          </div>
          {/* Features */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1 */}
            <Link
              to={user ? "/create-report" : "/login"}
              onClick={handleReportClick}
            >
              <div className="bg-pink-200 hover:bg-pink-300 transition-colors rounded-lg overflow-hidden shadow-md relative">
                <div className="p-6 h-56 flex items-center justify-center">
                  <img
                    src="/images/icons/report.svg"
                    alt="Report"
                    className="h-40"
                  />
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-pink-100 p-1 rounded">
                      <MessageSquareDiff size={16} className="text-pink-600" />
                    </div>
                    <h3 className="font-bold">Buat Laporan</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    Proses mudah pelaporan online dalam beberapa langkah
                    sederhana dan terlindungi.
                  </p>
                </div>
              </div>
            </Link>
            {/* Card 2 */}
            <Link to="/serena-bot">
              <div className="bg-pink-200 hover:bg-pink-300 transition-colors rounded-lg overflow-hidden shadow-md relative cursor-pointer">
                <div className="p-6 h-56 flex items-center justify-center">
                  <img
                    src="/images/icons/ai.svg"
                    alt="Chatbot"
                    className="h-40"
                  />
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-pink-100 p-1 rounded">
                      <Bot size={16} className="text-pink-600" />
                    </div>
                    <h3 className="font-bold">Chatbot AI</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    Dapatkan bantuan cepat melalui asisten virtual kami yang
                    tersedia 24/7.
                  </p>
                </div>
              </div>
            </Link>
            {/* Card 3 */}
            <Link to="/guide">
              <div className="bg-pink-200 hover:bg-pink-300 transition-colors rounded-lg overflow-hidden shadow-md relative">
                <div className="p-6 h-56 flex items-center justify-center">
                  <img
                    src="/images/icons/guide.svg"
                    alt="Guide"
                    className="h-40"
                  />
                </div>
                <div className="bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-pink-100 p-1 rounded">
                      <FileText size={16} className="text-pink-600" />
                    </div>
                    <h3 className="font-bold">Panduan Pengguna</h3>
                  </div>
                  <p className="text-xs text-gray-600">
                    Pelajari langkah-langkah dalam proses pelaporan dan dukungan
                    tersedia.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
