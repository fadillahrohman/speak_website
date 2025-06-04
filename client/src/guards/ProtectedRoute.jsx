import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, checkingAuth } = useAuth();

  if (checkingAuth) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
