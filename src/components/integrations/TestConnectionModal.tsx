import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Integration } from '../../types';
import { IntegrationBrandLogo } from './IntegrationBrandLogo';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCw,
  Copy,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';

interface TestConnectionModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onRunTest: (
    id: string,
    isDemoTest?: boolean,
    customPayload?: any
  ) => Promise<{
    success: boolean;
    latencyMs?: number;
    statusCode?: number;
    message: string;
    details?: any;
    isDemo?: boolean;
  }>;
}

export function TestConnectionModal({
  integration,
  isOpen,
  onClose,
  onRunTest,
}: TestConnectionModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    statusCode?: number;
    message: string;
    details?: any;
    isDemo?: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!integration) return null;

  const isWebhook = integration.authType === 'webhook';
  const hasLiveCredentials =
    (integration.key === 'google_sheets' && Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)) ||
    (integration.key === 'gmail' && Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)) ||
    (integration.key === 'slack' && Boolean(import.meta.env.VITE_SLACK_CLIENT_ID || import.meta.env.VITE_SLACK_BOT_TOKEN));

  const handleTest = async (isDemo: boolean = false) => {
    setIsRunning(true);
    setTestResult(null);
    try {
      const res = await onRunTest(integration.id, isDemo);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection test could not be completed.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyLogs = () => {
    if (!testResult) return;
    navigator.clipboard.writeText(JSON.stringify(testResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Test Connection: ${integration.name}`}
      description="Validate connectivity, response latency, and authorization parameters."
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">
        {/* Header Summary */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40">
          <IntegrationBrandLogo providerKey={integration.key} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              {integration.name}
            </h4>
            <span className="text-[11px] font-mono text-neutral-500 block truncate">
              {isWebhook
                ? `Endpoint: ${integration.configuration?.webhookUrl || 'Not configured'}`
                : `Auth Protocol: OAuth 2.0 (${hasLiveCredentials ? 'Credentials Available' : 'Setup Required'})`}
            </span>
          </div>
        </div>

        {/* Real test instruction */}
        {isWebhook ? (
          <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
            <p>
              This action will dispatch an actual HTTP probe to{' '}
              <strong className="text-neutral-900 dark:text-white font-mono text-[11px]">
                {integration.configuration?.webhookUrl || 'https://api.flowpilot.ai/v1/webhook-receiver'}
              </strong>
              . The exact HTTP status code and round-trip latency will be measured.
            </p>
          </div>
        ) : !hasLiveCredentials ? (
          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 text-xs space-y-1.5">
            <div className="flex items-start gap-2 text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Setup Required: No Server OAuth Credentials</p>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 mt-0.5">
                  FlowPilot never simulates fake production connectivity. To test with live servers, set your OAuth credentials in the environment. Alternatively, you can run an explicit <strong>Sandbox Demo Test</strong>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            Verifies token freshness, API rate limits, and endpoint reachability for {integration.name}.
          </div>
        )}

        {/* Test Result Box */}
        {testResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs space-y-2.5 ${
              testResult.success
                ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                : 'bg-red-50/60 dark:bg-red-950/40 border-red-200 dark:border-red-800/80 text-red-950 dark:text-red-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                )}
                <span className="font-bold">
                  {testResult.isDemo
                    ? '[Demo Sandbox Test] Completed'
                    : testResult.success
                    ? 'Connection Succeeded'
                    : 'Connection Test Failed'}
                </span>
              </div>

              {testResult.latencyMs !== undefined && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  {testResult.latencyMs}ms
                </span>
              )}
            </div>

            <p className="text-[11px] leading-relaxed opacity-90">{testResult.message}</p>

            {/* Technical Result Metadata */}
            {testResult.details && (
              <div className="p-2.5 rounded bg-neutral-900 text-neutral-200 font-mono text-[10px] space-y-1 overflow-x-auto border border-neutral-800">
                <div className="flex justify-between items-center text-neutral-400 pb-1 border-b border-neutral-800">
                  <span>Diagnostic Output</span>
                  <button
                    onClick={handleCopyLogs}
                    className="hover:text-white cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[10px] leading-tight">
                  {JSON.stringify(testResult.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex gap-2">
            {!hasLiveCredentials && !isWebhook && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleTest(true)}
                disabled={isRunning}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              >
                {isRunning ? 'Evaluating...' : 'Run Demo Sandbox Test'}
              </Button>
            )}

            {(isWebhook || hasLiveCredentials) && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleTest(false)}
                disabled={isRunning}
                leftIcon={isRunning ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              >
                {isRunning ? 'Testing...' : 'Run Live Test'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
