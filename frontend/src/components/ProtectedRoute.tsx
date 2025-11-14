// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactElement;
  requiredRole?: "citizen" | "council";
  fallback?: string; // path to redirect if not allowed
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, fallback = "/login" }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  if (!user) { 
    return <Navigate to={fallback} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If a logged-in user of wrong role tries to access, route them appropriately
    return <Navigate to={user.role === "council" ? "/council" : "/my-lands"} replace />;
  }

  return children;
};
