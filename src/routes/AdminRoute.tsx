import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// NOTE: Client-side role check only. Real access control MUST also be enforced
// by the production backend API on all sensitive endpoints and queries.
export const AdminRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ground flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lines border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Allow admin access if role is admin
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
