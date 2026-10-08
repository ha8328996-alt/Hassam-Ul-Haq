import React, { useState, useMemo, useEffect } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Check,
} from 'lucide-react';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    updatePassword,
    getAuthErrorMessage,
    isAuthenticated,
    isRecoverySession,
    authCallbackError,
    session,
  } = useAuth();
  const { navigate } = useRouter();
  const { success, error: toastError } = useToast();

  const isLinkExpired =
    Boolean(authCallbackError?.toLowerCase().includes('expired')) ||
    (typeof window !== 'undefined' &&
      (window.location.hash.includes('otp_expired') ||
        window.location.search.includes('otp_expired')));

  useEffect(() => {
    if (authCallbackError) {
      setFormError(authCallbackError);
    }
  }, [authCallbackError]);

  // Detailed password strength calculation
  const passwordCriteria = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasUpperLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passwordStrength = useMemo(() => {
    if (!password) {
      return { score: 0, label: '', color: 'bg-neutral-200 dark:bg-neutral-800', textColor: 'text-neutral-400' };
    }
    const metCount = Object.values(passwordCriteria).filter(Boolean).length;
    if (metCount <= 2) {
      return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500' };
    } else if (metCount === 3) {
      return { score: 2, label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-500' };
    } else {
      return { score: 3, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
    }
  }, [password, passwordCriteria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setFormError(null);

    if (password.length < 8) {
      const msg = 'Password must be at least 8 characters long.';
      setFormError(msg);
      toastError('Weak Password', msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please ensure both passwords match.';
      setFormError(msg);
      toastError('Password Mismatch', msg);
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(password);
      setIsSuccess(true);
      success('Password Updated', 'Your password has been successfully reset.');
    } catch (err: any) {
      const userMessage = getAuthErrorMessage(err);
      setFormError(userMessage);
      toastError('Reset Failed', userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If the recovery link has expired or is invalid
  if (isLinkExpired && !isSuccess) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
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
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Password Reset Link Expired
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                This password reset link has expired or has already been used. For your security, reset links are single-use.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/forgot-password')}
                className="w-full"
              >
                Request a New Reset Link
              </Button>
            </div>
          </div>

          <div className="text-center text-xs">
            <Link
              to="/login"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
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
            Set New Password
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Create a secure password to protect your FlowPilot workspace.
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <span className="font-semibold block">Update Error</span>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isLoading}
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

              {password.length > 0 && (
                <div className="space-y-2 pt-1 animate-in fade-in">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-400">Strength:</span>
                    <span className={`font-semibold ${passwordStrength.textColor}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 h-1.5">
                    <div
                      className={`rounded-full transition-colors ${
                        passwordStrength.score >= 1 ? passwordStrength.color : 'bg-neutral-200 dark:bg-neutral-800'
                      }`}
                    />
                    <div
                      className={`rounded-full transition-colors ${
                        passwordStrength.score >= 2 ? passwordStrength.color : 'bg-neutral-200 dark:bg-neutral-800'
                      }`}
                    />
                    <div
                      className={`rounded-full transition-colors ${
                        passwordStrength.score >= 3 ? passwordStrength.color : 'bg-neutral-200 dark:bg-neutral-800'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-neutral-500 pt-0.5">
                    <div className={`flex items-center gap-1 ${passwordCriteria.hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.hasMinLength ? 'opacity-100' : 'opacity-30'}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordCriteria.hasUpperLower ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.hasUpperLower ? 'opacity-100' : 'opacity-30'}`} />
                      <span>Mixed case</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                      <span>1+ number</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      <Check className={`w-3 h-3 ${passwordCriteria.hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                      <span>1+ symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
              error={
                confirmPassword && password !== confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Update Password
            </Button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Password Successfully Reset
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Your new password has been stored securely in Supabase.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In Now'}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-neutral-500">
          <Link
            to="/login"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
