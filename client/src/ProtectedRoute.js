// src/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If route starts with /admin and user is not admin, redirect
  if (location.pathname.startsWith("/admin") && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
