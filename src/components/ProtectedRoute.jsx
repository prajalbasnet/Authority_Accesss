import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// role: "citizen" | "authority" | "admin"
const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    toast.error("You have to register");
    return <Navigate to="/signup" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    toast.error(
      `You are ${user.role?.toLowerCase() || "not authorized"}, you can't access this page`
    );
    // Go back to previous page or home
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
