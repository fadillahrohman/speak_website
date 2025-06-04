import { useNavigate } from "react-router-dom";
import { CircleArrowLeft } from 'lucide-react';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <img
        src="/images/error.svg"
        alt="404 Error"
        className="w-auto h-auto object-contain mb-5"
      />
      <button
        onClick={() => navigate("/reports")}
        className="flex gap-2 px-6 py-2 bg-[#AC1754] text-white hover:bg-pink-800 rounded-md font-medium transition-colors shadow-sm cursor-pointer"
      >
       <CircleArrowLeft /> Kembali
      </button>
    </div>
  );
};

export default Error;
