import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Lead, LeadStatus } from '../../types';
import { LeadMetricsCards } from '../../components/leads/LeadMetricsCards';
import {
  LeadFiltersBar,
  LeadViewMode,
  LeadSortOption,
} from '../../components/leads/LeadFiltersBar';
import { LeadTableView } from '../../components/leads/LeadTableView';
import { LeadGridView } from '../../components/leads/LeadGridView';
import { LeadKanbanView } from '../../components/leads/LeadKanbanView';
import { AddLeadModal } from '../../components/leads/AddLeadModal';
import { EditLeadModal } from '../../components/leads/EditLeadModal';
import { DeleteLeadConfirmModal } from '../../components/leads/DeleteLeadConfirmModal';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

const VIEW_STORAGE_KEY = 'flowpilot_leads_view_mode';

export function LeadsPage() {
  const { leads, addLead, updateLead, deleteLead, refreshLeads } = useData();
  const { success } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortOption, setSortOption] = useState<LeadSortOption>('recent');

  // View Mode with local persistence
  const [viewMode, setViewMode] = useState<LeadViewMode>(() => {
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      if (saved === 'table' || saved === 'grid' || saved === 'kanban') {
        return saved;
      }
      return 'table';
    } catch {
      return 'table';
    }
  });

  const handleViewModeChange = (mode: LeadViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultStatus, setAddModalDefaultStatus] = useState<LeadStatus>('new');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered and Sorted Leads calculation
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Full-text search across Name, Email, Phone, Company, Source, Notes
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = (lead.name || '').toLowerCase().includes(q);
          const matchesEmail = (lead.email || '').toLowerCase().includes(q);
          const matchesPhone = (lead.phone || '').toLowerCase().includes(q);
          const matchesCompany = (lead.company || '').toLowerCase().includes(q);
          const matchesSource = (lead.source || '').toLowerCase().includes(q);
          const matchesNotes =
            (lead.notes || '').toLowerCase().includes(q) ||
            (lead.aiNotes || '').toLowerCase().includes(q);

          if (
            !matchesName &&
            !matchesEmail &&
            !matchesPhone &&
            !matchesCompany &&
            !matchesSource &&
            !matchesNotes
          ) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== 'all') {
          if ((lead.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
            return false;
          }
        }

        // Source Filter
        if (sourceFilter !== 'all') {
          if ((lead.source || '').toLowerCase() !== sourceFilter.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'oldest':
            return (a.createdAt || '').localeCompare(b.createdAt || '');
          case 'name_asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name_desc':
            return (b.name || '').localeCompare(a.name || '');
          case 'score_desc':
            return (b.score || 0) - (a.score || 0);
          case 'score_asc':
            return (a.score || 0) - (b.score || 0);
          case 'value_desc':
            return (b.estimatedValue || 0) - (a.estimatedValue || 0);
          case 'recent':
          default:
            return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
      });
  }, [leads, searchQuery, statusFilter, sourceFilter, sortOption]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshLeads();
      success('Refreshed', 'Leads database is up to date.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Phone,Company,Title,Score,Status,Estimated ARR,Source,Country,Assigned To'].join(
        ','
      ) +
      '\n' +
      filteredLeads
        .map(
          (l) =>
            `"${l.name}","${l.email}","${l.phone || ''}","${l.company}","${l.title || ''}",${l.score},"${l.status}",${l.estimatedValue || 0},"${l.source || ''}","${l.country || ''}","${l.assignedTo || ''}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `flowpilot_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('CSV Exported', `Exported ${filteredLeads.length} leads.`);
  };

  const handleQuickStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    await updateLead(leadId, { status: nextStatus });
    success('Stage Updated', `Updated lead to ${nextStatus.toUpperCase()}.`);
  };

  const handleOpenAddModalWithStatus = (status: LeadStatus) => {
    setAddModalDefaultStatus(status);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Leads
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage, organize and track your leads from one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setAddModalDefaultStatus('new');
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            + Add Lead
          </Button>
        </div>
      </div>

      {/* CRM Metric Cards (Live calculation from user's actual lead data) */}
      <LeadMetricsCards
        leads={leads}
        activeStatusFilter={statusFilter}
        onFilterByStatus={(status) => {
          setStatusFilter(status);
        }}
      />

      {/* Search, Filter, Sort & View Controls */}
      <LeadFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onExportCSV={handleExportCSV}
        onOpenAddModal={() => {
          setAddModalDefaultStatus('new');
          setIsAddModalOpen(true);
        }}
        totalFilteredCount={filteredLeads.length}
        totalCount={leads.length}
      />

      {/* View Mode Content */}
      {viewMode === 'table' && (
        <LeadTableView
          leads={filteredLeads}
          onEditLead={(lead) => setEditingLead(lead)}
          onDeleteLead={(lead) => setDeletingLead(lead)}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}

      {viewMode === 'grid' && (
        <LeadGridView
          leads={filteredLeads}
          onEditLead={(lead) => setEditingLead(lead)}
          onDeleteLead={(lead) => setDeletingLead(lead)}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}

      {viewMode === 'kanban' && (
        <LeadKanbanView
          leads={filteredLeads}
          onQuickStatusChange={handleQuickStatusChange}
          onOpenAddModalWithStatus={handleOpenAddModalWithStatus}
        />
      )}

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={addLead}
        defaultStatus={addModalDefaultStatus}
      />

      {/* Edit Lead Modal */}
      <EditLeadModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        lead={editingLead}
        onUpdateLead={updateLead}
      />

      {/* Delete Lead Confirm Modal */}
      <DeleteLeadConfirmModal
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        lead={deletingLead}
        onConfirmDelete={deleteLead}
      />
    </div>
  );
}
