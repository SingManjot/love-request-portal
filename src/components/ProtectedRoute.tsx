
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: "requester" | "approver";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login");
    }
  }, [loading, user]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If userType is specified, check if the user has the correct type
  if (userType && user.type !== userType) {
    return userType === "requester" ? (
      <Navigate to="/approve" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
