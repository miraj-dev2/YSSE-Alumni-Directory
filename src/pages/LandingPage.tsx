import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { alumniService } from '../services/alumniService';
import { sessionService } from '../services/sessionService';
import { AlumniProfile } from '../types';
import { Avatar } from '../components/shared/Avatar';
import { FaqAccordion } from '../components/shared/FaqAccordion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Briefcase,
  Sparkles,
  Calendar,
  Building,
  GraduationCap,
  Layers,
  CheckCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredAlumni, setFeaturedAlumni] = useState<AlumniProfile[]>([]);
  const [sessionsOffered, setSessionsOffered] = useState<AlumniProfile[]>([]);
  const [allAlumni, setAllAlumni] = useState<AlumniProfile[]>([]);
  const [heroSearch, setHeroSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const autoplayPlugin = useMemo(() => {
    if (prefersReducedMotion) return [];
    return [
      Autoplay({
        delay: 4500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ];
  }, [prefersReducedMotion]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    autoplayPlugin
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    Promise.all([
      alumniService.getFeaturedAlumni(),
      sessionService.getSessionsOffered(),
      alumniService.getAlumni({ pageSize: 100 }),
    ]).then(([featured, sessions, directoryRes]) => {
      setFeaturedAlumni(featured);
      setSessionsOffered(sessions.slice(0, 3));
      setAllAlumni(directoryRes.data);
      setLoading(false);
    });
  }, []);

  // Compute stats strictly from data (never invented)
  const stats = useMemo(() => {
    const total = allAlumni.length;
    const batchesCount = new Set(allAlumni.map((a) => a.batch)).size;
    const companiesCount = new Set(allAlumni.map((a) => a.organization)).size;
    const countriesCount = new Set(allAlumni.map((a) => a.country).filter(Boolean)).size;
    return { total, batchesCount, companiesCount, countriesCount };
  }, [allAlumni]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/alumni?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/alumni');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* 2. Hero Section */}
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

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <Link to="/alumni" className="btn-primary gap-2">
                <span>Browse Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/me" className="btn-secondary">
                Join as Alumnus
              </Link>
            </div>

            {/* Search Bar directly below CTAs */}
            <form onSubmit={handleHeroSearchSubmit} className="relative max-w-xl">
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

      {/* 3. Stats Strip (Computed dynamically) */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-card p-6">
            <span className="block font-heading font-semibold text-3xl sm:text-4xl text-text">
              {stats.total}+
            </span>
            <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
              Verified Alumni
            </span>
          </div>

          <div className="bg-surface border border-border rounded-card p-6">
            <span className="block font-heading font-semibold text-3xl sm:text-4xl text-accent">
              {stats.batchesCount}
            </span>
            <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
              Alumni Batches
            </span>
          </div>

          <div className="bg-surface border border-border rounded-card p-6">
            <span className="block font-heading font-semibold text-3xl sm:text-4xl text-text">
              {stats.companiesCount}+
            </span>
            <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
              Organizations
            </span>
          </div>

          <div className="bg-surface border border-border rounded-card p-6">
            <span className="block font-heading font-semibold text-3xl sm:text-4xl text-accent">
              {stats.countriesCount}+
            </span>
            <span className="text-xs text-muted uppercase font-mono tracking-wider mt-1 block">
              Countries Reached
            </span>
          </div>
        </div>
      </section>

      {/* 4. "Find alumni by" Cards (Preset filter links) */}
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
            to="/alumni?city=Dhaka"
            className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
              By Location
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Explore alumni across Dhaka, Singapore, Munich, Toronto, and Sydney.
            </p>
          </Link>

          <Link
            to="/alumni?field=Software"
            className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
              By Industry Field
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Software engineering, brand strategy, venture capital, and multilateral NGOs.
            </p>
          </Link>

          <Link
            to="/alumni?wing=YSSE IT"
            className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
              By Wing (YSSE IT)
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Connect with alumni who served in YSSE IT, engineering, design, and innovation.
            </p>
          </Link>

          <Link
            to="/alumni?batch=8"
            className="group bg-surface border border-border hover:border-border-strong rounded-card p-5 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-surface-hover border border-border-strong flex items-center justify-center text-accent mb-4">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
              By Batch (Batch 8)
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Browse cohort groups from Batch 8 through the latest alumni cohorts.
            </p>
          </Link>
        </div>
      </section>

      {/* 5. "Where they are now": Embla Photo Carousel */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
              Where they are now
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Alumni journeys across international technology firms, enterprises, and research labs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="p-2.5 rounded-md bg-surface border border-border text-text hover:bg-surface-hover transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next slide"
              className="p-2.5 rounded-md bg-surface border border-border text-text hover:bg-surface-hover transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div ref={emblaRef} className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] shrink-0 h-80 bg-surface border border-border rounded-card animate-pulse"
                />
              ))
            ) : (
              featuredAlumni.map((alumnus) => (
                <a
                  key={alumnus.id}
                  href={`/alumni/${alumnus.id}`}
                  className="group flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] shrink-0 flex flex-col justify-between bg-surface border border-border hover:border-border-strong rounded-card p-4 transition-colors text-left"
                >
                  <div>
                    {/* 4:5 Photo */}
                    <div className="relative aspect-[4/5] rounded-md overflow-hidden mb-3 bg-surface-hover border border-border">
                      {alumnus.photoUrl ? (
                        <img
                          src={alumnus.photoUrl}
                          alt={alumnus.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Avatar name={alumnus.name} size="2xl" className="!rounded-md" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="chip bg-bg/90 text-muted border-border-strong text-[10px]">
                          {alumnus.batch}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors truncate">
                      {alumnus.name}
                    </h3>
                    <p className="text-xs text-muted truncate mt-0.5">
                      {alumnus.role} at <span className="text-text">{alumnus.organization}</span>
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span className="truncate max-w-[120px] font-mono text-[11px]">{alumnus.wing}</span>
                    <span className="text-accent group-hover:underline flex items-center gap-1 text-[11px]">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. Alumni Stories (3 cards) */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Alumni Stories
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Reflections from alumni on how YSSE shaped their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border rounded-card p-6 flex flex-col justify-between">
            <p className="text-sm text-text leading-relaxed mb-6 italic">
              "Leading tech initiatives at YSSE gave me practical system deployment experience before I ever interviewed at Big Tech. Giving back via 1:1 sessions is my way of keeping that door open for juniors."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" name="Tanvir Hossain" size="md" />
              <div>
                <span className="font-semibold text-sm text-text block leading-tight">Tanvir Hossain</span>
                <span className="text-xs text-muted">Senior SWE, Google (Munich)</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-card p-6 flex flex-col justify-between">
            <p className="text-sm text-text leading-relaxed mb-6 italic">
              "YSSE taught me stakeholder communication and grassroots empathy. When crafting brand strategy at Unilever, those early campaign experiments became my strongest foundation."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Avatar src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" name="Nusrat Jahan" size="md" />
              <div>
                <span className="font-semibold text-sm text-text block leading-tight">Nusrat Jahan</span>
                <span className="text-xs text-muted">Brand Manager, Unilever</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-card p-6 flex flex-col justify-between">
            <p className="text-sm text-text leading-relaxed mb-6 italic">
              "The design critiques and collaborative spirit in the Creative wing helped me build an international portfolio. Now at Canva, I love reviewing portfolio case studies from fellow alumni."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Avatar src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80" name="Anika Rahman" size="md" />
              <div>
                <span className="font-semibold text-sm text-text block leading-tight">Anika Rahman</span>
                <span className="text-xs text-muted">Senior Product Designer, Canva</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sessions Teaser (3 cards + "See all sessions") */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
              1:1 Mentorship Offers
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Book dedicated advisory sessions with senior alumni.
            </p>
          </div>
          <Link to="/sessions" className="btn-secondary !min-h-[38px] h-[38px] text-xs px-3.5 gap-1.5">
            <span>See all sessions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessionsOffered.map((mentor) => (
            <div key={mentor.id} className="bg-surface border border-border rounded-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Avatar src={mentor.photoUrl} name={mentor.name} size="md" />
                  <span className="chip bg-accent/15 text-accent border-accent/25 text-[10px]">
                    {mentor.sessionFormat || 'Online'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-text">{mentor.name}</h3>
                <p className="text-xs text-muted">{mentor.role} at {mentor.organization}</p>
                <div className="mt-3 p-3 bg-surface-hover rounded-md border border-border">
                  <span className="text-[10px] font-mono uppercase text-muted block mb-0.5">Focus Area</span>
                  <p className="text-xs text-text font-medium line-clamp-2">
                    {mentor.sessionTopic || 'Career & Technical Advising'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <Link to={`/alumni/${mentor.id}`} className="text-xs text-muted hover:text-text">
                  View Profile
                </Link>
                <Link to="/sessions" className="btn-primary !min-h-[36px] h-[36px] text-xs px-3 gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Request Session</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. For Alumni & About YSSE Global */}
      <section id="about" className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* About YSSE Global Card */}
        <div className="bg-surface border border-border rounded-card p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-start sm:items-center gap-4">
              <img
                src="/ysse-logo.png"
                alt="YSSE Logo"
                className="h-14 w-auto max-w-[70px] object-contain bg-white rounded p-1 border border-border-strong shrink-0"
              />
              <div>
                <span className="chip bg-surface-hover text-accent border-border-strong text-xs mb-1">
                  Stage of Innovation
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
                  About Youth School for Social Entrepreneurs
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed max-w-xl">
                  Empowering young changemakers, grassroots social entrepreneurship, and global innovation across Bangladesh and beyond.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="https://ysseglobal.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !min-h-[40px] h-[40px] text-xs px-4 gap-1.5"
              >
                <span>YSSE Main Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ysseglobal/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !min-h-[40px] h-[40px] text-xs px-4 gap-1.5"
              >
                <span>LinkedIn Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-6">
            <div className="max-w-xl mb-6">
              <span className="chip bg-surface-hover text-accent border-border-strong text-xs mb-2">
                Alumni Registration Guide
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-text">
                Three steps to join the verified network
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Maintain connections with peers and mentor upcoming cohorts.
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border rounded-md p-5 bg-surface-hover/30">
              <span className="w-7 h-7 rounded-full bg-surface border border-border-strong flex items-center justify-center text-xs font-mono font-semibold text-accent mb-4">
                1
              </span>
              <h3 className="text-sm font-semibold text-text mb-1">Create Your Profile</h3>
              <p className="text-xs text-muted leading-relaxed">
                Provide your YSSE graduation batch, wing role, current organization, career milestones, and bio.
              </p>
            </div>

            <div className="border border-border rounded-md p-5 bg-surface-hover/30">
              <span className="w-7 h-7 rounded-full bg-surface border border-border-strong flex items-center justify-center text-xs font-mono font-semibold text-accent mb-4">
                2
              </span>
              <h3 className="text-sm font-semibold text-text mb-1">Secretariat Verification</h3>
              <p className="text-xs text-muted leading-relaxed">
                The YSSE leadership team reviews cohort records to confirm alumni credentials and maintain directory integrity.
              </p>
            </div>

            <div className="border border-border rounded-md p-5 bg-surface-hover/30">
              <span className="w-7 h-7 rounded-full bg-surface border border-border-strong flex items-center justify-center text-xs font-mono font-semibold text-accent mb-4">
                3
              </span>
              <h3 className="text-sm font-semibold text-text mb-1">Mentor & Connect</h3>
              <p className="text-xs text-muted leading-relaxed">
                Once approved, choose whether to host 1:1 sessions, receive connection requests, or join exclusive alumni meetups.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted">Ready to claim your directory listing?</span>
            <Link to="/me" className="btn-primary !min-h-[42px] h-[42px] text-xs px-6">
              Register or Update Profile
            </Link>
          </div>
        </div>
      </div>
    </section>

      {/* 9. FAQ Accordion */}
      <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-6">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Details regarding privacy policies, directory approval, and membership accounts.
          </p>
        </div>

        <div className="max-w-3xl">
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
};
