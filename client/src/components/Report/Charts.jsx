import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import { ChevronDown, X, ChartSpline, ChartPie } from "lucide-react";

const Charts = ({ reports, timeframe = "7d", user, counselingData = [] }) => {
  const [lineDropdownOpen, setLineDropdownOpen] = useState(false);
  const [pieDropdownOpen, setPieDropdownOpen] = useState(false);
  const [lineTimeframe, setLineTimeframe] = useState(timeframe);
  const [pieTimeframe, setPieTimeframe] = useState(timeframe);

  // Refs for dropdown containers
  const lineDropdownRef = useRef(null);
  const pieDropdownRef = useRef(null);

  // Add effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click was outside the line dropdown
      if (
        lineDropdownRef.current &&
        !lineDropdownRef.current.contains(event.target)
      ) {
        setLineDropdownOpen(false);
      }

      // Check if click was outside the pie dropdown
      if (
        pieDropdownRef.current &&
        !pieDropdownRef.current.contains(event.target)
      ) {
        setPieDropdownOpen(false);
      }
    };

    // Only add listener if dropdowns are open
    if (lineDropdownOpen || pieDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [lineDropdownOpen, pieDropdownOpen]);

  const timeframeOptions = [
    { value: "7d", label: "7 Hari Terakhir" },
    { value: "30d", label: "30 Hari Terakhir" },
    { value: "90d", label: "3 Bulan Terakhir" },
    { value: "180d", label: "6 Bulan Terakhir" },
  ];

  const getTimeframeDays = (tf) => {
    switch (tf) {
      case "30d":
        return 30;
      case "90d":
        return 90;
      case "180d":
        return 180;
      case "7d":
      default:
        return 7;
    }
  };

  const getTimeframeLabel = (tf) => {
    return (
      timeframeOptions.find((option) => option.value === tf)?.label ||
      "7 Hari Terakhir"
    );
  };

  // Prepare chart data from reports based on timeframe
  const prepareLineData = () => {
    const days = getTimeframeDays(lineTimeframe);
    const timeframeDays = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      let displayName;
      if (days <= 7) {
        // For 7 days, show short weekday names
        const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
        displayName = dayName.charAt(0).toUpperCase() + dayName.slice(1, 3);
      } else if (days <= 30) {
        // For 30 days, show day/month format
        displayName = date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      } else {
        displayName = date.toLocaleDateString("id-ID", { month: "short" });
        const existingMonth = timeframeDays.find(
          (d) =>
            d.name === displayName &&
            new Date(d.date).getMonth() === date.getMonth()
        );

        if (existingMonth) {
          continue;
        }
      }

      timeframeDays.push({
        date: date.toISOString().split("T")[0] || "",
        name: displayName,
        pengguna: 0,
        aktif: 0,
      });
    }

    // Count reports for each day/period
    if (user === "counselor") {
      // For counselor, use counselingData
      if (Array.isArray(counselingData)) {
        counselingData.forEach((counseling) => {
          const counselingDate = new Date(counseling.createdAt || counseling.updatedAt);

          let periodIndex;

          if (days > 30) {
            // For longer periods, match by month
            periodIndex = timeframeDays.findIndex(
              (day) => new Date(day.date).getMonth() === counselingDate.getMonth()
            );
          } else {
            // For shorter periods, match by exact date
            const counselingDateStr = (counseling.createdAt || counseling.updatedAt)?.split("T")[0] || "";
            periodIndex = timeframeDays.findIndex(
              (day) => day.date === counselingDateStr
            );
          }

          if (periodIndex !== -1) {
            timeframeDays[periodIndex].pengguna += 1;
            if (counseling.status === "process" || counseling.status === "pending") {
              timeframeDays[periodIndex].aktif += 1;
            }
          }
        });
      }
    } else {
      // For regular users, use reports data
      if (Array.isArray(reports)) {
        reports.forEach((report) => {
          const reportDate = new Date(report.createdAt);

          let periodIndex;

          if (days > 30) {
            // For longer periods, match by month
            periodIndex = timeframeDays.findIndex(
              (day) => new Date(day.date).getMonth() === reportDate.getMonth()
            );
          } else {
            // For shorter periods, match by exact date
            periodIndex = timeframeDays.findIndex(
              (day) => day.date === (report.createdAt?.split("T")[0] || "")
            );
          }

          if (periodIndex !== -1) {
            timeframeDays[periodIndex].pengguna += 1;
            if (report.status === "process" || report.status === "counseling") {
              timeframeDays[periodIndex].aktif += 1;
            }
          }
        });
      }
    }

    return timeframeDays;
  };

  const preparePieData = () => {
    const days = getTimeframeDays(pieTimeframe);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    if (user === "counselor") {
      // For counselor, use counseling status categories
      const statusCounts = {
        pending: { name: "Menunggu", value: 0, color: "#ec4899" },
        rejected: { name: "Ditolak", value: 0, color: "#f472b6" },
        process: { name: "Dalam Proses", value: 0, color: "#db2777" },
        closed: { name: "Selesai", value: 0, color: "#9d174d" },
      };

      if (Array.isArray(counselingData)) {
        counselingData.forEach((counseling) => {
          const counselingDate = new Date(counseling.createdAt || counseling.updatedAt);

          if (counselingDate >= cutoffDate && statusCounts[counseling.status]) {
            statusCounts[counseling.status].value += 1;
          }
        });
      }

      return Object.values(statusCounts);
    } else {
      // For regular users, use report status categories
      const statusCounts = {
        rejected: { name: "Ditolak", value: 0, color: "#f472b6" },
        pending: { name: "Menunggu", value: 0, color: "#ec4899" },
        process: { name: "Dalam Proses", value: 0, color: "#db2777" },
        counseling: { name: "Konseling", value: 0, color: "#be185d" },
        closed: { name: "Selesai", value: 0, color: "#9d174d" },
      };

      if (Array.isArray(reports)) {
        reports.forEach((report) => {
          const reportDate = new Date(report.createdAt);

          if (reportDate >= cutoffDate && statusCounts[report.status]) {
            statusCounts[report.status].value += 1;
          }
        });
      }

      return Object.values(statusCounts);
    }
  };

  const chartLabels = {
    lineTitle: user === "counselor" ? "Konseling Masuk" : "Laporan Masuk",
    pieTitle: user === "counselor" ? "Status Konseling" : "Status Laporan",
    lineTooltipLabel:
    user === "counselor" ? "Konseling Masuk:" : "Laporan Masuk:",
    lineLegendLabel: user === "counselor" ? "Konseling Masuk" : "Laporan Masuk",
  };

  // Generate chart data based on current timeframe selections
  const lineData = prepareLineData();
  const pieData = preparePieData();

  // Custom tooltip for Line Chart
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 shadow-md rounded border border-gray-200 text-xs sm:text-sm">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-pink-700">
            <span className="font-medium">{chartLabels.lineTooltipLabel}</span>{" "}
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 shadow-md rounded border border-gray-200 text-xs sm:text-sm">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-pink-700">
            <span className="font-medium">Jumlah:</span> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
      {/* Line Chart */}
      <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
          <h2 className="flex items-center font-semibold text-sm sm:text-base mb-2 sm:mb-0 w-45 text-white text-center bg-[#AC1754] p-1 rounded gap-1">
            <ChartSpline />
            <span className="flex-1">{chartLabels.lineTitle}</span>
          </h2>
          <div className="relative" ref={lineDropdownRef}>
            <button
              className="flex items-center text-xs sm:text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 sm:px-3"
              onClick={() => setLineDropdownOpen(!lineDropdownOpen)}
            >
              <span>{getTimeframeLabel(lineTimeframe)}</span>
              <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            {lineDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-40">
                <div className="flex justify-between items-center p-2 border-b">
                  <span className="text-xs font-medium text-gray-500">
                    Pilih Periode
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLineDropdownOpen(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="block">
                  {timeframeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-500 hover:bg-gray-100 cursor-pointer ${
                        lineTimeframe === option.value ? "bg-gray-100" : ""
                      }`}
                      onClick={() => {
                        setLineTimeframe(option.value);
                        setLineDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="h-48 sm:h-56 md:h-64 lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{
                top: 5,
                right: 5,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "10px", width: 30 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: "10px" }}
                width={40}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="pengguna"
                stroke="#AC1754"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-2 sm:mt-3 md:mt-4">
          <div className="flex items-center">
            <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#AC1754] mr-1 sm:mr-2"></div>
            <span className="text-xs sm:text-sm text-gray-600">
              {chartLabels.lineLegendLabel}
            </span>
          </div>
        </div>
      </div>
      {/* Pie Chart */}
      <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
          <h2 className="flex items-center font-semibold text-sm sm:text-base mb-2 sm:mb-0 w-45 text-white text-center bg-[#AC1754] p-1 rounded gap-1">
            <ChartPie />
            <span className="flex-1">{chartLabels.pieTitle}</span>
          </h2>
          <div className="relative" ref={pieDropdownRef}>
            <button
              className="flex items-center text-xs sm:text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 sm:px-3"
              onClick={() => setPieDropdownOpen(!pieDropdownOpen)}
            >
              <span>{getTimeframeLabel(pieTimeframe)}</span>
              <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            {pieDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-40">
                <div className="flex justify-between items-center p-2 border-b">
                  <span className="text-xs font-medium text-gray-500">
                    Pilih Periode
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPieDropdownOpen(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="block">
                  {timeframeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-500 hover:bg-gray-100 cursor-pointer ${
                        pieTimeframe === option.value ? "bg-gray-100" : ""
                      }`}
                      onClick={() => {
                        setPieTimeframe(option.value);
                        setPieDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="h-48 sm:h-56 md:h-64 lg:h-72 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <PieTooltip content={<CustomPieTooltip />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="70%"
                paddingAngle={0}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center flex-wrap gap-1 sm:gap-2 md:gap-3 mt-2 sm:mt-3 md:mt-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center mx-1">
              <div
                className="h-2 w-2 sm:h-3 sm:w-3 rounded-full mr-1 sm:mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-xs sm:text-sm text-gray-600">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;