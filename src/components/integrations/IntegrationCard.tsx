import React from 'react';
import { Integration } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { IntegrationBrandLogo } from './IntegrationBrandLogo';
import { IntegrationStatusBadge } from './IntegrationStatusBadge';
import {
  Settings,
  Play,
  Unlink,
  Check,
  ExternalLink,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (integration: Integration) => void;
  onConfigure: (integration: Integration) => void;
  onTest: (integration: Integration) => void;
  onDisconnect: (integration: Integration) => void;
}

export function IntegrationCard({
  integration,
  onConnect,
  onConfigure,
  onTest,
  onDisconnect,
}: IntegrationCardProps) {
  const isConnected = integration.status === 'connected';
  const isSetupRequired = integration.status === 'setup_required';
  const isWebhook = integration.authType === 'webhook';

  const authBadgeLabel = {
    webhook: 'Webhook',
    oauth: 'OAuth 2.0',
    api_key: 'API Key',
  }[integration.authType] || 'API';

  return (
    <Card className="flex flex-col justify-between p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs group">
      <div className="space-y-3.5">
        {/* Header: Logo, Name, Category, Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <IntegrationBrandLogo providerKey={integration.key} size="md" />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-none">
                  {integration.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                  {integration.category}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-1.5 py-0.5 rounded">
                  {authBadgeLabel}
                </span>
              </div>
            </div>
          </div>

          <IntegrationStatusBadge status={integration.status} size="sm" />
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed min-h-[36px]">
          {integration.description}
        </p>

        {/* Safe Config / Account Display */}
        {integration.accountName && (
          <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 truncate flex items-center gap-1.5">
            <span className="text-neutral-400 font-sans text-[10px]">Target:</span>
            <span className="truncate">{integration.accountName}</span>
          </div>
        )}

        {/* Last Sync / Test Info */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
          {integration.lastSync ? (
            <span className="font-mono text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400" />
              {integration.lastSync}
            </span>
          ) : (
            <span className="text-[10px] text-neutral-400 italic">No sync recorded</span>
          )}

          {integration.configuration?.lastTestedAt && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                integration.configuration.lastTestStatus === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
              }`}
            >
              Tested {integration.configuration.lastTestedAt}
            </span>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-2">
        {isConnected ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConfigure(integration)}
              leftIcon={<Settings className="w-3.5 h-3.5 text-neutral-500" />}
              className="flex-1"
            >
              Configure
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onTest(integration)}
              leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
              title="Test Connection"
            >
              Test
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDisconnect(integration)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 px-2.5"
              title="Disconnect"
            >
              <Unlink className="w-3.5 h-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant={isSetupRequired ? 'outline' : 'primary'}
              onClick={() => onConnect(integration)}
              className="flex-1"
            >
              {isSetupRequired ? 'Setup & Connect' : 'Connect'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConfigure(integration)}
              leftIcon={<Settings className="w-3.5 h-3.5 text-neutral-500" />}
              title="Configure Parameters"
            >
              Configure
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onTest(integration)}
              title="Test Connection"
            >
              <Play className="w-3.5 h-3.5 text-neutral-500" />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
