import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { AlumniProfile } from '../../types/admin';

const alumniSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  batch: z.string().min(1, 'Batch is required'),
  wing: z.string().min(1, 'Wing is required'),
  currentRole: z.string().min(2, 'Role is required'),
  organization: z.string().min(2, 'Organization is required'),
  location: z.string().min(2, 'Location is required'),
  linkedinUrl: z.string().url('Valid URL required').or(z.literal('')),
  isContactPublic: z.boolean(),
  openToSessions: z.boolean(),
});

type FormValues = z.infer<typeof alumniSchema>;

interface AlumniFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialData?: AlumniProfile | null;
  isSubmitting?: boolean;
}

export const AlumniFormModal: React.FC<AlumniFormModalProps> = ({
  isOpen, onClose, onSubmit, initialData, isSubmitting = false,
}) => {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(alumniSchema),
    defaultValues: {
      name: '', email: '', batch: 'Batch 8', wing: 'YSSE IT', currentRole: '',
      organization: '', location: 'Dhaka, Bangladesh', linkedinUrl: '', isContactPublic: true, openToSessions: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name, email: initialData.email, batch: initialData.batch, wing: initialData.wing,
        currentRole: initialData.currentRole, organization: initialData.organization,
        location: initialData.location, linkedinUrl: initialData.linkedinUrl || '',
        isContactPublic: initialData.isContactPublic, openToSessions: !!initialData.openToSessions,
      });
    } else {
      reset({
        name: '', email: '', batch: 'Batch 8', wing: 'YSSE IT', currentRole: '',
        organization: '', location: 'Dhaka, Bangladesh', linkedinUrl: '', isContactPublic: true, openToSessions: true,
      });
    }
  }, [initialData, reset, isOpen]);

  const handleAttemptClose = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Discard them?')) return;
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleAttemptClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#1F3027] border border-[#2E4336] rounded-md p-6 shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E4336]">
            <Dialog.Title className="text-base font-bold font-heading text-[#EEF3E8]">
              {initialData ? 'Edit Alumni Profile' : 'Add New Alumnus'}
            </Dialog.Title>
            <button type="button" onClick={handleAttemptClose} className="text-[#9DB0A2] hover:text-[#EEF3E8] p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Full Name *</label>
                <input {...register('name')} className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
                {errors.name && <p className="text-[11px] text-[#E8A598] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Email *</label>
                <input {...register('email')} type="email" className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
                {errors.email && <p className="text-[11px] text-[#E8A598] mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Batch *</label>
                <input {...register('batch')} placeholder="Batch 8" className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Wing *</label>
                <input {...register('wing')} placeholder="YSSE IT" className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Role *</label>
                <input {...register('currentRole')} placeholder="Product Lead" className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Organization *</label>
                <input {...register('organization')} placeholder="bKash" className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">Location *</label>
                <input {...register('location')} className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DB0A2] mb-1">LinkedIn URL</label>
                <input {...register('linkedinUrl')} placeholder="https://linkedin.com/in/..." className="w-full bg-[#18251D] border border-[#2E4336] rounded px-3 py-2 text-xs text-[#EEF3E8] min-h-[44px]" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#9DB0A2]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isContactPublic')} className="rounded bg-[#18251D] border-[#2E4336] text-[#B7FF72] h-4 w-4" />
                <span>Public contact</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('openToSessions')} className="rounded bg-[#18251D] border-[#2E4336] text-[#B7FF72] h-4 w-4" />
                <span>Open to mentorship</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2E4336]">
              <button type="button" onClick={handleAttemptClose} className="min-h-[44px] px-4 text-xs font-semibold rounded bg-[#1F3027] text-[#EEF3E8] border border-[#2E4336]">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="min-h-[44px] px-5 text-xs font-semibold rounded bg-[#B7FF72] text-[#18251D] hover:opacity-90 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : initialData ? 'Update Profile' : 'Save Alumnus'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
