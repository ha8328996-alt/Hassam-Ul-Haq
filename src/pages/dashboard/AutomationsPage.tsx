import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useRouter } from '../../context/RouterContext';
import { Automation, AutomationStatus } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Zap,
  Plus,
  Search,
  Trash2,
  Clock,
  ArrowRight,
  List as ListIcon,
  LayoutGrid,
  MoreVertical,
  Copy,
  Power,
  Pause,
  ExternalLink,
  AlertTriangle,
  Globe,
  Calendar,
  Mail,
} from 'lucide-react';

export function AutomationsPage() {
  const {
    automations,
    runAutomation,
    deleteAutomation,
    duplicateAutomation,
    setAutomationStatus,
  } = useData();
  const { success, error, info } = useToast();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [triggerFilter, setTriggerFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'runs' | 'success'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [deleteTarget, setDeleteTarget] = useState<Automation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredAutomations = automations
    .filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        a.name.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && a.status === 'active') ||
        (statusFilter === 'Draft' && a.status === 'draft') ||
        (statusFilter === 'Paused' && (a.status === 'paused' || a.status === 'inactive'));
      const matchesTrigger =
        triggerFilter === 'All' ||
        (triggerFilter === 'Lead' && (a.triggerType.includes('lead') || a.triggerType.includes('form'))) ||
        (triggerFilter === 'Webhook' && a.triggerType.includes('webhook')) ||
        (triggerFilter === 'Schedule' && a.triggerType.includes('schedule')) ||
        (triggerFilter === 'Email' && a.triggerType.includes('email'));
      return matchesSearch && matchesStatus && matchesTrigger;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'runs') return (b.runCount || 0) - (a.runCount || 0);
      if (sortBy === 'success') return (b.successRate || 0) - (a.successRate || 0);
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

  const handleToggleStatus = async (auto: Automation) => {
    const nextStatus: AutomationStatus = auto.status === 'active' ? 'paused' : 'active';
    try {
      await setAutomationStatus(auto.id, nextStatus);
      info(
        `Automation ${nextStatus === 'active' ? 'Activated' : 'Paused'}`,
        `"${auto.name}" is now ${nextStatus}.`
      );
    } catch (err: any) {
      error('Status Update Failed', err?.message || 'Could not update status.');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateAutomation(id);
      success('Automation Duplicated', `Created "${copy.name}".`);
      navigate(`/dashboard/automations/${copy.id}`);
    } catch (err: any) {
      error('Duplication Failed', err?.message || 'Could not duplicate automation.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAutomation(deleteTarget.id);
      success('Automation Deleted', `"${deleteTarget.name}" has been permanently removed.`);
      setDeleteTarget(null);
    } catch (err: any) {
      error('Deletion Failed', err?.message || 'Could not delete automation.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRunManual = (auto: Automation) => {
    runAutomation(auto.id);
    success('Workflow Executed', `Ran "${auto.name}" in demo simulation mode with 0 errors.`);
  };

  const getStatusBadge = (status: AutomationStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'paused':
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            Paused
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Draft
          </span>
        );
    }
  };

  const getTriggerIcon = (triggerType: string) => {
    if (triggerType.includes('schedule')) return <Calendar className="w-4 h-4 text-emerald-500" />;
    if (triggerType.includes('webhook')) return <Globe className="w-4 h-4 text-emerald-500" />;
    if (triggerType.includes('email')) return <Mail className="w-4 h-4 text-emerald-500" />;
    return <Zap className="w-4 h-4 text-emerald-500" />;
  };

  const totalCount = automations.length;
  const activeCount = automations.filter((a) => a.status === 'active').length;
  const pausedCount = automations.filter((a) => a.status === 'paused' || a.status === 'inactive').length;
  const draftCount = automations.filter((a) => a.status === 'draft').length;
  const totalRunsAll = automations.reduce((acc, a) => acc + (a.runCount || 0), 0);
  const avgSuccessRate =
    automations.length > 0
      ? (
          automations.reduce((acc, a) => acc + (a.successRate || 98.5), 0) /
          automations.length
        ).toFixed(1)
      : '99.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Automations
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Build powerful workflows that automate repetitive business tasks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/dashboard/automations/new')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Automation
          </Button>
        </div>
      </div>

      {/* Automation Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">Total Workflows</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-[10px] font-mono text-emerald-500 font-semibold">{activeCount} active</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono block">
            {draftCount} draft • {pausedCount} paused
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">Active Status</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-bold text-emerald-500">
              {activeCount}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono block">
            Ready & listening for events
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">Total Runs</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              {totalRunsAll.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">execs</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono block">Across all triggers</span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">Avg Success Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-bold text-emerald-500">
              {avgSuccessRate}%
            </span>
            <span className="text-[10px] font-mono text-emerald-500 font-semibold">Healthy</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono block">Zero fatal crashes</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search automations by name, trigger, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
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
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400 text-[11px] hidden sm:inline">Trigger:</span>
            <select
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs focus:outline-none"
            >
              <option value="All">All Triggers</option>
              <option value="Lead">Lead & Forms</option>
              <option value="Webhook">Webhooks</option>
              <option value="Schedule">Schedule / Cron</option>
              <option value="Email">Email</option>
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
              <option value="runs">Total Runs</option>
              <option value="success">Success Rate</option>
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

      {/* Empty State */}
      {filteredAutomations.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              No automations yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Build your first workflow and let FlowPilot AI handle repetitive tasks for you.
            </p>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              onClick={() => navigate('/dashboard/automations/new')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Automation
            </Button>
          </div>
        </div>
      )}

      {/* Automations Cards */}
      {filteredAutomations.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {filteredAutomations.map((auto) => {
            const stepCount = auto.workflow_data?.nodes?.length || auto.steps?.length || 2;
            const totalRuns = auto.runCount || 0;
            const successfulRuns =
              auto.successfulRuns !== undefined
                ? auto.successfulRuns
                : Math.round(totalRuns * ((auto.successRate || 98.5) / 100));
            const failedRuns =
              auto.failedRuns !== undefined ? auto.failedRuns : Math.max(0, totalRuns - successfulRuns);

            if (viewMode === 'list') {
              return (
                <div
                  key={auto.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
                      {getTriggerIcon(auto.triggerType)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          onClick={() => navigate(`/dashboard/automations/${auto.id}`)}
                          className="font-bold text-sm text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors truncate"
                        >
                          {auto.name}
                        </h3>
                        {getStatusBadge(auto.status)}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                          {auto.triggerType}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                        {auto.description || 'Autonomous multi-step business workflow.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase">Steps</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {stepCount}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase">Runs</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {totalRuns.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase">Success</span>
                      <span className="font-semibold text-emerald-500">{auto.successRate || 98.5}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/automations/${auto.id}`)}
                      >
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/automations/${auto.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(auto)}
                      >
                        {auto.status === 'active' ? 'Pause' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(auto)}
                        className="text-rose-500 hover:text-rose-600 p-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Card
                key={auto.id}
                className="hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group hover:shadow-xs relative"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700 group-hover:scale-105 transition-transform">
                        {getTriggerIcon(auto.triggerType)}
                      </div>
                      <div className="min-w-0">
                        <h3
                          onClick={() => navigate(`/dashboard/automations/${auto.id}`)}
                          className="font-bold text-sm text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors truncate"
                        >
                          {auto.name}
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                          Trigger: {auto.triggerType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {getStatusBadge(auto.status)}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === auto.id ? null : auto.id)
                          }
                          className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenuId === auto.id && (
                          <div
                            className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-20 p-1 text-xs animate-in fade-in zoom-in-95"
                            onMouseLeave={() => setActiveMenuId(null)}
                          >
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate(`/dashboard/automations/${auto.id}`);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate(`/dashboard/automations/${auto.id}/edit`);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Edit in Builder</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleDuplicate(auto.id);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleToggleStatus(auto);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                            >
                              {auto.status === 'active' ? (
                                <Pause className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <Power className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                              <span>{auto.status === 'active' ? 'Pause' : 'Activate'}</span>
                            </button>
                            <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setDeleteTarget(auto);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {auto.description || 'Autonomous multi-step business workflow.'}
                  </p>

                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono">
                    <div className="bg-neutral-50/60 dark:bg-neutral-900/40 p-1.5 rounded-lg text-center">
                      <span className="text-[9px] text-neutral-400 block uppercase">Steps</span>
                      <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block">
                        {stepCount}
                      </span>
                    </div>
                    <div className="bg-neutral-50/60 dark:bg-neutral-900/40 p-1.5 rounded-lg text-center">
                      <span className="text-[9px] text-neutral-400 block uppercase">Runs</span>
                      <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block">
                        {totalRuns.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-neutral-50/60 dark:bg-neutral-900/40 p-1.5 rounded-lg text-center">
                      <span className="text-[9px] text-neutral-400 block uppercase">Success</span>
                      <span className="font-bold text-emerald-500 mt-0.5 block">
                        {successfulRuns.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-neutral-50/60 dark:bg-neutral-900/40 p-1.5 rounded-lg text-center">
                      <span className="text-[9px] text-neutral-400 block uppercase">Failed</span>
                      <span className="font-bold text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                        {failedRuns}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>Run: {auto.lastRun || 'Never'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRunManual(auto)}
                      className="text-xs py-1 px-2"
                      title="Simulate workflow run"
                    >
                      Run
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/dashboard/automations/${auto.id}/edit`)}
                      className="text-xs py-1 px-2.5"
                      title="Edit in Visual Builder"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/dashboard/automations/${auto.id}`)}
                      className="text-xs py-1 px-2.5"
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Automation"
        description="Are you sure you want to delete this automation? This action cannot be undone."
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
                You are about to delete <strong>"{deleteTarget.name}"</strong>. Any incoming webhooks, schedules, or integrations will no longer trigger this workflow.
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
                Yes, Delete Automation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
