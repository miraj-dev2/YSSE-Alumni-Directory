import React from 'react';
import { Link } from 'react-router-dom';

export const LandingGuideSection: React.FC = () => {
  return (
    <section id="about" className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-surface border border-border rounded-card p-8 sm:p-10">
        <div>
          <div className="max-w-xl mb-6">
            <span className="chip bg-surface-hover text-accent border-border-strong text-xs mb-2">
              Alumni Registration Guide
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-text">
              Three steps to join the verified network
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Maintain connections with peers and mentor upcoming cohorts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border rounded-md p-5 bg-surface-hover/30">
              <span className="w-7 h-7 rounded-full bg-surface border border-border-strong flex items-center justify-center text-xs font-mono font-semibold text-accent mb-4">
                1
              </span>
              <h3 className="text-sm font-semibold text-text mb-1">Create Your Profile</h3>
              <p className="text-xs text-muted leading-relaxed">
                Provide your YSSE graduation batch, wing role, current organization, career milestones, and bio.
              </p>
            </div>

            <div className="border border-border rounded-md p-5 bg-surface-hover/30">
              <span className="w-7 h-7 rounded-full bg-surface border border-border-strong flex items-center justify-center text-xs font-mono font-semibold text-accent mb-4">
                2
              </span>
              <h3 className="text-sm font-semibold text-text mb-1">Secretariat Verification</h3>
              <p className="text-xs text-muted leading-relaxed">
                The YSSE leadership team reviews cohort records to confirm alumni credentials and maintain directory integrity.
              </p>
            </div>

            <div className="border border-border rounded-md p-5 bg-surface-hover/30">
              <span className="w-7 h-7 rounded-full bg-surface border border-border-strong flex items-center justify-center text-xs font-mono font-semibold text-accent mb-4">
                3
              </span>
              <h3 className="text-sm font-semibold text-text mb-1">Mentor & Connect</h3>
              <p className="text-xs text-muted leading-relaxed">
                Once approved, choose whether to host 1:1 sessions, receive connection requests, or join exclusive alumni meetups.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted">Ready to claim your directory listing?</span>
            <Link to="/me" className="btn-primary !min-h-[42px] h-[42px] text-xs px-6">
              Register or Update Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
