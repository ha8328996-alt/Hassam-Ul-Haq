import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useRouter } from '../../context/RouterContext';
import { AgentStatus, AgentToolsConfig, AgentMemoryConfig, AgentHumanHandoffConfig } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Bot,
  Sparkles,
  Cpu,
  MessageSquare,
  Zap,
  Shield,
  ArrowLeft,
  Check,
} from 'lucide-react';

export function CreateAgentPage() {
  const { createAgent } = useData();
  const { success, error } = useToast();
  const { navigate } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('Sales & Lead Qualifier');
  const [description, setDescription] = useState('');
  const [avatarIcon, setAvatarIcon] = useState('bot');
  const [systemInstructions, setSystemInstructions] = useState(
    'You are a professional sales assistant. Help customers understand our services, answer questions accurately and qualify potential leads.'
  );
  const [model, setModel] = useState('Gemini 2.5 Pro');
  const [temperature, setTemperature] = useState(0.2);
  const [responseStyle, setResponseStyle] = useState<'Professional' | 'Friendly' | 'Concise' | 'Detailed'>('Professional');
  const [knowledgeName, setKnowledgeName] = useState('Product Knowledge Base');
  const [knowledgeDescription, setKnowledgeDescription] = useState('Standard enterprise documentation, pricing tiers, and SLA policies.');
  const [sourceInput, setSourceInput] = useState('');
  const [sources, setSources] = useState<string[]>(['https://docs.flowpilot.ai', 'pricing-guide.pdf']);

  const [tools, setTools] = useState<AgentToolsConfig>({
    webSearch: true,
    leadCapture: true,
    email: true,
    calendar: false,
    crm: true,
    webhook: false,
  });

  const [memory, setMemory] = useState<AgentMemoryConfig>({
    enableMemory: true,
    conversationMemory: true,
    customerInfo: true,
  });

  const [humanHandoff, setHumanHandoff] = useState<AgentHumanHandoffConfig>({
    enabled: true,
    condition: 'Customer sentiment is negative or customer requests live specialist',
  });

  const [status, setStatus] = useState<AgentStatus>('active');

  const promptPresets = [
    {
      title: 'Sales Assistant',
      role: 'Enterprise Sales & Demo Booking',
      prompt:
        'You are an elite enterprise B2B sales assistant. Analyze buyer intent, explain our ROI metrics, verify company revenue tier, and route high-fit leads to executive demos.',
    },
    {
      title: 'Customer Support',
      role: 'Tier 1 Resolution & Triage',
      prompt:
        'You are a technical customer support agent. Resolve API, webhook, and authentication questions using official specs. When sentiment is critical or account issue arises, initiate warm human handover.',
    },
    {
      title: 'Calendar Concierge',
      role: 'Executive Scheduling',
      prompt:
        'Coordinate executive meetings with precision. Respect working hours, timezone differences, buffer periods, and schedule meetings seamlessly using Google Calendar.',
    },
    {
      title: 'Lead Qualifier',
      role: 'Pipeline Fit Scoring',
      prompt:
        'Inspect inbound form submissions, enrich company background, score fit (0-100) based on target ICP, and create deals in HubSpot with detailed AI synthesis.',
    },
  ];

  const handleAddSource = () => {
    if (!sourceInput.trim()) return;
    if (!sources.includes(sourceInput.trim())) {
      setSources([...sources, sourceInput.trim()]);
    }
    setSourceInput('');
  };

  const handleRemoveSource = (src: string) => {
    setSources(sources.filter((s) => s !== src));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Name required', 'Please provide a name for your AI agent.');
      return;
    }
    if (!systemInstructions.trim()) {
      error('Instructions required', 'Please provide system instructions for agent behavior.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createAgent({
        name: name.trim(),
        role: role.trim() || 'Autonomous Assistant',
        description: description.trim() || 'Autonomous agent configured for intelligent business operations.',
        systemPrompt: systemInstructions.trim(),
        system_instructions: systemInstructions.trim(),
        model,
        temperature,
        status,
        avatarIcon,
        responseStyle,
        tools,
        memory,
        humanHandoff,
        knowledge: {
          name: knowledgeName,
          description: knowledgeDescription,
          sources,
        },
        capabilities: Object.entries(tools)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()),
      });
      success('AI Agent Created', 'AI Agent created successfully.');
      navigate('/dashboard/agents');
    } catch (err: any) {
      error('Creation Failed', err?.message || 'Could not create AI agent in database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconOptions = [
    { id: 'bot', icon: <Bot className="w-4 h-4 text-sky-500" />, label: 'Bot' },
    { id: 'sparkles', icon: <Sparkles className="w-4 h-4 text-amber-500" />, label: 'Sparkles' },
    { id: 'cpu', icon: <Cpu className="w-4 h-4 text-purple-500" />, label: 'Compute' },
    { id: 'message', icon: <MessageSquare className="w-4 h-4 text-emerald-500" />, label: 'Chat' },
    { id: 'zap', icon: <Zap className="w-4 h-4 text-yellow-500" />, label: 'Zap' },
    { id: 'shield', icon: <Shield className="w-4 h-4 text-indigo-500" />, label: 'Shield' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/agents')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to agents"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Create AI Agent
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Configure autonomous capabilities, reasoning constraints, and tool execution permissions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/agents')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Deploy Agent
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="w-5 h-5 rounded-md bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                Basic Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Agent Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sales Assistant, Inbound Lead Qualifier"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Role & Specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inbound Qualification, Tier 1 Support"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                />
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe what this agent is responsible for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
              />
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                Agent Icon
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {iconOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatarIcon(opt.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      avatarIcon === opt.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Section 2: AI Instructions */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                  AI Instructions
                </h2>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                System Prompt Constraints
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-[11px] text-neutral-400">Quick Template Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {promptPresets.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => {
                      setSystemInstructions(preset.prompt);
                      setRole(preset.role);
                    }}
                    className="px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-[11px] transition-colors cursor-pointer"
                  >
                    + {preset.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                System Instructions <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={6}
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                placeholder="You are a professional sales assistant..."
                className="w-full py-2.5 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 leading-relaxed"
                required
              />
              <p className="text-[11px] text-neutral-400">
                Be explicit about tone, boundaries, qualification parameters, and when the agent should trigger tool actions.
              </p>
            </div>
          </Card>

          {/* Section 3 & 4: Model & Behavior */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h2 className="font-bold text-sm text-neutral-900 dark:text-white">Model</h2>
              </div>
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Select Intelligence Engine
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'Gemini 2.5 Pro', label: 'Gemini 2.5 Pro', desc: 'Complex reasoning, long context' },
                    { id: 'Gemini 2.5 Flash', label: 'Gemini 2.5 Flash', desc: 'Ultra-low latency sub-second routing' },
                    { id: 'OpenAI GPT-4o', label: 'OpenAI GPT-4o', desc: 'Enterprise omni-reasoning & tool use' },
                    { id: 'OpenAI GPT-4o Mini', label: 'OpenAI GPT-4o Mini', desc: 'Cost-efficient execution' },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        model === m.id
                          ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <input
                        type="radio"
                        name="model"
                        value={m.id}
                        checked={model === m.id}
                        onChange={() => setModel(m.id)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-white text-xs">{m.label}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <h2 className="font-bold text-sm text-neutral-900 dark:text-white">Behavior</h2>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Temperature: <span className="font-mono text-emerald-500 font-bold">{temperature}</span>
                  </label>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {temperature <= 0.3 ? 'Precise' : temperature <= 0.7 ? 'Balanced' : 'Creative'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Response Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Professional', 'Friendly', 'Concise', 'Detailed'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setResponseStyle(style)}
                      className={`p-2 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                        responseStyle === style
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Section 5: Tools */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                5
              </span>
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
                Autonomous Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { key: 'webSearch', title: 'Web Search', desc: 'Browse live web documentation & external company data' },
                { key: 'leadCapture', title: 'Lead Capture', desc: 'Extract contact records & score incoming prospect intent' },
                { key: 'email', title: 'Email Dispatch', desc: 'Draft and dispatch email follow-ups via connected account' },
                { key: 'calendar', title: 'Calendar Scheduling', desc: 'Check timezone slots and dispatch calendar invites' },
                { key: 'crm', title: 'CRM Integration', desc: 'Create and update deals in HubSpot & Salesforce' },
                { key: 'webhook', title: 'Custom Webhook', desc: 'Post JSON triggers to external production endpoints' },
              ].map((t) => (
                <label
                  key={t.key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    tools[t.key as keyof AgentToolsConfig]
                      ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tools[t.key as keyof AgentToolsConfig]}
                    onChange={(e) =>
                      setTools({ ...tools, [t.key]: e.target.checked })
                    }
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-white">{t.title}</span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">{t.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Agent Preview Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono font-semibold text-neutral-400 tracking-wider">
              Live Preview
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">Updates dynamically</span>
          </div>
          <Card className="p-5 border-neutral-300 dark:border-neutral-700 shadow-md space-y-4 bg-white dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
                  {iconOptions.find((i) => i.id === avatarIcon)?.icon || <Bot className="w-5 h-5 text-sky-500" />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                    {name || 'Untitled Agent'}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono truncate">
                    {role || 'Autonomous Assistant'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {status}
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {description || 'Autonomous agent configured for intelligent business operations.'}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                {model}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Temp: {temperature}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                className="w-full"
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Create AI Agent
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
