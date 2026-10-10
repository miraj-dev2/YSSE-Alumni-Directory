import React, { useState, useEffect } from 'react';
import { useAuth, AuthModalMode } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from './Modal';
import {
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  Check,
} from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    loginWithCredentials,
    registerUser,
    loginWithGoogle,
    loginAs,
    role: currentRole,
  } = useAuth();
  const { success, error } = useToast();

  const [mode, setMode] = useState<AuthModalMode>(authModalMode);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'member' | 'alumni'>('member');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(authModalMode);
  }, [authModalMode]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      error('Email Required', 'Please enter your email address to log in.');
      return;
    }
    setLoading(true);
    try {
      await loginWithCredentials(loginEmail, loginPassword);
      success('Welcome Back', `Successfully signed in as ${loginEmail}`);
      closeAuthModal();
    } catch {
      error('Sign In Failed', 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      error('Missing Details', 'Please provide both your name and email address.');
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });
      success(
        'Account Created',
        regRole === 'alumni'
          ? 'Welcome! You can now configure your alumni profile at /me.'
          : 'Welcome to YSSE! You can now browse verified contacts and request sessions.'
      );
      closeAuthModal();
    } catch {
      error('Registration Failed', 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (targetRole?: UserRole) => {
    setLoading(true);
    try {
      await loginWithGoogle(targetRole || (mode === 'register' ? regRole : 'member'));
      success('Google Sign In', 'Authenticated successfully with Google.');
      closeAuthModal();
    } catch {
      error('Auth Error', 'Could not complete Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSwitch = async (personaRole: UserRole) => {
    setLoading(true);
    try {
      await loginAs(personaRole);
      success(
        `Switched to ${personaRole.toUpperCase()}`,
        personaRole === 'admin'
          ? 'Leadership portal access enabled'
          : personaRole === 'alumni'
          ? 'Alumni privileges active (manage profile at /me, offer sessions)'
          : personaRole === 'member'
          ? 'Member privileges active (request mentorship sessions)'
          : 'Browsing as public visitor'
      );
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title=""
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Header Tabs: Log In / Register */}
        <div className="flex items-center justify-center p-1 bg-surface-hover/80 rounded-md border border-border">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded transition-colors text-center ${
              mode === 'login'
                ? 'bg-accent text-on-accent font-bold shadow-sm'
                : 'text-muted hover:text-text'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded transition-colors text-center ${
              mode === 'register'
                ? 'bg-accent text-on-accent font-bold shadow-sm'
                : 'text-muted hover:text-text'
            }`}
          >
            Register
          </button>
        </div>

        {/* Modal Intro */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-md bg-surface-active border border-border-strong flex items-center justify-center text-accent font-heading font-black text-xl mx-auto mb-2">
            Y
          </div>
          <h2 className="text-lg font-bold font-heading text-text">
            {mode === 'login' ? 'Log in to YSSE' : 'Create your YSSE Account'}
          </h2>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {mode === 'login'
              ? 'Connect with alumni mentors, verify profiles, and access directory resources.'
              : 'Join the community as a current member or register as an alumnus.'}
          </p>
        </div>

        {/* Continue with Google (Primary modern OAuth button) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleGoogleAuth()}
            disabled={loading}
            className="w-full h-11 px-4 bg-surface text-text hover:bg-surface-hover border border-border-strong rounded-md flex items-center justify-center gap-3 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {/* Google Multi-Color SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
          </button>
        </div>

        {/* Divider OR */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-surface px-3 text-[11px] font-mono uppercase text-muted tracking-wider absolute">
            or manually
          </span>
        </div>

        {/* Manual Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleManualLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-text mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="input-base text-xs pl-9"
                />
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-text">Password</label>
                <button
                  type="button"
                  onClick={() => error('Demo Info', 'In demo mode, any password will authenticate.')}
                  className="text-[11px] text-accent hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-base text-xs pl-9"
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !min-h-[44px] h-[44px] text-xs font-semibold gap-2"
            >
              <span>Log In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-text mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Farhan Ahmed"
                  required
                  className="input-base text-xs pl-9"
                />
                <UserIcon className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="farhan@example.com"
                  required
                  className="input-base text-xs pl-9"
                />
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a password"
                  className="input-base text-xs pl-9"
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">
                Join YSSE as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('member')}
                  className={`p-2.5 rounded-md border text-left flex flex-col justify-between transition-colors ${
                    regRole === 'member'
                      ? 'bg-surface-active border-accent text-text'
                      : 'bg-surface border-border text-muted hover:text-text'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-semibold text-text">YSSE Member</span>
                  </div>
                  <span className="text-[10px] text-muted mt-1 leading-snug">
                    Current intern / student fellow
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('alumni')}
                  className={`p-2.5 rounded-md border text-left flex flex-col justify-between transition-colors ${
                    regRole === 'alumni'
                      ? 'bg-surface-active border-accent text-text'
                      : 'bg-surface border-border text-muted hover:text-text'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-semibold text-text">YSSE Alumni</span>
                  </div>
                  <span className="text-[10px] text-muted mt-1 leading-snug">
                    Graduate / former fellow
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-muted mt-1.5 leading-relaxed">
                {regRole === 'alumni'
                  ? 'Note: Alumni can offer mentorship sessions to YSSE and edit their directory profile.'
                  : 'Note: Members can browse verified contacts and request 1:1 sessions with alumni.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !min-h-[44px] h-[44px] text-xs font-semibold gap-2 mt-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Quick Demo Persona Switcher (For Pair-Programming / Demo Testing) */}
        <div className="p-3 bg-surface-hover/50 border border-border rounded-md space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Instant 1-Click Demo Login</span>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoSwitch('member')}
              className={`p-1.5 rounded border text-[11px] font-medium text-center transition-colors ${
                currentRole === 'member'
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-surface border-border hover:bg-surface-hover text-text'
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => handleDemoSwitch('alumni')}
              className={`p-1.5 rounded border text-[11px] font-medium text-center transition-colors ${
                currentRole === 'alumni'
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-surface border-border hover:bg-surface-hover text-text'
              }`}
            >
              Alumni
            </button>
            <button
              type="button"
              onClick={() => handleDemoSwitch('admin')}
              className={`p-1.5 rounded border text-[11px] font-medium text-center transition-colors ${
                currentRole === 'admin'
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-surface border-border hover:bg-surface-hover text-text'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoSwitch('visitor')}
              className={`p-1.5 rounded border text-[11px] font-medium text-center transition-colors ${
                currentRole === 'visitor'
                  ? 'bg-accent/15 border-accent text-accent'
                  : 'bg-surface border-border hover:bg-surface-hover text-muted'
              }`}
            >
              Visitor
            </button>
          </div>
        </div>

        {/* Footer Toggle */}
        <div className="text-center pt-2 text-xs text-muted">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-accent font-semibold hover:underline ml-1"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-accent font-semibold hover:underline ml-1"
              >
                Log in here
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
