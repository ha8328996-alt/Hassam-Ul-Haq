import React from 'react';
import { IntegrationStatus } from '../../types';
import { AlertTriangle, CheckCircle2, Circle, Clock } from 'lucide-react';

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function IntegrationStatusBadge({
  status,
  size = 'sm',
  className = '',
}: IntegrationStatusBadgeProps) {
  const isSm = size === 'sm';
  const sizeClass = isSm ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (status) {
    case 'connected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 ${sizeClass} ${className}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Connected
        </span>
      );

    case 'setup_required':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 ${sizeClass} ${className}`}
          title="OAuth credentials or API secret configuration required in server environment"
        >
          <AlertTriangle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Setup Required
        </span>
      );

    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 ${sizeClass} ${className}`}
        >
          <Clock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Pending
        </span>
      );

    case 'disconnected':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 ${sizeClass} ${className}`}
        >
          <Circle className={isSm ? 'w-2 h-2 fill-neutral-400 text-neutral-400' : 'w-2.5 h-2.5 fill-neutral-400 text-neutral-400'} />
          Not Connected
        </span>
      );
  }
}
