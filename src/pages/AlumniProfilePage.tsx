import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { alumniService } from '../services/alumniService';
import { useAuth } from '../context/AuthContext';
import { useCan } from '../hooks/useCan';
import { AlumniProfile } from '../types';
import { Avatar } from '../components/shared/Avatar';
import { Timeline } from '../components/shared/Timeline';
import { AlumniCard } from '../components/shared/AlumniCard';
import { RequestSessionModal } from '../components/profile/RequestSessionModal';
import { AlumniStoryCard } from '../components/profile/AlumniStoryCard';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Mail,
  Sparkles,
  Lock,
  Calendar,
  Share2,
  Clock,
  Shield,
  Info,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const AlumniProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role, openAuthModal } = useAuth();
  const canViewPrivateContact = useCan('view_contact_private');
  const canViewFullContact = useCan('view_contact_full');
  const { success } = useToast();
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const { data: alumnus, isLoading, error } = useQuery({
    queryKey: ['alumni', id],
    queryFn: () => alumniService.getAlumniById(id || ''),
    enabled: Boolean(id),
  });

  const { data: similarAlumni = [] } = useQuery({
    queryKey: ['similarAlumni', id, alumnus?.wing, alumnus?.batch],
    queryFn: () => alumniService.getSimilarAlumni(id || '', alumnus?.wing || '', alumnus?.batch || ''),
    enabled: Boolean(alumnus),
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Profile Link Copied', 'Sharable URL copied to clipboard.');
  };

  if (isLoading) {
    return (
      <div className="max-w-content mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-surface rounded-md" />
        <div className="h-64 bg-surface rounded-card border border-border" />
      </div>
    );
  }

  if (error || !alumnus) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold font-heading text-text mb-2">Alumnus Not Found</h2>
        <p className="text-sm text-muted mb-6">
          The requested profile may have been unlisted or moved.
        </p>
        <Link to="/alumni" className="btn-primary">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb Navigation & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/alumni"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border-strong text-xs text-muted hover:text-text hover:bg-surface-hover transition-colors"
          title="Copy profile link"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-surface border border-border rounded-card p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
          {/* 4:5 Portrait Photo */}
          <div className="w-28 h-36 sm:w-36 sm:h-44 rounded-md overflow-hidden bg-surface-hover border border-border-strong shrink-0">
            {alumnus.photoUrl ? (
              <img
                src={alumnus.photoUrl}
                alt={alumnus.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar name={alumnus.name} size="2xl" className="!rounded-md" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Meta Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="chip bg-surface-hover text-accent border-border-strong text-xs">
                {alumnus.batch}
              </span>
              <span className="chip bg-surface-hover text-text border-border text-xs">
                {alumnus.wing}
              </span>
              {(alumnus.city || alumnus.country) && (
                <span className="chip bg-surface-hover text-muted border-border text-xs">
                  <MapPin className="w-3 h-3 text-muted" />
                  <span>{[alumnus.city, alumnus.country].filter(Boolean).join(', ')}</span>
                </span>
              )}
            </div>

            {/* Name, Role & Organization */}
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
              {alumnus.name}
            </h1>
            <p className="text-base text-muted mt-0.5">
              {alumnus.role} at <strong className="text-text font-semibold">{alumnus.organization}</strong>
            </p>

            <div className="flex items-center gap-3 text-xs text-muted font-mono mt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-muted/70" />
                <span>Last updated {alumnus.updatedAt}</span>
              </span>
            </div>

            {/* Request Session CTA */}
            {alumnus.openToSessions && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {role === 'alumni' ? (
                  <span className="chip bg-surface-hover text-muted border-border text-xs py-1 px-3">
                    Mentorship offered to YSSE members
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (role === 'visitor') {
                        openAuthModal('login');
                      } else {
                        setIsSessionModalOpen(true);
                      }
                    }}
                    className="btn-primary gap-2 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Request a Mentorship Session</span>
                  </button>
                )}
                <span className="text-xs text-muted">
                  Format: <strong className="text-text">{alumnus.sessionFormat || 'Online'}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Bio & Timeline (Left 2 cols) vs Contact & Sessions (Right 1 col) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Biography */}
          <div className="bg-surface border border-border rounded-card p-6">
            <h2 className="text-base font-bold font-heading text-text mb-3">
              About & Background
            </h2>
            <p className="text-sm text-text leading-relaxed whitespace-pre-line font-normal">
              {alumnus.bio}
            </p>

            {/* Expertise Tags */}
            {alumnus.expertise && alumnus.expertise.length > 0 && (
              <div className="mt-6 pt-5 border-t border-border">
                <span className="text-xs font-mono uppercase text-muted tracking-wider block mb-2.5">
                  Core Expertise
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {alumnus.expertise.map((tag) => (
                    <span key={tag} className="chip bg-surface-hover text-text border-border text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Success Story & Journey Reflection */}
          {alumnus.story && (
            <AlumniStoryCard story={alumnus.story} name={alumnus.name} />
          )}

          {/* Career Timeline */}
          <div className="bg-surface border border-border rounded-card p-6">
            <h2 className="text-base font-bold font-heading text-text mb-4">
              Career Trajectory
            </h2>
            <Timeline entries={alumnus.career} />
          </div>
        </div>

        {/* Right Column: Contact & Mentorship details */}
        <div className="space-y-6">
          {/* Contact Block following permission matrix */}
          <div className="bg-surface border border-border rounded-card p-6">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-4">
              Verified Contact
            </h2>

            {role === 'visitor' ? (
              <div className="p-4 bg-surface-hover/50 border border-dashed border-border-strong rounded-md text-center space-y-3">
                <Lock className="w-4 h-4 text-accent mx-auto" />
                <p className="text-xs text-muted leading-relaxed">
                  Email and direct links are protected. Sign in with your YSSE account to view.
                </p>
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn-primary !min-h-[38px] h-[38px] text-xs w-full"
                >
                  Log in or register to view
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Email Block */}
                <div>
                  <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  {alumnus.isEmailPublic || canViewFullContact ? (
                    <a
                      href={`mailto:${alumnus.email}`}
                      className="inline-flex items-center gap-2 text-xs text-accent hover:underline break-all"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>{alumnus.email}</span>
                      {canViewFullContact && !alumnus.isEmailPublic && (
                        <span className="chip bg-surface-hover text-muted text-[9px]">Admin view</span>
                      )}
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Lock className="w-3 h-3 text-muted/70" />
                      <span>Private (hidden by member)</span>
                    </div>
                  )}
                </div>

                {/* LinkedIn Block */}
                <div className="pt-3 border-t border-border">
                  <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
                    LinkedIn Profile
                  </span>
                  {alumnus.isLinkedinPublic || canViewFullContact ? (
                    alumnus.linkedinUrl ? (
                      <a
                        href={alumnus.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-accent hover:underline break-all"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>View LinkedIn Profile</span>
                        {canViewFullContact && !alumnus.isLinkedinPublic && (
                          <span className="chip bg-surface-hover text-muted text-[9px]">Admin view</span>
                        )}
                      </a>
                    ) : (
                      <span className="text-xs text-muted">No LinkedIn provided</span>
                    )
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Lock className="w-3 h-3 text-muted/70" />
                      <span>Private (hidden by member)</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mentorship Offer Teaser Card */}
          {alumnus.openToSessions && (
            <div className="bg-surface border border-border rounded-card p-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Mentorship Offering</span>
              </div>
              <h3 className="text-sm font-semibold text-text mb-1">
                {alumnus.sessionTopic || '1:1 Career Advising'}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Format: <strong className="text-text">{alumnus.sessionFormat || 'Online'}</strong>.
                Submit a session request with your topic and specific questions.
              </p>
              {role === 'alumni' ? (
                <div className="mt-4 p-3 rounded-md bg-surface-hover/70 border border-border text-xs text-muted flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-text block mb-0.5">Alumni Policy</span>
                    Alumni offer mentorship directly to YSSE members. Alumni cannot request sessions from another alumni.
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (role === 'visitor') openAuthModal('login');
                    else setIsSessionModalOpen(true);
                  }}
                  className="btn-primary !min-h-[38px] h-[38px] text-xs w-full mt-4"
                >
                  Request Session
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Similar Alumni Row */}
      {similarAlumni.length > 0 && (
        <div className="pt-8 border-t border-border">
          <h2 className="text-base font-bold font-heading text-text mb-4">
            Similar Alumni ({alumnus.wing} & {alumnus.batch})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarAlumni.map((sim: AlumniProfile) => (
              <AlumniCard key={sim.id} alumni={sim} />
            ))}
          </div>
        </div>
      )}

      {/* Request Session Modal */}
      <RequestSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        alumnus={alumnus}
      />
    </div>
  );
};
