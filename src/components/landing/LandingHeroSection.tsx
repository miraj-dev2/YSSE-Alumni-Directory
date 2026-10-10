import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

export const LandingHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/alumni?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/alumni');
    }
  };

  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-surface border border-border rounded-card p-8 sm:p-14 lg:p-16">
        <div className="max-w-3xl">
          <span className="chip bg-surface-hover text-accent border-border-strong text-xs mb-6">
            YSSE Global Network
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text leading-tight mb-5">
            Connect with fellow changemakers across the globe.
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-2xl font-normal">
            A curated community connecting alumni and fellows from Youth School for Social
            Entrepreneurs to share industry insights, explore careers, and book 1:1 mentorship.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
            <Link to="/alumni" className="btn-primary gap-2">
              <span>Browse Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/me" className="btn-secondary">
              Join as Alumnus
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-xl">
            <label htmlFor="hero-search-input" className="sr-only">
              Search alumni by name, role, or company
            </label>
            <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="hero-search-input"
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search alumni by name, company, or wing..."
              className="input-base pl-11 pr-24"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary !min-h-[34px] h-[34px] px-3 text-xs"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
