import { Navigate, Outlet } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";

export default function PublicOnlyRoute() {
  
  const { isAuthenticated, checkingAuth } = useAuth();

  if (checkingAuth) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace/>
  }

  return <Outlet />;
}
