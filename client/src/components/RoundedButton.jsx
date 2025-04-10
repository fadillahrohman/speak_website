import React from "react";
import { useNavigate } from "react-router-dom";

function RoundedButton({
  children,
  className = "",
  onClick,
  to = "",
  typeButton = "",
}) {
  const navigate = useNavigate();

  // Click will direct to route
  const toPage = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(to);
    }
  };

  return (
    // Button Component
    <button
      type={typeButton}
      onClick={toPage}
      className={`px-8 py-2 rounded-full shadow-sm text-sm font-medium cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
export default RoundedButton;
