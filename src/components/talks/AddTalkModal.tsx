import React, { useState } from 'react';
import { X, Video, Save } from 'lucide-react';
import { talkService } from '../../services/talkService';
import { useToast } from '../../context/ToastContext';

interface AddTalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTalkModal: React.FC<AddTalkModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    topic: '',
    speakerName: '',
    speakerRole: '',
    speakerOrg: '',
    talkDate: new Date().toISOString().split('T')[0],
    recordingUrl: '',
    liveUrl: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.topic || !form.speakerName) {
      error('Missing fields', 'Title, topic, and speaker name are required');
      return;
    }

    setSubmitting(true);
    try {
      await talkService.createTalk({
        ...form,
        talkDate: new Date(form.talkDate).toISOString(),
      });
      success('Talk Published', 'Alumni Talk session has been recorded and published.');
      onSuccess();
      onClose();
    } catch {
      error('Failed to create talk', 'Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-card p-6 w-full max-w-lg space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold font-heading text-text">Add Alumni Talk Session</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-text mb-1">Session Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Navigating Product Management in FinTech"
              className="input-base text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-text mb-1">Topic / Wing *</label>
              <input
                type="text"
                required
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g. Product Strategy"
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text mb-1">Session Date *</label>
              <input
                type="date"
                required
                value={form.talkDate}
                onChange={(e) => setForm({ ...form, talkDate: e.target.value })}
                className="input-base text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-text mb-1">Speaker *</label>
              <input
                type="text"
                required
                value={form.speakerName}
                onChange={(e) => setForm({ ...form, speakerName: e.target.value })}
                placeholder="Speaker Name"
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text mb-1">Role</label>
              <input
                type="text"
                value={form.speakerRole}
                onChange={(e) => setForm({ ...form, speakerRole: e.target.value })}
                placeholder="Lead Designer"
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-text mb-1">Org</label>
              <input
                type="text"
                value={form.speakerOrg}
                onChange={(e) => setForm({ ...form, speakerOrg: e.target.value })}
                placeholder="Google"
                className="input-base text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text mb-1">Recording URL (YouTube, Drive, etc.)</label>
            <input
              type="url"
              value={form.recordingUrl}
              onChange={(e) => setForm({ ...form, recordingUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="input-base text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text mb-1">Description & Overview</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Key takeaways, topics discussed, and audience background..."
              className="input-base text-xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary !min-h-[34px] h-[34px] text-xs px-3">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary !min-h-[34px] h-[34px] text-xs px-4 gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Publishing...' : 'Publish Talk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
