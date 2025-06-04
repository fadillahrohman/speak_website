import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import PublicOnlyRoute from "./guards/PublicOnlyRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerificationSuccess from "./pages/VerificationSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResendEmail from "./pages/ResendEmail";
import CreateReport from "./pages/CreateReport";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import NotFound from "./components/404";

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Simulate loading complete after all resources are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleOnIdle = () => {
    if (isAuthenticated) {
      alert("session timed out");
      logout();
      navigate("/login");
    }
  };

  useIdleTimer({
    timeout: 1000 * 60 * 30, // 30 minutes
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* AUTH */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route
          path="/verification-success"
          element={<VerificationSuccess />}
        ></Route>
        <Route path="/resend-verification" element={<ResendEmail />} />
        {/* REPORT */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-report" element={<CreateReport />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/report-detail/:reportCode" element={<ReportDetail />} />
        </Route>
      </Routes>
      {!isLoading && <Footer />}
    </>
  );
}

export default AppContent;
