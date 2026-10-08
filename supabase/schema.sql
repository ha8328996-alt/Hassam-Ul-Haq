-- ==============================================================================
-- FlowPilot AI - Complete Supabase PostgreSQL Schema with Row Level Security (RLS)
-- Step 7: Complete Authentication + User Onboarding & Profiles Schema
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Corresponds to auth.users.id
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  workspace_name TEXT DEFAULT 'My Business Workspace',
  plan TEXT DEFAULT 'free',
  role TEXT DEFAULT 'user',
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add columns if profiles table already existed from earlier steps
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'workspace_name') THEN
    ALTER TABLE public.profiles ADD COLUMN workspace_name TEXT DEFAULT 'My Business Workspace';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_data') THEN
    ALTER TABLE public.profiles ADD COLUMN onboarding_data JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to auto-create profile on Supabase auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    avatar_url,
    workspace_name,
    plan,
    role,
    onboarding_completed,
    onboarding_data,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'full_name' || '''s Workspace', 'My Business Workspace'),
    'free',
    'user',
    false,
    '{}'::jsonb,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. AI AGENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  system_instructions TEXT,
  model TEXT DEFAULT 'gemini-2.5-pro',
  temperature NUMERIC DEFAULT 0.2,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'paused', 'training')),
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI agents"
  ON public.ai_agents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI agents"
  ON public.ai_agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI agents"
  ON public.ai_agents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI agents"
  ON public.ai_agents FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. AUTOMATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'draft')),
  trigger_type TEXT NOT NULL,
  configuration JSONB DEFAULT '{}'::jsonb,
  workflow_data JSONB DEFAULT '{}'::jsonb,
  run_count INTEGER DEFAULT 0,
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automations"
  ON public.automations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own automations"
  ON public.automations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own automations"
  ON public.automations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own automations"
  ON public.automations FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 4. AUTOMATION RUNS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'running', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automation runs"
  ON public.automation_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own automation runs"
  ON public.automation_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. LEADS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT DEFAULT 'Prospect Decision Maker',
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  source TEXT DEFAULT 'Manual',
  assigned_to TEXT DEFAULT 'Unassigned',
  tags TEXT[] DEFAULT '{}'::text[],
  notes TEXT,
  estimated_value NUMERIC DEFAULT 0,
  country TEXT DEFAULT 'United States',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add new columns if table already existed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'title') THEN
    ALTER TABLE public.leads ADD COLUMN title TEXT DEFAULT 'Prospect Decision Maker';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'assigned_to') THEN
    ALTER TABLE public.leads ADD COLUMN assigned_to TEXT DEFAULT 'Unassigned';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'tags') THEN
    ALTER TABLE public.leads ADD COLUMN tags TEXT[] DEFAULT '{}'::text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'estimated_value') THEN
    ALTER TABLE public.leads ADD COLUMN estimated_value NUMERIC DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'country') THEN
    ALTER TABLE public.leads ADD COLUMN country TEXT DEFAULT 'United States';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_activity_at') THEN
    ALTER TABLE public.leads ADD COLUMN last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON public.leads FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5B. LEAD ACTIVITIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lead activities"
  ON public.lead_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lead activities"
  ON public.lead_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lead activities"
  ON public.lead_activities FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5C. LEAD NOTES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  author_name TEXT DEFAULT 'Operator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lead notes"
  ON public.lead_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lead notes"
  ON public.lead_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lead notes"
  ON public.lead_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lead notes"
  ON public.lead_notes FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. CONVERSATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ai_handled' CHECK (status IN ('ai_handled', 'needs_human', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. CONVERSATION MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for own conversations"
  ON public.conversation_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_messages.conversation_id
    AND c.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages into own conversations"
  ON public.conversation_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_messages.conversation_id
    AND c.user_id = auth.uid()
  ));

-- ------------------------------------------------------------------------------
-- 8. INTEGRATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  name TEXT,
  category TEXT DEFAULT 'Developer Tools',
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'pending', 'setup_required')),
  configuration JSONB DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add columns if integrations table already existed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'name') THEN
    ALTER TABLE public.integrations ADD COLUMN name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'category') THEN
    ALTER TABLE public.integrations ADD COLUMN category TEXT DEFAULT 'Developer Tools';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'last_synced_at') THEN
    ALTER TABLE public.integrations ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'error_message') THEN
    ALTER TABLE public.integrations ADD COLUMN error_message TEXT;
  END IF;
END $$;

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integrations"
  ON public.integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integrations"
  ON public.integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations"
  ON public.integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations"
  ON public.integrations FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);
