import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GoogleOAuthSetupModal } from '../../components/auth/GoogleOAuthSetupModal';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Database, HelpCircle } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const {
    loginWithEmail,
    loginWithGoogle,
    loginAsDemo,
    isConfigured,
    getAuthErrorMessage,
    authCallbackError,
    clearAuthCallbackError,
  } = useAuth();
  const { navigate } = useRouter();
  const { success, error: toastError, info } = useToast();

  useEffect(() => {
    if (authCallbackError) {
      setFormError(authCallbackError);
    }
  }, [authCallbackError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);
    clearAuthCallbackError();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      const msg = 'Please enter a valid work email address.';
      setFormError(msg);
      toastError('Invalid Email', msg);
      return;
    }
    if (!password) {
      const msg = 'Please enter your password.';
      setFormError(msg);
      toastError('Password Missing', msg);
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await loginWithEmail(trimmedEmail, password);
      success('Welcome back', 'Successfully authenticated with Supabase.');

      // Route based on onboarding status
      if (loggedInUser.onboardingCompleted === false) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const userMessage = getAuthErrorMessage(err);
      setFormError(userMessage);
      toastError('Authentication Failed', userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError(null);
    clearAuthCallbackError();
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      info('Connecting with Google', 'Redirecting to secure Google authentication...');
    } catch (err: any) {
      const userMessage = getAuthErrorMessage(err);
      setFormError(userMessage);
      toastError('Google Sign-in Failed', userMessage);
      if (userMessage.toLowerCase().includes('not enabled') || userMessage.toLowerCase().includes('credentials are required')) {
        setShowGoogleModal(true);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickDemo = () => {
    loginAsDemo();
    success('Demo Session Active', 'Signed in as Workspace Operator.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              FP
            </span>
            <span className="font-bold text-lg text-neutral-900 dark:text-white tracking-tight">
              FlowPilot AI
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Sign In to FlowPilot
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Access your AI workforce, automations, and Supabase backend
          </p>
        </div>

        {/* Supabase Status / Fast Demo Card */}
        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              {isConfigured ? 'Supabase Connected' : 'Supabase Client Ready'}
            </span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              1-Click Demo Sign In →
            </button>
          </div>
          {!isConfigured && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
              Set <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">VITE_SUPABASE_URL</code> & <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">VITE_SUPABASE_ANON_KEY</code> for remote project connection.
            </p>
          )}
        </div>

        {/* Inline Error Message */}
        {formError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed flex-1">
              <span className="font-semibold block">Authentication Notice</span>
              <span>{formError}</span>
            </div>
            {formError.toLowerCase().includes('provider') && (
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="text-xs font-semibold underline text-rose-800 dark:text-rose-200 shrink-0 cursor-pointer"
              >
                Setup Guide
              </button>
            )}
          </div>
        )}

        {/* Google Authentication */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-medium transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>
          {!isConfigured && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Google OAuth Configuration Guide</span>
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
          <span className="relative bg-white dark:bg-neutral-950 px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
            Or continue with email
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="name@company.com"
            disabled={isLoading || isGoogleLoading}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="••••••••"
              disabled={isLoading || isGoogleLoading}
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <Button
            type="submit"
            size="md"
            isLoading={isLoading}
            disabled={isLoading || isGoogleLoading}
            className="w-full"
          >
            Sign In to Workspace
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          <span>Don't have a workspace yet? </span>
          <Link
            to="/signup"
            className="font-semibold text-neutral-900 dark:text-white hover:underline ml-1"
          >
            Create account
          </Link>
        </div>
      </div>

      {/* Google OAuth Setup Guide Modal */}
      <GoogleOAuthSetupModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </div>
  );
}
