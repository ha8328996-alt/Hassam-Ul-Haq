import React from 'react';
import { Lead, LeadStatus } from '../../types';
import { Card } from '../ui/Card';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadScoreBadge } from './LeadScoreBadge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Users, Mail, Phone, ExternalLink, Edit2, Trash2, Building, DollarSign } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

interface LeadGridViewProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onQuickStatusChange: (leadId: string, nextStatus: LeadStatus) => void;
}

export function LeadGridView({
  leads,
  onEditLead,
  onDeleteLead,
  onQuickStatusChange,
}: LeadGridViewProps) {
  const { navigate } = useRouter();

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads match your criteria"
        description="Try adjusting your search terms or filters to find leads in your CRM."
        icon={<Users className="w-6 h-6" />}
      />
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-blue-600',
      'bg-indigo-600',
      'bg-purple-600',
      'bg-emerald-600',
      'bg-teal-600',
      'bg-amber-600',
      'bg-rose-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leads.map((lead) => {
        return (
          <Card
            key={lead.id}
            className="p-5 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-xs group cursor-pointer"
            onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
          >
            <div>
              {/* Card Header: Avatar + Name + Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${getAvatarBg(
                      lead.name
                    )}`}
                  >
                    {getInitials(lead.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-neutral-900 dark:text-white truncate group-hover:text-neutral-950 dark:group-hover:text-white">
                      {lead.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {lead.title || 'Decision Maker'}
                    </p>
                  </div>
                </div>
                <LeadScoreBadge score={lead.score} />
              </div>

              {/* Company & ARR badge */}
              <div className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium truncate">
                  <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{lead.company}</span>
                </div>
                <div className="font-mono font-semibold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                  ${(lead.estimatedValue || 0).toLocaleString()} <span className="text-[10px] text-neutral-400 font-sans">ARR</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-2.5 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                {lead.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{lead.email}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate text-[11px]">{lead.phone}</span>
                  </div>
                )}
              </div>

              {/* Status and Source tags */}
              <div className="mt-3.5 flex items-center justify-between gap-2">
                <LeadStatusBadge status={lead.status} />
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 truncate">
                  {lead.source || 'Website'}
                </span>
              </div>

              {/* AI summary snippet if available */}
              {lead.aiNotes && (
                <p className="mt-2.5 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 italic bg-neutral-50 dark:bg-neutral-950/60 p-2 rounded-lg border border-neutral-100 dark:border-neutral-800/60">
                  "{lead.aiNotes}"
                </p>
              )}
            </div>

            {/* Card Footer Actions */}
            <div
              className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <select
                value={lead.status}
                onChange={(e) => onQuickStatusChange(lead.id, e.target.value as LeadStatus)}
                className="text-xs font-medium py-1 px-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                <option value="new">Move: New</option>
                <option value="contacted">Move: Contacted</option>
                <option value="qualified">Move: Qualified</option>
                <option value="proposal">Move: Proposal</option>
                <option value="converted">Move: Converted</option>
                <option value="lost">Move: Lost</option>
              </select>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                  title="View Lead Details"
                  className="px-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditLead(lead)}
                  title="Edit Lead"
                  className="px-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-neutral-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteLead(lead)}
                  title="Delete Lead"
                  className="px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
