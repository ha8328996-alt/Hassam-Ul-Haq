import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Integration } from '../../types';
import { useToast } from '../../context/ToastContext';
import { IntegrationBrandLogo } from './IntegrationBrandLogo';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Info,
  Key,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ConfigureOAuthModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Record<string, any>) => Promise<void>;
  onConnect: (config: Record<string, any>) => Promise<void>;
}

export function ConfigureOAuthModal({
  integration,
  isOpen,
  onClose,
  onSave,
  onConnect,
}: ConfigureOAuthModalProps) {
  const { success, error: toastError } = useToast();

  if (!integration) return null;

  // Check if live OAuth credentials exist in environment
  const hasEnvCredentials =
    (integration.key === 'google_sheets' && Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)) ||
    (integration.key === 'gmail' && Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)) ||
    (integration.key === 'slack' && Boolean(import.meta.env.VITE_SLACK_CLIENT_ID || import.meta.env.VITE_SLACK_BOT_TOKEN));

  const [channelName, setChannelName] = useState(
    integration.configuration?.channelName || '#leads-firehose'
  );
  const [spreadsheetName, setSpreadsheetName] = useState(
    integration.configuration?.spreadsheetName || 'FlowPilot Enterprise Inbound Pipeline'
  );
  const [spreadsheetId, setSpreadsheetId] = useState(
    integration.configuration?.spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  );
  const [accountEmail, setAccountEmail] = useState(
    integration.configuration?.accountEmail || 'sales-ops@flowpilot.ai'
  );
  const [fromName, setFromName] = useState(
    integration.configuration?.fromName || 'FlowPilot Sales Executive'
  );
  const [enableDemoMode, setEnableDemoMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scopes mapping per provider
  const scopes = {
    google_sheets: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'],
    gmail: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.compose'],
    slack: ['chat:write', 'channels:read', 'incoming-webhook', 'users:read'],
    hubspot: ['crm.objects.contacts.write', 'crm.objects.deals.write', 'timeline'],
    salesforce: ['api', 'refresh_token', 'offline_access'],
    stripe: ['checkout.session.completed', 'invoice.payment_failed'],
  }[integration.key] || ['read', 'write'];

  const envVarNames = {
    google_sheets: ['VITE_GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    gmail: ['VITE_GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    slack: ['VITE_SLACK_CLIENT_ID', 'SLACK_CLIENT_SECRET', 'SLACK_BOT_TOKEN'],
    hubspot: ['HUBSPOT_CLIENT_ID', 'HUBSPOT_CLIENT_SECRET'],
    salesforce: ['SALESFORCE_CONSUMER_KEY', 'SALESFORCE_CONSUMER_SECRET'],
    stripe: ['STRIPE_SECRET_KEY'],
  }[integration.key] || ['CLIENT_ID', 'CLIENT_SECRET'];

  const handleSaveOrConnect = async (isConnecting: boolean) => {
    if (!hasEnvCredentials && !enableDemoMode && isConnecting) {
      toastError(
        'Setup Required',
        `Live credentials for ${integration.name} are not configured in your server environment variables. To evaluate in demo mode, enable Sandbox Demo Evaluation below.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const configPayload = {
        channelName,
        spreadsheetName,
        spreadsheetId,
        accountEmail,
        fromName,
        isDemo: enableDemoMode,
      };

      if (isConnecting) {
        await onConnect(configPayload);
        success(
          enableDemoMode ? 'Demo Sandbox Connected' : 'Integration Connected',
          enableDemoMode
            ? `Connected ${integration.name} in isolated demo sandbox evaluation mode.`
            : `Successfully authorized and connected ${integration.name}.`
        );
      } else {
        await onSave(configPayload);
        success('Configuration Saved', `Updated configuration for ${integration.name}.`);
      }
      onClose();
    } catch (err: any) {
      toastError('Connection Error', err?.message || 'Could not save integration configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure ${integration.name}`}
      description="Manage OAuth authorization, environment credentials, and synchronization scopes."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        {/* Header with Logo */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40">
          <IntegrationBrandLogo providerKey={integration.key} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              {integration.name}
            </h4>
            <span className="text-[11px] font-mono text-neutral-500">
              Protocol: OAuth 2.0 &bull; Category: {integration.category}
            </span>
          </div>
          {hasEnvCredentials ? (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Credentials Present
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Setup Required
            </span>
          )}
        </div>

        {/* Environment Status Notice */}
        {!hasEnvCredentials ? (
          <div className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 text-xs space-y-2">
            <div className="flex items-start gap-2 text-amber-900 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Setup Required: Server Environment Variables Missing</p>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 mt-0.5 leading-relaxed">
                  In compliance with enterprise security policy, OAuth client secrets and tokens are never hardcoded or exposed in frontend code. To establish a real connection, configure these variables in your deployment environment:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {envVarNames.map((v) => (
                <code
                  key={v}
                  className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                >
                  {v}
                </code>
              ))}
            </div>

            {/* Sandbox Evaluation Toggle */}
            <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Enable Sandbox Demo Mode
                </span>
                <p className="text-[10px] text-neutral-500">
                  Allows testing workflows in an isolated evaluation sandbox without live credentials.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableDemoMode}
                  onChange={(e) => setEnableDemoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                OAuth Application Ready
              </span>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80">
                Valid OAuth credentials detected in environment. Tokens will be securely rotated.
              </p>
            </div>
          </div>
        )}

        {/* Integration Specific Fields */}
        <div className="space-y-3 pt-1">
          {integration.key === 'google_sheets' && (
            <>
              <Input
                label="Target Spreadsheet Name"
                value={spreadsheetName}
                onChange={(e) => setSpreadsheetName(e.target.value)}
                placeholder="FlowPilot Enterprise Inbound Pipeline"
              />
              <Input
                label="Google Sheet Document ID"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
            </>
          )}

          {integration.key === 'slack' && (
            <Input
              label="Default Notification Channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="#leads-firehose"
            />
          )}

          {integration.key === 'gmail' && (
            <>
              <Input
                label="Sender Display Name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="FlowPilot Sales Executive"
              />
              <Input
                label="Authorized Sender Email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                placeholder="sales-ops@flowpilot.ai"
              />
            </>
          )}

          {(integration.key === 'hubspot' || integration.key === 'salesforce') && (
            <Input
              label="Connected Account ID"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              placeholder="acct_hubspot_enterprise_8901"
            />
          )}
        </div>

        {/* Requested OAuth Scopes */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-neutral-500" /> Authorized Scopes
          </label>
          <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-wrap gap-1.5">
            {scopes.map((s) => (
              <span
                key={s}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded shadow-2xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSaveOrConnect(false)}
              disabled={isSubmitting}
            >
              Save Settings
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleSaveOrConnect(true)}
              disabled={isSubmitting || (!hasEnvCredentials && !enableDemoMode)}
            >
              {isSubmitting
                ? 'Connecting...'
                : enableDemoMode
                ? 'Connect Demo Sandbox'
                : 'Authorize & Connect'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
