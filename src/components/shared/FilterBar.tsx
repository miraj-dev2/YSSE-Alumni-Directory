import React from 'react';
import { Search, RotateCcw, Sparkles, LayoutGrid, List } from 'lucide-react';
import { DirectoryFilterParams } from '../../types';
import { FilterChip } from './FilterChip';

interface FilterBarProps {
  filters: DirectoryFilterParams;
  onChange: (updates: Partial<DirectoryFilterParams>) => void;
  onReset: () => void;
  options: {
    batches: string[];
    wings: string[];
    companies: string[];
    cities: string[];
    fields: string[];
  };
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  options,
  viewMode,
  onViewModeChange,
}) => {
  const activeChips: { label: string; value: string; key: keyof DirectoryFilterParams }[] = [];

  if (filters.batch && filters.batch !== 'all') {
    activeChips.push({ label: 'Batch', value: filters.batch, key: 'batch' });
  }
  if (filters.wing && filters.wing !== 'all') {
    activeChips.push({ label: 'Wing', value: filters.wing, key: 'wing' });
  }
  if (filters.company && filters.company !== 'all') {
    activeChips.push({ label: 'Company', value: filters.company, key: 'company' });
  }
  if (filters.city && filters.city !== 'all') {
    activeChips.push({ label: 'Location', value: filters.city, key: 'city' });
  }
  if (filters.field && filters.field !== 'all') {
    activeChips.push({ label: 'Field', value: filters.field, key: 'field' });
  }
  if (filters.openToSessions) {
    activeChips.push({ label: 'Status', value: 'Open to Sessions', key: 'openToSessions' });
  }

  return (
    <div className="bg-surface border border-border rounded-card p-5 mb-8 space-y-4">
      {/* Top Search & Layout Controls Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <label htmlFor="search-alumni-input" className="sr-only">
            Search alumni by name, role, organization, or expertise
          </label>
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-alumni-input"
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            placeholder="Search alumni by name, role, company, city, or skill..."
            className="input-base pl-10"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sort || 'updatedAt'}
            onChange={(e) => onChange({ sort: e.target.value as any, page: 1 })}
            className="input-base !w-auto text-xs font-medium cursor-pointer"
            aria-label="Sort alumni"
          >
            <option value="updatedAt">Recently Updated</option>
            <option value="name">Name (A-Z)</option>
            <option value="batch">Graduation Batch</option>
          </select>

          {/* Grid / List Toggle */}
          <div className="flex items-center border border-border-strong rounded-md p-0.5 bg-surface-hover shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-sm transition-colors ${
                viewMode === 'grid' ? 'bg-surface text-accent' : 'text-muted hover:text-text'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-sm transition-colors ${
                viewMode === 'list' ? 'bg-surface text-accent' : 'text-muted hover:text-text'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Select Filters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 items-center">
        {/* Batch */}
        <div>
          <label htmlFor="filter-batch" className="sr-only">Batch</label>
          <select
            id="filter-batch"
            value={filters.batch || 'all'}
            onChange={(e) => onChange({ batch: e.target.value, page: 1 })}
            className="input-base text-xs py-2 h-10 min-h-[40px]"
          >
            <option value="all">All Batches</option>
            {filters.batch && filters.batch !== 'all' && !options.batches.includes(filters.batch) && (
              <option value={filters.batch}>
                {filters.batch.startsWith('Batch') ? filters.batch : `Batch ${filters.batch}`}
              </option>
            )}
            {options.batches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Wing */}
        <div>
          <label htmlFor="filter-wing" className="sr-only">Wing</label>
          <select
            id="filter-wing"
            value={filters.wing || 'all'}
            onChange={(e) => onChange({ wing: e.target.value, page: 1 })}
            className="input-base text-xs py-2 h-10 min-h-[40px]"
          >
            <option value="all">All Wings</option>
            {filters.wing && filters.wing !== 'all' && !options.wings.includes(filters.wing) && (
              <option value={filters.wing}>{filters.wing}</option>
            )}
            {options.wings.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div>
          <label htmlFor="filter-company" className="sr-only">Organization</label>
          <select
            id="filter-company"
            value={filters.company || 'all'}
            onChange={(e) => onChange({ company: e.target.value, page: 1 })}
            className="input-base text-xs py-2 h-10 min-h-[40px]"
          >
            <option value="all">All Organizations</option>
            {options.companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label htmlFor="filter-city" className="sr-only">City</label>
          <select
            id="filter-city"
            value={filters.city || 'all'}
            onChange={(e) => onChange({ city: e.target.value, page: 1 })}
            className="input-base text-xs py-2 h-10 min-h-[40px]"
          >
            <option value="all">All Locations</option>
            {options.cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Field / Expertise */}
        <div>
          <label htmlFor="filter-field" className="sr-only">Field</label>
          <select
            id="filter-field"
            value={filters.field || 'all'}
            onChange={(e) => onChange({ field: e.target.value, page: 1 })}
            className="input-base text-xs py-2 h-10 min-h-[40px]"
          >
            <option value="all">All Expertise</option>
            {options.fields.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Open to Sessions Toggle */}
        <div>
          <button
            type="button"
            onClick={() =>
              onChange({
                openToSessions: filters.openToSessions ? undefined : true,
                page: 1,
              })
            }
            className={`w-full flex items-center justify-center gap-1.5 px-3 rounded-md border text-xs font-semibold transition-colors h-10 min-h-[40px] ${
              filters.openToSessions
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-surface border-border-strong text-muted hover:text-text'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate">Mentors Only</span>
          </button>
        </div>
      </div>

      {/* Removable Active Filter Chips Row */}
      {activeChips.length > 0 && (
        <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted font-mono">Filters:</span>
          {activeChips.map((chip) => (
            <FilterChip
              key={chip.label}
              label={chip.label}
              value={chip.value}
              onRemove={() =>
                onChange({
                  [chip.key]: undefined,
                  page: 1,
                })
              }
            />
          ))}
          <button
            onClick={onReset}
            className="btn-tertiary text-xs gap-1 ml-auto text-status-rejected hover:text-status-rejected/80"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
