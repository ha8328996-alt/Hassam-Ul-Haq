import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import {
  Zap,
  Bot,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Headphones,
  Megaphone,
  Cpu,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const { navigate } = useRouter();
  const { success, error: toastError } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Lead Generation',
    'Customer Support',
  ]);
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate');
  const [workspaceName, setWorkspaceName] = useState<string>(
    user?.workspaceName || `${user?.name || 'My Business'} Workspace`
  );
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  // Goals Catalog
  const goalOptions = [
    {
      id: 'Lead Generation',
      title: 'Lead Generation',
      description: 'Enrich prospects, capture inbound forms, and score ICP fit automatically.',
      icon: <Users className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'Customer Support',
      title: 'Customer Support',
      description: 'Resolve common tickets, answer questions 24/7, and route urgent escalations.',
      icon: <Headphones className="w-5 h-5 text-sky-500" />,
    },
    {
      id: 'Sales',
      title: 'Sales & Booking',
      description: 'Qualify buyer intent, schedule calendar demos, and update CRM opportunities.',
      icon: <Briefcase className="w-5 h-5 text-purple-500" />,
    },
    {
      id: 'Marketing',
      title: 'Marketing',
      description: 'Trigger multi-channel campaigns, write personalized emails, and analyze metrics.',
      icon: <Megaphone className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'Internal Operations',
      title: 'Internal Operations',
      description: 'Ingest webhooks, synchronize internal databases, and dispatch Slack alerts.',
      icon: <Cpu className="w-5 h-5 text-rose-500" />,
    },
    {
      id: 'Other',
      title: 'Other Business Tasks',
      description: 'Custom multi-step automation pipelines tailored to unique corporate operations.',
      icon: <Zap className="w-5 h-5 text-indigo-500" />,
    },
  ];

  // Experience Options
  const experienceOptions = [
    {
      id: 'Beginner',
      title: 'Beginner',
      subtitle: 'New to automation and AI agents',
      description: 'I want guided templates, intuitive visual drag-and-drop, and ready-to-use presets.',
    },
    {
      id: 'Intermediate',
      title: 'Intermediate',
      subtitle: 'Familiar with Zapier, Make, or n8n',
      description: 'I understand webhooks, filters, and conditional branches and want powerful agent tooling.',
    },
    {
      id: 'Advanced',
      title: 'Advanced',
      subtitle: 'Developer or Technical Architect',
      description: 'I build custom API integrations, webhook handlers, and autonomous agent loops.',
    },
    {
      id: 'Expert',
      title: 'Expert',
      subtitle: 'Enterprise AI & Distributed Systems Engineer',
      description: 'High-scale multi-agent coordination, sub-second SLAs, and complex state machines.',
    },
  ];

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const handleNextStep = () => {
    if (currentStep === 2 && selectedGoals.length === 0) {
      toastError('Select an Area', 'Please choose at least one automation goal to continue.');
      return;
    }
    if (currentStep === 4) {
      if (!workspaceName.trim() || workspaceName.trim().length < 2) {
        setWorkspaceError('Please enter a workspace name with at least 2 characters.');
        return;
      }
      setWorkspaceError(null);
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        automationGoals: selectedGoals,
        experienceLevel,
        workspaceName: workspaceName.trim(),
      });
      success('Workspace Ready', `Welcome to your workspace "${workspaceName.trim()}"!`);
      navigate('/dashboard');
    } catch (err: any) {
      toastError('Setup Error', err?.message || 'Could not complete workspace setup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Header */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-xs shadow-sm">
            FP
          </div>
          <span className="font-bold text-base text-neutral-900 dark:text-white tracking-tight">
            FlowPilot AI
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500">Step {currentStep} of 5</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-6 h-1 rounded-full transition-colors ${
                  step <= currentStep
                    ? 'bg-neutral-900 dark:bg-white'
                    : 'bg-neutral-300 dark:bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Multi-Step Wizard Container */}
      <main className="max-w-2xl mx-auto w-full py-8 flex-1 flex flex-col justify-center">
        {/* STEP 1: WELCOME */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                Welcome to FlowPilot AI
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
                The enterprise AI orchestration platform. Build autonomous AI agents, visually connect
                workflow logic, and scale your business operations without writing code.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left pt-2">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-1.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-neutral-900 dark:text-white">
                  Autonomous AI Agents
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                  Configure intelligent agents with custom prompts, knowledge, and tools.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-1.5">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 w-fit">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-neutral-900 dark:text-white">
                  Visual Builder
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                  Connect triggers, conditions, and automated actions with drag-and-drop ease.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs space-y-1.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-neutral-900 dark:text-white">
                  Supabase Powered
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                  Enterprise security, role-based controls, and persistent database storage.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleNextStep}
                className="w-full sm:w-auto px-8"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: AUTOMATION GOAL */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Step 2 of 5
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                What do you want to automate?
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Choose one or more areas. We will tune your dashboard presets and recommend templates.
              </p>
            </div>

            {/* Multi-Select Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/5 dark:bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {goal.icon}
                        <h4 className="font-bold text-xs text-neutral-900 dark:text-white">
                          {goal.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrevStep}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleNextStep}
                disabled={selectedGoals.length === 0}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: EXPERIENCE LEVEL */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Step 3 of 5
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                How experienced are you with automation?
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                This helps us customize node guides, tool documentation, and default complexity.
              </p>
            </div>

            <div className="space-y-3">
              {experienceOptions.map((opt) => {
                const isSelected = experienceLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExperienceLevel(opt.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/5 dark:bg-sky-500/10 ring-2 ring-sky-500/20 shadow-2xs'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white">
                          {opt.title}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          — {opt.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500 text-white'
                          : 'border-neutral-300 dark:border-neutral-700 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrevStep}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleNextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: WORKSPACE NAME */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Step 4 of 5
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                What should we call your workspace?
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Give your organization, team, or venture a workspace identity. You can change this anytime.
              </p>
            </div>

            <Card className="p-6 space-y-4">
              <Input
                label="Workspace Name"
                type="text"
                required
                placeholder="e.g. My Company, My Agency, Personal Workspace"
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                  if (workspaceError) setWorkspaceError(null);
                }}
                leftIcon={<Building2 className="w-4 h-4" />}
                error={workspaceError || undefined}
                autoFocus
              />

              {/* Example Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Quick Examples:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['My Company', 'My Agency', 'Personal Workspace'].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => {
                        setWorkspaceName(example);
                        setWorkspaceError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      + {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
                <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Tip: Workspace Scope
                </p>
                <p>
                  Your workspace houses your AI agents, webhook endpoints, API credentials, and visual
                  automation workflows safely separated under your Supabase tenant.
                </p>
              </div>
            </Card>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrevStep}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleNextStep}
                disabled={!workspaceName.trim()}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: FINISH / READY */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                You're all set!
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                Your workspace is ready. We've provisioned your database environment and pre-loaded your
                automation templates.
              </p>
            </div>

            {/* Summary Review Card */}
            <Card className="p-5 text-left text-xs font-mono space-y-3.5 max-w-md mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 uppercase text-[10px]">Workspace:</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {workspaceName.trim()}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 uppercase text-[10px]">Experience Level:</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {experienceLevel}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-400 uppercase text-[10px]">Account Tier:</span>
                <span className="font-bold text-emerald-500">Free Starter Plan</span>
              </div>
              <div className="pt-1">
                <span className="text-neutral-400 uppercase text-[10px] block mb-1.5">
                  Selected Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {selectedGoals.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] border border-neutral-200 dark:border-neutral-700"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                onClick={handleFinishOnboarding}
                className="px-8"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="max-w-3xl mx-auto w-full pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-[11px] text-neutral-400">
        <span>FlowPilot AI Enterprise Platform • Protected by Supabase Row-Level Security</span>
      </footer>
    </div>
  );
}
