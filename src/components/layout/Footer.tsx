import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface/70 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent font-heading font-black">
                Y
              </div>
              <span className="font-heading font-bold text-lg text-text">
                YSSE Alumni Directory
              </span>
            </div>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              Youth School for Social Entrepreneurs (YSSE) empowers changemakers,
              fosters grassroots entrepreneurship, and connects alumni across the globe
              to mentor the next generation of social innovators.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
              <span>for the YSSE Global Community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-text text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>
                <Link to="/alumni" className="hover:text-accent transition-colors">
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/sessions" className="hover:text-accent transition-colors">
                  Mentorship Sessions
                </Link>
              </li>
              <li>
                <Link to="/me" className="hover:text-accent transition-colors">
                  Member Profile
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-accent transition-colors text-amber-300/80">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading font-semibold text-text text-sm uppercase tracking-wider mb-4">
              Connect With YSSE
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>
                <a
                  href="https://ysse.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4 text-accent" />
                  <span>Official Website</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors inline-flex items-center gap-1.5"
                >
                  <span>LinkedIn Community</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <span className="block text-xs text-text-muted/80 mt-2">
                  Inquiries: alumni@ysse.org
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Youth School for Social Entrepreneurs (YSSE). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="chip-mono bg-surface-elevated text-text-muted">Dark Mode Token Theme</span>
            <span className="chip-mono bg-accent/15 text-accent border border-accent/20">Demo Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
