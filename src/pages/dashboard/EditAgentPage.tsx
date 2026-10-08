import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
} from 'lucide-react';

interface EditAgentPageProps {
  agentId: string;
}

export function EditAgentPage({ agentId }: EditAgentPageProps) {
  const { getAgentById, updateAgent } = useData();
  const { success, error } = useToast();
  const { navigate } = useRouter();
  const agent = getAgentById(agentId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [avatarIcon, setAvatarIcon] = useState('bot');
  const [systemInstructions, setSystemInstructions] = useState('');
  const [model, setModel] = useState('Gemini 2.5 Pro');
  const [temperature, setTemperature] = useState(0.2);
  const [responseStyle, setResponseStyle] = useState<'Professional' | 'Friendly' | 'Concise' | 'Detailed'>('Professional');
  const [tools, setTools] = useState<AgentToolsConfig>({
    webSearch: true,
    leadCapture: true,
    email: false,
    calendar: false,
    crm: true,
    webhook: false,
  });
  const [status, setStatus] = useState<AgentStatus>('active');

  useEffect(() => {
    if (agent) {
      setName(agent.name || '');
      setRole(agent.role || '');
      setDescription(agent.description || '');
      setAvatarIcon(agent.avatarIcon || 'bot');
      setSystemInstructions(agent.system_instructions || agent.systemPrompt || '');
      setModel(agent.model || 'Gemini 2.5 Pro');
      setTemperature(typeof agent.temperature === 'number' ? agent.temperature : 0.2);
      setResponseStyle(agent.responseStyle || 'Professional');
      setTools(
        agent.tools || {
          webSearch: true,
          leadCapture: true,
          email: false,
          calendar: false,
          crm: true,
          webhook: false,
        }
      );
      setStatus(agent.status || 'active');
    }
  }, [agent]);

  if (!agent) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Agent Not Found</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            The requested AI agent ID could not be located in your database.
          </p>
        </div>
        <Button size="sm" onClick={() => navigate('/dashboard/agents')}>
          Back to AI Agents
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Name required', 'Please provide an agent name.');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateAgent(agentId, {
        name: name.trim(),
        role: role.trim() || 'Autonomous Assistant',
        description: description.trim(),
        systemPrompt: systemInstructions.trim(),
        system_instructions: systemInstructions.trim(),
        model,
        temperature,
        status,
        avatarIcon,
        responseStyle,
        tools,
        capabilities: Object.entries(tools)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()),
      });
      success('Agent Updated', 'AI Agent updated successfully.');
      navigate(`/dashboard/agents/${agentId}`);
    } catch (err: any) {
      error('Update Failed', err?.message || 'Could not save agent updates to database.');
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
            onClick={() => navigate(`/dashboard/agents/${agentId}`)}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to agent details"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Edit Agent: {agent.name}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Modify system instructions, model constraints, and autonomous capabilities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/agents/${agentId}`)}
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
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-5 space-y-4">
            <h2 className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Role & Specialty
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none"
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
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
              AI Instructions
            </h2>
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                System Instructions
              </label>
              <textarea
                rows={6}
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono text-xs focus:outline-none leading-relaxed"
                required
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-5 space-y-4">
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Model Engine
              </h2>
              <div className="space-y-1.5 text-xs">
                {['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'OpenAI GPT-4o'].map((m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      model === m
                        ? 'border-emerald-500 bg-emerald-500/10 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      value={m}
                      checked={model === m}
                      onChange={() => setModel(m)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h2 className="font-bold text-sm text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
                Behavior
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Temperature: <span className="font-mono text-emerald-500 font-bold">{temperature}</span>
                  </label>
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
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          <Card className="p-5 space-y-4 bg-white dark:bg-neutral-900">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Save Configuration
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Updates to system prompt constraints and tool access take effect immediately on active sessions.
            </p>
            <Button
              className="w-full"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Update AI Agent
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
}
