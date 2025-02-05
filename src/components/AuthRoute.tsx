import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { auth } from "src/config/firebase";

const AuthRoute: React.FC = () => {
  const user = auth.currentUser; // Check if the user is authenticated

  if (user) {
    // If the user is authenticated, redirect to the dashboard
    return <Navigate to="/students" />;
  }

  // If the user is not authenticated, render the child routes
  return <Outlet />;
};

export default AuthRoute;