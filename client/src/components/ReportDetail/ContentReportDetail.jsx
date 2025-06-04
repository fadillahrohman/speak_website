import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ContentReportDetail = ({ report }) => {
  const [showDescription, setShowDescription] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Create the full image URL by adding the base URL
  const getImageUrl = (imageSource) => {
    if (!imageSource) return null;

    // Check if the image already has a full URL
    if (imageSource.startsWith("http")) {
      return imageSource;
    }

    // Add the base URL
    return `https://speak.rynn.fun/images/${imageSource}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
      <h2 className="text-md text-white font-medium bg-[#AC1754] rounded inline-block p-1 mb-4 md:mb-6">
        Detail Laporan
      </h2>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left */}
        <div className="space-y-4 md:space-y-6 pb-6 border-b border-gray-200 lg:pb-0 lg:border-b-0 lg:pr-8 lg:border-r">
          <div>
            <p className="text-md text-black mb-1">Judul Laporan</p>
            <p className="font-medium bg-gray-100 border border-gray-200 text-gray-600 inline-block px-2 py-0.5 rounded">
              {report.title}
            </p>
          </div>

          <div>
            <p className="text-md text-black mb-1">Tanggal Kejadian</p>
            <p className="font-medium bg-gray-100 border border-gray-200 text-gray-600 inline-block px-2 py-0.5 rounded">
              {formatDate(report.date)}
            </p>
          </div>
        </div>
        {/* Right*/}
        <div className="space-y-4 md:space-y-6 pt-6 lg:pt-0">
          {/* Description Section with Transition */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-black">Deskripsi Laporan</p>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-gray-600 cursor-pointer"
              >
                {showDescription ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showDescription ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="font-medium bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                <p className="text-gray-600">{report.description}</p>
              </div>
            </div>
          </div>

          {/* Evidence Section with Transition */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-black">Bukti Laporan</p>
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className="text-gray-600 cursor-pointer"
              >
                {showEvidence ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showEvidence ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="w-70 h-auto bg-cover">
                {report.proof ? (
                  <img
                    src={getImageUrl(report.proof)}
                    alt="Bukti laporan"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">
                    Tidak ada bukti yang diunggah
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentReportDetail;
