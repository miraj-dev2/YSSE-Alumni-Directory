import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { alumniService } from '../services/alumniService';
import { AlumniProfile, CareerEntry, SessionFormat } from '../types';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Avatar } from '../components/shared/Avatar';
import {
  Upload,
  User,
  Save,
  Camera,
  Globe,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  batch: z.string().min(1, 'Please select your batch cohort'),
  wing: z.string().min(1, 'Please select your YSSE wing'),
  role: z.string().min(2, 'Current role is required'),
  organization: z.string().min(2, 'Organization is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  bio: z.string().min(10, 'Please write a short bio (at least 10 characters)').max(600),
  story: z.string().max(3000, 'Story cannot exceed 3,000 characters').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').or(z.literal('')),
  isEmailPublic: z.boolean(),
  isLinkedinPublic: z.boolean(),
  openToSessions: z.boolean(),
  sessionTopic: z.string().optional(),
  sessionFormat: z.enum(['Online', 'Offline', 'Both']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const MyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [careerList, setCareerList] = useState<CareerEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      batch: 'Batch 2024',
      wing: 'Tech & Innovation',
      role: '',
      organization: '',
      city: 'Dhaka',
      country: 'Bangladesh',
      bio: '',
      story: '',
      linkedinUrl: '',
      isEmailPublic: true,
      isLinkedinPublic: true,
      openToSessions: true,
      sessionTopic: '',
      sessionFormat: 'Online',
    },
  });

  const openToSessionsWatch = watch('openToSessions');
  const watchedValues = watch();

  // Completeness Meter computation
  const completeness = React.useMemo(() => {
    let score = 0;
    if (watchedValues.name) score += 10;
    if (watchedValues.role) score += 10;
    if (watchedValues.organization) score += 10;
    if (watchedValues.batch) score += 10;
    if (watchedValues.wing) score += 10;
    if (watchedValues.city && watchedValues.country) score += 10;
    if (watchedValues.bio && watchedValues.bio.length > 20) score += 15;
    if (watchedValues.linkedinUrl) score += 10;
    if (photoPreview) score += 10;
    if (expertise.length > 0) score += 5;
    return Math.min(score, 100);
  }, [watchedValues, photoPreview, expertise]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (!user) return;
        const found = await alumniService.getMyProfile(user.id);
        if (found) {
          setProfile(found);
          setPhotoPreview(found.photoUrl);
          setExpertise(found.expertise || []);
          setCareerList(found.career || []);
          reset({
            name: found.name,
            batch: found.batch,
            wing: found.wing,
            role: found.role,
            organization: found.organization,
            city: found.city,
            country: found.country,
            bio: found.bio,
            story: found.story || '',
            linkedinUrl: found.linkedinUrl || '',
            isEmailPublic: found.isEmailPublic,
            isLinkedinPublic: found.isLinkedinPublic,
            openToSessions: found.openToSessions,
            sessionTopic: found.sessionTopic || '',
            sessionFormat: found.sessionFormat || 'Online',
          });
        }
      } catch (err) {
        // error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, reset]);

  // Client-side image resize and crop to ~400px using HTML Canvas
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Invalid file', 'Please select an image file (JPEG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetSize = 400;
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Crop centered square
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);

        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setPhotoPreview(resizedDataUrl);
        success('Photo processed', 'Profile photo cropped to 400x400px.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!expertise.includes(tagInput.trim())) {
        setExpertise([...expertise, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setExpertise(expertise.filter((t) => t !== tag));
  };

  const handleAddCareer = () => {
    const newEntry: CareerEntry = {
      id: `career-${Date.now()}`,
      role: '',
      organization: '',
      startYear: new Date().getFullYear().toString(),
      current: true,
    };
    setCareerList([newEntry, ...careerList]);
  };

  const handleUpdateCareer = (idx: number, field: keyof CareerEntry, value: any) => {
    const updated = [...careerList];
    updated[idx] = { ...updated[idx], [field]: value };
    setCareerList(updated);
  };

  const handleRemoveCareer = (idx: number) => {
    setCareerList(careerList.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setSaving(true);
    try {
      if (profile) {
        const updated = await alumniService.updateProfile(profile.id, {
          ...data,
          photoUrl: photoPreview,
          expertise,
          career: careerList,
          sessionFormat: data.sessionFormat as SessionFormat,
        });
        setProfile(updated);
        success(
          'Profile Saved',
          updated.approvalStatus === 'Pending'
            ? 'Changes saved. Sensitive updates re-entered Secretariat pending queue.'
            : 'Your alumni profile details were updated successfully.'
        );
      } else {
        const created = await alumniService.createProfile({
          userId: user.id,
          ...data,
          email: user.email,
          photoUrl: photoPreview,
          expertise,
          career: careerList,
          sessionFormat: data.sessionFormat as SessionFormat,
        });
        setProfile(created);
        success('Profile Created', 'Your alumni profile has been submitted for Secretariat review.');
      }
    } catch {
      error('Failed to save profile', 'Please check fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-content mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-36 bg-surface rounded-md" />
        <div className="h-96 bg-surface rounded-card border border-border" />
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header with Approval Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            My Alumni Profile
          </h1>
          <p className="text-xs text-muted mt-1">
            Maintain your verified directory credentials, career timeline, and 1:1 mentorship settings.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface border border-border rounded-md px-4 py-2.5">
          <span className="text-xs text-muted">Status:</span>
          <StatusBadge status={profile?.approvalStatus || 'Pending'} size="md" />
        </div>
      </div>

      {/* Rejection notice if profile was rejected */}
      {profile?.approvalStatus === 'Rejected' && (
        <div className="p-4 bg-status-rejected-bg border border-status-rejected/40 rounded-card flex items-start gap-3 text-status-rejected">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-sm">Profile Verification Rejected</p>
            <p className="text-muted leading-relaxed">
              Reason provided by Secretariat: <strong className="text-status-rejected">{profile.rejectionReason || 'Affiliation could not be verified'}</strong>.
              Please update your information and re-save to request another review.
            </p>
          </div>
        </div>
      )}

      {/* Sensitive fields notice */}
      <div className="p-3.5 bg-surface-hover/60 border border-border rounded-card flex items-center gap-2.5 text-xs text-muted">
        <Info className="w-4 h-4 text-accent shrink-0" />
        <span>
          Policy note: Editing sensitive fields (current role, organization, or wing) on an approved profile re-enters the Pending queue for Secretariat verification.
        </span>
      </div>

      {/* Completeness Meter */}
      <div className="bg-surface border border-border rounded-card p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text">Profile Completeness</span>
          <span className="font-mono text-accent">{completeness}%</span>
        </div>
        <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Photo Upload with 4:5 preview and canvas resize */}
        <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold font-heading text-text">
            Profile Portrait Photo
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-36 rounded-md overflow-hidden bg-surface-hover border border-border-strong shrink-0 group">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar name={user?.name || 'YS'} size="2xl" className="!rounded-md" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Upload photo"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-mono">Upload</span>
              </button>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                id="photo-file-input"
              />
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary !min-h-[38px] h-[38px] text-xs px-3.5 gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                </button>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(undefined)}
                    className="text-xs text-status-rejected hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Photos are automatically cropped to 400x400px on your browser before upload.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold font-heading text-text">
            General Directory Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-name" className="block text-xs font-semibold text-text mb-1">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                id="input-name"
                type="text"
                {...register('name')}
                className="input-base"
              />
              {errors.name && <p className="text-xs text-status-rejected mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="input-batch" className="block text-xs font-semibold text-text mb-1">
                YSSE Batch Cohort <span className="text-accent">*</span>
              </label>
              <select
                id="input-batch"
                {...register('batch')}
                className="input-base cursor-pointer"
              >
                <option value="Batch 2024">Batch 2024</option>
                <option value="Batch 2023">Batch 2023</option>
                <option value="Batch 2022">Batch 2022</option>
                <option value="Batch 2021">Batch 2021</option>
                <option value="Batch 2020">Batch 2020</option>
                <option value="Batch 2019">Batch 2019</option>
                <option value="Batch 2018">Batch 2018</option>
              </select>
            </div>

            <div>
              <label htmlFor="input-wing" className="block text-xs font-semibold text-text mb-1">
                YSSE Wing Role <span className="text-accent">*</span>
              </label>
              <select
                id="input-wing"
                {...register('wing')}
                className="input-base cursor-pointer"
              >
                <option value="Tech & Innovation">Tech & Innovation</option>
                <option value="Marketing & PR">Marketing & PR</option>
                <option value="Creative & Content">Creative & Content</option>
                <option value="Operations & Logistics">Operations & Logistics</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Sponsorship">Finance & Sponsorship</option>
              </select>
            </div>

            <div>
              <label htmlFor="input-role" className="block text-xs font-semibold text-text mb-1">
                Current Role / Designation <span className="text-accent">*</span>
              </label>
              <input
                id="input-role"
                type="text"
                {...register('role')}
                placeholder="e.g. Software Engineer, Brand Manager"
                className="input-base"
              />
              {errors.role && <p className="text-xs text-status-rejected mt-1">{errors.role.message}</p>}
            </div>

            <div>
              <label htmlFor="input-org" className="block text-xs font-semibold text-text mb-1">
                Organization / Company <span className="text-accent">*</span>
              </label>
              <input
                id="input-org"
                type="text"
                {...register('organization')}
                placeholder="e.g. Google, Unilever, bKash"
                className="input-base"
              />
              {errors.organization && <p className="text-xs text-status-rejected mt-1">{errors.organization.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="input-city" className="block text-xs font-semibold text-text mb-1">
                  City <span className="text-accent">*</span>
                </label>
                <input
                  id="input-city"
                  type="text"
                  {...register('city')}
                  className="input-base"
                />
              </div>
              <div>
                <label htmlFor="input-country" className="block text-xs font-semibold text-text mb-1">
                  Country <span className="text-accent">*</span>
                </label>
                <input
                  id="input-country"
                  type="text"
                  {...register('country')}
                  className="input-base"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="input-bio" className="block text-xs font-semibold text-text mb-1">
              Bio & Highlights <span className="text-accent">*</span>
            </label>
            <textarea
              id="input-bio"
              rows={4}
              {...register('bio')}
              placeholder="Tell fellow alumni about your career journey, past achievements, and areas of passion..."
              className="input-base h-auto py-2.5 resize-none"
            />
            {errors.bio && <p className="text-xs text-status-rejected mt-1">{errors.bio.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="input-story" className="block text-xs font-semibold text-text">
                Success Story & YSSE Reflection <span className="text-muted font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] font-mono text-muted">
                {(watchedValues.story?.length || 0)} / 3000
              </span>
            </div>
            <textarea
              id="input-story"
              rows={5}
              {...register('story')}
              placeholder="Share how YSSE shaped your career journey, key milestones, challenges overcome, or advice for aspiring youth..."
              className="input-base h-auto py-2.5 resize-none"
            />
            <p className="text-[11px] text-muted mt-1">
              Your story will be featured on your public profile and on the Alumni Success Stories showcase to inspire current members.
            </p>
            {errors.story && <p className="text-xs text-status-rejected mt-1">{errors.story.message}</p>}
          </div>

          {/* Core Expertise Tags */}
          <div>
            <label className="block text-xs font-semibold text-text mb-1">
              Core Expertise Tags (Press Enter to add)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g. React, Product Strategy, Brand Storytelling..."
              className="input-base"
            />
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {expertise.map((tag) => (
                <span key={tag} className="chip bg-surface-hover text-text border-border text-xs">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-muted hover:text-text"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Career Timeline Entries */}
        <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-text">
                Career Timeline
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Add your employment trajectory and major company transitions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCareer}
              className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {careerList.map((entry, idx) => (
              <div
                key={entry.id}
                className="p-3.5 bg-surface-hover/50 border border-border rounded-md grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
              >
                <div>
                  <label className="block text-[11px] font-mono text-muted mb-1">Role</label>
                  <input
                    type="text"
                    value={entry.role}
                    onChange={(e) => handleUpdateCareer(idx, 'role', e.target.value)}
                    placeholder="Role title"
                    className="input-base !min-h-[36px] h-[36px] text-xs py-1"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-muted mb-1">Organization</label>
                  <input
                    type="text"
                    value={entry.organization}
                    onChange={(e) => handleUpdateCareer(idx, 'organization', e.target.value)}
                    placeholder="Company name"
                    className="input-base !min-h-[36px] h-[36px] text-xs py-1"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-muted mb-1">Year Period</label>
                  <input
                    type="text"
                    value={entry.startYear}
                    onChange={(e) => handleUpdateCareer(idx, 'startYear', e.target.value)}
                    placeholder="Start year"
                    className="input-base !min-h-[36px] h-[36px] text-xs py-1"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-4 sm:pt-0">
                  <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry.current}
                      onChange={(e) => handleUpdateCareer(idx, 'current', e.target.checked)}
                      className="accent-[#B7FF72] rounded"
                    />
                    <span>Present</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveCareer(idx)}
                    className="text-status-rejected hover:text-status-rejected/80 p-1"
                    aria-label="Remove career milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Privacy Toggles */}
        <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold font-heading text-text">
            Privacy & Contact Controls
          </h2>

          <div>
            <label htmlFor="input-linkedin" className="block text-xs font-semibold text-text mb-1">
              LinkedIn Profile URL
            </label>
            <input
              id="input-linkedin"
              type="url"
              {...register('linkedinUrl')}
              placeholder="https://linkedin.com/in/username"
              className="input-base"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <label className="flex items-center justify-between p-3.5 bg-surface-hover/50 rounded-md border border-border cursor-pointer select-none">
              <div>
                <span className="text-sm font-semibold text-text block">
                  Show Email to Verified Community Members
                </span>
                <span className="text-xs text-muted">
                  When off, your email address is hidden from members.
                </span>
              </div>
              <input
                type="checkbox"
                {...register('isEmailPublic')}
                className="w-4 h-4 accent-[#B7FF72] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-surface-hover/50 rounded-md border border-border cursor-pointer select-none">
              <div>
                <span className="text-sm font-semibold text-text block">
                  Show LinkedIn URL on Profile
                </span>
                <span className="text-xs text-muted">
                  Allow fellows to view your professional network profile.
                </span>
              </div>
              <input
                type="checkbox"
                {...register('isLinkedinPublic')}
                className="w-4 h-4 accent-[#B7FF72] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 1:1 Mentorship Sessions Offering */}
        <div className="bg-surface border border-border rounded-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-text">
                1:1 Mentorship Sessions
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Offer office hours to junior fellows and incoming cohort members.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                {...register('openToSessions')}
                className="w-4 h-4 accent-[#B7FF72] rounded"
              />
              <span>Open to Sessions</span>
            </label>
          </div>

          {openToSessionsWatch && (
            <div className="pt-4 border-t border-border space-y-4 animate-fade-in">
              <div>
                <label htmlFor="session-topic-input" className="block text-xs font-semibold text-text mb-1">
                  Primary Mentorship Topic
                </label>
                <input
                  id="session-topic-input"
                  type="text"
                  {...register('sessionTopic')}
                  placeholder="e.g. Big Tech Interview Prep & Distributed Systems"
                  className="input-base"
                />
              </div>

              <div>
                <label htmlFor="session-format-input" className="block text-xs font-semibold text-text mb-1">
                  Session Format
                </label>
                <select
                  id="session-format-input"
                  {...register('sessionFormat')}
                  className="input-base cursor-pointer"
                >
                  <option value="Online">Online Video Call (Google Meet)</option>
                  <option value="Offline">In-Person Meetup</option>
                  <option value="Both">Both Online & Offline</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary gap-2 text-xs px-8"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
