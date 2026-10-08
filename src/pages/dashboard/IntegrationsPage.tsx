import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Integration } from '../../types';
import { IntegrationsMetricsBar } from '../../components/integrations/IntegrationsMetricsBar';
import { IntegrationCard } from '../../components/integrations/IntegrationCard';
import { ConfigureWebhookModal } from '../../components/integrations/ConfigureWebhookModal';
import { ConfigureOAuthModal } from '../../components/integrations/ConfigureOAuthModal';
import { TestConnectionModal } from '../../components/integrations/TestConnectionModal';
import { DisconnectConfirmModal } from '../../components/integrations/DisconnectConfirmModal';
import { AddCustomWebhookModal } from '../../components/integrations/AddCustomWebhookModal';
import {
  Search,
  X,
  RotateCw,
  Plus,
  Radio,
  SlidersHorizontal,
  Layers,
  Sparkles,
  AlertCircle,
  Loader2,
  PlugZap,
} from 'lucide-react';

export function IntegrationsPage() {
  const {
    integrations,
    isLoadingIntegrations,
    integrationsError,
    connectIntegration,
    disconnectIntegration,
    updateIntegrationConfig,
    testIntegrationConnection,
    addCustomWebhook,
    refreshIntegrations,
  } = useData();

  const { success, error: toastError, info } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Productivity' | 'Communication' | 'Developer Tools'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Connected' | 'Not Connected'>('All');

  // Modal states
  const [webhookModalTarget, setWebhookModalTarget] = useState<Integration | null>(null);
  const [oauthModalTarget, setOauthModalTarget] = useState<Integration | null>(null);
  const [testModalTarget, setTestModalTarget] = useState<Integration | null>(null);
  const [disconnectModalTarget, setDisconnectModalTarget] = useState<Integration | null>(null);
  const [isAddWebhookOpen, setIsAddWebhookOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered Integrations list
  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      // 1. Category Filter
      if (categoryFilter !== 'All') {
        if (categoryFilter === 'Developer Tools' && item.category !== 'Developer Tools') {
          return false;
        }
        if (categoryFilter === 'Productivity' && item.category !== 'Productivity') {
          return false;
        }
        if (categoryFilter === 'Communication' && item.category !== 'Communication') {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter === 'Connected' && item.status !== 'connected') {
        return false;
      }
      if (statusFilter === 'Not Connected' && item.status === 'connected') {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesKey = item.key.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesAccount = item.accountName?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesDesc && !matchesKey && !matchesCat && !matchesAccount) {
          return false;
        }
      }

      return true;
    });
  }, [integrations, categoryFilter, statusFilter, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshIntegrations();
      info('Status Refreshed', 'Checked synchronization state across all active connectors.');
    } catch (e: any) {
      toastError('Refresh Failed', e?.message || 'Could not refresh integration statuses.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Card Action Handlers
  const handleConnectClick = (item: Integration) => {
    if (item.authType === 'webhook') {
      setWebhookModalTarget(item);
    } else {
      setOauthModalTarget(item);
    }
  };

  const handleConfigureClick = (item: Integration) => {
    if (item.authType === 'webhook') {
      setWebhookModalTarget(item);
    } else {
      setOauthModalTarget(item);
    }
  };

  const handleTestClick = (item: Integration) => {
    setTestModalTarget(item);
  };

  const handleDisconnectClick = (item: Integration) => {
    setDisconnectModalTarget(item);
  };

  const handleConfirmDisconnect = async (id: string) => {
    try {
      await disconnectIntegration(id);
      success('Integration Disconnected', 'Connector access revoked and automation listeners paused.');
    } catch (e: any) {
      toastError('Error', e?.message || 'Failed to disconnect integration.');
    }
  };

  const handleSaveWebhookConfig = async (config: Record<string, any>) => {
    if (!webhookModalTarget) return;
    await updateIntegrationConfig(webhookModalTarget.id, config);
  };

  const handleTestWebhookDirect = async (url: string, method: string) => {
    if (!webhookModalTarget) {
      return { success: false, message: 'No target selected' };
    }
    return testIntegrationConnection(webhookModalTarget.id, false, { url, method });
  };

  const handleSaveOAuthConfig = async (config: Record<string, any>) => {
    if (!oauthModalTarget) return;
    await updateIntegrationConfig(oauthModalTarget.id, config);
  };

  const handleConnectOAuth = async (config: Record<string, any>) => {
    if (!oauthModalTarget) return;
    await connectIntegration(oauthModalTarget.id, config);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Integrations & Connectors
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
              {integrations.filter((i) => i.status === 'connected').length} Active
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Connect CRMs, communication channels, Google Workspace, and signed HTTP webhooks with FlowPilot AI.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoadingIntegrations}
            leftIcon={<RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddWebhookOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Custom Webhook
          </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <IntegrationsMetricsBar
        integrations={integrations}
        activeFilter={statusFilter}
        onSelectFilter={(f) => setStatusFilter(f as any)}
      />

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search integrations, protocols, endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories & Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs overflow-x-auto shadow-2xs">
            {(['All', 'Productivity', 'Communication', 'Developer Tools'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Tabs Filter */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs shadow-2xs">
            {(['All', 'Connected', 'Not Connected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state banner if any */}
      {integrationsError && (
        <div className="p-3.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{integrationsError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoadingIntegrations && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <p className="text-xs text-neutral-500">Loading connectors and verifying endpoints...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingIntegrations && filteredIntegrations.length === 0 && (
        <div className="py-16 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
            <PlugZap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            No matching integrations found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {searchQuery
              ? `No integrations matched "${searchQuery}". Try clearing your search query or switching categories.`
              : 'No connectors are currently active for the selected filters.'}
          </p>
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
                setStatusFilter('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* Integrations Responsive Grid */}
      {!isLoadingIntegrations && filteredIntegrations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIntegrations.map((item) => (
            <IntegrationCard
              key={item.id}
              integration={item}
              onConnect={handleConnectClick}
              onConfigure={handleConfigureClick}
              onTest={handleTestClick}
              onDisconnect={handleDisconnectClick}
            />
          ))}
        </div>
      )}

      {/* Security & Protocol Architecture Footer Banner */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 text-xs text-neutral-600 dark:text-neutral-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Enterprise Security & Zero-Trust Architecture
          </span>
          <p className="text-[11px] text-neutral-500">
            FlowPilot enforces Row Level Security (RLS) on all integration parameters. Client secrets, OAuth tokens, and webhook HMAC digests are stored strictly server-side and never exposed to browser runtimes.
          </p>
        </div>
        <a
          href="https://supabase.com/docs/guides/database/postgres/row-level-security"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline shrink-0"
        >
          Security Policies &rarr;
        </a>
      </div>

      {/* Configure Webhook Modal */}
      <ConfigureWebhookModal
        integration={webhookModalTarget}
        isOpen={!!webhookModalTarget}
        onClose={() => setWebhookModalTarget(null)}
        onSave={handleSaveWebhookConfig}
        onTest={handleTestWebhookDirect}
      />

      {/* Configure OAuth Modal */}
      <ConfigureOAuthModal
        integration={oauthModalTarget}
        isOpen={!!oauthModalTarget}
        onClose={() => setOauthModalTarget(null)}
        onSave={handleSaveOAuthConfig}
        onConnect={handleConnectOAuth}
      />

      {/* Test Connection Modal */}
      <TestConnectionModal
        integration={testModalTarget}
        isOpen={!!testModalTarget}
        onClose={() => setTestModalTarget(null)}
        onRunTest={testIntegrationConnection}
      />

      {/* Disconnect Confirmation Modal */}
      <DisconnectConfirmModal
        integration={disconnectModalTarget}
        isOpen={!!disconnectModalTarget}
        onClose={() => setDisconnectModalTarget(null)}
        onConfirm={handleConfirmDisconnect}
      />

      {/* Add Custom Webhook Modal */}
      <AddCustomWebhookModal
        isOpen={isAddWebhookOpen}
        onClose={() => setIsAddWebhookOpen(false)}
        onAdd={addCustomWebhook}
      />
    </div>
  );
}
