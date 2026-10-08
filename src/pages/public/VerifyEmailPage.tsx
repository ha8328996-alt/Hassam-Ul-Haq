import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Mail,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

export function VerifyEmailPage() {
  const {
    user,
    supabaseUser,
    isAuthenticated,
    resendVerificationEmail,
    getAuthErrorMessage,
    authCallbackError,
  } = useAuth();
  const { navigate } = useRouter();
  const { success, error: toastError } = useToast();

  const [emailToVerify, setEmailToVerify] = useState(
    user?.email || supabaseUser?.email || ''
  );
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL parameters for OTP errors
  const isLinkExpired =
    Boolean(authCallbackError?.toLowerCase().includes('expired')) ||
    (typeof window !== 'undefined' &&
      (window.location.hash.includes('otp_expired') ||
        window.location.search.includes('otp_expired')));

  useEffect(() => {
    if (authCallbackError) {
      setErrorMessage(authCallbackError);
    }
  }, [authCallbackError]);

  useEffect(() => {
    if (user?.email && !emailToVerify) {
      setEmailToVerify(user.email);
    }
  }, [user?.email, emailToVerify]);

  // 60-second cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    const target = emailToVerify.trim();
    if (!target || !target.includes('@')) {
      const msg = 'Please enter a valid work email address.';
      setErrorMessage(msg);
      toastError('Email Required', msg);
      return;
    }

    if (resendCooldown > 0 || isResending) return;

    setErrorMessage(null);
    setIsResending(true);
    try {
      await resendVerificationEmail(target);
      setResendCooldown(60);
      success('Confirmation Link Dispatched', `A fresh verification email was sent to ${target}`);
    } catch (err: any) {
      const msg = getAuthErrorMessage(err);
      setErrorMessage(msg);
      toastError('Resend Failed', msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Brand Lockup */}
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-xs shadow-sm">
            FP
          </span>
          <span className="font-bold text-lg text-neutral-900 dark:text-white tracking-tight">
            FlowPilot AI
          </span>
        </Link>

        {/* Verification Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Verify Your Email Address
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
              We sent a confirmation link to activate your FlowPilot AI workspace.
            </p>
          </div>

          {/* Expired or invalid link banner */}
          {isLinkExpired && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 text-left animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Confirmation Link Expired</span>
                <span>
                  The verification link has expired or has already been consumed. Request a new confirmation email below.
                </span>
              </div>
            </div>
          )}

          {/* Generic Error message */}
          {errorMessage && !isLinkExpired && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 text-left animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email target input */}
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
              Registered Work Email
            </label>
            <Input
              type="email"
              value={emailToVerify}
              onChange={(e) => setEmailToVerify(e.target.value)}
              placeholder="name@company.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 space-y-1 text-left">
            <div className="flex items-center gap-2 font-semibold text-neutral-700 dark:text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instructions:</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 pl-1 text-[11px] leading-relaxed">
              <li>Open your email inbox and search for "FlowPilot AI".</li>
              <li>Click the "Confirm your email" link.</li>
              <li>Your workspace will be activated immediately.</li>
            </ol>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending || !emailToVerify}
              className="w-full"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />}
            >
              {isResending
                ? 'Dispatching email...'
                : resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : 'Resend Confirmation Email'}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(isAuthenticated ? '/onboarding' : '/login')}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isAuthenticated ? 'Proceed to Workspace' : 'Sign In with Existing Account'}
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-neutral-500">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
