import React from 'react';
import { Link } from '../../context/RouterContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Sparkles,
  Bot,
  Zap,
  Shield,
  Users,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Globe,
  Layers,
  HeartHandshake,
  Workflow,
  Lock,
} from 'lucide-react';

export function AboutPage() {
  const pillars = [
    {
      icon: <Bot className="w-5 h-5 text-emerald-500" />,
      title: 'Autonomous Intelligence',
      description:
        'We believe AI should do meaningful work. Our agents are not just chat interfaces—they execute real multi-step workflows with persistent state, domain knowledge, and specialized toolkits.',
    },
    {
      icon: <Workflow className="w-5 h-5 text-sky-500" />,
      title: 'Visual Workflow Orchestration',
      description:
        'Engineering-grade automation shouldn’t require thousands of lines of boilerplate code. Our visual canvas enables teams to compose triggers, agents, conditions, and actions in minutes.',
    },
    {
      icon: <Lock className="w-5 h-5 text-purple-500" />,
      title: 'Enterprise Security & Governance',
      description:
        'Built with PostgreSQL and strict Row-Level Security from day one. Your workspace data, customer records, and API credentials remain isolated, auditable, and encrypted.',
    },
    {
      icon: <Globe className="w-5 h-5 text-amber-500" />,
      title: 'Omnichannel Integration',
      description:
        'Connect seamlessly with existing business systems. Ingest webhooks, update CRMs, synchronize email threads, and notify messaging platforms with zero friction.',
    },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'The Inception of Autonomous Agents',
      detail:
        'Founded with a clear vision: bridge the gap between static LLM chats and production-ready business automation pipelines.',
    },
    {
      year: '2025',
      title: 'Visual Canvas & Omnichannel Engine',
      detail:
        'Launched the drag-and-drop Visual Automation Builder, introducing condition branches, webhook gateways, and real-time test simulations.',
    },
    {
      year: '2026',
      title: 'Enterprise Scale & Supabase Foundation',
      detail:
        'Serving forward-thinking enterprises with high-throughput workflow execution, enterprise authentication, and autonomous lead intelligence.',
    },
  ];

  const values = [
    {
      title: 'Safety by Architecture',
      description: 'Zero prompt leakage, strict execution sandbox, and human-in-the-loop controls where it matters most.',
    },
    {
      title: 'Speed & Reliability',
      description: 'Sub-second event triggering, automatic retries, and high-availability database infrastructure.',
    },
    {
      title: 'Human Augmentation',
      description: 'We build AI that empowers human operators to eliminate drudgery and focus on strategic judgment.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 animate-in fade-in duration-300">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About FlowPilot AI</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.15]">
          Pioneering the Autonomous Enterprise
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          FlowPilot AI is built to liberate modern businesses from manual operations. We combine autonomous AI agents, intuitive visual workflow builders, and enterprise data security into a unified operational platform.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/signup">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Free Trial
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="md" variant="outline">
              Talk to Founders
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white">
              99.9%
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Execution Uptime</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-500">
              500k+
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Automated Tasks / Day</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white">
              &lt;200ms
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Trigger Pipeline Latency</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-sky-500">
              100%
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Row-Level Security</p>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Our Foundation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Designed for Reliability, Engineered for Scale
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Every feature in FlowPilot AI is constructed to deliver verifiable results without black-box surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <Card
              key={idx}
              className="p-6 space-y-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700">
                {pillar.icon}
              </div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Journey & Milestones */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
            Our Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            How We Got Here
          </h2>
        </div>

        <div className="space-y-4">
          {milestones.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center gap-4 transition-all"
            >
              <div className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-mono font-bold text-xs text-neutral-900 dark:text-white w-fit shrink-0">
                {item.year}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Company Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Values
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            What Drives Our Decisions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-2"
            >
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {v.title}
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white text-center space-y-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-white">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to automate your operations?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Join leading organizations building their AI workforce with FlowPilot AI.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Link to="/signup">
              <Button size="md" className="bg-white text-neutral-950 hover:bg-neutral-100 font-bold">
                Get Started Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="md"
                variant="outline"
                className="border-neutral-700 text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
