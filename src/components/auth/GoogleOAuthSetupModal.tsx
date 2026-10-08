import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { supabaseUrl, isSupabaseConfigured } from '../../lib/supabase';
import { ExternalLink, Copy, CheckCircle2, ShieldAlert, KeyRound } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface GoogleOAuthSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleOAuthSetupModal({ isOpen, onClose }: GoogleOAuthSetupModalProps) {
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);

  // The official Supabase redirect callback URL for Google OAuth
  const callbackUrl = isSupabaseConfigured
    ? `${supabaseUrl.replace(/\/$/, '')}/auth/v1/callback`
    : 'https://<your-supabase-project-id>.supabase.co/auth/v1/callback';

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    success('Copied', 'Supabase OAuth Redirect URL copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google OAuth Provider Setup"
      description="Connect real Google authentication through your Supabase project."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <span className="font-semibold block">Google Provider Configuration Required</span>
            <span>
              To enable authentic 1-click Google Sign-In, the Google OAuth provider must be enabled in your remote Supabase project dashboard.
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-white block">
            Step 1: Authorized Redirect URI in Google Cloud Console
          </span>
          <p className="text-[11px] text-neutral-500">
            In your Google Cloud Console (APIs & Services &gt; Credentials &gt; OAuth 2.0 Client IDs), register this exact Authorized Redirect URI:
          </p>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-mono text-[11px] text-neutral-900 dark:text-white break-all">
            <span className="flex-1 select-all">{callbackUrl}</span>
            <button
              type="button"
              onClick={handleCopyCallback}
              className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              title="Copy URI"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-white block">
            Step 2: Enable Google in Supabase Dashboard
          </span>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] leading-relaxed">
            <li>
              Navigate to your{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-900 dark:text-white underline inline-flex items-center gap-0.5"
              >
                Supabase Dashboard <ExternalLink className="w-3 h-3 inline" />
              </a>
              .
            </li>
            <li>Select your project &gt; go to <strong>Authentication</strong> &gt; <strong>Providers</strong>.</li>
            <li>Toggle <strong>Google</strong> to enabled.</li>
            <li>Paste your Google <strong>Client ID</strong> and <strong>Client Secret</strong>.</li>
            <li>Click <strong>Save</strong>.</li>
          </ol>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-[11px] space-y-1">
          <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-neutral-500" />
            Security & Zero-Exposure Guarantee
          </span>
          <p className="text-neutral-500">
            Client secrets are safely stored in your remote Supabase infrastructure and are never exposed to browser code.
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <Button size="sm" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
}
