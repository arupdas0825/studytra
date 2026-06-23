import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FullPageLoader from "../ui/FullPageLoader";

export default function ProtectedRoute({ children }) {
  const { user, loading, setAuthModalOpen } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      setAuthModalOpen(true);
    }
  }, [user, loading, setAuthModalOpen]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
