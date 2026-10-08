import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useData } from '../../context/DataContext';
import {
  Search,
  Zap,
  Bot,
  MessageSquare,
  Users,
  Settings,
  ArrowRight,
  Grid,
  FileCode2,
  BarChart3,
  UserCheck,
  CreditCard,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const { navigate } = useRouter();
  const { automations, agents, leads, conversations } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPages = [
    { title: 'Overview', path: '/dashboard', icon: <Zap className="w-3.5 h-3.5" /> },
    { title: 'Automations', path: '/dashboard/automations', icon: <Zap className="w-3.5 h-3.5" /> },
    { title: 'AI Agents', path: '/dashboard/agents', icon: <Bot className="w-3.5 h-3.5" /> },
    { title: 'Conversations', path: '/dashboard/conversations', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { title: 'Leads', path: '/dashboard/leads', icon: <Users className="w-3.5 h-3.5" /> },
    { title: 'Integrations', path: '/dashboard/integrations', icon: <Grid className="w-3.5 h-3.5" /> },
    { title: 'Templates', path: '/dashboard/templates', icon: <FileCode2 className="w-3.5 h-3.5" /> },
    { title: 'Analytics', path: '/dashboard/analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { title: 'Team', path: '/dashboard/team', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { title: 'Billing', path: '/dashboard/billing', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { title: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  const filteredPages = quickPages.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAutomations = automations.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAgents = agents.filter(
    (ag) =>
      ag.name.toLowerCase().includes(query.toLowerCase()) ||
      ag.role.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.company.toLowerCase().includes(query.toLowerCase()) ||
      l.email.toLowerCase().includes(query.toLowerCase())
  );

  const filteredConversations = conversations.filter(
    (c) =>
      c.customerName.toLowerCase().includes(query.toLowerCase()) ||
      c.customerCompany.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search automations, agents, leads, conversations, settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 text-xs sm:text-sm bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Navigation / Settings */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Pages & Settings
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredPages.map((page) => (
                  <button
                    key={page.path}
                    onClick={() => handleSelect(page.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
                        {page.icon}
                      </span>
                      <span>{page.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Automations */}
          {filteredAutomations.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Automations
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredAutomations.map((aut) => (
                  <button
                    key={aut.id}
                    onClick={() => handleSelect(`/dashboard/automations/${aut.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{aut.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">{aut.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Agents */}
          {filteredAgents.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                AI Agents
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredAgents.map((ag) => (
                  <button
                    key={ag.id}
                    onClick={() => handleSelect('/dashboard/agents')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-3.5 h-3.5 text-sky-500" />
                      <div>
                        <span className="font-medium text-neutral-900 dark:text-white">{ag.name}</span>
                        <span className="text-neutral-400 ml-2">({ag.model})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">{ag.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Leads & Prospects
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredLeads.map((ld) => (
                  <button
                    key={ld.id}
                    onClick={() => handleSelect('/dashboard/leads')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-medium text-neutral-900 dark:text-white">{ld.name}</span>
                      <span className="text-neutral-400">• {ld.company}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">Score {ld.score}/100</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversations */}
          {filteredConversations.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Conversations & Inquiries
              </p>
              <div className="space-y-0.5 mt-1">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelect('/dashboard/conversations')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="font-medium text-neutral-900 dark:text-white truncate">
                        {conv.customerName} ({conv.customerCompany})
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-mono">{conv.lastMessageTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 &&
            filteredAgents.length === 0 &&
            filteredAutomations.length === 0 &&
            filteredLeads.length === 0 &&
            filteredConversations.length === 0 && (
              <div className="p-8 text-center text-neutral-400 text-xs">
                No matching results found for "{query}".
              </div>
            )}
        </div>

        <div className="p-2.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span>Shortcut:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">
              Ctrl+K
            </kbd>
            <span>or</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">
              ⌘K
            </kbd>
          </div>
          <span className="font-mono">FlowPilot Command Palette</span>
        </div>
      </div>
    </div>
  );
}
