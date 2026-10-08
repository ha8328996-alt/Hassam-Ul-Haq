import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Unable to load data',
  description = 'An error occurred while connecting to the automation service. Please verify your connection and try again.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10 ${className}`}
    >
      <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
}
