import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, ArrowUpRight } from 'lucide-react';

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface/90 border-t border-border mt-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/ysse-logo.png"
                alt="YSSE Logo"
                className="h-10 w-auto max-w-[50px] object-contain bg-white rounded p-1 border border-border-strong"
              />
              <div>
                <span className="font-heading font-bold text-lg text-text block leading-tight">
                  YSSE Alumni Directory
                </span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                  Global Alumni Network
                </span>
              </div>
            </div>
            <p className="text-xs text-muted max-w-md leading-relaxed">
              Youth School for Social Entrepreneurs empowers changemakers, fosters grassroots
              initiatives, and connects alumni across the globe to mentor future leaders.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted pt-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-accent fill-accent inline" />
              <span>for the YSSE Global Community</span>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text text-xs uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-muted">
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
                  Alumni Enrollment
                </Link>
              </li>
              <li>
                <a href="https://ysseglobal.org/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  About YSSE Global
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-text text-xs uppercase tracking-wider mb-3">
              Connect With YSSE
            </h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li>
                <a
                  href="https://ysseglobal.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors inline-flex items-center gap-2 group"
                >
                  <Globe className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-text group-hover:text-accent transition-colors">YSSE Main Portal</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ysseglobal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors inline-flex items-center gap-2 group"
                >
                  <LinkedinIcon className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-text group-hover:text-accent transition-colors">YSSE on LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li className="pt-2 border-t border-border">
                <span className="block text-[11px] font-mono uppercase text-muted mb-0.5">Secretariat Inquiries</span>
                <a href="mailto:alumni@ysseglobal.org" className="text-text hover:text-accent font-mono text-[11px]">
                  alumni@ysseglobal.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {new Date().getFullYear()} Youth School for Social Entrepreneurs (YSSE). All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="https://ysseglobal.org/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              ysseglobal.org
            </a>
            <span>•</span>
            <span className="chip bg-surface text-accent border-border text-[10px]">Alumni Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
