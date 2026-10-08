import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, OnboardingData } from '../types';
import { supabase, isSupabaseConfigured, DatabaseProfile } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  isRecoverySession: boolean;
  authCallbackError: string | null;
  loginWithEmail: (email: string, password: string) => Promise<UserProfile>;
  signupWithEmail: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ user: UserProfile | null; requiresEmailConfirmation: boolean }>;
  loginWithGoogle: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  completeOnboarding: (data: {
    automationGoals: string[];
    experienceLevel: string;
    workspaceName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemo: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  getAuthErrorMessage: (err: any) => string;
  clearAuthCallbackError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function formatSupabaseError(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const message = err.message || (typeof err === 'string' ? err : '');
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please verify your credentials.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'An account already exists with this email address. Please sign in instead.';
  }
  if (lower.includes('password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.';
  }
  if (lower.includes('otp_expired') || lower.includes('token has expired') || lower.includes('link is invalid or has expired')) {
    return 'This verification or password reset link has expired. Please request a new link.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('over_email_send_rate_limit')) {
    return 'Too many authentication attempts or emails sent. Please wait at least 60 seconds and try again.';
  }
  if (
    lower.includes('provider is not enabled') ||
    lower.includes('unsupported provider') ||
    (lower.includes('provider') && lower.includes('not enabled'))
  ) {
    return 'Google Sign-In is not enabled on this Supabase project. Please enable Google in Supabase Dashboard > Authentication > Providers.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Network connection error. Please verify your internet connection.';
  }
  if (lower.includes('url') && lower.includes('placeholder')) {
    return 'Supabase project credentials are required. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment, or use the 1-Click Demo session.';
  }
  return message || 'Authentication failed. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRecoverySession, setIsRecoverySession] = useState<boolean>(false);
  const [authCallbackError, setAuthCallbackError] = useState<string | null>(null);

  const clearAuthCallbackError = () => {
    setAuthCallbackError(null);
  };

  // Helper to sync profile from Supabase profiles table
  const syncProfile = async (sbUser: User): Promise<UserProfile> => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sbUser.id)
          .single();

        if (data && !error) {
          const profile = data as DatabaseProfile;
          const onboardingDone = profile.onboarding_completed === true;

          return {
            id: profile.id,
            name: profile.full_name || sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Operator',
            email: profile.email || sbUser.email || '',
            avatarUrl: profile.avatar_url || DEFAULT_AVATAR,
            role: profile.role || 'user',
            workspaceName: profile.workspace_name || `${profile.full_name || 'My Business'} Workspace`,
            plan: profile.plan || 'free',
            onboardingCompleted: onboardingDone,
            onboardingData: profile.onboarding_data || undefined,
            createdAt: profile.created_at || sbUser.created_at,
            updatedAt: profile.updated_at,
          };
        } else {
          // If profile does not exist yet in profiles table, create it with onboarding_completed: false
          // Use database server timestamp by omitting client created_at or fallback to auth.users created_at
          const fullName = sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User';
          const newProfile: Partial<DatabaseProfile> = {
            id: sbUser.id,
            full_name: fullName,
            email: sbUser.email || null,
            avatar_url: sbUser.user_metadata?.avatar_url || DEFAULT_AVATAR,
            plan: 'free',
            role: 'user',
            workspace_name: `${fullName}'s Workspace`,
            onboarding_completed: false,
          };

          const { data: insertedData } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          const recordCreatedAt = (insertedData as any)?.created_at || sbUser.created_at;

          return {
            id: sbUser.id,
            name: fullName,
            email: sbUser.email || '',
            avatarUrl: DEFAULT_AVATAR,
            role: 'user',
            workspaceName: `${fullName}'s Workspace`,
            plan: 'free',
            onboardingCompleted: false,
            createdAt: recordCreatedAt,
          };
        }
      }
    } catch (err) {
      console.warn('Error querying Supabase profiles table:', err);
    }

    // Default fallback from user metadata using authentic auth.users server created_at
    const name = sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'User';
    return {
      id: sbUser.id,
      name,
      email: sbUser.email || '',
      avatarUrl: sbUser.user_metadata?.avatar_url || DEFAULT_AVATAR,
      role: 'user',
      workspaceName: `${name}'s Workspace`,
      plan: 'free',
      onboardingCompleted: false,
      createdAt: sbUser.created_at,
    };
  };

  useEffect(() => {
    let mounted = true;

    // Detect recovery session or error parameters in URL hash/query
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';

      if (hash.includes('error=') || search.includes('error=')) {
        const hashRaw = hash.startsWith('#') ? hash.slice(1) : hash;
        const searchRaw = search.startsWith('?') ? search.slice(1) : search;
        const params = new URLSearchParams(hashRaw || searchRaw);
        const errCode = params.get('error_code') || params.get('error') || '';
        const errDesc = params.get('error_description') || '';

        if (errCode === 'otp_expired' || errDesc.toLowerCase().includes('expired')) {
          setAuthCallbackError('Verification or password reset link has expired. Please request a new link.');
        } else if (errDesc || errCode) {
          setAuthCallbackError(decodeURIComponent((errDesc || errCode).replace(/\+/g, ' ')));
        }
      }

      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setIsRecoverySession(true);
      }
    }

    const checkSession = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.getSession();
          if (mounted) {
            if (data?.session) {
              setSession(data.session);
              setSupabaseUser(data.session.user);
              const mappedUser = await syncProfile(data.session.user);
              setUser(mappedUser);
            } else {
              // Check if a local demo session was saved
              const storedDemo = localStorage.getItem('flowpilot_demo_session');
              if (storedDemo) {
                try {
                  const demoUser = JSON.parse(storedDemo);
                  setUser(demoUser);
                } catch {
                  setUser(null);
                }
              } else {
                setUser(null);
              }
            }
          }
        } else {
          // In local preview mode without live Supabase credentials
          const storedDemo = localStorage.getItem('flowpilot_demo_session');
          if (storedDemo) {
            try {
              setUser(JSON.parse(storedDemo));
            } catch {
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.warn('Error reading initial session:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Listen to Supabase auth state transitions
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);

        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoverySession(true);
        }

        if (currentSession?.user) {
          setSupabaseUser(currentSession.user);
          const mappedUser = await syncProfile(currentSession.user);
          setUser(mappedUser);
          localStorage.removeItem('flowpilot_demo_session');
        } else {
          setSupabaseUser(null);
          const storedDemo = localStorage.getItem('flowpilot_demo_session');
          if (storedDemo) {
            try {
              setUser(JSON.parse(storedDemo));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setIsLoading(false);
      });
      authListener = data;
    }

    return () => {
      mounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<UserProfile> => {
    if (!isSupabaseConfigured) {
      const demoUser: UserProfile = {
        id: 'usr_local_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        avatarUrl: DEFAULT_AVATAR,
        role: 'user',
        workspaceName: `${email.split('@')[0]}'s Workspace`,
        plan: 'free',
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('flowpilot_demo_session', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Authentication succeeded but user profile was not returned.');
    }

    setSession(data.session);
    setSupabaseUser(data.user);
    const mappedUser = await syncProfile(data.user);
    setUser(mappedUser);
    return mappedUser;
  };

  const signupWithEmail = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<{ user: UserProfile | null; requiresEmailConfirmation: boolean }> => {
    if (!isSupabaseConfigured) {
      const demoUser: UserProfile = {
        id: 'usr_local_' + Math.random().toString(36).substring(2, 9),
        name: fullName || 'User',
        email,
        avatarUrl: DEFAULT_AVATAR,
        role: 'user',
        workspaceName: `${fullName}'s Workspace`,
        plan: 'free',
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('flowpilot_demo_session', JSON.stringify(demoUser));
      setUser(demoUser);
      return { user: demoUser, requiresEmailConfirmation: false };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: window.location.origin + '/onboarding',
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Could not create account in Supabase.');
    }

    // Safely upsert initial profile without overwriting server-generated created_at
    try {
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          full_name: fullName,
          email: data.user.email || email,
          avatar_url: DEFAULT_AVATAR,
          plan: 'free',
          role: 'user',
          workspace_name: `${fullName}'s Workspace`,
          onboarding_completed: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id', ignoreDuplicates: false }
      );
    } catch (profileErr) {
      console.warn('Could not write initial profile to Supabase:', profileErr);
    }

    const hasSession = Boolean(data.session);
    if (hasSession) {
      setSession(data.session);
      setSupabaseUser(data.user);
      const mappedUser = await syncProfile(data.user);
      mappedUser.onboardingCompleted = false;
      setUser(mappedUser);
      return { user: mappedUser, requiresEmailConfirmation: false };
    } else {
      // User must verify email first
      return { user: null, requiresEmailConfirmation: true };
    }
  };

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      throw new Error(
        'Google OAuth requires configured Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).'
      );
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (emailToVerify: string): Promise<void> => {
    if (!isSupabaseConfigured) {
      return;
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: emailToVerify,
      options: {
        emailRedirectTo: window.location.origin + '/onboarding',
      },
    });

    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    setIsRecoverySession(false);
  };

  const completeOnboarding = async (data: {
    automationGoals: string[];
    experienceLevel: string;
    workspaceName: string;
  }) => {
    const updatedOnboardingData = {
      automation_goals: data.automationGoals,
      experience_level: data.experienceLevel,
      workspace_name: data.workspaceName,
    };

    if (isSupabaseConfigured && (user || supabaseUser)) {
      const targetUserId = user?.id || supabaseUser?.id;
      if (targetUserId) {
        try {
          await supabase
            .from('profiles')
            .update({
              onboarding_completed: true,
              onboarding_data: updatedOnboardingData,
              workspace_name: data.workspaceName,
              updated_at: new Date().toISOString(),
            })
            .eq('id', targetUserId);
        } catch (err) {
          console.warn('Could not update onboarding status in Supabase profiles:', err);
        }
      }
    }

    setUser((prev) => {
      if (!prev) return null;
      const updated: UserProfile = {
        ...prev,
        workspaceName: data.workspaceName || prev.workspaceName,
        onboardingCompleted: true,
        onboardingData: {
          automationGoals: data.automationGoals,
          experienceLevel: data.experienceLevel,
          workspaceName: data.workspaceName,
        },
      };
      const storedDemo = localStorage.getItem('flowpilot_demo_session');
      if (storedDemo) {
        localStorage.setItem('flowpilot_demo_session', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Error signing out of Supabase:', e);
    } finally {
      localStorage.removeItem('flowpilot_demo_session');
      setUser(null);
      setSession(null);
      setSupabaseUser(null);
      setIsRecoverySession(false);
    }
  };

  const loginAsDemo = () => {
    const demoUser: UserProfile = {
      id: 'usr_demo_admin',
      name: 'Alex Chen',
      email: 'alex.chen@flowpilot.ai',
      avatarUrl: DEFAULT_AVATAR,
      role: 'admin',
      workspaceName: 'Acme Operations Ltd.',
      plan: 'free',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('flowpilot_demo_session', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    if (user && isSupabaseConfigured) {
      supabase
        .from('profiles')
        .update({
          full_name: updates.name || undefined,
          avatar_url: updates.avatarUrl || undefined,
          workspace_name: updates.workspaceName || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .then(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isAuthenticated: !!user,
        isLoading,
        isConfigured: isSupabaseConfigured,
        isRecoverySession,
        authCallbackError,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        resendVerificationEmail,
        resetPassword,
        updatePassword,
        completeOnboarding,
        logout,
        loginAsDemo,
        updateUser,
        getAuthErrorMessage: formatSupabaseError,
        clearAuthCallbackError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
