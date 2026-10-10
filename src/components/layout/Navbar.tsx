import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserMenu } from '../shared/UserMenu';
import { Menu, X, Users, Calendar, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-bg/95 backdrop-blur-md border-b border-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md p-1"
            aria-label="YSSE Alumni Directory Home"
          >
            <img
              src="/ysse-logo.png"
              alt="YSSE Logo"
              className="h-9 w-auto max-w-[46px] object-contain bg-white rounded p-0.5 border border-border-strong"
            />
            <div>
              <span className="font-heading font-semibold text-base text-text tracking-tight flex items-center gap-1.5 leading-none">
                YSSE <span className="text-accent font-normal">Alumni</span>
              </span>
              <span className="block font-mono text-[10px] text-muted uppercase tracking-widest mt-0.5">
                Directory & Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <Link
              to="/#about"
              className="px-3.5 py-2 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-surface transition-colors"
            >
              About
            </Link>

            <NavLink
              to="/alumni"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface text-accent border border-border'
                    : 'text-muted hover:text-text hover:bg-surface'
                }`
              }
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Alumni</span>
              </span>
            </NavLink>

            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface text-accent border border-border'
                    : 'text-muted hover:text-text hover:bg-surface'
                }`
              }
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Sessions</span>
              </span>
            </NavLink>
          </nav>

          {/* Right Action: User Menu / Sign In */}
          <div className="hidden md:flex items-center gap-3">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <UserMenu />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-surface border border-border text-text hover:bg-surface-hover"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          <Link
            to="/#about"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-text hover:bg-surface"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>About YSSE</span>
          </Link>
          <NavLink
            to="/alumni"
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-surface text-accent border border-border' : 'text-text hover:bg-surface'
              }`
            }
          >
            <Users className="w-4 h-4 text-accent" />
            <span>Alumni Directory</span>
          </NavLink>
          <NavLink
            to="/sessions"
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-surface text-accent border border-border' : 'text-text hover:bg-surface'
              }`
            }
          >
            <Calendar className="w-4 h-4 text-accent" />
            <span>Mentorship Sessions</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
