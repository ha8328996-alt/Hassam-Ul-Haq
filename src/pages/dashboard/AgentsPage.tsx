import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useRouter } from '../../context/RouterContext';
import { Agent, AgentStatus } from '../../types';
import { AgentCard } from '../../components/agents/AgentCard';
import { TestAgentPanel } from '../../components/agents/TestAgentPanel';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  Bot,
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export function AgentsPage() {
  const { agents, isLoadingAgents, deleteAgent, duplicateAgent, setAgentStatus } = useData();
  const { success, error, info } = useToast();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modelFilter, setModelFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'success' | 'conversations'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTestingAgent, setActiveTestingAgent] = useState<Agent | null>(null);

  const filteredAgents = agents
    .filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && agent.status === 'active') ||
        (statusFilter === 'Inactive' && (agent.status === 'inactive' || agent.status === 'paused')) ||
        (statusFilter === 'Draft' && agent.status === 'draft');
      const matchesModel =
        modelFilter === 'All' ||
        (modelFilter === 'Gemini' && agent.model.toLowerCase().includes('gemini')) ||
        (modelFilter === 'OpenAI' && agent.model.toLowerCase().includes('openai')) ||
        (modelFilter === 'Custom' && agent.model.toLowerCase().includes('custom'));
      return matchesSearch && matchesStatus && matchesModel;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'success') return (b.successRate || 0) - (a.successRate || 0);
      if (sortBy === 'conversations') {
        const countA = a.conversationsCount || a.totalExecutions || 0;
        const countB = b.conversationsCount || b.totalExecutions || 0;
        return countB - countA;
      }
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateAgent(id);
      success('Agent Duplicated', `Created "${copy.name}".`);
    } catch (err: any) {
      error('Duplication Failed', err?.message || 'Could not duplicate agent.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const target = agents.find((a) => a.id === id);
    if (!target) return;
    const newStatus: AgentStatus = target.status === 'active' ? 'inactive' : 'active';
    try {
      await setAgentStatus(id, newStatus);
      info(
        `Agent ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
        `"${target.name}" is now ${newStatus}.`
      );
    } catch (err: any) {
      error('Status Update Failed', err?.message || 'Could not update agent status.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAgent(deleteTarget.id);
      success('AI Agent Deleted', `"${deleteTarget.name}" has been permanently removed.`);
      setDeleteTarget(null);
    } catch (err: any) {
      error('Deletion Failed', err?.message || 'Could not delete agent.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            AI Agents
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Create intelligent AI agents that can handle conversations, qualify leads and automate business tasks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/dashboard/agents/new')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create AI Agent
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search agents by name, role, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400 text-[11px] hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400 text-[11px] hidden sm:inline">Model:</span>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none"
            >
              <option value="All">All Models</option>
              <option value="Gemini">Gemini</option>
              <option value="OpenAI">OpenAI</option>
              <option value="Custom">Custom API</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400 text-[11px] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="success">Success Rate</option>
              <option value="conversations">Conversations</option>
            </select>
          </div>

          <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-0.5 ml-auto sm:ml-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
              }`}
              title="List view"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {isLoadingAgents && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                  <div className="space-y-1.5">
                    <div className="w-28 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="w-20 h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                </div>
                <div className="w-14 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              </div>
              <div className="w-full h-8 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {!isLoadingAgents && filteredAgents.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              No AI agents yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Create your first AI agent to start automating conversations and business tasks.
            </p>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              onClick={() => navigate('/dashboard/agents/new')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create AI Agent
            </Button>
          </div>
        </div>
      )}

      {!isLoadingAgents && filteredAgents.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              viewMode={viewMode}
              onDuplicate={handleDuplicate}
              onToggleStatus={handleToggleStatus}
              onRequestDelete={(a) => setDeleteTarget(a)}
              onOpenTest={(a) => setActiveTestingAgent(a)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete AI Agent"
        description="Are you sure you want to delete this AI agent? This action cannot be undone."
        maxWidth="md"
      >
        {deleteTarget && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Permanent Deletion Warning</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-400">
                You are about to delete <strong>"{deleteTarget.name}"</strong> ({deleteTarget.model}). Any active automations referencing this agent will need to be re-routed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={confirmDelete}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Yes, Delete Agent
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {activeTestingAgent && (
        <Modal
          isOpen={!!activeTestingAgent}
          onClose={() => setActiveTestingAgent(null)}
          title={`Test Agent: ${activeTestingAgent.name}`}
          description={`Interactive prompt simulator running under ${activeTestingAgent.model} constraints.`}
          maxWidth="2xl"
        >
          <div className="pt-2">
            <TestAgentPanel
              agent={activeTestingAgent}
              onClose={() => setActiveTestingAgent(null)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
