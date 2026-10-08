import React from 'react';

interface IntegrationBrandLogoProps {
  providerKey: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IntegrationBrandLogo({
  providerKey,
  size = 'md',
  className = '',
}: IntegrationBrandLogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 p-1 rounded-md text-xs',
    md: 'w-10 h-10 p-2 rounded-lg text-sm',
    lg: 'w-12 h-12 p-2.5 rounded-xl text-base',
  }[size];

  switch (providerKey) {
    case 'webhooks':
    case 'custom_webhook':
      return (
        <div
          className={`${sizeClasses} bg-neutral-900 border border-neutral-700/80 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs ${className}`}
          title="HTTP Webhook"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c0-2.21 1.79-4 4-4h1" />
            <path d="M6 13V4.9C6 3.85 6.85 3 7.9 3c1.06 0 1.9.85 1.9 1.9V7" />
            <circle cx="18" cy="17" r="3" fill="currentColor" fillOpacity="0.2" />
            <circle cx="6" cy="17" r="3" fill="currentColor" fillOpacity="0.2" />
            <circle cx="18" cy="7" r="3" fill="currentColor" fillOpacity="0.2" />
            <path d="M18 10V7" />
            <path d="m15 10 3-3 3 3" />
          </svg>
        </div>
      );

    case 'google_sheets':
    case 'sheets':
      return (
        <div
          className={`${sizeClasses} bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}
          title="Google Sheets"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#0F9D58" fillOpacity="0.2" stroke="#0F9D58" strokeWidth="1.8" />
            <path d="M14 2v6h6" stroke="#0F9D58" strokeWidth="1.8" />
            <path d="M8 13h8M8 17h8M12 10v10" stroke="#0F9D58" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'slack':
      return (
        <div
          className={`${sizeClasses} bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 shadow-xs ${className}`}
          title="Slack"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M6 15a2 2 0 0 1-2-2V9a2 2 0 0 1 4 0v4a2 2 0 0 1-2 2z" fill="#E01E5A" />
            <path d="M15 18a2 2 0 0 1-2 2H9a2 2 0 0 1 0-4h4a2 2 0 0 1 2 2z" fill="#36C5F0" />
            <path d="M18 9a2 2 0 0 1 2 2v4a2 2 0 0 1-4 0v-4a2 2 0 0 1 2-2z" fill="#2EB67D" />
            <path d="M9 6a2 2 0 0 1 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 1-2-2z" fill="#ECB22E" />
          </svg>
        </div>
      );

    case 'gmail':
    case 'google_workspace':
      return (
        <div
          className={`${sizeClasses} bg-red-50 dark:bg-red-950/50 border border-red-200/80 dark:border-red-900/60 flex items-center justify-center shrink-0 shadow-xs ${className}`}
          title="Gmail"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#EA4335" strokeWidth="1.8" fill="#EA4335" fillOpacity="0.1" />
            <path d="M3 7l9 6 9-6" stroke="#EA4335" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 19l6.5-6.5M21 19l-6.5-6.5" stroke="#EA4335" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'hubspot':
      return (
        <div
          className={`${sizeClasses} bg-orange-50 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-900/60 flex items-center justify-center shrink-0 shadow-xs ${className}`}
          title="HubSpot"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle cx="12" cy="12" r="4.5" fill="#FF7A59" fillOpacity="0.2" stroke="#FF7A59" strokeWidth="2" />
            <circle cx="18" cy="8" r="2.5" fill="#FF7A59" />
            <path d="M12 7.5V4M12 4a2 2 0 1 0-2 2" stroke="#FF7A59" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M15.5 10l-1.5 1" stroke="#FF7A59" strokeWidth="1.8" />
          </svg>
        </div>
      );

    case 'stripe':
      return (
        <div
          className={`${sizeClasses} bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 flex items-center justify-center shrink-0 shadow-xs ${className}`}
          title="Stripe"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <rect width="24" height="24" rx="4" fill="#635BFF" fillOpacity="0.15" />
            <path
              d="M14.5 9.8c0-1.1-.9-1.6-2.3-1.6-1.5 0-2.8.5-3.7 1.1l-.5-2.2c1.1-.6 2.7-1.1 4.5-1.1 3.5 0 5.4 1.7 5.4 4.3 0 3.8-5.2 3.2-5.2 4.9 0 .6.6.9 1.6.9 1.3 0 2.8-.5 3.7-1.1l.5 2.2c-1.1.6-2.7 1.1-4.5 1.1-3.6 0-5.4-1.8-5.4-4.3-.1-3.8 5.9-3.2 5.9-5.2z"
              fill="#635BFF"
            />
          </svg>
        </div>
      );

    case 'salesforce':
      return (
        <div
          className={`${sizeClasses} bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-900/60 flex items-center justify-center shrink-0 shadow-xs ${className}`}
          title="Salesforce"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M8.5 8a4.5 4.5 0 0 1 7.2-1.5A5.5 5.5 0 0 1 20 12.5a4 4 0 0 1-3.5 4h-10a4.5 4.5 0 0 1-.8-8.9A4.4 4.4 0 0 1 8.5 8z"
              fill="#00A1E0"
              fillOpacity="0.2"
              stroke="#00A1E0"
              strokeWidth="1.8"
            />
          </svg>
        </div>
      );

    case 'discord':
      return (
        <div
          className={`${sizeClasses} bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/60 flex items-center justify-center shrink-0 shadow-xs ${className}`}
          title="Discord"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M18.9 6.2a14.7 14.7 0 0 0-3.6-1.1.1.1 0 0 0-.1 0 10.3 10.3 0 0 0-.5 1 13.6 13.6 0 0 0-5.4 0 10.3 10.3 0 0 0-.5-1 .1.1 0 0 0-.1 0 14.7 14.7 0 0 0-3.6 1.1.1.1 0 0 0 0 0c-2.3 3.4-3 6.7-2.6 10a.1.1 0 0 0 0 .1 14.8 14.8 0 0 0 4.5 2.3.1.1 0 0 0 .1 0c.3-.5.7-1 1-1.5a.1.1 0 0 0-.1-.1c-.5-.2-1-.4-1.4-.7a.1.1 0 0 1 0-.1c.1-.1.2-.1.3-.2a10.6 10.6 0 0 0 9.7 0l.3.2a.1.1 0 0 1 0 .1c-.5.3-.9.5-1.4.7a.1.1 0 0 0-.1.1c.3.5.7 1 1 1.5a.1.1 0 0 0 .1 0 14.8 14.8 0 0 0 4.5-2.3.1.1 0 0 0 0-.1c.4-3.8-.7-7.1-2.7-10zM8.5 13.5c-.8 0-1.5-.7-1.5-1.6s.6-1.6 1.5-1.6c.8 0 1.5.7 1.5 1.6s-.7 1.6-1.5 1.6zm7 0c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6c.9 0 1.5.7 1.5 1.6s-.6 1.6-1.5 1.6z"
              fill="#5865F2"
            />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`${sizeClasses} bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0 shadow-xs ${className}`}
          title={providerKey}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
          </svg>
        </div>
      );
  }
}
