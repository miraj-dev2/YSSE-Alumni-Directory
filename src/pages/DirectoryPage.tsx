import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { alumniService } from '../services/alumniService';
import { AlumniProfile, DirectoryFilterParams, PaginatedResult } from '../types';
import { FilterBar } from '../components/shared/FilterBar';
import { AlumniCard } from '../components/shared/AlumniCard';
import { AlumniCardSkeleton } from '../components/shared/Skeleton';
import { EmptyState } from '../components/shared/EmptyState';
import { Pagination } from '../components/shared/Pagination';
import { Avatar } from '../components/shared/Avatar';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract filter parameters from URL
  const filters: DirectoryFilterParams = useMemo(() => {
    return {
      search: searchParams.get('q') || '',
      batch: searchParams.get('batch') || 'all',
      wing: searchParams.get('wing') || 'all',
      company: searchParams.get('company') || 'all',
      city: searchParams.get('city') || 'all',
      field: searchParams.get('field') || 'all',
      openToSessions: searchParams.get('openToSessions') === 'true' ? true : undefined,
      sort: (searchParams.get('sort') as any) || 'updatedAt',
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: 9,
    };
  }, [searchParams]);

  // Query distinct options for dropdowns
  const { data: options = { batches: [], wings: [], companies: [], cities: [], fields: [] } } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => alumniService.getDistinctFilterOptions(),
  });

  // Query alumni with current filters
  const { data: queryResult, isLoading, isFetching } = useQuery<PaginatedResult<AlumniProfile>>({
    queryKey: ['alumni', filters],
    queryFn: () => alumniService.getAlumni(filters),
    placeholderData: keepPreviousData,
  });

  // Push new filter states to URL search parameters
  const updateFilters = (updates: Partial<DirectoryFilterParams>) => {
    const nextParams = new URLSearchParams(searchParams);

    if (updates.search !== undefined) {
      if (updates.search) nextParams.set('q', updates.search);
      else nextParams.delete('q');
    }

    if (updates.batch !== undefined) {
      if (updates.batch && updates.batch !== 'all') nextParams.set('batch', updates.batch);
      else nextParams.delete('batch');
    }

    if (updates.wing !== undefined) {
      if (updates.wing && updates.wing !== 'all') nextParams.set('wing', updates.wing);
      else nextParams.delete('wing');
    }

    if (updates.company !== undefined) {
      if (updates.company && updates.company !== 'all') nextParams.set('company', updates.company);
      else nextParams.delete('company');
    }

    if (updates.city !== undefined) {
      if (updates.city && updates.city !== 'all') nextParams.set('city', updates.city);
      else nextParams.delete('city');
    }

    if (updates.field !== undefined) {
      if (updates.field && updates.field !== 'all') nextParams.set('field', updates.field);
      else nextParams.delete('field');
    }

    if (updates.openToSessions !== undefined) {
      if (updates.openToSessions) nextParams.set('openToSessions', 'true');
      else nextParams.delete('openToSessions');
    }

    if (updates.sort !== undefined) {
      if (updates.sort) nextParams.set('sort', updates.sort);
      else nextParams.delete('sort');
    }

    if (updates.page !== undefined) {
      if (updates.page > 1) nextParams.set('page', updates.page.toString());
      else nextParams.delete('page');
    } else {
      nextParams.delete('page');
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold font-heading text-text">
          Alumni Directory
        </h1>
        <p className="text-sm text-muted mt-1 max-w-2xl leading-relaxed">
          Search and discover fellows who have contributed to YSSE initiatives worldwide.
          Filter by cohort batch, organizational wing, employer, location, or mentorship availability.
        </p>
      </div>

      {/* Filter Bar synced to URL */}
      <FilterBar
        filters={filters}
        onChange={updateFilters}
        onReset={handleReset}
        options={options}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Result Count and Status Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text">
            {isLoading ? 'Loading alumni...' : `${queryResult?.total || 0} Alumni Records`}
          </span>
          {filters.openToSessions && (
            <span className="chip bg-accent/15 text-accent border-accent/25">
              Mentors Only
            </span>
          )}
        </div>
        {isFetching && !isLoading && (
          <span className="text-muted animate-pulse">Refreshing results...</span>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <AlumniCardSkeleton key={i} />
          ))}
        </div>
      ) : queryResult && queryResult.data.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {queryResult.data.map((alumnus) => (
                <AlumniCard key={alumnus.id} alumni={alumnus} />
              ))}
            </div>
          ) : (
            /* List View Mode */
            <div className="space-y-3">
              {queryResult.data.map((alumnus) => (
                <Link
                  key={alumnus.id}
                  to={`/alumni/${alumnus.id}`}
                  className="group bg-surface border border-border hover:border-border-strong rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar src={alumnus.photoUrl} name={alumnus.name} size="md" className="!rounded-md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text group-hover:text-accent transition-colors">
                          {alumnus.name}
                        </span>
                        <span className="chip bg-surface-hover text-muted text-[10px]">
                          {alumnus.batch}
                        </span>
                        {alumnus.openToSessions && (
                          <span className="chip bg-accent text-on-accent text-[10px] font-semibold border-transparent">
                            Mentoring
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        {alumnus.role} at <strong className="text-text">{alumnus.organization}</strong> • {alumnus.wing}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center text-xs text-muted">
                    <span className="font-mono text-[11px] hidden md:inline">
                      Updated {alumnus.updatedAt}
                    </span>
                    <span className="text-accent flex items-center gap-1 font-medium group-hover:underline">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Pagination
            currentPage={queryResult.page}
            totalPages={queryResult.totalPages}
            onPageChange={(p) => updateFilters({ page: p })}
          />
        </>
      ) : (
        <EmptyState
          title="No Alumni Match Your Criteria"
          description="Try broadening your search keywords, clearing company or wing filters, or removing the mentorship constraint."
          actionText="Clear All Filters"
          onAction={handleReset}
        />
      )}
    </div>
  );
};
