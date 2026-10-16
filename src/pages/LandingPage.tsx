import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { alumniService } from '../services/alumniService';
import { sessionService } from '../services/sessionService';
import { useInView } from '../hooks/useInView';
import { FaqAccordion } from '../components/shared/FaqAccordion';
import { LandingHeroSection } from '../components/landing/LandingHeroSection';
import { LandingStatsSection } from '../components/landing/LandingStatsSection';
import { LandingFindSection } from '../components/landing/LandingFindSection';
import { LandingCarouselSection } from '../components/landing/LandingCarouselSection';
import { LandingStoriesSection } from '../components/landing/LandingStoriesSection';
import { LandingSessionsSection } from '../components/landing/LandingSessionsSection';
import { LandingGuideSection } from '../components/landing/LandingGuideSection';

export const LandingPage: React.FC = () => {
  const { ref: storiesRef, isInView: isStoriesInView } = useInView({ rootMargin: '300px' });
  const { ref: sessionsRef, isInView: isSessionsInView } = useInView({ rootMargin: '300px' });

  // 1. Live Aggregate Directory Stats (calls fast /api/alumni/stats endpoint)
  const statsQuery = useQuery({
    queryKey: ['landing', 'stats'],
    queryFn: () => alumniService.getLandingStats()
  });

  // 2. Featured Alumni for Carousel
  const featuredQuery = useQuery({
    queryKey: ['landing', 'featured'],
    queryFn: () => alumniService.getFeaturedAlumni()
  });

  // 3. Success Stories & Reflections (deferred until near viewport)
  const storiesQuery = useQuery({
    queryKey: ['landing', 'stories'],
    queryFn: () => alumniService.getSuccessStories(),
    enabled: isStoriesInView
  });

  // 4. Mentorship Sessions Offered (deferred until near viewport)
  const sessionsQuery = useQuery({
    queryKey: ['landing', 'sessions'],
    queryFn: async () => {
      const list = await sessionService.getSessionsOffered();
      return list.slice(0, 3);
    },
    enabled: isSessionsInView
  });

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      <LandingHeroSection />

      <LandingStatsSection
        stats={statsQuery.data}
        isLoading={statsQuery.isLoading}
        isError={statsQuery.isError}
        onRetry={() => statsQuery.refetch()}
      />

      <LandingFindSection />

      <LandingCarouselSection
        featuredAlumni={featuredQuery.data || []}
        isLoading={featuredQuery.isLoading}
        isError={featuredQuery.isError}
        onRetry={() => featuredQuery.refetch()}
      />

      <div ref={storiesRef}>
        <LandingStoriesSection
          stories={storiesQuery.data || []}
          isLoading={!isStoriesInView || storiesQuery.isLoading}
          isError={storiesQuery.isError}
          onRetry={() => storiesQuery.refetch()}
        />
      </div>

      <div ref={sessionsRef}>
        <LandingSessionsSection
          sessionsOffered={sessionsQuery.data || []}
          isLoading={!isSessionsInView || sessionsQuery.isLoading}
          isError={sessionsQuery.isError}
          onRetry={() => sessionsQuery.refetch()}
        />
      </div>

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
