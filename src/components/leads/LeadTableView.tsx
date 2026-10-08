import React from 'react';
import { Lead, LeadStatus } from '../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadScoreBadge } from './LeadScoreBadge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Users, Mail, Phone, ExternalLink, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

interface LeadTableViewProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onQuickStatusChange: (leadId: string, nextStatus: LeadStatus) => void;
}

export function LeadTableView({
  leads,
  onEditLead,
  onDeleteLead,
  onQuickStatusChange,
}: LeadTableViewProps) {
  const { navigate } = useRouter();

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads match your criteria"
        description="Try adjusting your search terms, changing status filters, or adding a new lead to your pipeline."
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
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/80 dark:bg-neutral-950/40">
            <TableHead>Prospect / Contact</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>ICP Score</TableHead>
            <TableHead align="right">Est. ARR</TableHead>
            <TableHead>Source</TableHead>
            <TableHead align="right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            return (
              <TableRow
                key={lead.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
              >
                {/* Lead Name + Avatar + Title */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${getAvatarBg(
                        lead.name
                      )}`}
                    >
                      {getInitials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate group-hover:text-neutral-950 dark:group-hover:text-white flex items-center gap-1.5">
                        <span>{lead.name}</span>
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {lead.title || 'Decision Maker'}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Company */}
                <TableCell>
                  <p className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {lead.company}
                  </p>
                  {lead.country && (
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                      {lead.country}
                    </p>
                  )}
                </TableCell>

                {/* Contact: Email & Phone */}
                <TableCell>
                  <div className="space-y-0.5">
                    {lead.email && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                        <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate max-w-[150px] font-mono text-[11px]">
                          {lead.email}
                        </span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate max-w-[150px] text-[11px]">{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Status + Quick Changer */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <LeadStatusBadge status={lead.status} />
                    <select
                      value={lead.status}
                      onChange={(e) => onQuickStatusChange(lead.id, e.target.value as LeadStatus)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-[11px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 rounded p-0.5 text-neutral-600 dark:text-neutral-300 cursor-pointer transition-opacity"
                      title="Quick Change Status"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </TableCell>

                {/* ICP Score */}
                <TableCell>
                  <LeadScoreBadge score={lead.score} showBar={true} />
                </TableCell>

                {/* Est. ARR */}
                <TableCell isNumeric>
                  <span className="font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-white">
                    ${(lead.estimatedValue || 0).toLocaleString()}
                  </span>
                </TableCell>

                {/* Source */}
                <TableCell>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium whitespace-nowrap">
                    {lead.source || 'Website'}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
