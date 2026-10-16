import React, { useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight, RotateCw, AlertCircle } from 'lucide-react';
import { AlumniProfile } from '../../types';
import { Avatar } from '../shared/Avatar';

interface CarouselProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  featuredAlumni: AlumniProfile[];
}

export const LandingCarouselSection: React.FC<CarouselProps> = ({
  isLoading,
  isError,
  onRetry,
  featuredAlumni
}) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const autoplayPlugin = useMemo(() => {
    if (prefersReducedMotion) return [];
    return [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })];
  }, [prefersReducedMotion]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, autoplayPlugin);
  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); }, [emblaApi]);

  return (
    <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">Where they are now</h2>
          <p className="text-xs text-muted mt-0.5">Alumni journeys across technology firms, enterprises, and research labs.</p>
        </div>
        {!isLoading && !isError && featuredAlumni.length > 0 && (
          <div className="flex items-center gap-2">
            <button onClick={scrollPrev} aria-label="Previous slide" className="p-2.5 rounded-md bg-surface border border-border text-text hover:bg-surface-hover">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={scrollNext} aria-label="Next slide" className="p-2.5 rounded-md bg-surface border border-border text-text hover:bg-surface-hover">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] shrink-0 h-80 bg-surface border border-border rounded-card animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-surface border border-border rounded-card p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-muted text-xs">
            <AlertCircle className="w-5 h-5 text-status-rejected shrink-0" />
            <span>Failed to load featured alumni profiles.</span>
          </div>
          <button onClick={onRetry} className="btn-secondary !min-h-[36px] h-[36px] text-xs px-3.5 gap-1.5 shrink-0">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : featuredAlumni.length > 0 ? (
        <div ref={emblaRef} className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4">
            {featuredAlumni.map((alumnus) => (
              <a
                key={alumnus.id}
                href={`/alumni/${alumnus.id}`}
                className="group flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] shrink-0 flex flex-col justify-between bg-surface border border-border hover:border-border-strong rounded-card p-4 transition-colors text-left"
              >
                <div>
                  <div className="relative aspect-[4/5] rounded-md overflow-hidden mb-3 bg-surface-hover border border-border">
                    {alumnus.photoUrl ? (
                      <img src={alumnus.photoUrl} alt={alumnus.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Avatar name={alumnus.name} size="2xl" className="!rounded-md" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="chip bg-bg/90 text-muted border-border-strong text-[10px]">{alumnus.batch}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors truncate">{alumnus.name}</h3>
                  <p className="text-xs text-muted truncate mt-0.5">{alumnus.role} at <span className="text-text">{alumnus.organization}</span></p>
                </div>
                <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                  <span className="truncate max-w-[120px] font-mono text-[11px]">{alumnus.wing}</span>
                  <span className="text-accent group-hover:underline flex items-center gap-1 text-[11px]">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-card p-10 text-center text-muted text-xs">
          Alumni profiles will be featured here as fellows register and become verified.
        </div>
      )}
    </section>
  );
};
