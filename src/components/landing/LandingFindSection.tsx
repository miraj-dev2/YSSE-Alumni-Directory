import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Layers, GraduationCap } from 'lucide-react';

export const LandingFindSection: React.FC = () => {
  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
          Find alumni by
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Quickly navigate directory subsets based on common paths.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/alumni"
          className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
        >
          <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
            By Location
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Explore alumni across local chapters, metropolitan hubs, and international regions.
          </p>
        </Link>

        <Link
          to="/alumni"
          className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
        >
          <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
            <Briefcase className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
            By Industry Field
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Engineering, social entrepreneurship, product management, and development sector.
          </p>
        </Link>

        <Link
          to="/alumni"
          className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
        >
          <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
            By Wing
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Connect with alumni who served across IT, Academy, Charity Hub, and initiatives.
          </p>
        </Link>

        <Link
          to="/alumni"
          className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
        >
          <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
            By Cohort Batch
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Browse cohort groups from inaugural batches through the latest alumni cohorts.
          </p>
        </Link>
      </div>
    </section>
  );
};
