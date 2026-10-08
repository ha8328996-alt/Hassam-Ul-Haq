import React from 'react';
import { LeadStatus } from '../../types';

interface LeadStatusBadgeProps {
  status: LeadStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function LeadStatusBadge({ status, size = 'sm', className = '' }: LeadStatusBadgeProps) {
  const normStatus = (status || 'new').toLowerCase();

  const config: Record<string, { label: string; bg: string; text: string; dot: string; border: string }> = {
    new: {
      label: 'New',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      dot: 'bg-sky-500',
      border: 'border-sky-200 dark:border-sky-800/60',
    },
    contacted: {
      label: 'Contacted',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-700 dark:text-indigo-300',
      dot: 'bg-indigo-500',
      border: 'border-indigo-200 dark:border-indigo-800/60',
    },
    qualified: {
      label: 'Qualified',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200 dark:border-emerald-800/60',
    },
    proposal: {
      label: 'Proposal',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      dot: 'bg-purple-500',
      border: 'border-purple-200 dark:border-purple-800/60',
    },
    converted: {
      label: 'Converted',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-300',
      dot: 'bg-teal-500',
      border: 'border-teal-200 dark:border-teal-800/60',
    },
    lost: {
      label: 'Lost',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500',
      border: 'border-rose-200 dark:border-rose-800/60',
    },
    unqualified: {
      label: 'Unqualified',
      bg: 'bg-neutral-100 dark:bg-neutral-800',
      text: 'text-neutral-600 dark:text-neutral-300',
      dot: 'bg-neutral-400',
      border: 'border-neutral-200 dark:border-neutral-700',
    },
  };

  const current = config[normStatus] || {
    label: normStatus.charAt(0).toUpperCase() + normStatus.slice(1),
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    text: 'text-neutral-700 dark:text-neutral-300',
    dot: 'bg-neutral-400',
    border: 'border-neutral-200 dark:border-neutral-700',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}
