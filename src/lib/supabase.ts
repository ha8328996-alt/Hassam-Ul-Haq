import { createClient } from '@supabase/supabase-js';

// Environment variable retrieval
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check whether live Supabase credentials have been injected
export const isSupabaseConfigured = Boolean(
  envUrl &&
    envAnonKey &&
    !envUrl.includes('your-project') &&
    !envUrl.includes('placeholder')
);

// Fallback to prevent crash if keys are pending configuration in the preview environment
const fallbackUrl = 'https://placeholder-flowpilot.supabase.co';
const fallbackKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.placeholder';

export const supabaseUrl = envUrl || fallbackUrl;
export const supabaseAnonKey = envAnonKey || fallbackKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Database Entity Type Definitions matching Supabase Schema
export interface DatabaseProfile {
  id: string; // matches auth.users.id
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  workspace_name?: string | null;
  plan: 'free' | 'starter' | 'professional' | 'business' | 'enterprise';
  role: 'user' | 'admin' | 'owner';
  onboarding_completed?: boolean | null;
  onboarding_data?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAIAgent {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  system_instructions: string | null;
  model: string;
  temperature: number;
  status: 'active' | 'inactive' | 'draft' | 'paused' | 'training' | string;
  configuration?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAutomation {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'draft' | string;
  trigger_type: string;
  configuration?: Record<string, any> | null;
  workflow_data?: Record<string, any> | null;
  last_run_at?: string | null;
  run_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAutomationRun {
  id: string;
  automation_id: string;
  user_id: string;
  status: 'success' | 'running' | 'failed';
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, any>;
}

export interface DatabaseLead {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title?: string | null;
  lead_score: number;
  status: string;
  source: string | null;
  assigned_to?: string | null;
  tags?: string[] | null;
  notes: string | null;
  estimated_value?: number | null;
  country?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseLeadActivity {
  id: string;
  lead_id: string;
  user_id: string;
  activity_type: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DatabaseLeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  note: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseConversation {
  id: string;
  user_id: string;
  agent_id: string | null;
  lead_id: string | null;
  status: 'ai_handled' | 'needs_human' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface DatabaseConversationMessage {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'ai' | 'system';
  content: string;
  created_at: string;
}

export interface DatabaseIntegration {
  id: string;
  user_id: string;
  provider: string;
  name?: string | null;
  category?: string | null;
  status: 'connected' | 'disconnected' | 'pending' | 'setup_required';
  configuration: Record<string, any>;
  last_synced_at?: string | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}
