import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Protects routes that require authentication
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  // Still checking auth state
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;