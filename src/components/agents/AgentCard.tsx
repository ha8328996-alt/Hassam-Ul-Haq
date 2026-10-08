import React from 'react';
import { Agent, AgentStatus } from '../../types';
import { useRouter } from '../../context/RouterContext';
import {
  Bot,
  Sparkles,
  Cpu,
  MessageSquare,
  Zap,
  Shield,
  MoreVertical,
  ExternalLink,
  Edit,
  Copy,
  Power,
  Trash2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AgentCardProps {
  agent: Agent;
  onDuplicate: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRequestDelete: (agent: Agent) => void;
  onOpenTest: (agent: Agent) => void;
  viewMode?: 'grid' | 'list';
}

export function AgentCard({
  agent,
  onDuplicate,
  onToggleStatus,
  onRequestDelete,
  onOpenTest,
  viewMode = 'grid',
}: AgentCardProps) {
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const getAgentIcon = (iconName?: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-purple-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-sky-500" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bot className="w-5 h-5 text-sky-500" />;
    }
  };

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'inactive':
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-400/30 dark:border-neutral-600/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
            Inactive
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Draft
          </span>
        );
    }
  };

  const totalConversations = agent.conversationsCount || agent.totalExecutions || 0;
  const totalTasks = agent.tasksCount || Math.round((agent.totalExecutions || 1) * 2.4);

  // List View Mode
  if (viewMode === 'list') {
    return (
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
            {getAgentIcon(agent.avatarIcon)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3
                onClick={() => navigate(`/dashboard/agents/${agent.id}`)}
                className="font-bold text-sm text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors truncate"
              >
                {agent.name}
              </h3>
              {getStatusBadge(agent.status)}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                {agent.model}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
              {agent.description || 'No description provided.'}
            </p>
          </div>
        </div>
        {/* Stats and Actions */}
        <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase">Conversations</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {totalConversations.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block uppercase">Success</span>
              <span className="font-semibold text-emerald-500">{agent.successRate || 98.4}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenTest(agent)}
            >
              Test
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/dashboard/agents/${agent.id}/edit`)}
            >
              Edit
            </Button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="More actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-20 p-1 text-xs animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/dashboard/agents/${agent.id}`);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Open Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(agent.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleStatus(agent.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{agent.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onRequestDelete(agent);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Agent</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Mode (Default)
  return (
    <Card className="hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between group hover:shadow-xs relative">
      <div className="p-5 space-y-4">
        {/* Header: Icon, Name, Status, Options */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700 group-hover:scale-105 transition-transform">
              {getAgentIcon(agent.avatarIcon)}
            </div>
            <div className="min-w-0">
              <h3
                onClick={() => navigate(`/dashboard/agents/${agent.id}`)}
                className="font-bold text-sm text-neutral-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors truncate"
              >
                {agent.name}
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                {agent.role || 'Autonomous Assistant'}
              </p>
            </div>
          </div>

          {/* Status & Options Menu */}
          <div className="flex items-center gap-1.5 shrink-0">
            {getStatusBadge(agent.status)}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-20 p-1 text-xs animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/dashboard/agents/${agent.id}`);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Open Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/dashboard/agents/${agent.id}/edit`);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Edit Configuration</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(agent.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleStatus(agent.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{agent.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onRequestDelete(agent);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Agent</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {agent.description || 'No detailed instructions configured.'}
        </p>

        {/* Model & Temperature Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            {agent.model}
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            Temp: {agent.temperature}
          </span>
          {agent.responseStyle && (
            <span className="text-[10px] text-neutral-400 ml-auto font-mono">
              {agent.responseStyle}
            </span>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs font-mono">
          <div className="bg-neutral-50/60 dark:bg-neutral-900/40 p-2 rounded-lg text-center">
            <span className="text-[10px] text-neutral-400 block uppercase">Conversations</span>
            <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block">
              {totalConversations.toLocaleString()}
            </span>
          </div>
          <div className="bg-neutral-50/60 dark:bg-neutral-900/40 p-2 rounded-lg text-center">
            <span className="text-[10px] text-neutral-400 block uppercase">Tasks</span>
            <span className="font-bold text-neutral-900 dark:text-white mt-0.5 block">
              {totalTasks.toLocaleString()}
            </span>
          </div>
          <div className="bg-neutral-50/60 dark:bg-neutral-900/40 p-2 rounded-lg text-center">
            <span className="text-[10px] text-neutral-400 block uppercase">Success</span>
            <span className="font-bold text-emerald-500 mt-0.5 block">
              {agent.successRate || 98.4}%
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span>Active {agent.lastActive || 'recently'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenTest(agent)}
            className="text-xs py-1 px-2.5"
          >
            Test
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/dashboard/agents/${agent.id}`)}
            className="text-xs py-1 px-2.5"
            rightIcon={<ArrowRight className="w-3 h-3" />}
          >
            Open
          </Button>
        </div>
      </div>
    </Card>
  );
}
