import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Integration } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Globe, Shield, Play, Code, CheckSquare, Square, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ConfigureWebhookModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Record<string, any>) => Promise<void>;
  onTest: (url: string, method: string) => Promise<any>;
}

const AVAILABLE_EVENTS = [
  { id: 'lead.created', label: 'Lead Created', desc: 'When a new lead enters the CRM' },
  { id: 'lead.status_updated', label: 'Lead Status Changed', desc: 'When lead moves stages (e.g. Qualified, Proposal)' },
  { id: 'agent.action_completed', label: 'AI Agent Action Finished', desc: 'When autonomous reasoning run concludes' },
  { id: 'automation.executed', label: 'Workflow Executed', desc: 'When an automated step pipeline fires' },
  { id: 'conversation.new_message', label: 'Omnichannel Inbound Chat', desc: 'When customer sends a new message' },
];

export function ConfigureWebhookModal({
  integration,
  isOpen,
  onClose,
  onSave,
  onTest,
}: ConfigureWebhookModalProps) {
  const { success, error: toastError } = useToast();
  const [url, setUrl] = useState(integration?.configuration?.webhookUrl || 'https://api.flowpilot.ai/v1/webhook-receiver');
  const [method, setMethod] = useState<'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'>(
    (integration?.configuration?.webhookMethod as any) || 'POST'
  );
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    integration?.configuration?.webhookEvents || ['lead.created', 'agent.action_completed']
  );
  const [customHeaderKey, setCustomHeaderKey] = useState('');
  const [customHeaderVal, setCustomHeaderVal] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; statusCode?: number; latencyMs?: number; message: string } | null>(null);

  // Sync state if integration changes
  React.useEffect(() => {
    if (integration) {
      setUrl(integration.configuration?.webhookUrl || 'https://api.flowpilot.ai/v1/webhook-receiver');
      setMethod((integration.configuration?.webhookMethod as any) || 'POST');
      setSelectedEvents(integration.configuration?.webhookEvents || ['lead.created', 'agent.action_completed']);
      setTestResult(null);
    }
  }, [integration]);

  const toggleEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleTestNow = async () => {
    if (!url.trim()) {
      toastError('URL Required', 'Please provide a destination endpoint URL to test.');
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTest(url, method);
      setTestResult(res);
      if (res.success) {
        success('Webhook Test Succeeded', res.message);
      } else {
        toastError('Webhook Test Notice', res.message);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Failed to dispatch test ping',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toastError('Validation Error', 'Webhook endpoint URL cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        webhookUrl: url.trim(),
        webhookMethod: method,
        webhookEvents: selectedEvents,
        accountName: url.trim(),
      });
      success('Webhook Configured', 'Endpoint configuration and event subscriptions updated.');
      onClose();
    } catch (err: any) {
      toastError('Save Error', err?.message || 'Could not update webhook configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const samplePayload = {
    event: selectedEvents[0] || 'lead.created',
    timestamp: new Date().toISOString(),
    event_id: 'evt_98a72b01',
    data: {
      lead_id: 'lead_01',
      name: 'Marcus Vance',
      company: 'Nordic Steel Corp',
      email: 'm.vance@nordicsteel.io',
      score: 96,
      status: 'qualified',
      source: 'Inbound Qualifier Agent',
    },
    context: {
      workspace_id: 'ws_flowpilot_prod',
      agent: 'Gemini 2.5 Pro Lead Qualifier',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure ${integration?.name || 'Webhook Endpoint'}`}
      description="Route real-time HTTP callbacks to your servers, serverless lambdas, or middleware."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Endpoint Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Payload Schema
          </button>
        </div>

        {activeTab === 'settings' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL & Method */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Destination Endpoint URL <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-28 text-xs font-mono font-semibold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                </select>
                <div className="flex-1">
                  <Input
                    placeholder="https://api.yourdomain.com/webhooks/flowpilot"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Supports any public HTTPS URL (e.g. AWS API Gateway, Supabase Edge Functions, Zapier, Make).
              </p>
            </div>

            {/* Event Subscriptions */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Trigger Events ({selectedEvents.length} selected)
              </label>
              <div className="space-y-2 bg-neutral-50 dark:bg-neutral-950/60 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 max-h-48 overflow-y-auto">
                {AVAILABLE_EVENTS.map((ev) => {
                  const isChecked = selectedEvents.includes(ev.id);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => toggleEvent(ev.id)}
                      className="flex items-start gap-2.5 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      <button type="button" className="text-neutral-600 dark:text-neutral-300 mt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-neutral-900 dark:text-white block">
                          {ev.label}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          {ev.id} &bull; {ev.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HMAC Signature Security Box */}
            <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Cryptographic Payload Signing
                </span>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
                  Every payload includes a cryptographic HMAC SHA-256 digest in the header{' '}
                  <code className="bg-emerald-100/70 dark:bg-emerald-900/40 px-1 py-0.5 rounded font-mono text-[10px]">
                    X-FlowPilot-Signature
                  </code>
                  . Verify this digest on your server to prevent replay and spoofing attacks. Secrets are never exposed client-side.
                </p>
              </div>
            </div>

            {/* Test Results Output */}
            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-0.5">
                  <span className="font-semibold block">
                    {testResult.success ? 'Connectivity Verified' : 'Test Dispatch Notice'}
                  </span>
                  <p className="text-[11px] opacity-90">{testResult.message}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestNow}
                disabled={isTesting}
                leftIcon={isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
              >
                {isTesting ? 'Sending Ping...' : 'Test Connection'}
              </Button>

              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-3">
            <div className="p-3 bg-neutral-900 text-neutral-200 rounded-lg font-mono text-[11px] overflow-x-auto border border-neutral-800 leading-relaxed">
              <pre>{JSON.stringify(samplePayload, null, 2)}</pre>
            </div>
            <p className="text-[11px] text-neutral-500">
              FlowPilot dispatches payloads via HTTP POST/PUT with UTF-8 JSON headers and timestamp verification.
            </p>
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setActiveTab('settings')}>
                Back to Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
