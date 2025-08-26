import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "authority" | "citizen">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading)
    return <div className="p-8 text-center text-blue-700">Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (
    allowedRoles &&
    userProfile &&
    !allowedRoles.includes(userProfile.userType)
  ) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Access Denied
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
