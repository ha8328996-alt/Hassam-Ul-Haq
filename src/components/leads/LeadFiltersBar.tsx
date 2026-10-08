import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  Table as TableIcon,
  LayoutGrid,
  Kanban,
  RotateCw,
  Plus,
  Download,
} from 'lucide-react';

export type LeadViewMode = 'table' | 'grid' | 'kanban';
export type LeadSortOption =
  | 'recent'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'score_desc'
  | 'score_asc'
  | 'value_desc';

interface LeadFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sourceFilter: string;
  onSourceChange: (source: string) => void;
  sortOption: LeadSortOption;
  onSortChange: (sort: LeadSortOption) => void;
  viewMode: LeadViewMode;
  onViewModeChange: (mode: LeadViewMode) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onExportCSV: () => void;
  onOpenAddModal: () => void;
  totalFilteredCount: number;
  totalCount: number;
}

export function LeadFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing = false,
  onExportCSV,
  onOpenAddModal,
  totalFilteredCount,
  totalCount,
}: LeadFiltersBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    sourceFilter !== 'all' ||
    sortOption !== 'recent';

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onSourceChange('all');
    onSortChange('recent');
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'Website', label: 'Website' },
    { value: 'Web Form', label: 'Web Form' },
    { value: 'AI Agent', label: 'AI Agent' },
    { value: 'Automation', label: 'Automation' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Other', label: 'Other' },
  ];

  const sortOptions: { value: LeadSortOption; label: string }[] = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'score_desc', label: 'Highest Score' },
    { value: 'score_asc', label: 'Lowest Score' },
    { value: 'value_desc', label: 'Highest Value ($)' },
  ];

  return (
    <div className="space-y-3">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search by name, email, phone, company, source, notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-3.5 h-3.5" />}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View toggles and Primary Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg border border-neutral-200 dark:border-neutral-700/60">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Pipeline / Kanban View"
              aria-label="Pipeline / Kanban View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pipeline</span>
            </button>
          </div>

          {/* Refresh Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            leftIcon={
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-neutral-600 dark:text-neutral-300' : ''}`} />
            }
            title="Refresh leads"
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Export CSV */}
          <Button
            size="sm"
            variant="outline"
            onClick={onExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            title="Export CSV"
          >
            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Add Lead */}
          <Button
            size="sm"
            onClick={onOpenAddModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-xs font-medium py-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => onSourceChange(e.target.value)}
              className="text-xs font-medium py-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              {sourceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort:
            </span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as LeadSortOption)}
              className="text-xs font-medium py-1 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline underline-offset-2 transition-colors cursor-pointer ml-1"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results Count indicator */}
        <div className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
          Showing <span className="font-semibold text-neutral-900 dark:text-white">{totalFilteredCount}</span> of {totalCount} leads
        </div>
      </div>
    </div>
  );
}
