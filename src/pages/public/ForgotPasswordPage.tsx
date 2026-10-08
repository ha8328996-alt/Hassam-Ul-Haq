import React, { useState } from 'react';
import { Link } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { resetPassword, getAuthErrorMessage } = useAuth();
  const { success, error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      const msg = 'Please enter a valid work email address.';
      setFormError(msg);
      toastError('Invalid Email', msg);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(trimmedEmail);
      setIsSubmitted(true);
      success('Request Submitted', 'If an account exists, a password reset link has been dispatched.');
    } catch (err: any) {
      const userMessage = getAuthErrorMessage(err);
      // If it's a rate limit error, show it; otherwise maintain anti-enumeration security
      if (userMessage.toLowerCase().includes('rate limit') || userMessage.toLowerCase().includes('too many requests')) {
        setFormError(userMessage);
        toastError('Rate Limited', userMessage);
      } else {
        // Safe anti-enumeration fallback
        setIsSubmitted(true);
        success('Request Submitted', 'If an account exists, a password reset link has been dispatched.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
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
            Reset Your Password
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Enter your work email and we will send you a secure password reset link.
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <span className="font-semibold block">Reset Error</span>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              disabled={isLoading}
            />

            <Button type="submit" size="md" isLoading={isLoading} className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Check Your Inbox
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                If an account exists for{' '}
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                  {email}
                </span>
                , a secure reset link has been dispatched. Please check your inbox and spam folder.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>For privacy, we never disclose whether an address is registered.</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:underline cursor-pointer"
              >
                Send to a different email address
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
