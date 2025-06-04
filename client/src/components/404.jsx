import { useEffect } from "react";

const NotFound = () => {
  // Page title
  useEffect(() => {
    document.title = "404";
  });
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <img
        src="/images/404.svg"
        alt="404 Not Found"
        className="w-auto h-auto object-contain"
      />
    </div>
  );
};

export default NotFound;
