import React, { useState, useMemo, useEffect } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { GoogleOAuthSetupModal } from '../../components/auth/GoogleOAuthSetupModal';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Inbox,
  Check,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const {
    signupWithEmail,
    loginWithGoogle,
    resendVerificationEmail,
    getAuthErrorMessage,
    authCallbackError,
    clearAuthCallbackError,
    isConfigured,
  } = useAuth();
  const { navigate } = useRouter();
  const { success, error: toastError, info } = useToast();

  useEffect(() => {
    if (authCallbackError) {
      setFormError(authCallbackError);
    }
  }, [authCallbackError]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Detailed password strength calculations
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    setFormError(null);
    clearAuthCallbackError();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      const msg = 'Please enter your full name.';
      setFormError(msg);
      toastError('Name Required', msg);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      const msg = 'Please enter a valid work email address.';
      setFormError(msg);
      toastError('Invalid Email', msg);
      return;
    }

    if (password.length < 8) {
      const msg = 'Password must be at least 8 characters long for account security.';
      setFormError(msg);
      toastError('Weak Password', msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please verify both password entries.';
      setFormError(msg);
      toastError('Password Mismatch', msg);
      return;
    }

    if (!termsAgreed) {
      const msg = 'Please accept the Terms of Service and Privacy Policy to create your account.';
      setFormError(msg);
      toastError('Terms Agreement Required', msg);
      return;
    }

    setIsLoading(true);
    try {
      const result = await signupWithEmail(trimmedName, trimmedEmail, password);
      if (result.requiresEmailConfirmation) {
        setVerificationPending(true);
        setResendCooldown(60);
        success('Verification Link Sent', `Confirmation message dispatched to ${trimmedEmail}`);
      } else {
        success('Account Created', `Welcome to FlowPilot AI, ${trimmedName}!`);
        navigate('/onboarding');
      }
    } catch (err: any) {
      const userMessage = getAuthErrorMessage(err);
      setFormError(userMessage);
      toastError('Registration Failed', userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      // If error indicates unconfigured or disabled provider, offer setup guide
      if (userMessage.toLowerCase().includes('not enabled') || userMessage.toLowerCase().includes('credentials are required')) {
        setShowGoogleModal(true);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await resendVerificationEmail(email.trim());
      setResendCooldown(60);
      success('Email Dispatched', `A fresh confirmation link was sent to ${email}`);
    } catch (err: any) {
      toastError('Resend Failed', getAuthErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  // If email verification is pending
  if (verificationPending) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
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

          <div className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
              <Inbox className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Verify Your Work Email
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
                We sent a secure activation link to{' '}
                <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                  {email}
                </span>
                . Click the link inside the email to complete your registration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 text-left space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Next steps</span>
              </div>
              <p>1. Open your email inbox and click "Confirm your email".</p>
              <p>2. You will be automatically authenticated and redirected to workspace setup.</p>
              <p>3. If you do not see the email, check your spam or promotional folders.</p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Proceed to Sign In
              </Button>

              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendCooldown > 0 || isResending}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : 'Resend confirmation email'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVerificationPending(false)}
                className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Entered the wrong email? Re-enter address
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
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
            Create Your Account
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Start automating operations with intelligent AI agents & CRM
          </p>
        </div>

        {/* Inline Error Message */}
        {formError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed flex-1">
              <span className="font-semibold block">Registration Notice</span>
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

        {/* Continue with Google */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={handleGoogleSignup}
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
            <span>{isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
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
            Or register with email
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSignup} className="space-y-3.5">
          <Input
            label="Full Name"
            type="text"
            required
            autoComplete="name"
            placeholder="Alex Morgan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            disabled={isLoading || isGoogleLoading}
          />

          <Input
            label="Work Email"
            type="email"
            required
            autoComplete="email"
            placeholder="alex@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            disabled={isLoading || isGoogleLoading}
          />

          <div className="space-y-1.5">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
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

            {/* Password Strength Indicator & Checklist */}
            {password.length > 0 && (
              <div className="space-y-2 pt-1 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-neutral-400">Password Strength:</span>
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
                    <span>Uppercase & lowercase</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                    <Check className={`w-3 h-3 ${passwordCriteria.hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                    <span>At least 1 number</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                    <Check className={`w-3 h-3 ${passwordCriteria.hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            disabled={isLoading || isGoogleLoading}
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

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 text-xs pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              disabled={isLoading || isGoogleLoading}
              className="mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-neutral-600 dark:text-neutral-400 leading-snug cursor-pointer select-none"
            >
              I agree to the{' '}
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                Privacy Policy
              </span>
              .
            </label>
          </div>

          <Button
            type="submit"
            size="md"
            isLoading={isLoading}
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-semibold text-neutral-900 dark:text-white hover:underline ml-1"
          >
            Sign In
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
