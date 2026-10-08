import React from 'react';
import { Card } from '../ui/Card';
import { Integration } from '../../types';
import { CheckCircle2, AlertTriangle, Radio, Globe } from 'lucide-react';

interface IntegrationsMetricsBarProps {
  integrations: Integration[];
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export function IntegrationsMetricsBar({
  integrations,
  activeFilter,
  onSelectFilter,
}: IntegrationsMetricsBarProps) {
  const total = integrations.length;
  const connected = integrations.filter((i) => i.status === 'connected').length;
  const setupRequired = integrations.filter((i) => i.status === 'setup_required').length;
  const webhooks = integrations.filter((i) => i.authType === 'webhook').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card
        onClick={() => onSelectFilter('All')}
        className={`p-4 cursor-pointer transition-all hover:border-neutral-400 dark:hover:border-neutral-600 ${
          activeFilter === 'All' ? 'ring-1 ring-neutral-900 dark:ring-white bg-neutral-50/50 dark:bg-neutral-900/50' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Total Connectors
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mt-1">
              {total}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-neutral-400 mt-2 truncate">
          Available enterprise integrations
        </p>
      </Card>

      <Card
        onClick={() => onSelectFilter('Connected')}
        className={`p-4 cursor-pointer transition-all hover:border-emerald-400 dark:hover:border-emerald-600 ${
          activeFilter === 'Connected' ? 'ring-1 ring-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Active Connections
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
              {connected}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 mt-2 truncate">
          Streaming events in real-time
        </p>
      </Card>

      <Card
        onClick={() => onSelectFilter('Not Connected')}
        className={`p-4 cursor-pointer transition-all hover:border-amber-400 dark:hover:border-amber-600 ${
          activeFilter === 'Not Connected' ? 'ring-1 ring-amber-500 bg-amber-50/20 dark:bg-amber-950/20' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Setup Required
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-1">
              {setupRequired}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 mt-2 truncate">
          Needs OAuth / API credentials
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Webhook Endpoints
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mt-1">
              {webhooks}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
            <Radio className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-neutral-400 mt-2 truncate">
          Custom HTTP callbacks configured
        </p>
      </Card>
    </div>
  );
}
