import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

const widthClasses = {
  md: 'max-w-md',
  lg: 'max-w-xl',
  xl: 'max-w-2xl',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'lg',
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity" />
        <Dialog.Content
          className={`fixed inset-y-0 right-0 z-50 w-full ${widthClasses[width]} bg-surface border-l border-border-strong p-6 overflow-y-auto shadow-2xl focus:outline-none flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
              <div>
                <Dialog.Title className="text-lg font-bold font-heading text-text">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="text-xs text-muted mt-0.5">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  className="p-1 rounded-sm text-muted hover:text-text hover:bg-surface-hover"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div>{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
