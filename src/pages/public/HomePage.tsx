import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '../../context/RouterContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';
import {
  ArrowRight,
  Zap,
  Bot,
  MessageSquare,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  Play,
  Check,
  ChevronDown,
  TrendingUp,
  Globe,
  Database,
  Mail,
  FileSpreadsheet,
  Radio,
  Send,
  CreditCard,
  Cpu,
  BarChart3,
} from 'lucide-react';

export function HomePage() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'agents' | 'automations' | 'leads'>('automations');
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [agentTemperature, setAgentTemperature] = useState('0.2');
  const [selectedAgentModel, setSelectedAgentModel] = useState('Gemini 2.5 Pro');
  const [agentTestPrompt, setAgentTestPrompt] = useState(
    'Prospect from healthcare company, 45 seats, requested demo for enterprise compliance.'
  );
  const [agentTestResponse, setAgentTestResponse] = useState<string | null>(null);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const triggerWorkflowSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 700);
    setTimeout(() => setSimStep(3), 1400);
    setTimeout(() => setSimStep(4), 2100);
    setTimeout(() => setSimStep(5), 2800);
    setTimeout(() => {
      setSimStep(6);
      setIsSimulating(false);
      success('Workflow Complete', 'Lead scored 94/100, synced to CRM, and alert dispatched.');
    }, 3500);
  };

  const handleTestAgentPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentTestPrompt.trim()) return;
    setIsAgentRunning(true);
    setTimeout(() => {
      setAgentTestResponse(
        `[Analysis Complete — ${selectedAgentModel}]\n• Classification: Healthcare Enterprise (Tier 1)\n• ICP Score: 94 / 100\n• Actions Executed: Created HubSpot Opportunity ($54,000 ARR) & scheduled discovery call with Solutions Lead.`
      );
      setIsAgentRunning(false);
      success('Agent Executed', 'Intent parsed and actions triggered.');
    }, 800);
  };

  const faqs = [
    {
      q: 'What is FlowPilot AI?',
      a: 'FlowPilot AI is an enterprise automation platform that combines autonomous AI agents with an event-driven workflow engine. It allows teams to create specialized AI workers, automate cross-app workflows, score and enrich incoming leads, and handle multi-channel customer inquiries without manual intervention.',
    },
    {
      q: 'Do I need coding knowledge?',
      a: 'No. FlowPilot provides an intuitive visual drag-and-drop workflow canvas and natural language prompt configuration for AI agents. For engineering teams, we also support custom REST API webhooks, JSON schema payload validation, and custom JavaScript transforms.',
    },
    {
      q: 'Can I create custom AI agents?',
      a: 'Yes. You can define custom system instructions, attach proprietary knowledge documents, set sampling temperatures, and grant specific tool execution capabilities (e.g. updating CRM records, querying databases, or booking calendar slots).',
    },
    {
      q: 'What integrations are supported?',
      a: 'FlowPilot supports over 50 native connectors including OpenAI, Gmail, Google Sheets, Slack, Discord, Telegram, WhatsApp, Stripe, HubSpot, and custom webhooks with HMAC signature verification.',
    },
    {
      q: 'Can I connect my own API?',
      a: 'Yes. Custom REST endpoints and authenticated webhook listeners can be hooked directly into any trigger or action node within your automation pipelines.',
    },
    {
      q: 'Is there a free plan?',
      a: 'Yes. Every new workspace includes a 14-day full access evaluation period with all Pro features unlocked. No credit card is required to sign up and start building.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. You can change plans, upgrade capacity, or cancel your subscription at any time directly from the Billing settings with no cancellation fees.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.05,
                },
              },
            }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 text-[11px] font-mono font-medium tracking-wide text-neutral-700 dark:text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>POWERED BY AI • BUILT FOR MODERN BUSINESSES</span>
              </div>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] text-balance"
            >
              Automate Your Business With AI
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed text-balance"
            >
              Build intelligent AI agents, automate repetitive workflows, capture leads, and connect your favorite business tools — all from one powerful platform.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Building Free
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}>
                  Explore Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } },
              }}
              className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-mono"
            >
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> 14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> 5-minute setup
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Dashboard Preview */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-purple-500/10 rounded-2xl blur-xl pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden transition-all"
            >
              <div className="h-10 px-4 bg-neutral-100/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <div className="px-3 py-0.5 rounded bg-white dark:bg-neutral-900 text-[10px] font-mono text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                  flowpilot.ai/dashboard/overview
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono text-neutral-400">Live</span>
                </div>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Tasks Completed</span>
                    <span className="text-base font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                      14,280
                    </span>
                    <span className="text-[10px] text-emerald-500 font-mono block mt-0.5">+24% vs last week</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">AI Agent Activity</span>
                    <span className="text-base font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                      5 Active
                    </span>
                    <span className="text-[10px] text-sky-500 font-mono block mt-0.5">140ms avg latency</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Recent Leads</span>
                    <span className="text-base font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                      $184k ARR
                    </span>
                    <span className="text-[10px] text-emerald-500 font-mono block mt-0.5">94% fit score</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveTab('automations')}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === 'automations'
                        ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Automation Status
                  </button>
                  <button
                    onClick={() => setActiveTab('agents')}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === 'agents'
                        ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    AI Agents
                  </button>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors cursor-pointer ${
                      activeTab === 'leads'
                        ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    Leads Stream
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'automations' && (
                    <motion.div
                      key="automations"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2 border border-neutral-100 dark:border-neutral-800 rounded-xl p-3 bg-neutral-50/50 dark:bg-neutral-950/40"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800/60">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-semibold text-neutral-900 dark:text-white">Inbound Lead Qualifier & CRM Sync</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Operational</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-neutral-500">
                        <div>Trigger: Webhook</div>
                        <div>Agent: Gemini 2.5</div>
                        <div>Target: HubSpot</div>
                        <div className="text-right">4,280 runs</div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'agents' && (
                    <motion.div
                      key="agents"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2 border border-neutral-100 dark:border-neutral-800 rounded-xl p-3 bg-neutral-50/50 dark:bg-neutral-950/40"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800/60">
                        <div className="flex items-center gap-2">
                          <Bot className="w-3.5 h-3.5 text-sky-500" />
                          <span className="font-semibold text-neutral-900 dark:text-white">Support Dispatcher Agent</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">Gemini 2.5 Flash</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 line-clamp-1">
                        Resolves documentation queries, parses webhook payloads, and escalates edge cases to on-call engineers.
                      </p>
                    </motion.div>
                  )}
                  {activeTab === 'leads' && (
                    <motion.div
                      key="leads"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-2 border border-neutral-100 dark:border-neutral-800 rounded-xl p-3 bg-neutral-50/50 dark:bg-neutral-950/40"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800/60">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-semibold text-neutral-900 dark:text-white">Nordic Steel Corporation</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-500">Score 96/100</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-500">
                        <span>40 enterprise seats requested</span>
                        <span className="font-mono text-neutral-900 dark:text-white">$48,000 ARR</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Throughput Trajectory</span>
                    <span className="text-[10px] font-mono text-emerald-500">99.4% success rate</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12 pt-1">
                    {[35, 52, 48, 65, 58, 80, 72, 88, 94, 82, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-neutral-300 dark:bg-neutral-700 hover:bg-emerald-500 transition-colors rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="border-y border-neutral-200 dark:border-neutral-800/80 py-10 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Built for teams that want to work smarter
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all text-xs sm:text-sm font-mono font-bold tracking-widest text-neutral-600 dark:text-neutral-400">
            <span>NEXUSLABS</span>
            <span>VELOCE</span>
            <span>HYPERION</span>
            <span>STRATUM</span>
            <span>LUMINA</span>
            <span>VERTEX DATA</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Everything you need to automate your business
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Eliminate operational bottlenecks with autonomous reasoning, event-driven pipelines, and instant integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-lg">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                1. AI Agents
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Deploy autonomous agents configured with custom instructions, reasoning thresholds, and verified tool calling for discrete business objectives.
              </p>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 text-[11px] font-mono flex items-center justify-between text-neutral-500">
                <span>Model: Gemini 2.5 Pro</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/dashboard/agents" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline inline-flex items-center gap-1">
                <span>Configure Agents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-lg">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                2. Workflow Automation
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Drag-and-drop triggers, conditional branches, retry queues, and multi-app mutations that execute deterministically 24/7.
              </p>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 text-[11px] font-mono flex items-center justify-between text-neutral-500">
                <span>Trigger: Webhook Ingest</span>
                <span className="text-neutral-900 dark:text-white font-semibold">→ 4 Actions</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/dashboard/automations" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline inline-flex items-center gap-1">
                <span>Visual Canvas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-lg">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                3. Lead Generation
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Automatically enrich company firmographics, calculate ICP buying scores from 0-100, and route high-fit leads to calendar slots.
              </p>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 text-[11px] font-mono flex items-center justify-between text-neutral-500">
                <span>Nordic Steel</span>
                <span className="text-emerald-500 font-bold">96/100 Intent</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/dashboard/leads" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline inline-flex items-center gap-1">
                <span>Lead Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-lg">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                4. AI Customer Support
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Unified omnichannel inbox covering Email, Slack, WhatsApp, and Webchat with sentiment detection and 1-click human takeover.
              </p>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 text-[11px] font-mono flex items-center justify-between text-neutral-500">
                <span>Sentiment: Positive</span>
                <span className="text-sky-500">Auto-Resolved</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/dashboard/conversations" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline inline-flex items-center gap-1">
                <span>Unified Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-lg">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                5. Analytics
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Granular telemetry tracking execution volume, latency distributions, hours saved, and cost efficiency across all pipelines.
              </p>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 text-[11px] font-mono flex items-center justify-between text-neutral-500">
                <span>Monthly Reclaimed</span>
                <span className="font-semibold text-neutral-900 dark:text-white">480 Hours</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/dashboard/analytics" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline inline-flex items-center gap-1">
                <span>View Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-lg">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                6. Business Integrations
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Direct connectors for HubSpot, Salesforce, Slack, Stripe, Google Workspace, Discord, Telegram, and REST webhooks.
              </p>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 text-[11px] font-mono flex items-center justify-between text-neutral-500">
                <span>Connectors: 50+</span>
                <span className="text-emerald-500">Zero-Code Sync</span>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/dashboard/integrations" className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline inline-flex items-center gap-1">
                <span>Browse Connectors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. AUTOMATION VISUAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
            Visual Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            End-to-End Autonomous Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Follow an inbound lead through each autonomous stage from capture to CRM synchronization.
          </p>
        </div>

        <Card className="p-6 sm:p-8 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Live Pipeline Demonstration
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Website Lead → AI Agent → Analyze Lead → Lead Score → CRM → Email Notification
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant={isSimulating ? 'outline' : 'secondary'}
                onClick={triggerWorkflowSimulation}
                isLoading={isSimulating}
                leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
              >
                {simStep === 0 ? 'Run Workflow Simulation' : isSimulating ? 'Processing Trace...' : 'Re-Run Trace'}
              </Button>
              <Link to="/dashboard/automations">
                <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Build Your Workflow
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-8 relative">
            <div
              className={`p-4 rounded-xl border transition-all text-center space-y-2 ${
                simStep >= 1
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 opacity-60'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block">01 • Trigger</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Website Lead</h4>
              <p className="text-[10px] text-neutral-500 font-mono">Form Submitted</p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all text-center space-y-2 ${
                simStep >= 2
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 opacity-60'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block">02 • Agent</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">AI Agent</h4>
              <p className="text-[10px] text-neutral-500 font-mono">Gemini 2.5 Ingest</p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all text-center space-y-2 ${
                simStep >= 3
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 opacity-60'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block">03 • Logic</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Analyze Lead</h4>
              <p className="text-[10px] text-neutral-500 font-mono">Firmographics</p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all text-center space-y-2 ${
                simStep >= 4
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 opacity-60'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block">04 • Score</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Lead Score</h4>
              <p className="text-[10px] text-emerald-500 font-mono font-bold">94 / 100 ICP</p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all text-center space-y-2 ${
                simStep >= 5
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 opacity-60'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block">05 • Sync</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">CRM</h4>
              <p className="text-[10px] text-neutral-500 font-mono">HubSpot Deal</p>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all text-center space-y-2 ${
                simStep >= 6
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 opacity-60'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block">06 • Notify</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Email Notice</h4>
              <p className="text-[10px] text-neutral-500 font-mono">Alert Dispatched</p>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. AI AGENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Agent Builder: Enterprise Qualifier
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Model: {selectedAgentModel}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Foundation Model
                  </label>
                  <select
                    value={selectedAgentModel}
                    onChange={(e) => setSelectedAgentModel(e.target.value)}
                    className="w-full text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-2 text-neutral-800 dark:text-neutral-200"
                  >
                    <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Ultra-Low Latency)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Temperature ({agentTemperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agentTemperature}
                    onChange={(e) => setAgentTemperature(e.target.value)}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <form onSubmit={handleTestAgentPrompt} className="space-y-2 pt-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block">
                  Interactive Test Input
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={agentTestPrompt}
                    onChange={(e) => setAgentTestPrompt(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                  <Button type="submit" size="sm" isLoading={isAgentRunning} leftIcon={<Play className="w-3 h-3 text-emerald-500" />}>
                    Execute
                  </Button>
                </div>
              </form>

              <div className="p-3.5 rounded-lg bg-neutral-900 text-neutral-100 font-mono text-[11px] leading-relaxed min-h-[90px] border border-neutral-800">
                {isAgentRunning ? (
                  <span className="text-neutral-400 animate-pulse">Agent reasoning through intent & verifying schema parameters...</span>
                ) : agentTestResponse ? (
                  <span className="whitespace-pre-line text-emerald-400">{agentTestResponse}</span>
                ) : (
                  <span className="text-neutral-500">// Output response trace will render here upon execution.</span>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
              Autonomous Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white text-balance">
              Your AI workforce, working 24/7
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-balance">
              Create specialized AI agents that can understand instructions, process information, communicate with customers, and trigger business actions.
            </p>
            <ul className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
              {[
                { title: 'Custom instructions', desc: 'Define precise operational boundaries and tone guidelines' },
                { title: 'Knowledge base', desc: 'Ground outputs in your documentation and company policies' },
                { title: 'Tools & integrations', desc: 'Allow agents to query databases, calendars, and CRM APIs' },
                { title: 'Memory', desc: 'Retain state and context across multi-turn customer conversations' },
                { title: 'Automated actions', desc: 'Trigger verified mutations with deterministic retry fallbacks' },
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-neutral-900 dark:text-white">{feat.title}: </strong>
                    <span className="text-neutral-500 dark:text-neutral-400">{feat.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Link to="/dashboard/agents">
                <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Create an AI Agent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTEGRATIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
            Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Connect the tools you already use
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Synchronize your data and actions effortlessly with verified pre-built connectors.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { name: 'OpenAI', icon: Sparkles, desc: 'LLM Reasoning & Embeddings' },
            { name: 'Gmail', icon: Mail, desc: 'Email Dispatch & Parsing' },
            { name: 'Google Sheets', icon: FileSpreadsheet, desc: 'Tabular Ledger Sync' },
            { name: 'Slack', icon: Radio, desc: 'Interactive Team Alerts' },
            { name: 'Discord', icon: MessageSquare, desc: 'Community Channel Bot' },
            { name: 'Telegram', icon: Send, desc: 'Instant Mobile Notifications' },
            { name: 'WhatsApp', icon: MessageSquare, desc: 'Omnichannel Customer Chat' },
            { name: 'Stripe', icon: CreditCard, desc: 'Invoices & Payment Recovery' },
            { name: 'HubSpot', icon: Database, desc: 'Deals & Contact Pipelines' },
            { name: 'Webhooks', icon: Globe, desc: 'HMAC SHA-256 Verified REST' },
          ].map((tool, i) => {
            const Icon = tool.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all text-center space-y-2 group shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{tool.name}</h4>
                <p className="text-[10px] text-neutral-500 font-mono truncate">{tool.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
            Three Simple Steps
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            How FlowPilot Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-4">
            <span className="text-2xl font-bold font-mono text-emerald-500">01 • Connect</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Connect your business tools.
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Authenticate your existing CRMs, communication channels, and databases in seconds with verified OAuth or API tokens.
            </p>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2 text-[11px] font-mono text-neutral-500">
              <div className="flex items-center justify-between">
                <span>HubSpot CRM</span>
                <span className="text-emerald-500">Connected ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Slack Workspace</span>
                <span className="text-emerald-500">Connected ✓</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <span className="text-2xl font-bold font-mono text-sky-500">02 • Build</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Create your AI workflow.
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Use the drag-and-drop visual canvas to connect triggers, assign specialized AI agents, and set routing conditions.
            </p>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2 text-[11px] font-mono text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Node 1: Webhook Ingest</span>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span>↳ Gemini 2.5 Scoring</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <span className="text-2xl font-bold font-mono text-purple-500">03 • Automate</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Let FlowPilot handle the repetitive work.
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Sit back as incoming leads, customer inquiries, and data syncs execute autonomously with 99.99% reliability.
            </p>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2 text-[11px] font-mono text-neutral-500">
              <div className="flex items-center justify-between">
                <span>Autonomous Run</span>
                <span className="text-emerald-500 font-bold">120ms Latency</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Errors Flagged</span>
                <span className="text-neutral-400 font-bold">0 Errors</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 8. PRICING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
            Predictable Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Transparent plans for modern teams
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Start free for 14 days. Scale as your autonomous throughput grows.
          </p>
          <div className="pt-2 flex items-center justify-center">
            <div className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 inline-flex items-center text-xs">
              <button
                onClick={() => setPricingCycle('monthly')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                  pricingCycle === 'monthly'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setPricingCycle('yearly')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  pricingCycle === 'yearly'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>Yearly billing</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  For Solopreneurs & Small Projects
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">STARTER</h3>
                <div className="pt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                    ${pricingCycle === 'yearly' ? '15' : '19'}
                  </span>
                  <span className="text-xs text-neutral-500">/ month</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>5 automations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>1 AI agent</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>1,000 tasks / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Basic analytics</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/signup?plan=starter" className="w-full block">
                <Button variant="outline" size="md" className="w-full">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between border-neutral-900 dark:border-neutral-400 relative shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-mono text-[10px] font-bold uppercase tracking-wider">
              POPULAR
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-semibold text-emerald-500 uppercase tracking-wider">
                  For Growing Teams & High Inbound
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">PROFESSIONAL</h3>
                <div className="pt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                    ${pricingCycle === 'yearly' ? '39' : '49'}
                  </span>
                  <span className="text-xs text-neutral-500">/ month</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Unlimited</strong> automations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>5 AI agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>10,000 tasks / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Advanced analytics & integrations</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/signup?plan=pro" className="w-full block">
                <Button size="md" className="w-full">
                  Start Building Free
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  For Scale & Enterprise Operations
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">BUSINESS</h3>
                <div className="pt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                    ${pricingCycle === 'yearly' ? '119' : '149'}
                  </span>
                  <span className="text-xs text-neutral-500">/ month</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Unlimited</strong> automations & agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>50,000 tasks / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Team members with RBAC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Full API & priority support</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
              <Link to="/signup?plan=business" className="w-full block">
                <Button variant="outline" size="md" className="w-full">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
            Common Inquiries
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900/60 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-neutral-950 dark:bg-neutral-900 text-white border border-neutral-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to automate your business?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Start building intelligent workflows today. Deploy your first agent in under five minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Building Free
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-neutral-700 hover:bg-neutral-800">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
