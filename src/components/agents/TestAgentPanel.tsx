import React, { useState, useRef, useEffect } from 'react';
import { Agent } from '../../types';
import {
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  User,
  Cpu,
  Layers,
  Sliders,
  Shield,
  MessageSquare,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface TestAgentPanelProps {
  agent: Agent;
  onClose?: () => void;
}

interface TestMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  latencyMs?: number;
}

export function TestAgentPanel({ agent, onClose }: TestAgentPanelProps) {
  const [messages, setMessages] = useState<TestMessage[]>([
    {
      id: 'welcome_1',
      sender: 'agent',
      text: `Hello! I am ${agent.name}. My model is configured as ${agent.model} with a temperature of ${agent.temperature}. How can I assist you with your workflow today?`,
      timestamp: 'Just now',
      latencyMs: 140,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agent.system_instructions || agent.systemPrompt || '');
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'reset_' + Date.now(),
        sender: 'agent',
        text: `Session re-initialized. Ready to test against system prompt constraints.`,
        timestamp: 'Just now',
        latencyMs: 80,
      },
    ]);
  };

  const generateMockResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    const instructions = agent.system_instructions || agent.systemPrompt || '';
    const temp = typeof agent.temperature === 'number' ? agent.temperature : 0.2;
    const isPrecise = temp <= 0.3;
    const isCreative = temp >= 0.7;

    let baseReply = '';

    if (q.includes('schedule') || q.includes('calendar') || q.includes('meeting') || q.includes('demo')) {
      if (isPrecise) {
        baseReply = `[Deterministic Schedule Check — Temp ${temp}]\n1. Calendar slot 1: Thursday at 2:00 PM EST (Capacity: Verified)\n2. Calendar slot 2: Friday at 11:00 AM EST (Capacity: Verified)\nAutomated Google Calendar reservation queued upon team confirmation.`;
      } else if (isCreative) {
        baseReply = `I'd love to help your team connect! In addition to standard 30-minute executive slots (Thursday 2:00 PM EST or Friday 11:00 AM EST), I can also coordinate an interactive workshop session or dispatch an asynchronous product walkthrough if preferred.`;
      } else {
        baseReply = `I would be delighted to coordinate that for you. Based on our executive scheduling policy, I have scanned current calendar availability. I can propose two optimal slots: Thursday at 2:00 PM EST or Friday at 11:00 AM EST. Would either of these work for your team?`;
      }
    } else if (q.includes('pricing') || q.includes('cost') || q.includes('plan') || q.includes('quote')) {
      if (isPrecise) {
        baseReply = `[Pricing Policy Verification — Temp ${temp}]\n• Professional Tier: $99/mo (Includes 50,000 monthly automation runs)\n• Enterprise Tier: Custom volume pricing with SLA & dedicated agent hosting\n• Quota verification: Nominal execution cost calculated at $0.0012/task.`;
      } else if (isCreative) {
        baseReply = `We design flexible engagement models to fit your operational scale. Whether you're bootstrapping automated inbound qualification or running high-throughput multi-region pipelines, we can tailor a growth plan that maximizes ROI while keeping task latency under 200ms.`;
      } else {
        baseReply = `FlowPilot AI offers scalable tiers starting with our Professional tier for high-growth operations up to custom multi-region Enterprise deployments. For high-volume automated webhook ingestion (>100,000 tasks/month), our enterprise architect can provide a tailored dunning and execution plan.`;
      }
    } else if (q.includes('qualify') || q.includes('company') || q.includes('revenue') || q.includes('fit')) {
      if (isPrecise) {
        baseReply = `[ICP Fit Assessment — Temp ${temp}]\n• Intent Score: 94/100\n• Revenue Tier: Enterprise High-Fit\n• Automated Deal Staging: HubSpot Opportunity #9102 created.\n• Action: Lead qualification criteria satisfied under active instructions.`;
      } else {
        baseReply = `Analyzing prospect credentials... Domain fit score: 94/100 (Tier 1 High-Intent Prospect). Identified tech stack compatibility and automated CRM deal creation staged. Meeting invite dispatched to account executive.`;
      }
    } else if (q.includes('human') || q.includes('agent') || q.includes('escalate') || q.includes('support')) {
      if (agent.humanHandoff?.enabled) {
        baseReply = `Human handoff triggered: Condition met ("${agent.humanHandoff.condition || 'Customer requested live specialist'}"). Notifying active team members in #escalations. An operator will take over this thread shortly.`;
      } else {
        baseReply = `Under current system constraints, human handoff is disabled. I will resolve your query directly using active documentation and webhook diagnostic tools.`;
      }
    } else if (q.includes('webhook') || q.includes('api') || q.includes('error') || q.includes('hmac')) {
      baseReply = `Parsed execution trace: Webhook signature verified with HMAC SHA-256. Payload ingestion confirmed with 0 schema violations. Average response latency: 184ms.`;
    } else {
      if (isPrecise) {
        baseReply = `[Rule-Guided Response — Temp ${temp}]\nUnder active system prompt "${instructions.slice(0, 45)}...":\n• Verification status: 100% compliant with operating instructions\n• Available autonomous tools: ${Object.entries(agent.tools || {}).filter(([_, v]) => v).map(([k]) => k).join(', ') || 'Standard'}\nReady for next command or test parameter.`;
      } else if (isCreative) {
        baseReply = `Guided by my objective ("${instructions.slice(0, 55)}..."), I can explore several strategies for your scenario. We could automate initial classification via webhook, trigger conversational outreach across Slack and email, or draft bespoke executive summaries for your leadership team.`;
      } else {
        baseReply = `Operating under system instructions for "${agent.name}": I have evaluated your request against active business guidelines. All tool permissions (Web Search: ${agent.tools?.webSearch ? 'ON' : 'OFF'}, CRM: ${agent.tools?.crm ? 'ON' : 'OFF'}) were consulted. How else can I assist with your evaluation?`;
      }
    }
    return baseReply;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setInput('');

    const userMsg: TestMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const simulatedLatency = Math.floor(Math.random() * 400) + 250;
    setTimeout(() => {
      const replyText = generateMockResponse(userText);
      const agentMsg: TestMessage = {
        id: 'agt_' + Date.now(),
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencyMs: simulatedLatency,
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, simulatedLatency);
  };

  const sampleQuestions = [
    'How do you qualify incoming demo leads?',
    'What pricing tiers are available?',
    'Help me schedule an executive demonstration',
    'I need to escalate this ticket to a human manager',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
      {/* Left Column: Agent Configuration Summary (5 cols) */}
      <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 space-y-5 text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-semibold text-neutral-400 tracking-wider">
              Testing Environment
            </span>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white mt-0.5">
              {agent.name}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
              {agent.role || 'Autonomous Assistant'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {agent.status}
          </span>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <span className="text-[10px] text-neutral-400 block uppercase">Model</span>
            <span className="font-bold text-neutral-900 dark:text-white truncate block mt-0.5">
              {agent.model}
            </span>
          </div>
          <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <span className="text-[10px] text-neutral-400 block uppercase">Temperature</span>
            <span className="font-bold text-neutral-900 dark:text-white truncate block mt-0.5">
              {agent.temperature} ({agent.temperature <= 0.3 ? 'Precise' : agent.temperature <= 0.7 ? 'Balanced' : 'Creative'})
            </span>
          </div>
        </div>

        {/* System Instructions Preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] uppercase font-semibold tracking-wider font-mono">
              System Instructions
            </span>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] max-h-36 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {agent.system_instructions || agent.systemPrompt || 'No instructions configured.'}
          </div>
        </div>

        {/* Enabled Tools */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider font-mono">
            Autonomous Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {agent.tools?.webSearch && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                ✓ Web Search
              </span>
            )}
            {agent.tools?.leadCapture && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                ✓ Lead Capture
              </span>
            )}
            {agent.tools?.email && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                ✓ Email Dispatch
              </span>
            )}
            {agent.tools?.calendar && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                ✓ Calendar
              </span>
            )}
            {agent.tools?.crm && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                ✓ CRM Sync
              </span>
            )}
            {agent.tools?.webhook && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                ✓ Webhook
              </span>
            )}
          </div>
        </div>

        {/* Human Handoff Rule */}
        <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Human Handoff</span>
            <span className={`font-mono text-[10px] font-bold ${agent.humanHandoff?.enabled ? 'text-emerald-500' : 'text-neutral-400'}`}>
              {agent.humanHandoff?.enabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          {agent.humanHandoff?.enabled && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
              Condition: {agent.humanHandoff.condition || 'When requested by customer'}
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Chat Interface (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-[520px]">
        {/* Chat Header Notice */}
        <div className="px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-amber-500/5 dark:bg-amber-500/10 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-medium text-amber-800 dark:text-amber-300">
              Demo Simulation Mode
            </span>
            <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 hidden sm:inline">
              • Mock responses simulated under agent prompt rules
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/20 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-xl p-3.5 space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-normal'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 border border-neutral-200/60 dark:border-neutral-700/60'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`flex items-center justify-between gap-2 text-[10px] font-mono pt-1 ${
                    msg.sender === 'user' ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.latencyMs && (
                    <span className="text-emerald-500 font-medium">⚡ {msg.latencyMs}ms</span>
                  )}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">Evaluating prompt constraints...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested test prompts */}
        <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
          <span className="text-neutral-400 font-mono shrink-0">Try:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInput(q)}
              className="px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${agent.name}...`}
            className="flex-1 py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
          <Button
            size="sm"
            type="submit"
            disabled={!input.trim() || isTyping}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
