import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer rounded-l-lg ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="h-5 w-5 text-gray-500" />
      </button>
    );
    // Generate page buttons
    if (totalPages <= 5) {
      // Less than 5 pages, show all
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
              currentPage === i
                ? "bg-[#AC1754] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // More than 5 pages, use ellipsis
      if (currentPage <= 3) {
        // Show 1, 2, 3, ..., totalPages
        for (let i = 1; i <= 3; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => paginate(i)}
              className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
                currentPage === i
                  ? "bg-[#AC1754] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }
        buttons.push(
          <button
            key="ellipsis1"
            className="w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer"
          >
            ...
          </button>
        );
        buttons.push(
          <button
            key={totalPages}
            onClick={() => paginate(totalPages)}
            className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
              currentPage === totalPages
                ? "bg-[#AC1754] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </button>
        );
      } else if (currentPage >= totalPages - 2) {
        // Show 1, ..., totalPages-2, totalPages-1, totalPages
        buttons.push(
          <button
            key={1}
            onClick={() => paginate(1)}
            className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
              currentPage === 1
                ? "bg-[#AC1754] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {1}
          </button>
        );
        buttons.push(
          <button
            key="ellipsis2"
            className="w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer"
          >
            ...
          </button>
        );
        for (let i = totalPages - 2; i <= totalPages; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => paginate(i)}
              className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
                currentPage === i
                  ? "bg-[#AC1754] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }
      } else {
        // Show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
        buttons.push(
          <button
            key={1}
            onClick={() => paginate(1)}
            className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
              currentPage === 1
                ? "bg-[#AC1754] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {1}
          </button>
        );
        buttons.push(
          <button
            key="ellipsis3"
            className="w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer"
          >
            ...
          </button>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => paginate(i)}
              className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
                currentPage === i
                  ? "bg-[#AC1754] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i}
            </button>
          );
        }
        buttons.push(
          <button
            key="ellipsis4"
            className="w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer"
          >
            ...
          </button>
        );
        buttons.push(
          <button
            key={totalPages}
            onClick={() => paginate(totalPages)}
            className={`w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center cursor-pointer ${
              currentPage === totalPages
                ? "bg-[#AC1754] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer rounded-r-lg ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        <ChevronRight className="h-5 w-5 text-gray-500" />
      </button>
    );

    return buttons;
  };

  return (
    <div className="flex items-center justify-between p-6">
      <p className="text-sm text-gray-500">
        Menampilkan {totalItems > 0 ? indexOfFirstItem + 1 : 0} sampai{" "}
        {Math.min(indexOfLastItem, totalItems)} dari {totalItems} hasil
      </p>
      <div className="flex">{totalPages > 0 && renderPaginationButtons()}</div>
    </div>
  );
};

export default Pagination;
