import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthLoginForm } from './AuthLoginForm';
import { AuthRegisterForm } from './AuthRegisterForm';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    loginWithCredentials,
    registerUser,
    loginWithGoogle,
    loginAs,
    role: currentRole
  } = useAuth();

  const { success, error } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(authModalMode);
  }, [authModalMode]);

  const handleLogin = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await loginWithCredentials(email, pass);
      success('Welcome Back', 'Logged in successfully.');
      closeAuthModal();
    } catch (err: any) {
      error('Sign In Failed', err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: { name: string; email: string; password?: string; role: 'member' | 'alumni' }) => {
    setLoading(true);
    try {
      await registerUser(data);
      success('Account Created', 'Welcome to the YSSE Network!');
      closeAuthModal();
    } catch (err: any) {
      error('Registration Failed', err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle('member');
      success('Google Sign In', 'Authenticated successfully with Google.');
      closeAuthModal();
    } catch {
      error('Auth Error', 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={mode === 'login' ? 'Sign in to YSSE Network' : 'Join the YSSE Directory'}
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {/* Tab switcher */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 pb-3 text-xs font-semibold border-b-2 transition-colors ${
              mode === 'login' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 pb-3 text-xs font-semibold border-b-2 transition-colors ${
              mode === 'register' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-text'
            }`}
          >
            Register
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="btn-secondary w-full !min-h-[44px] h-[44px] text-xs font-semibold gap-2.5 justify-center"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-4.8L1.9 17.3C3.7 21 7.5 24 12 24z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-border w-full" />
          <span className="bg-surface px-3 text-[11px] font-mono uppercase text-muted tracking-wider absolute">
            or with email
          </span>
        </div>

        {mode === 'login' ? (
          <AuthLoginForm onSubmit={handleLogin} loading={loading} />
        ) : (
          <AuthRegisterForm onSubmit={handleRegister} loading={loading} />
        )}

        <div className="pt-2 border-t border-border/40 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
            <span>Fast Role Test:</span>
            {(['member', 'alumni', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => loginAs(r)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border transition-colors ${
                  currentRole === r ? 'border-accent text-accent bg-accent/10' : 'border-border text-muted hover:text-text'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
