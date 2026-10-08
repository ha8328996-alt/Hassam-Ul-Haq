import React from 'react';

interface LeadScoreBadgeProps {
  score: number;
  showBar?: boolean;
  size?: 'sm' | 'md';
}

export function LeadScoreBadge({ score, showBar = false, size = 'sm' }: LeadScoreBadgeProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));

  const getColorConfig = (val: number) => {
    if (val >= 85) {
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        bar: 'bg-emerald-500',
        label: 'High ICP Fit',
      };
    }
    if (val >= 70) {
      return {
        bg: 'bg-sky-500/10 dark:bg-sky-500/15',
        text: 'text-sky-700 dark:text-sky-300',
        border: 'border-sky-200 dark:border-sky-800/60',
        bar: 'bg-sky-500',
        label: 'Good Fit',
      };
    }
    if (val >= 50) {
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
        bar: 'bg-amber-500',
        label: 'Moderate',
      };
    }
    return {
      bg: 'bg-rose-500/10 dark:bg-rose-500/15',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800/60',
      bar: 'bg-rose-500',
      label: 'Low Fit',
    };
  };

  const config = getColorConfig(safeScore);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <div className="inline-flex items-center gap-2">
      {showBar && (
        <div className="w-12 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden shrink-0">
          <div
            className={`h-full ${config.bar} transition-all duration-300`}
            style={{ width: `${safeScore}%` }}
          />
        </div>
      )}
      <span
        className={`font-mono font-semibold rounded-md border tabular-nums ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
        title={`Intent & ICP Score: ${safeScore}/100 (${config.label})`}
      >
        {safeScore}
      </span>
    </div>
  );
}
