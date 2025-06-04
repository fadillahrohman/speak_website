import { Check, X, Info } from "lucide-react";
import React from "react";

const StatusProgress = ({ report, formatDateTime }) => {
  const getStatusClass = (currentStatus, stepStatus) => {
    const statusOrder = ["pending", "process", "counseling", "closed"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentStatus === "rejected" && stepStatus === "pending") {
      return "bg-red-500";
    }
    if (currentIndex >= stepIndex) {
      return "bg-[#45a834]";
    }
    return "bg-gray-300";
  };

  const getConnectorClass = (currentReportStatus, originStepStatus) => {
    const statusOrder = ["pending", "process", "counseling", "closed"];
    const currentIndex = statusOrder.indexOf(currentReportStatus);
    const stepIndex = statusOrder.indexOf(originStepStatus);

    if (currentReportStatus === "rejected" && originStepStatus === "pending") {
      return "bg-red-500";
    }
    if (currentIndex <= stepIndex) {
      return "bg-gray-300"; 
    }
    return "bg-[#45a834]";
  };

  const statusSteps = [
    {
      status: "pending",
      label: "Menunggu",
      icon: "/images/status/pending.svg",
      rejectedIcon: "/images/status/rejected.svg",
    },
    {
      status: "process",
      label: "Diproses",
      icon: "/images/status/process.svg",
    },
    {
      status: "counseling",
      label: "Konseling",
      icon: "/images/status/counseling.svg",
    },
    { status: "closed", label: "Selesai", icon: "/images/status/closed.svg" },
  ];

  const statusMessages = {
    pending: {
      message:
        "Laporan telah dikirim dan sedang menunggu diverifikasi oleh tim kami.",
    },
    rejected: { message: "Maaf, laporan kamu tidak dapat kami proses." },
    process: {
      message:
        "Laporan kamu sedang kami proses. Sesi konseling akan dijadwalkan.",
    },
    counseling: {
      message:
        "Sesi konseling sedang berlangsung. Konselor akan menghubungi Kamu sesuai jadwal yang telah disepakati.",
    },
    closed: {
      message: "Laporan kamu selesai, terimakasih telah menggunakan SPEAK.",
    },
  };

  const currentStatusMessage = statusMessages[report.status] || {
    message: "Status tidak diketahui.",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <h2 className="text-md text-white font-medium bg-[#AC1754] rounded inline-block p-1 mb-6">
        Status Laporan
      </h2>
      {/* The main container for steps, always flex-row and items-start */}
      <div className="flex flex-row justify-center items-start relative overflow-x-auto py-2 px-1">
        {statusSteps.map((step, index, array) => {
          const isRejectedPending =
            report.status === "rejected" && step.status === "pending";
          const isActiveOrCompleted =
            getStatusClass(report.status, step.status) === "bg-[#45a834]";
          const circleBgClass = getStatusClass(report.status, step.status);
          const connectorColorClass = getConnectorClass(
            report.status,
            step.status
          );
          return (
            <React.Fragment key={step.status}>
              {/* Each step is an item in a flex row */}
              <div className="flex flex-col items-center text-center relative px-1 sm:px-2 md:px-3 flex-shrink-0">
                {" "}
                {/* flex-shrink-0 to prevent shrinking if overflow */}
                {/* Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-30 md:h-30 lg:w-40  lg:h-40">
                  <img
                    src={isRejectedPending ? step.rejectedIcon : step.icon}
                    alt={isRejectedPending ? "Ditolak" : step.label}
                    className={`w-full h-full object-contain ${
                      isRejectedPending || isActiveOrCompleted
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                  />
                </div>
                {/* Status Circle: Responsive size */}
                <div className="relative">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center mt-1 sm:mt-2 ${circleBgClass}`}
                  >
                    {isRejectedPending ? (
                      <X className="text-white w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    ) : (
                      <Check strokeWidth={3} className="text-white w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    )}
                  </div>
                </div>
                {/* Label */}
                <span
                  className={`text-[10px] leading-tight sm:text-xs md:text-sm mt-1 sm:mt-2 w-16 sm:w-20 md:w-24 lg:w-28 ${
                    isRejectedPending
                      ? "text-red-600 font-medium"
                      : isActiveOrCompleted
                      ? "text-gray-700 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {isRejectedPending ? "Ditolak" : step.label}
                </span>
              </div>
              {/* Horizontal Connector Line: Always there if not the last item */}
              {index < array.length - 1 && (
                <div
                  className="relative flex items-center self-auto sm:mx-1
                  w-[100px] h-[126px]
                  sm:w-[100px] sm:h-[165px]
                  md:w-[140px] md:h-[290px]
                  lg:w-[150px] lg:h-[365px]"
                >
                  <div
                    className={`w-full h-0.5 ${connectorColorClass}`}
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      position: "absolute",
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Status Message Area */}
      {report.status && statusMessages[report.status] && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div
            className={`inline-flex items-center text-xs sm:text-sm text-gray-700 mt-5 lg:mt-0 p-3 sm:p-4 rounded-lg w-full md:w-auto      
        ${
          currentStatusMessage.bgColor || "bg-gray-100"
        } border border-gray-200`}
          >
            <Info
              className={`h-5 w-5 sm:h-6 mr-2 shrink-0 ${
                currentStatusMessage.iconColor || "text-gray-600"
              }`}
            />
            <p>{currentStatusMessage.message}</p>
          </div>
          <span className="text-gray-500 text-xs mt-2 md:mt-8 self-end md:self-center">
            Diperbarui {formatDateTime(report.updatedAt)}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusProgress;
