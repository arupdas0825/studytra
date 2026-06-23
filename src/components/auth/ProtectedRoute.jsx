import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FullPageLoader from "../ui/FullPageLoader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
