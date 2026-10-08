import React from 'react';

export type StatusVariant = 'active' | 'paused' | 'success' | 'warning' | 'error' | 'neutral';

interface StatusIndicatorProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
}

export function StatusIndicator({ status, label, className = '' }: StatusIndicatorProps) {
  const getDotColor = () => {
    switch (status) {
      case 'active':
      case 'success':
      case 'connected':
      case 'resolved':
      case 'qualified':
        return 'bg-emerald-500';
      case 'paused':
      case 'warning':
      case 'contacted':
      case 'needs_human':
        return 'bg-amber-500';
      case 'error':
      case 'unqualified':
      case 'disconnected':
        return 'bg-rose-500';
      case 'training':
      case 'new':
      case 'ai_handled':
        return 'bg-sky-500';
      default:
        return 'bg-neutral-400';
    }
  };

  const displayText = label || (status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '));

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} aria-hidden="true" />
      <span>{displayText}</span>
    </span>
  );
}
