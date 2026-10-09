import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { Search, Users, LayoutDashboard, UserCheck, CalendarCheck2, FileSpreadsheet, Settings, Clock, ArrowRight } from 'lucide-react';
import { alumniService } from '../../services/alumniService';
import { AlumniProfile } from '../../types';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      alumniService.getFeaturedAlumni().then(setAlumni);
    }
  }, [open]);

  const navCommands = [
    { label: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Pending Approvals', to: '/admin/approvals', icon: UserCheck },
    { label: 'Alumni Master Table', to: '/admin/alumni', icon: Users },
    { label: 'Session Requests', to: '/admin/sessions', icon: CalendarCheck2 },
    { label: 'Import CSV Data', to: '/admin/import', icon: FileSpreadsheet },
    { label: 'Stale Profile Reminders', to: '/admin/stale', icon: Clock },
    { label: 'Activity Logs', to: '/admin/activity', icon: Clock },
    { label: 'Admin Settings', to: '/admin/settings', icon: Settings },
    { label: 'Public Directory', to: '/alumni', icon: Users },
  ];

  const filteredCommands = navCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAlumni = alumni.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.organization.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (to: string) => {
    navigate(to);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-hover border border-border text-xs text-muted hover:text-text hover:border-border-strong transition-colors"
        aria-label="Open command palette"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Quick jump...</span>
        <kbd className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border-strong text-muted">
          ⌘K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl bg-surface border border-border-strong rounded-card shadow-2xl overflow-hidden focus:outline-none">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search admin pages, alumni profiles, or settings..."
                className="w-full bg-transparent text-sm text-text placeholder-muted focus:outline-none"
                autoFocus
              />
              <kbd className="font-mono text-[10px] bg-surface-hover px-1.5 py-0.5 rounded border border-border-strong text-muted">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-3">
              {/* Navigation Group */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1 block">
                  Admin Navigation
                </span>
                <div className="space-y-0.5">
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.to}
                      onClick={() => handleSelect(cmd.to)}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-xs text-left hover:bg-surface-hover hover:text-accent text-text transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <cmd.icon className="w-4 h-4 text-muted" />
                        <span>{cmd.label}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Alumni Search Group */}
              {query && filteredAlumni.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted px-2.5 py-1 block">
                    Alumni Profiles
                  </span>
                  <div className="space-y-0.5">
                    {filteredAlumni.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleSelect(`/alumni/${a.id}`)}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-xs text-left hover:bg-surface-hover hover:text-accent text-text transition-colors"
                      >
                        <div>
                          <span className="font-medium text-text block">{a.name}</span>
                          <span className="text-[11px] text-muted">{a.role} at {a.organization}</span>
                        </div>
                        <span className="chip bg-surface text-muted text-[10px]">{a.batch}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
