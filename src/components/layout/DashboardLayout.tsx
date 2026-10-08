import React, { useState, useEffect, ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopNav } from './DashboardTopNav';
import { GlobalSearchModal } from './GlobalSearchModal';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Zap, Bot, Users, BookOpen, MessageSquare, Terminal, HelpCircle, ExternalLink } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  // Persistent sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('flowpilot_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleSetIsCollapsed = (val: boolean) => {
    setIsCollapsed(val);
    try {
      localStorage.setItem('flowpilot_sidebar_collapsed', String(val));
    } catch (e) {
      console.warn('Could not persist sidebar collapse state', e);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { currentPath, navigate } = useRouter();

  const isFullBleedRoute =
    currentPath === '/dashboard/automations/new' ||
    (currentPath.startsWith('/dashboard/automations/') && currentPath !== '/dashboard/automations');

  // Global keyboard shortcut listener for Ctrl+K and Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <DashboardSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={handleSetIsCollapsed}
          onOpenHelp={() => setHelpOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-neutral-900 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <DashboardSidebar
              isCollapsed={false}
              setIsCollapsed={() => {}}
              onCloseMobile={() => setMobileMenuOpen(false)}
              onOpenHelp={() => {
                setMobileMenuOpen(false);
                setHelpOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopNav
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenQuickCreate={() => setQuickCreateOpen(true)}
        />

        {isFullBleedRoute ? (
          <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {children}
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>
        )}
      </div>

      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Quick Create Selection Modal */}
      <Modal
        isOpen={quickCreateOpen}
        onClose={() => setQuickCreateOpen(false)}
        title="Quick Creation"
        description="Select what you would like to configure in your AI workspace."
        maxWidth="md"
      >
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              setQuickCreateOpen(false);
              navigate('/dashboard/automations/new');
            }}
            className="w-full flex items-start gap-3 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 text-left transition-all group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                New Automation Workflow
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                Connect triggers (webhooks, email, CRM) to multi-step AI agent actions and external tools.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setQuickCreateOpen(false);
              navigate('/dashboard/agents/new');
            }}
            className="w-full flex items-start gap-3 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 text-left transition-all group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                New Autonomous AI Agent
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                Configure role, system instructions, temperature, and specific tool execution permissions.
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setQuickCreateOpen(false);
              navigate('/dashboard/leads');
            }}
            className="w-full flex items-start gap-3 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/50 text-left transition-all group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                New Lead or Opportunity
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                Add prospect contact details to trigger automatic background enrichment and scoring.
              </p>
            </div>
          </button>
        </div>
      </Modal>

      {/* Help Center Modal */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="FlowPilot Help & Resources"
        description="Guides, developer documentation, and support contacts."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold mb-1">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>API & Webhook Docs</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Learn how to ingest custom events, verify HMAC-SHA256 signatures, and trigger asynchronous workflows.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold mb-1">
                <Terminal className="w-4 h-4 text-sky-500" />
                <span>Keyboard Shortcuts</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 font-mono mt-1">
                <div className="flex justify-between">
                  <span>Open Search</span>
                  <span className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">⌘K / Ctrl+K</span>
                </div>
                <div className="flex justify-between">
                  <span>Close Overlay</span>
                  <span className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">ESC</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                24/7
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">Enterprise Concierge Support</p>
                <p className="text-[11px] text-neutral-500">Typical response time: under 5 minutes</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setHelpOpen(false);
                navigate('/dashboard/conversations');
              }}
            >
              Open Live Ticket
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
