import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services/sessionService';
import { alumniService } from '../services/alumniService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AlumniProfile, SessionFormat, SessionRequestStatus } from '../types';
import { Avatar } from '../components/shared/Avatar';
import { StatusBadge } from '../components/shared/StatusBadge';
import { RequestSessionModal } from '../components/profile/RequestSessionModal';
import { EmptyState } from '../components/shared/EmptyState';
import {
  Calendar,
  Clock,
  Briefcase,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Send,
  Inbox,
  Check,
  X,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SessionsPage: React.FC = () => {
  const { user, role, openAuthModal } = useAuth();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'offers' | 'my-requests' | 'to-me'>('offers');
  const [formatFilter, setFormatFilter] = useState<'all' | SessionFormat>('all');
  const [topicSearch, setTopicSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<AlumniProfile | null>(null);

  // Fetch mentorship offers
  const { data: rawOffers = [], isLoading: loadingOffers } = useQuery({
    queryKey: ['sessionOffers'],
    queryFn: () => sessionService.getSessionsOffered(),
  });

  // Fetch my requests
  const { data: myRequests = [], isLoading: loadingMyRequests } = useQuery({
    queryKey: ['mySessionRequests', user?.id],
    queryFn: () => sessionService.getMySessionRequests(user?.id || ''),
    enabled: Boolean(user),
  });

  // Fetch requests to me (if alumni)
  const { data: myAlumniProfile } = useQuery({
    queryKey: ['myAlumniProfile', user?.id],
    queryFn: () => (user ? alumniService.getMyProfile(user.id) : null),
    enabled: Boolean(user && role === 'alumni'),
  });

  const { data: requestsToMe = [], isLoading: loadingRequestsToMe } = useQuery({
    queryKey: ['requestsToMe', myAlumniProfile?.id],
    queryFn: () => (myAlumniProfile ? sessionService.getRequestsToMe(myAlumniProfile.id) : []),
    enabled: Boolean(myAlumniProfile),
  });

  // Mutation to update request status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SessionRequestStatus }) =>
      sessionService.updateStatus(id, status, user?.name || 'User'),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['requestsToMe'] });
      queryClient.invalidateQueries({ queryKey: ['mySessionRequests'] });
      success('Status Updated', `Session request marked as ${updated.status}.`);
    },
    onError: () => {
      error('Action failed', 'Could not update session status.');
    },
  });

  const filteredOffers = rawOffers.filter((m) => {
    const matchFormat = formatFilter === 'all' || m.sessionFormat === formatFilter || m.sessionFormat === 'Both';
    const matchTopic =
      !topicSearch ||
      (m.sessionTopic && m.sessionTopic.toLowerCase().includes(topicSearch.toLowerCase())) ||
      m.role.toLowerCase().includes(topicSearch.toLowerCase()) ||
      m.organization.toLowerCase().includes(topicSearch.toLowerCase());
    return matchFormat && matchTopic;
  });

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-text">
          Mentorship & Office Hours
        </h1>
        <p className="text-sm text-muted mt-1 max-w-2xl leading-relaxed">
          Book 1:1 sessions with verified YSSE alumni for resume critiques, tech interviews,
          startup advice, and graduate school insights.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'offers'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Browse Offers</span>
          <span className="chip bg-surface-hover text-muted text-[10px] ml-1">
            {filteredOffers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my-requests')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'my-requests'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>My Requests</span>
          {user && (
            <span className="chip bg-surface-hover text-muted text-[10px] ml-1">
              {myRequests.length}
            </span>
          )}
        </button>

        {role === 'alumni' && (
          <button
            onClick={() => setActiveTab('to-me')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'to-me'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Requests to Me</span>
            <span className="chip bg-surface-hover text-accent text-[10px] ml-1">
              {requestsToMe.length}
            </span>
          </button>
        )}
      </div>

      {/* Tab 1: Browse Offers */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          {/* Alumni Policy Banner */}
          {role === 'alumni' && (
            <div className="p-4 bg-surface-active/60 border border-accent/30 rounded-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text block">You are browsing as an Alumni</span>
                  <span className="text-muted leading-relaxed">
                    Alumni offer mentorship sessions directly to YSSE members and interns. You cannot request sessions from fellow alumni.
                  </span>
                </div>
              </div>
              <Link
                to="/me"
                className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3 whitespace-nowrap shrink-0"
              >
                Offer Sessions in My Profile →
              </Link>
            </div>
          )}

          {/* Filters: topic search + format select */}
          <div className="bg-surface border border-border rounded-card p-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="Filter by mentorship topic, role, or company..."
                className="input-base text-xs"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value as any)}
                className="input-base text-xs font-medium cursor-pointer"
                aria-label="Filter by session format"
              >
                <option value="all">All Formats</option>
                <option value="Online">Online Video Call</option>
                <option value="Offline">In-Person Meetup</option>
                <option value="Both">Both Online & Offline</option>
              </select>
            </div>
          </div>

          {loadingOffers ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-surface border border-border rounded-card animate-pulse" />
              ))}
            </div>
          ) : filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-surface border border-border hover:border-border-strong rounded-card p-5 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <Avatar src={mentor.photoUrl} name={mentor.name} size="md" className="!rounded-md" />
                      <span className="chip bg-accent/15 text-accent border-accent/25 text-[10px]">
                        {mentor.sessionFormat || 'Online'}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-text">{mentor.name}</h3>
                    <p className="text-xs text-muted">{mentor.role} at {mentor.organization}</p>

                    <div className="mt-3 p-3 bg-surface-hover rounded-md border border-border">
                      <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">
                        Mentorship Topic
                      </span>
                      <p className="text-xs text-text font-medium line-clamp-2">
                        {mentor.sessionTopic || 'General Career & Industry Guidance'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                    <Link to={`/alumni/${mentor.id}`} className="text-xs text-muted hover:text-text">
                      Profile
                    </Link>
                    {role === 'alumni' ? (
                      <span className="text-[11px] font-mono text-muted py-1.5 px-2.5 rounded bg-surface-hover border border-border">
                        Member-Only
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (role === 'visitor') openAuthModal('login');
                          else setSelectedMentor(mentor);
                        }}
                        className="btn-primary !min-h-[38px] h-[38px] text-xs px-3.5 gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Book Session</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Mentorship Offers Match Your Filter"
              description="Try clearing your search query or selecting All Formats."
              actionText="Reset Filters"
              onAction={() => {
                setFormatFilter('all');
                setTopicSearch('');
              }}
            />
          )}
        </div>
      )}

      {/* Tab 2: My Requests */}
      {activeTab === 'my-requests' && (
        <div>
          {!user ? (
            <div className="p-8 bg-surface border border-border rounded-card text-center max-w-md mx-auto space-y-4">
              <Calendar className="w-8 h-8 text-accent mx-auto" />
              <h2 className="text-base font-bold font-heading text-text">
                Sign in to View Your Requests
              </h2>
              <p className="text-xs text-muted">
                Log in as a member or register to view and manage your mentorship booking records.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn-secondary !min-h-[40px] h-[40px] text-xs px-4"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="btn-primary !min-h-[40px] h-[40px] text-xs px-4"
                >
                  Register
                </button>
              </div>
            </div>
          ) : role === 'alumni' ? (
            <div className="p-8 bg-surface border border-border rounded-card text-center max-w-lg mx-auto space-y-4">
              <Info className="w-8 h-8 text-accent mx-auto" />
              <h2 className="text-base font-bold font-heading text-text">
                Alumni Mentorship Policy
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                As a verified YSSE Alumni, your role is to offer mentorship to current YSSE members and interns. Alumni cannot request mentorship sessions from other alumni.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('to-me')}
                  className="btn-primary !min-h-[40px] h-[40px] text-xs px-4"
                >
                  View Requests to Me ({requestsToMe.length})
                </button>
                <Link
                  to="/me"
                  className="btn-secondary !min-h-[40px] h-[40px] text-xs px-4"
                >
                  Manage Session Offerings
                </Link>
              </div>
            </div>
          ) : loadingMyRequests ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-surface border border-border rounded-md animate-pulse" />
              ))}
            </div>
          ) : myRequests.length > 0 ? (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface border border-border rounded-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <Avatar src={req.alumniPhoto} name={req.alumniName || 'Alumnus'} size="md" className="!rounded-md" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-text text-sm">{req.alumniName}</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-accent font-medium flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Topic: {req.topic}</span>
                      </p>
                      <p className="text-xs text-muted mt-1 max-w-xl bg-surface-hover p-2.5 rounded-sm border border-border">
                        "{req.message}"
                      </p>
                      <span className="font-mono text-[10px] text-muted block mt-2">
                        Submitted {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/alumni/${req.alumniId}`}
                    className="btn-secondary !min-h-[38px] h-[38px] text-xs px-3 self-end md:self-center gap-1.5"
                  >
                    <span>View Alumnus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Requests Logged"
              description="You have not requested any mentorship sessions yet."
              actionText="Browse Available Mentors"
              onAction={() => setActiveTab('offers')}
            />
          )}
        </div>
      )}

      {/* Tab 3: Requests to Me (Alumni Only) */}
      {activeTab === 'to-me' && role === 'alumni' && (
        <div>
          {loadingRequestsToMe ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-surface border border-border rounded-md animate-pulse" />
              ))}
            </div>
          ) : requestsToMe.length > 0 ? (
            <div className="space-y-3">
              {requestsToMe.map((req) => (
                <div
                  key={req.id}
                  className="bg-surface border border-border rounded-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text text-sm">{req.requesterName}</span>
                      <span className="text-xs text-muted font-mono">({req.requesterEmail})</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-xs text-accent font-medium">Topic: {req.topic}</p>
                    <p className="text-xs text-muted mt-1 max-w-xl bg-surface-hover p-2.5 rounded-sm border border-border">
                      "{req.message}"
                    </p>
                    <span className="font-mono text-[10px] text-muted block mt-2">
                      Received {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions: Accept / Decline / Mark Done */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'Accepted' })}
                          className="btn-primary !min-h-[38px] h-[38px] text-xs px-3 gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'Declined' })}
                          className="btn-danger !min-h-[38px] h-[38px] text-xs px-3 gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'Done' })}
                        className="btn-secondary !min-h-[38px] h-[38px] text-xs px-3 gap-1 text-status-approved border-status-approved/40"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark as Done</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Pending Mentorship Inquiries"
              description="You have zero incoming requests from members at the moment."
            />
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedMentor && (
        <RequestSessionModal
          isOpen={Boolean(selectedMentor)}
          onClose={() => setSelectedMentor(null)}
          alumnus={selectedMentor}
        />
      )}
    </div>
  );
};
