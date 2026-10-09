import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../shared/Modal';
import { AlumniProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sessionService } from '../../services/sessionService';
import { Sparkles, Send, Calendar } from 'lucide-react';

const sessionSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters long').max(100),
  message: z.string().min(20, 'Please provide context in at least 20 characters').max(600),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface RequestSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumnus: AlumniProfile;
}

export const RequestSessionModal: React.FC<RequestSessionModalProps> = ({
  isOpen,
  onClose,
  alumnus,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      topic: alumnus.sessionTopic || '1:1 Career & Industry Mentorship',
      message: '',
    },
  });

  const onSubmit = async (data: SessionFormData) => {
    if (!user) {
      error('Authentication required', 'Please sign in to request a session');
      return;
    }

    try {
      setSubmitting(true);
      await sessionService.requestSession({
        alumniId: alumnus.id,
        requesterId: user.id,
        requesterName: user.name,
        requesterEmail: user.email || 'member@ysse.org',
        topic: data.topic,
        message: data.message,
      });

      success(
        'Session Request Submitted!',
        `Your request has been routed to ${alumnus.name}. You can track status in Sessions.`
      );
      reset();
      onClose();
    } catch (err) {
      error('Failed to submit request', 'Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Mentorship with ${alumnus.name}`}
      description={`Book a 1:1 conversation (${alumnus.sessionFormat || 'Online'}). Alumni volunteer their time to guide the YSSE community.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {alumnus.sessionTopic && (
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-xs text-text-secondary flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-accent block">Preferred Topic:</span>
              <span>{alumnus.sessionTopic}</span>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="session-topic" className="block text-xs font-semibold text-text mb-1">
            Session Topic / Objective <span className="text-accent">*</span>
          </label>
          <input
            id="session-topic"
            type="text"
            {...register('topic')}
            placeholder="e.g. Resume teardown, Tech interview prep, Venture pitch advice"
            className="w-full px-3.5 py-2.5 bg-surface-elevated text-text border border-border rounded-xl text-sm focus:border-accent"
          />
          {errors.topic && (
            <p className="text-xs text-rose-400 mt-1">{errors.topic.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="session-message" className="block text-xs font-semibold text-text mb-1">
            Brief Context & Questions <span className="text-accent">*</span>
          </label>
          <textarea
            id="session-message"
            rows={4}
            {...register('message')}
            placeholder="Introduce yourself, mention your goals, and share 2-3 specific questions you'd like to discuss..."
            className="w-full px-3.5 py-2.5 bg-surface-elevated text-text border border-border rounded-xl text-sm focus:border-accent resize-none"
          />
          {errors.message && (
            <p className="text-xs text-rose-400 mt-1">{errors.message.message}</p>
          )}
        </div>

        <div className="p-3 bg-surface-elevated border border-border rounded-xl text-xs text-text-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <span>Format: <strong className="text-text">{alumnus.sessionFormat || 'Online Video Call'}</strong></span>
          </div>
          <span>Status: <strong>Pending Approval</strong></span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary !min-h-[44px] h-[44px] text-xs px-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary !min-h-[44px] h-[44px] text-xs px-6 gap-2"
          >
            {submitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
