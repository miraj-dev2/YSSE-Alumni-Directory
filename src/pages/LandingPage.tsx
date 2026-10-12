import React, { useEffect, useState, useMemo } from 'react';
import { alumniService } from '../services/alumniService';
import { sessionService } from '../services/sessionService';
import { AlumniProfile } from '../types';
import { FaqAccordion } from '../components/shared/FaqAccordion';
import { LandingHeroSection } from '../components/landing/LandingHeroSection';
import { LandingStatsSection } from '../components/landing/LandingStatsSection';
import { LandingFindSection } from '../components/landing/LandingFindSection';
import { LandingCarouselSection } from '../components/landing/LandingCarouselSection';
import { LandingStoriesSection } from '../components/landing/LandingStoriesSection';
import { LandingSessionsSection } from '../components/landing/LandingSessionsSection';
import { LandingGuideSection } from '../components/landing/LandingGuideSection';

export const LandingPage: React.FC = () => {
  const [featuredAlumni, setFeaturedAlumni] = useState<AlumniProfile[]>([]);
  const [sessionsOffered, setSessionsOffered] = useState<AlumniProfile[]>([]);
  const [stories, setStories] = useState<AlumniProfile[]>([]);
  const [allAlumni, setAllAlumni] = useState<AlumniProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      alumniService.getFeaturedAlumni(),
      alumniService.getSuccessStories(),
      sessionService.getSessionsOffered(),
      alumniService.getAlumni({ pageSize: 50 }),
    ]).then(([featured, storiesRes, sessions, directoryRes]) => {
      setFeaturedAlumni(featured);
      setStories(storiesRes);
      setSessionsOffered(sessions.slice(0, 3));
      setAllAlumni(directoryRes.data);
      setTotalCount(directoryRes.total || directoryRes.data.length);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = totalCount || allAlumni.length;
    const batchesCount = new Set(allAlumni.map((a) => a.batch).filter(Boolean)).size;
    const companiesCount = new Set(allAlumni.map((a) => a.organization).filter(Boolean)).size;
    const countriesCount = new Set(allAlumni.map((a) => a.country).filter(Boolean)).size;
    return { total, batchesCount, companiesCount, countriesCount };
  }, [allAlumni, totalCount]);

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      <LandingHeroSection />
      <LandingStatsSection stats={stats} />
      <LandingFindSection />
      <LandingCarouselSection loading={loading} featuredAlumni={featuredAlumni} />
      <LandingStoriesSection stories={stories} />
      <LandingSessionsSection sessionsOffered={sessionsOffered} />
      <LandingGuideSection />

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
