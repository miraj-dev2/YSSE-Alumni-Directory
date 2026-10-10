import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface AuthLoginFormProps {
  onSubmit: (email: string, pass: string) => Promise<void>;
  loading: boolean;
}

export const AuthLoginForm: React.FC<AuthLoginFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-xs font-medium text-text mb-1">Email Address</label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        </div>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
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
        <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};
