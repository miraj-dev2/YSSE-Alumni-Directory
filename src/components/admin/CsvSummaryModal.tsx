import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface CsvSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  importedCount: number;
  skippedCount: number;
}

export const CsvSummaryModal: React.FC<CsvSummaryModalProps> = ({
  isOpen,
  onClose,
  importedCount,
  skippedCount,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#1F3027] border border-[#2E4336] rounded-md p-6 shadow-2xl focus:outline-none">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#B7FF72]/15 border border-[#B7FF72]/30 text-[#B7FF72] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <Dialog.Title className="text-lg font-bold font-heading text-[#EEF3E8]">
              Import Completed
            </Dialog.Title>

            <Dialog.Description className="text-xs text-[#9DB0A2]">
              The roster file has been processed into the in-memory demo directory.
            </Dialog.Description>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#2E4336] my-4">
              <div className="bg-[#18251D] p-3 rounded border border-[#2E4336]">
                <p className="text-[10px] font-mono uppercase text-[#9DB0A2]">Imported</p>
                <p className="text-2xl font-bold font-heading text-[#B7FF72]">{importedCount}</p>
              </div>
              <div className="bg-[#18251D] p-3 rounded border border-[#2E4336]">
                <p className="text-[10px] font-mono uppercase text-[#9DB0A2]">Skipped</p>
                <p className="text-2xl font-bold font-heading text-[#E8A598]">{skippedCount}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#1F3027] text-[#EEF3E8] border border-[#2E4336]"
              >
                Close
              </button>
              <Link
                to="/admin/alumni"
                className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#B7FF72] text-[#18251D] flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <span>View in Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
