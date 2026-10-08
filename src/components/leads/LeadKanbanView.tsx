import React from 'react';
import { Lead, LeadStatus } from '../../types';
import { LeadScoreBadge } from './LeadScoreBadge';
import { useRouter } from '../../context/RouterContext';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Building,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

interface LeadKanbanViewProps {
  leads: Lead[];
  onQuickStatusChange: (leadId: string, nextStatus: LeadStatus) => void;
  onOpenAddModalWithStatus?: (status: LeadStatus) => void;
}

interface ColumnConfig {
  id: LeadStatus;
  title: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  borderTop: string;
}

export function LeadKanbanView({
  leads,
  onQuickStatusChange,
  onOpenAddModalWithStatus,
}: LeadKanbanViewProps) {
  const { navigate } = useRouter();

  const columns: ColumnConfig[] = [
    {
      id: 'new',
      title: 'New',
      dotColor: 'bg-sky-500',
      badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
      badgeText: 'text-sky-700 dark:text-sky-300',
      borderTop: 'border-t-sky-500',
    },
    {
      id: 'contacted',
      title: 'Contacted',
      dotColor: 'bg-indigo-500',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      borderTop: 'border-t-indigo-500',
    },
    {
      id: 'qualified',
      title: 'Qualified',
      dotColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      borderTop: 'border-t-emerald-500',
    },
    {
      id: 'proposal',
      title: 'Proposal',
      dotColor: 'bg-purple-500',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
      badgeText: 'text-purple-700 dark:text-purple-300',
      borderTop: 'border-t-purple-500',
    },
    {
      id: 'converted',
      title: 'Converted',
      dotColor: 'bg-teal-500',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
      badgeText: 'text-teal-700 dark:text-teal-300',
      borderTop: 'border-t-teal-500',
    },
    {
      id: 'lost',
      title: 'Lost',
      dotColor: 'bg-rose-500',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
      badgeText: 'text-rose-700 dark:text-rose-300',
      borderTop: 'border-t-rose-500',
    },
  ];

  const stageOrder: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'converted', 'lost'];

  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    const idx = stageOrder.indexOf(current);
    if (idx >= 0 && idx < stageOrder.length - 1) {
      return stageOrder[idx + 1];
    }
    return null;
  };

  const getPrevStage = (current: LeadStatus): LeadStatus | null => {
    const idx = stageOrder.indexOf(current);
    if (idx > 0) {
      return stageOrder[idx - 1];
    }
    return null;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[600px] select-none scrollbar-thin">
      {columns.map((col) => {
        const colLeads = leads.filter(
          (l) => (l.status || '').toLowerCase() === col.id.toLowerCase()
        );
        const colTotalValue = colLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

        return (
          <div
            key={col.id}
            className={`w-72 shrink-0 bg-neutral-100/70 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[calc(100vh-250px)] border-t-4 ${col.borderTop}`}
          >
            {/* Column Header */}
            <div className="p-3 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h4 className="font-semibold text-xs text-neutral-900 dark:text-white truncate">
                  {col.title}
                </h4>
                <span
                  className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-full ${col.badgeBg} ${col.badgeText} tabular-nums`}
                >
                  {colLeads.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                  ${(colTotalValue / 1000).toFixed(0)}k
                </span>
                {onOpenAddModalWithStatus && (
                  <button
                    onClick={() => onOpenAddModalWithStatus(col.id)}
                    className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                    title={`Add lead to ${col.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Column Cards Container */}
            <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
              {colLeads.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500 italic border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                  No leads in {col.title}
                </div>
              ) : (
                colLeads.map((lead) => {
                  const prevStage = getPrevStage(lead.status as LeadStatus);
                  const nextStage = getNextStage(lead.status as LeadStatus);

                  return (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                      className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer group space-y-2.5"
                    >
                      {/* Name & ICP Score */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-neutral-900 dark:text-white truncate group-hover:text-neutral-950 dark:group-hover:text-white">
                            {lead.name}
                          </p>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                            {lead.title || 'Decision Maker'}
                          </p>
                        </div>
                        <LeadScoreBadge score={lead.score} />
                      </div>

                      {/* Company & Est ARR */}
                      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800/60">
                        <div className="flex items-center gap-1 min-w-0 font-medium truncate text-neutral-700 dark:text-neutral-300">
                          <Building className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate text-[11px]">{lead.company}</span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-neutral-900 dark:text-white tabular-nums shrink-0">
                          ${(lead.estimatedValue || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Pipeline Stage Shifters */}
                      <div
                        className="pt-1.5 flex items-center justify-between gap-1 border-t border-neutral-100 dark:border-neutral-800/60"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          {prevStage && (
                            <button
                              onClick={() => onQuickStatusChange(lead.id, prevStage)}
                              className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors text-[10px] flex items-center gap-0.5 cursor-pointer"
                              title={`Move back to ${prevStage}`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {nextStage && (
                            <button
                              onClick={() => onQuickStatusChange(lead.id, nextStage)}
                              className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors text-[10px] flex items-center gap-0.5 cursor-pointer"
                              title={`Advance to ${nextStage}`}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                          className="text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-0.5 transition-colors cursor-pointer"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
