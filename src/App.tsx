import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { PricingPage } from './pages/public/PricingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { VerifyEmailPage } from './pages/public/VerifyEmailPage';

// Authenticated Pages
import { OnboardingPage } from './pages/dashboard/OnboardingPage';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { AutomationsPage } from './pages/dashboard/AutomationsPage';
import { AutomationBuilderPage } from './pages/dashboard/AutomationBuilderPage';
import { AutomationDetailPage } from './pages/dashboard/AutomationDetailPage';
import { AgentsPage } from './pages/dashboard/AgentsPage';
import { CreateAgentPage } from './pages/dashboard/CreateAgentPage';
import { EditAgentPage } from './pages/dashboard/EditAgentPage';
import { AgentDetailPage } from './pages/dashboard/AgentDetailPage';
import { ConversationsPage } from './pages/dashboard/ConversationsPage';
import { LeadsPage } from './pages/dashboard/LeadsPage';
import { LeadDetailPage } from './pages/dashboard/LeadDetailPage';
import { IntegrationsPage } from './pages/dashboard/IntegrationsPage';
import { TemplatesPage } from './pages/dashboard/TemplatesPage';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { TeamPage } from './pages/dashboard/TeamPage';
import { BillingPage } from './pages/dashboard/BillingPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

function AppContent() {
  const { currentPath, navigate } = useRouter();
  const { isAuthenticated, isLoading, user, isRecoverySession } = useAuth();
  const { warning } = useToast();

  const isDashboardRoute = currentPath.startsWith('/dashboard');
  const isOnboardingRoute = currentPath === '/onboarding';
  const isAuthRoute = currentPath === '/login' || currentPath === '/signup';

  // Handle route protection and redirects
  useEffect(() => {
    if (!isLoading) {
      // 0. Active password recovery session
      if (isRecoverySession && currentPath !== '/reset-password') {
        navigate('/reset-password');
        return;
      }

      // 1. Unauthenticated users trying to access protected routes
      if (!isAuthenticated && (isDashboardRoute || isOnboardingRoute)) {
        warning('Access Protected', 'Please sign in to access your FlowPilot workspace.');
        navigate('/login');
      }
      // 2. Authenticated users trying to access login/signup
      else if (isAuthenticated && isAuthRoute) {
        if (user?.onboardingCompleted === false) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
      // 3. Authenticated user with incomplete onboarding trying to access dashboard
      else if (isAuthenticated && isDashboardRoute && user?.onboardingCompleted === false) {
        navigate('/onboarding');
      }
    }
  }, [
    isLoading,
    isRecoverySession,
    isDashboardRoute,
    isOnboardingRoute,
    isAuthRoute,
    isAuthenticated,
    user?.onboardingCompleted,
    currentPath,
    navigate,
    warning,
  ]);

  // Loading state while Supabase auth session resolves
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-sm">
          FP
        </div>
        <div className="flex items-center gap-2.5 text-xs text-neutral-500 font-mono">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  // Protected Onboarding Route (Standalone focused flow)
  if (isOnboardingRoute) {
    if (!isAuthenticated) {
      return (
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      );
    }
    return <OnboardingPage />;
  }

  // Protected Dashboard Routes
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      return (
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      );
    }

    let dashboardPageContent: React.ReactNode;
    if (currentPath === '/dashboard') {
      dashboardPageContent = <DashboardOverviewPage />;
    } else if (currentPath === '/dashboard/automations') {
      dashboardPageContent = <AutomationsPage />;
    } else if (currentPath === '/dashboard/automations/new') {
      dashboardPageContent = <AutomationBuilderPage />;
    } else if (currentPath.startsWith('/dashboard/automations/') && currentPath.endsWith('/edit')) {
      const autoId = currentPath.replace('/dashboard/automations/', '').replace('/edit', '');
      dashboardPageContent = <AutomationBuilderPage automationId={autoId} />;
    } else if (currentPath.startsWith('/dashboard/automations/')) {
      const autoId = currentPath.replace('/dashboard/automations/', '');
      dashboardPageContent = <AutomationDetailPage automationId={autoId} />;
    } else if (currentPath === '/dashboard/agents') {
      dashboardPageContent = <AgentsPage />;
    } else if (currentPath === '/dashboard/agents/new') {
      dashboardPageContent = <CreateAgentPage />;
    } else if (currentPath.startsWith('/dashboard/agents/') && currentPath.endsWith('/edit')) {
      const agentId = currentPath.replace('/dashboard/agents/', '').replace('/edit', '');
      dashboardPageContent = <EditAgentPage agentId={agentId} />;
    } else if (currentPath.startsWith('/dashboard/agents/')) {
      const agentId = currentPath.replace('/dashboard/agents/', '');
      dashboardPageContent = <AgentDetailPage agentId={agentId} />;
    } else if (currentPath === '/dashboard/conversations') {
      dashboardPageContent = <ConversationsPage />;
    } else if (currentPath.startsWith('/dashboard/leads/') && currentPath.endsWith('/edit')) {
      const leadId = currentPath.replace('/dashboard/leads/', '').replace('/edit', '');
      dashboardPageContent = <LeadDetailPage leadId={leadId} initialEdit={true} />;
    } else if (currentPath.startsWith('/dashboard/leads/')) {
      const leadId = currentPath.replace('/dashboard/leads/', '');
      dashboardPageContent = <LeadDetailPage leadId={leadId} />;
    } else if (currentPath === '/dashboard/leads') {
      dashboardPageContent = <LeadsPage />;
    } else if (currentPath === '/dashboard/integrations') {
      dashboardPageContent = <IntegrationsPage />;
    } else if (currentPath === '/dashboard/templates') {
      dashboardPageContent = <TemplatesPage />;
    } else if (currentPath === '/dashboard/analytics') {
      dashboardPageContent = <AnalyticsPage />;
    } else if (currentPath === '/dashboard/team') {
      dashboardPageContent = <TeamPage />;
    } else if (currentPath === '/dashboard/billing') {
      dashboardPageContent = <BillingPage />;
    } else if (currentPath === '/dashboard/settings') {
      dashboardPageContent = <SettingsPage />;
    } else {
      dashboardPageContent = <DashboardOverviewPage />;
    }

    return <DashboardLayout>{dashboardPageContent}</DashboardLayout>;
  }

  // Public Routes
  let publicPageContent: React.ReactNode;
  switch (currentPath) {
    case '/':
      publicPageContent = <HomePage />;
      break;
    case '/about':
      publicPageContent = <AboutPage />;
      break;
    case '/contact':
      publicPageContent = <ContactPage />;
      break;
    case '/pricing':
      publicPageContent = <PricingPage />;
      break;
    case '/features':
      publicPageContent = <FeaturesPage />;
      break;
    case '/login':
      publicPageContent = <LoginPage />;
      break;
    case '/signup':
      publicPageContent = <SignupPage />;
      break;
    case '/forgot-password':
      publicPageContent = <ForgotPasswordPage />;
      break;
    case '/reset-password':
      publicPageContent = <ResetPasswordPage />;
      break;
    case '/verify-email':
      publicPageContent = <VerifyEmailPage />;
      break;
    default:
      publicPageContent = <HomePage />;
      break;
  }

  return <PublicLayout>{publicPageContent}</PublicLayout>;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <RouterProvider>
              <AppContent />
            </RouterProvider>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
