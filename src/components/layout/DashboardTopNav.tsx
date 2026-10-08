import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Menu,
  Check,
  ChevronDown,
  LogOut,
  Settings,
  User,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

interface DashboardTopNavProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenQuickCreate: () => void;
}

export function DashboardTopNav({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenQuickCreate,
}: DashboardTopNavProps) {
  const { currentPath, navigate } = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getBreadcrumb = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length === 1 && parts[0] === 'dashboard') {
      return 'Overview';
    }
    const currentSub = parts[1] || '';
    if (currentSub === 'automations') {
      if (parts[2] === 'new') return 'Automations / Create Workflow';
      if (parts[2]) return 'Automations / Visual Builder';
      return 'Automations';
    }
    if (currentSub === 'agents') {
      if (parts[2] === 'new') return 'AI Agents / Create New';
      if (parts[3] === 'edit') return 'AI Agents / Edit Agent';
      if (parts[2]) return 'AI Agents / Details';
      return 'AI Agents';
    }
    switch (currentSub) {
      case 'conversations':
        return 'Omnichannel Inbox';
      case 'leads':
        return 'Lead Intelligence';
      case 'integrations':
        return 'Integrations Hub';
      case 'templates':
        return 'Automation Templates';
      case 'analytics':
        return 'Analytics & Telemetry';
      case 'team':
        return 'Team & Permissions';
      case 'billing':
        return 'Billing & Quota';
      case 'settings':
        return 'Workspace Settings';
      default:
        return 'Overview';
    }
  };

  const avatar = user?.avatarUrl || DEFAULT_AVATAR;

  return (
    <header className="h-14 px-4 sm:px-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400 font-medium">Dashboard</span>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-900 dark:text-white font-semibold">{getBreadcrumb()}</span>
        </nav>
      </div>

      {/* Right: Search, Quick Action, Notifs, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xs transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search or Cmd+K</span>
          <kbd className="hidden md:inline-block font-mono text-[10px] px-1 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            ⌘K
          </kbd>
        </button>

        {/* Quick Create Action */}
        <Button
          size="sm"
          onClick={onOpenQuickCreate}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="hidden sm:inline-flex"
        >
          Create
        </Button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-mono">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                        !item.read ? 'bg-neutral-50/50 dark:bg-neutral-800/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            markNotificationRead(item.id);
                            if (item.link) {
                              navigate(item.link);
                              setNotificationsOpen(false);
                            }
                          }}
                        >
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[10px] text-neutral-400 whitespace-nowrap font-mono">
                            {item.timestamp}
                          </span>
                          {!item.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationRead(item.id);
                              }}
                              className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                              title="Mark as read"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/dashboard/settings');
                  }}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-medium cursor-pointer"
                >
                  View all settings
                </button>
                <span className="text-[10px] text-neutral-400 font-mono">Supabase Sync</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <img
              src={avatar}
              alt={user?.name || 'User'}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
            />
            <span className="hidden md:inline-block text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {user?.name || 'Operator'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden md:inline-block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 p-1 text-xs animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                <p className="font-semibold text-neutral-900 dark:text-white truncate">{user?.name || 'Operator'}</p>
                <p className="text-[11px] text-neutral-500 truncate">{user?.email || 'user@flowpilot.ai'}</p>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 uppercase tracking-wider font-mono">Role: {user?.role || 'user'}</span>
                  <span className="text-emerald-500 font-mono font-medium uppercase">{user?.plan || 'free'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/dashboard/settings');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                <span>Workspace Settings</span>
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/dashboard/team');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Team & Access</span>
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/onboarding');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Onboarding Flow</span>
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                <span>View Public Site</span>
              </button>

              <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

              <button
                onClick={async () => {
                  setProfileOpen(false);
                  try {
                    await logout();
                  } catch (e) {
                    console.error('Logout error:', e);
                  }
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
