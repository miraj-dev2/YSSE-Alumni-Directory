import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertCircle } from 'lucide-react';

interface ReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title: string;
  description: string;
  isSubmitting?: boolean;
}

export const ReasonDialog: React.FC<ReasonDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  isSubmitting = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a specific rejection reason.');
      return;
    }
    onSubmit(reason.trim());
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#1F3027] border border-[#2E4336] rounded-md p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-base font-bold font-heading text-[#EEF3E8]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-[#9DB0A2] mt-1">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild disabled={isSubmitting}>
              <button
                type="button"
                className="text-[#9DB0A2] hover:text-[#EEF3E8] p-1.5 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="rejection-reason" className="block text-xs font-mono uppercase tracking-wider text-[#9DB0A2] mb-1.5">
                Rejection Reason <span className="text-[#E8A598]">*</span>
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                disabled={isSubmitting}
                placeholder="e.g., Records do not match official YSSE secretariat batch records."
                className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] placeholder-[#9DB0A2]/50 focus:border-[#B7FF72] focus:outline-none resize-none"
              />
              {error && (
                <div className="flex items-center gap-1.5 mt-1 text-[#E8A598] text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2E4336]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#1F3027] text-[#EEF3E8] border border-[#2E4336] hover:bg-[#2E4336]/40 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reason.trim()}
                className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#E8A598] text-[#18251D] hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
