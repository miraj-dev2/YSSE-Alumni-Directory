import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/shared/Avatar';
import { LogOut, Save, Shield, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const { user, role, logout, updateUserAccount } = useAuth();
  const { success, error } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>(user?.interests || ['Tech & Innovation', 'Social Business']);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
      }
      setInterestInput('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserAccount({ name, interests });
      success('Account Updated', 'Your profile account settings have been saved.');
    } catch {
      error('Failed to update', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">Account Settings</h1>
        <p className="text-xs text-muted mt-1">Manage personal credentials, interests, and session preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface border border-border rounded-card p-6 text-center space-y-4 h-fit">
          <Avatar src={user.avatarUrl} name={user.name} size="2xl" className="mx-auto !rounded-md" />
          <div>
            <h2 className="text-base font-semibold text-text">{user.name}</h2>
            <p className="text-xs text-muted font-mono">{user.email}</p>
            <div className="mt-2">
              <span className="chip bg-surface-hover text-accent border-border-strong text-xs">Role: {role.toUpperCase()}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            {role === 'alumni' && (
              <Link to="/me" className="btn-secondary w-full !min-h-[38px] h-[38px] text-xs gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-accent" />
                <span>Go to Alumni Profile (/me)</span>
              </Link>
            )}
            {role === 'member' && (
              <Link to="/me" className="btn-primary w-full !min-h-[38px] h-[38px] text-xs gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-on-accent" />
                <span>Create Alumni Profile</span>
              </Link>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="btn-secondary w-full !min-h-[38px] h-[38px] text-xs gap-1.5 text-status-pending border-status-pending/40">
                <Shield className="w-3.5 h-3.5" />
                <span>Open Admin Portal</span>
              </Link>
            )}
            <button onClick={logout} className="btn-danger w-full !min-h-[38px] h-[38px] text-xs gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold font-heading text-text">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-base" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Email Address</label>
                <input type="email" value={user.email} disabled className="input-base opacity-60 cursor-not-allowed bg-surface-hover" />
                <span className="text-[11px] text-muted mt-1 block">Managed via OAuth / secure credentials.</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">Interests & Domains (Press Enter)</label>
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleAddInterest}
                  placeholder="e.g. Climate Tech, Microfinance..."
                  className="input-base"
                />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {interests.map((item) => (
                    <span key={item} className="chip bg-surface-hover text-text border-border text-xs">
                      {item}
                      <button type="button" onClick={() => setInterests(interests.filter((i) => i !== item))} className="ml-1 text-muted hover:text-text">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-border flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary gap-2 text-xs px-6">
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

