import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import {
  Copy,
  Plus,
  Calendar,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export function SettingsPage() {
  const { user, supabaseUser, updateUser } = useAuth();
  const { success } = useToast();
  const [workspaceName, setWorkspaceName] = useState(user?.workspaceName || 'Acme Operations Ltd.');
  const [primaryEmail, setPrimaryEmail] = useState(user?.email || 'alex.chen@flowpilot.ai');
  const [timezone, setTimezone] = useState('America/New_York (EST)');

  const formattedSignupDate = useMemo(() => {
    const rawDate = user?.createdAt || supabaseUser?.created_at;
    if (!rawDate) return 'Recently registered';
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return 'Recently registered';
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Recently registered';
    }
  }, [user?.createdAt, supabaseUser?.created_at]);

  const [apiKeys, setApiKeys] = useState([
    { id: 'key_live_9812', name: 'Production Hub Sync', key: 'fp_live_8921a98bc19203847', created: 'Oct 01, 2026', lastUsed: '3 mins ago' },
    { id: 'key_test_4120', name: 'Staging Sandbox', key: 'fp_test_4810294719283719', created: 'Sep 15, 2026', lastUsed: '4 days ago' },
  ]);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('https://api.acme-ops.com/v1/flowpilot/events');
  const [emailDigest, setEmailDigest] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ workspaceName, email: primaryEmail });
    success('Settings Saved', 'Workspace configuration updated successfully.');
  };

  const handleCopyKey = (keyString: string) => {
    navigator.clipboard.writeText(keyString);
    success('Key Copied', 'API secret copied to clipboard.');
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const newKey = {
      id: 'key_' + Math.random().toString(36).substring(2, 7),
      name: newKeyName,
      key: 'fp_live_' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      created: 'Just now',
      lastUsed: 'Never',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    success('API Key Generated', `Created "${newKeyName}".`);
    setIsKeyModalOpen(false);
    setNewKeyName('');
  };

  const handleRevokeKey = (id: string, name: string) => {
    if (confirm(`Revoke API key "${name}"? External services using this key will immediately fail.`)) {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      success('API Key Revoked', `Revoked ${name}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          General configuration, cryptographic API keys, webhooks, and security controls
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Profile & Supabase Identity Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Account Profile & Authentication</CardTitle>
                <p className="text-xs text-neutral-500">
                  Supabase user identity, access role, and verified creation metadata
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Account</span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                  Operator Name & Role
                </span>
                <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                  {user?.name || 'Authorized Operator'}
                </p>
                <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 capitalize">
                  {user?.role || 'user'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  Account Signup Date
                </span>
                <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                  {formattedSignupDate}
                </p>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Database Server Verified
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  User Identifier (UUID)
                </span>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 truncate max-w-[180px]">
                    {user?.id || 'usr_local_session'}
                  </code>
                  {user?.id && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(user.id);
                        success('Copied', 'User UUID copied to clipboard.');
                      }}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                      title="Copy user UUID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Row-Level Security Protected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>General Profile</CardTitle>
            <p className="text-xs text-neutral-500">Configure corporate identifiers and regional defaults</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Workspace Name"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
                <Input
                  label="Primary Administrator Email"
                  type="email"
                  required
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Operating Timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  options={[
                    { value: 'America/New_York (EST)', label: 'America/New York (EST)' },
                    { value: 'America/Los_Angeles (PST)', label: 'America/Los Angeles (PST)' },
                    { value: 'Europe/London (GMT)', label: 'Europe/London (GMT)' },
                    { value: 'Europe/Berlin (CET)', label: 'Europe/Berlin (CET)' },
                    { value: 'Asia/Tokyo (JST)', label: 'Asia/Tokyo (JST)' },
                  ]}
                />
              </div>
              <div className="pt-2 flex justify-end">
                <Button type="submit" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* API Keys Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>API Access Keys</CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Secret tokens for programmatic ingestion and external agent orchestration
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsKeyModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Generate New Key
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100 dark:border-neutral-800/60 text-xs">
              {apiKeys.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-neutral-900 dark:text-white">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                        {item.key.slice(0, 12)}••••••••••••••••
                      </code>
                      <button
                        onClick={() => handleCopyKey(item.key)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded transition-colors cursor-pointer"
                        title="Copy full key"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-mono pt-0.5">
                      Created: {item.created} • Last active: {item.lastUsed}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRevokeKey(item.id, item.name)}
                    className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    Revoke Key
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Webhooks & Signing Card */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Delivery & Security</CardTitle>
            <p className="text-xs text-neutral-500">
              FlowPilot signs all outgoing payloads with HMAC SHA-256 for verified integrity
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Primary Outgoing Webhook URL"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.com/webhooks"
            />
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-neutral-700 dark:text-neutral-300 block">
                  Signing Secret
                </span>
                <code className="text-[11px] font-mono text-neutral-500">
                  whsec_89102471928471092837401928347109
                </code>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopyKey('whsec_89102471928471092837401928347109')}
                leftIcon={<Copy className="w-3 h-3" />}
              >
                Copy Secret
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <p className="text-xs text-neutral-500">Choose when and how FlowPilot alerts your operators</p>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer">
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">Daily Operational Digest</p>
                <p className="text-neutral-500 text-[11px]">Receive 08:00 AM summary of throughput, hours saved, and lead volume.</p>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => {
                  setEmailDigest(e.target.checked);
                  success('Preference Saved', 'Updated daily digest notification setting.');
                }}
                className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer">
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">Slack Urgent Escalation</p>
                <p className="text-neutral-500 text-[11px]">Immediately post to #pipeline-alerts when customer sentiment drops below 0.3.</p>
              </div>
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => {
                  setSlackAlerts(e.target.checked);
                  success('Preference Saved', 'Updated Slack escalation setting.');
                }}
                className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0"
              />
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Generate Key Modal */}
      <Modal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        title="Generate Secret API Key"
        description="Provide a descriptive name to track key usage."
        maxWidth="md"
      >
        <form onSubmit={handleGenerateKey} className="space-y-4 pt-2">
          <Input
            label="Key Identifier"
            required
            placeholder="e.g. Production Webhook Ingest"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsKeyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Generate Secret Key
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
