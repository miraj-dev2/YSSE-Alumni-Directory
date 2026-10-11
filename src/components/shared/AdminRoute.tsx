import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { role, openAuthModal, logout } = useAuth();

  if (role !== 'admin') {
    const handleAdminSignIn = async () => {
      await logout();
      openAuthModal('login');
    };

    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-center text-amber-300 mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-text mb-2">
          Admin Portal Access Restricted
        </h2>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          {role === 'visitor'
            ? 'Sign in with an authorized Secretariat administrator account to access this portal.'
            : 'Your current account does not have administrator privileges. Please sign in with an authorized administrator account.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleAdminSignIn}
            className="btn-primary w-full sm:w-auto gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in as Admin</span>
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
