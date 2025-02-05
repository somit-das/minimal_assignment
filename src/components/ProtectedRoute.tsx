import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "src/config/firebase";

const ProtectedRoute: React.FC = () => {
  const user = auth.currentUser; // Check if the user is authenticated

  if (!user) {
    // {console.log("user does not exist")}
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;