import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useRouter } from '../../context/RouterContext';
import { AgentStatus } from '../../types';
import { TestAgentPanel } from '../../components/agents/TestAgentPanel';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  ArrowLeft,
  Edit,
  Power,
  Copy,
  Trash2,
  Terminal,
  Zap,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

interface AgentDetailPageProps {
  agentId: string;
}

export function AgentDetailPage({ agentId }: AgentDetailPageProps) {
  const { getAgentById, deleteAgent, duplicateAgent, setAgentStatus } = useData();
  const { success, error, info } = useToast();
  const { navigate } = useRouter();
  const agent = getAgentById(agentId);

  const [activeTab, setActiveTab] = useState<'overview' | 'test'>('overview');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!agent) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Agent Not Found</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            The requested AI agent could not be found or may have been deleted.
          </p>
        </div>
        <Button size="sm" onClick={() => navigate('/dashboard/agents')}>
          Back to AI Agents
        </Button>
      </div>
    );
  }

  const handleToggleStatus = async () => {
    const nextStatus: AgentStatus = agent.status === 'active' ? 'inactive' : 'active';
    try {
      await setAgentStatus(agent.id, nextStatus);
      info(
        `Agent ${nextStatus === 'active' ? 'Activated' : 'Deactivated'}`,
        `"${agent.name}" is now ${nextStatus}.`
      );
    } catch (err: any) {
      error('Status Update Failed', err?.message || 'Could not update agent status.');
    }
  };

  const handleDuplicate = async () => {
    try {
      const copy = await duplicateAgent(agent.id);
      success('Agent Duplicated', `Created "${copy.name}".`);
      navigate(`/dashboard/agents/${copy.id}`);
    } catch (err: any) {
      error('Duplication Failed', err?.message || 'Could not duplicate agent.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAgent(agent.id);
      success('Agent Deleted', `"${agent.name}" was permanently removed.`);
      navigate('/dashboard/agents');
    } catch (err: any) {
      error('Deletion Failed', err?.message || 'Could not delete agent.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const totalConversations = agent.conversationsCount || agent.totalExecutions || 0;
  const totalTasks = agent.tasksCount || Math.round((agent.totalExecutions || 1) * 2.4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/agents')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to agents list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {agent.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider ${
                  agent.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : agent.status === 'draft'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {agent.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                {agent.status}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                {agent.model}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {agent.role || 'Autonomous Assistant'} • Created on {agent.createdAt || 'Aug 2026'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={activeTab === 'test' ? 'primary' : 'outline'}
            onClick={() => setActiveTab(activeTab === 'test' ? 'overview' : 'test')}
            leftIcon={<Terminal className="w-3.5 h-3.5" />}
          >
            {activeTab === 'test' ? 'View Overview' : 'Test Agent'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/dashboard/agents/${agent.id}/edit`)}
            leftIcon={<Edit className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleStatus}
            leftIcon={<Power className="w-3.5 h-3.5" />}
          >
            {agent.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDuplicate}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
          >
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setDeleteConfirmOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <Card className="p-4">
          <span className="text-neutral-400 block text-[10px] uppercase">Total Conversations</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">
            {totalConversations.toLocaleString()}
          </span>
          <span className="text-[11px] text-neutral-400 mt-0.5 block font-sans">Across omnichannel threads</span>
        </Card>
        <Card className="p-4">
          <span className="text-neutral-400 block text-[10px] uppercase">Tasks Completed</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">
            {totalTasks.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-500 mt-0.5 block font-sans">99.4% autonomous</span>
        </Card>
        <Card className="p-4">
          <span className="text-neutral-400 block text-[10px] uppercase">Success Rate</span>
          <span className="text-2xl font-bold text-emerald-500 mt-1 block">
            {agent.successRate || 98.4}%
          </span>
          <span className="text-[11px] text-neutral-400 mt-0.5 block font-sans">0 schema violations</span>
        </Card>
        <Card className="p-4">
          <span className="text-neutral-400 block text-[10px] uppercase">Average Latency</span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-white mt-1 block">
            {agent.avgLatencyMs || 240}ms
          </span>
          <span className="text-[11px] text-neutral-400 mt-0.5 block font-sans">Fast execution</span>
        </Card>
      </div>

      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          Overview & Configuration
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'test'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          <span>Interactive Playground</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-500" />
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    System Instructions & Guidelines
                  </h3>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 text-neutral-800 dark:text-neutral-200 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {agent.system_instructions || agent.systemPrompt || 'No instructions provided.'}
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <Zap className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Permitted Autonomous Tools
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { key: 'webSearch', title: 'Web Search', enabled: agent.tools?.webSearch },
                  { key: 'leadCapture', title: 'Lead Capture', enabled: agent.tools?.leadCapture },
                  { key: 'email', title: 'Email Dispatch', enabled: agent.tools?.email },
                  { key: 'calendar', title: 'Calendar Scheduling', enabled: agent.tools?.calendar },
                  { key: 'crm', title: 'CRM Sync', enabled: agent.tools?.crm },
                  { key: 'webhook', title: 'Webhook Posting', enabled: agent.tools?.webhook },
                ].map((t) => (
                  <div
                    key={t.key}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      t.enabled
                        ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 text-neutral-900 dark:text-white'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-400'
                    }`}
                  >
                    <span className="font-medium text-xs">{t.title}</span>
                    <span className={`text-[10px] font-mono font-bold ${t.enabled ? 'text-emerald-500' : 'text-neutral-400'}`}>
                      {t.enabled ? 'ENABLED' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Knowledge Base & Reference Docs
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {agent.knowledge?.name || 'Default Enterprise Knowledge Base'}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {agent.knowledge?.description || 'Standard corporate documentation and pricing catalog.'}
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Execution Parameters
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Model:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{agent.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Temperature:</span>
                  <span className="font-semibold text-emerald-500">{agent.temperature}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Response Style:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{agent.responseStyle || 'Professional'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'test' && (
        <div className="pt-2">
          <TestAgentPanel agent={agent} />
        </div>
      )}

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete AI Agent"
        description="Are you sure you want to delete this AI agent? This action cannot be undone."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2 text-xs">
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Deleting <strong>"{agent.name}"</strong> will remove its configuration and historical performance metrics.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete Agent
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
