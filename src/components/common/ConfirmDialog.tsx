import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  isDestructive?: boolean;
  isSubmitting?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  isDestructive = false,
  isSubmitting = false,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-surface border border-lines rounded-md p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-md border flex items-center justify-center shrink-0 ${
                isDestructive
                  ? 'bg-destructive/15 border-destructive/30 text-destructive'
                  : 'bg-accent/15 border-accent/30 text-accent'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <Dialog.Title className="text-base font-bold font-heading text-text">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted leading-relaxed">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild disabled={isSubmitting}>
              <button className="text-muted hover:text-text p-1">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-lines">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-md bg-surface text-text border border-lines hover:bg-surface-hover disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors disabled:opacity-50 ${
                isDestructive
                  ? 'bg-destructive text-[#18251D] hover:opacity-90'
                  : 'bg-accent text-[#18251D] hover:opacity-90'
              }`}
            >
              {isSubmitting ? 'Processing...' : confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
