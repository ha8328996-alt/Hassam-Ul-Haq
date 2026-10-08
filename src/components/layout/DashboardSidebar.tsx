import React, { useState, useRef, useEffect } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Zap,
  Bot,
  MessageSquare,
  Users,
  Grid,
  FileCode2,
  BarChart3,
  UserCheck,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  HelpCircle,
  LogOut,
  Building2,
} from 'lucide-react';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onCloseMobile?: () => void;
  onOpenHelp?: () => void;
}

export function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  onCloseMobile,
  onOpenHelp,
}: DashboardSidebarProps) {
  const { currentPath, navigate } = useRouter();
  const { user, logout } = useAuth();
  const { info } = useToast();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('FlowPilot Workspace');
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const workspaces = [
    { id: 'ws_1', name: user?.workspaceName || 'FlowPilot Workspace', role: 'Owner', plan: 'Enterprise' },
    { id: 'ws_2', name: 'Acme Growth Team', role: 'Admin', plan: 'Pro' },
    { id: 'ws_3', name: 'EMEA Ops & Support', role: 'Member', plan: 'Pro' },
  ];

  const navItems = [
    { title: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Automations', path: '/dashboard/automations', icon: Zap },
    { title: 'AI Agents', path: '/dashboard/agents', icon: Bot },
    { title: 'Conversations', path: '/dashboard/conversations', icon: MessageSquare },
    { title: 'Leads', path: '/dashboard/leads', icon: Users },
    { title: 'Integrations', path: '/dashboard/integrations', icon: Grid },
    { title: 'Templates', path: '/dashboard/templates', icon: FileCode2 },
    { title: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { title: 'Team', path: '/dashboard/team', icon: UserCheck },
    { title: 'Billing', path: '/dashboard/billing', icon: CreditCard },
    { title: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    navigate('/login');
  };

  const avatar = user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <aside
      className={`h-screen sticky top-0 bg-neutral-900 text-neutral-300 border-r border-neutral-800/80 flex flex-col transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-3.5 flex items-center justify-between border-b border-neutral-800/80 shrink-0">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden group"
          onClick={handleLinkClick}
        >
          <div className="w-7 h-7 rounded-md bg-white text-neutral-950 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            FP
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-bold text-sm text-white tracking-tight block">FlowPilot AI</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors hidden lg:flex items-center justify-center cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Selector */}
      <div className="p-2 border-b border-neutral-800/60 bg-neutral-950/40 shrink-0 relative" ref={workspaceRef}>
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors cursor-pointer"
            title={user?.workspaceName || selectedWorkspace}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
          </button>
        ) : (
          <div>
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider leading-none">
                    Workspace
                  </p>
                  <p className="font-medium text-white truncate text-xs mt-1 leading-tight group-hover:text-emerald-300 transition-colors">
                    {user?.workspaceName || selectedWorkspace}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${workspaceMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Workspace Dropdown */}
            {workspaceMenuOpen && (
              <div className="absolute left-2 right-2 top-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-50 p-1.5 text-xs animate-in fade-in zoom-in-95">
                <p className="px-2 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Available Workspaces
                </p>
                <div className="space-y-0.5 mt-1">
                  {workspaces.map((ws) => {
                    const isCurrent = (user?.workspaceName || selectedWorkspace) === ws.name;
                    return (
                      <button
                        key={ws.id}
                        onClick={() => {
                          setSelectedWorkspace(ws.name);
                          setWorkspaceMenuOpen(false);
                          info('Switched Workspace', `Active context: ${ws.name}`);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-neutral-800 text-white font-medium'
                            : 'text-neutral-300 hover:bg-neutral-800/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs">{ws.name}</p>
                          <p className="text-[10px] text-neutral-400">{ws.role} • {ws.plan}</p>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-1 pt-1 border-t border-neutral-800">
                  <button
                    onClick={() => {
                      setWorkspaceMenuOpen(false);
                      navigate('/onboarding');
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-neutral-800/70 text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Run Workspace Setup</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/dashboard'
              ? currentPath === '/dashboard'
              : currentPath.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom of Sidebar: Help Center, User Profile, Logout */}
      <div className="p-2 border-t border-neutral-800/80 bg-neutral-950/70 shrink-0 space-y-1">
        {/* Help Center */}
        <button
          onClick={() => {
            if (onOpenHelp) onOpenHelp();
            else navigate('/dashboard/settings');
          }}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? 'Help Center' : undefined}
        >
          <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Help Center</span>}
        </button>

        {/* User Profile */}
        <div
          onClick={() => {
            navigate('/dashboard/settings');
            handleLinkClick();
          }}
          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-neutral-800/50 cursor-pointer transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? (user?.name || 'User Profile') : undefined}
        >
          <img
            src={avatar}
            alt={user?.name || 'User'}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border border-neutral-700 shrink-0"
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate leading-tight">
                {user?.name || 'FlowPilot Operator'}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                <span className="capitalize">{user?.role || 'user'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono uppercase">{user?.plan || 'free'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/20 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
