import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { role, openAuthModal, logout } = useAuth();

  // Visitor trying to access protected content
  if (role === 'visitor' && !allowedRoles.includes('visitor')) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-md bg-surface border border-border-strong flex items-center justify-center text-accent mx-auto mb-4">
          <LogIn className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold font-heading text-text mb-2">
          Authentication Required
        </h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          Please sign in to access this page. Members, alumni, and administrators can sign in using their account.
        </p>
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="btn-secondary !min-h-[42px] h-[42px] text-xs px-4"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className="btn-primary !min-h-[42px] h-[42px] text-xs px-4"
          >
            Register
          </button>
        </div>
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Signed in but lacking required role -> 403 Forbidden
  if (!allowedRoles.includes(role)) {
    const handleSwitchAccount = async () => {
      await logout();
      openAuthModal('login');
    };

    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-md bg-status-rejected-bg border border-status-rejected/30 flex items-center justify-center text-status-rejected mx-auto mb-4">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold font-heading text-text mb-2">
          403 — Access Forbidden
        </h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          Your current account role (<span className="text-accent font-mono uppercase text-xs">{role}</span>) does not have permission to view this section.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSwitchAccount}
            className="btn-primary w-full sm:w-auto"
          >
            Sign In with Different Account
          </button>
          <Link
            to="/alumni"
            className="btn-secondary w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
