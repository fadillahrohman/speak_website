import React, { useEffect, useState, useRef } from "react";
import { motion as Motion, useAnimation, useInView } from "framer-motion";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import {
  ShieldUser,
  DatabaseZap,
  ClockArrowUp,
  MessageSquareDiff,
  Bot,
  FileText,
  ChevronRight,
  Download,
} from "lucide-react";
import ChatWidget from "../components/ChatWidget";
import counselingAPI from "../api/counseling";

const Home = () => {
  // Page title
  useEffect(() => {
    document.title = "Pengaduan Aman - Cegah Kekerasan";
  });

  const [closedCounselingsCount, setClosedCounselingsCount] = useState(0);
  const controls = useAnimation();
  const statsSectionRef = useRef(null);
  const isInView = useInView(statsSectionRef, { once: true, amount: 0.5 });

  // Fetch closed reports count
  useEffect(() => {
    const fetchClosedReportsCount = async () => {
      try {
        const response = await counselingAPI.countCounglings();
        setClosedCounselingsCount(response.data.data.total);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setClosedCounselingsCount(0);
      }
    };

    fetchClosedReportsCount();
  }, []);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView && closedCounselingsCount > 0) {
      controls.start("visible");
    }
  }, [isInView, closedCounselingsCount, controls]);

  return (
    <>
      <div className="flex flex-col items-center bg-white">
        <ChatWidget />
        {/* Hero Section */}
        <section className="p-6">
          <div className="w-full max-w-8xl bg-pink-200 rounded-lg overflow-hidden mb-8">
            <div className="flex flex-col lg:flex-row">
              {/* Left Content */}
              <div className="bg-white p-6 md:p-8 lg:w-1/2 rounded-lg m-4 md:m-10">
                <h2 className="text-pink-600 font-bold text-xs sm:text-sm md:text-base mb-1 md:mb-2">
                  STOP KEKERASAN SEKSUAL
                </h2>
                <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 md:mb-4">
                  Bersama, kita bisa menghentikan kekerasan seksual.
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 md:mb-6 lg:mb-8 max-w-xl">
                  Mari bergerak untuk kebaikan lingkungan kita yang aman dari
                  kekerasan.
                </p>
                <Link to={"/create-report"}>
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
        </section>
        {/* Services Section */}
        <section className="flex flex-col md:flex-row justify-between gap-4 px-4 pb-4">
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
        </section>
        {/* Call to Action */}
        <div className="w-full max-w-4xl text-center my-6">
          <h2 className="text-3xl lg:text-4xl font-kaushan mb-1">
            Saling Jaga
          </h2>
          <h2 className="text-3xl lg:text-5xl font-kaushan mb-8">
            Saling Peduli
          </h2>
        </div>
        {/* Features Section */}
        <section className="w-full px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Link to="https://drive.google.com/file/d/1oYyjZf3qCuJrXQ1dUYuxh5DOpzLkQl9Y/view?usp=sharing">
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
            <Link to="https://drive.google.com/file/d/1TRnvDJOQ3tyhkImYKWIylywyU0L14Z8i/view?usp=sharing">
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
            <Link to="https://drive.google.com/file/d/14E4N7opQWzycts-tGbFEylaEgTZ562uz/view?usp=sharing">
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
        </section>
        {/* Statistics Section*/}
        <section ref={statsSectionRef} className="pt-12 sm:pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-5 pb-12 sm:pb-16">
              <div className="relative">
                <div className="absolute inset-0 h-1/2" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col p-6 text-center">
                      <Motion.h3
                        className="order-1 text-5xl font-extrabold text-[#AC1754]"
                        initial="hidden"
                        animate={controls}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <CountUp
                          start={0}
                          end={closedCounselingsCount}
                          duration={2}
                          formattingFn={(value) => `${value.toLocaleString()}+`}
                        />
                      </Motion.h3>
                      <Motion.span
                        className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={controls}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        Laporan Selesai
                      </Motion.span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Testimoni Section */}
        <section className="bg-pink-800 w-full">
          <div className=" mx-auto md:grid md:grid-cols-2 md:px-6 lg:px-8">
            <div className="py-12 px-4 sm:px-6 md:flex md:flex-col md:py-16 md:pl-0 md:pr-10 md:border-r md:border-pink-900 lg:pr-16">
              <blockquote className="mt-6 md:flex-grow md:flex md:flex-col">
                <div className="relative text-lg font-medium text-white md:flex-grow">
                  <svg
                    className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative">
                    Awalnya saya ragu untu k melapor, tapi tim pendamping sangat
                    ramah dan suportif. Saya merasa lebih berani dan nggak segan
                    untuk melapor jika melihat korban pelecehan lagi. Semoga
                    semakin banyak orang yang sadar bahwa melapor adalah langkah
                    penting untuk menghentikan kekerasan.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex rounded-full border-2 border-white">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="/images/icons/girl-icon.svg"
                        alt="Girl Icon"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-white">
                        Ananda Salsa
                      </div>
                      <div className="text-base font-medium text-emerald-200">
                        Mbak Yang Suka Laporin
                      </div>
                    </div>
                  </div>
                </div>
              </blockquote>
            </div>
            <div className="py-12 px-4 border-t-2 border-pink-900 sm:px-6 md:py-16 md:pr-0 md:pl-10 md:border-t-0 md:border-l lg:pl-16">
              <blockquote className="mt-6 md:flex-grow md:flex md:flex-col">
                <div className="relative text-lg font-medium text-white md:flex-grow">
                  <svg
                    className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative">
                    Gue awalnya ragu buat ngelapor, soalnya korban biasanya
                    takut identitasnya bakal tersebar. Tapi ternyata semuanya
                    dijaga dengan baik—kerahasiaan bener-bener diperhatikan.
                    Sekarang gue jadi percaya, dan semoga makin banyak yang
                    berani speak up tanpa rasa takut.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex rounded-full border-2 border-white">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="/images/icons/boy-icon.svg"
                        alt="Boy Icon"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-white">
                        Iqro Negoro
                      </div>
                      <div className="text-base font-medium text-indigo-200">
                        Mas-mas Gercep Ngelapor
                      </div>
                    </div>
                  </div>
                </div>
              </blockquote>
            </div>
          </div>
        </section>
        {/* Mobile Demo Section */}
        <section className="bg-[#AC1754] w-full">
          <div className="py-8 px-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Side: Text and Buttons */}
            <div className="w-full md:w-1/2 space-y-4 text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Cegah Kekerasan Mulai dari{" "}
                <span className="bg-gradient-to-tl from-pink-500 via-slate-50 to-pink-600 bg-clip-text text-transparent">
                  Smartphone
                </span>
                -mu!
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-100">
                Gampang Diakses, Maksimal Dampaknya
              </p>
              {/* Button More */}
              <div className="flex flex-col sm:flex-row gap-4">
                {" "}
                <Link to="/" target="_blank">
                  <button className="overflow-hidden relative w-46 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer z-10 group">
                    Selengkapnya
                    <span className="absolute w-52 h-36 -top-10 -left-4 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left" />
                    <span className="absolute w-52 h-36 -top-10 -left-4 bg-pink-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left" />
                    <span className="absolute w-52 h-36 -top-10 -left-4 bg-pink-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left" />
                    <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      Explore!
                    </span>
                  </button>
                </Link>
                {/* Button Download */}
                <Link to="/">
                  <button className="relative w-46 h-12 px-8 py-2 overflow-hidden rounded-md bg-black text-white text-xl font-bold hover:bg-pink-400 cursor-pointer z-10 group">
                    <span className="absolute top-0 right-0 px-5 py-1 text-xs tracking-wider text-center uppercase whitespace-no-wrap origin-bottom-left transform rotate-45 -translate-y-full translate-x-1/3 bg-[#f3438c]">
                      Try
                    </span>
                    <span className="relative flex items-center gap-2">
                      <span>Download</span>
                      <Download className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-y-1" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            {/* Right Side: Mobile Demo */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center justify-center h-full">
                <img src="/images/mobile-demo.svg" alt="" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
