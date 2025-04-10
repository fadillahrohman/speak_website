// VerificationSuccess.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // const [email, setEmail] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        // No token, redirect to login
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/auth/validate-success-token?token=${token}`
        );
        const data = await response.json();

        if (!response.ok || !data.valid) {
          // Token is invalid, redirect to login
          setError("Akses tidak sah atau token sudah kadaluarsa");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        // Token valid
        // setEmail(data.email);
        setIsLoading(false);
      } catch (error) {
        console.error("Error validating token:", error);
        setError("Terjadi kesalahan saat memvalidasi akses");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    validateToken();
  }, [navigate]);

  // Automatically redirect to login after 5 seconds
  useEffect(() => {
    if (!isLoading && !error) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, error, navigate]);

  if (isLoading && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded shadow-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Memvalidasi...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Akses Ditolak
          </h1>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Anda akan dialihkan ke halaman login...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Image for desktop */}
      <img
        src="/images/verification-email.svg"
        alt="Verification Illustration Desktop"
        className="hidden md:block absolute inset-0 w-auto h-full object-contain mx-auto"
      />

      {/* Image for tablet & mobile */}
      <img
        src="/images/verification-email.svg"
        alt="Verification"
        className="block md:hidden mx-auto w-auto h-[50vh] object-contain"
      />
    </div>
  );
};

export default VerificationSuccess;
