import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, GraduationCap, ArrowRight } from 'lucide-react';

interface AuthRegisterFormProps {
  onSubmit: (data: { name: string; email: string; password?: string; role: 'member' | 'alumni' }) => Promise<void>;
  loading: boolean;
}

export const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'member' | 'alumni'>('member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit({ name, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-xs font-medium text-text mb-1">Full Name</label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <label className="block text-xs font-medium text-text mb-1">Password</label>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            className="input-base text-xs pl-9"
          />
          <Lock className="w-4 h-4 text-muted absolute left-3 top-3.5" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-text mb-1.5">Join YSSE as:</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`p-2.5 rounded-md border text-left flex flex-col justify-between transition-colors ${
              role === 'member'
                ? 'bg-surface-active border-accent text-text'
                : 'bg-surface border-border text-muted hover:text-text'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-text">YSSE Member</span>
            </div>
            <span className="text-[10px] text-muted mt-1 leading-snug">Current student / fellow</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('alumni')}
            className={`p-2.5 rounded-md border text-left flex flex-col justify-between transition-colors ${
              role === 'alumni'
                ? 'bg-surface-active border-accent text-text'
                : 'bg-surface border-border text-muted hover:text-text'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-text">YSSE Alumni</span>
            </div>
            <span className="text-[10px] text-muted mt-1 leading-snug">Graduate / former fellow</span>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full !min-h-[44px] h-[44px] text-xs font-semibold gap-2 mt-2"
      >
        <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
};
