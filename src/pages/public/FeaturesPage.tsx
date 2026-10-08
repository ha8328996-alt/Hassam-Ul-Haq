import React from 'react';
import { Link } from '../../context/RouterContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  Bot,
  Zap,
  MessageSquare,
  Users,
  Grid,
  Shield,
  ArrowRight,
} from 'lucide-react';

export function FeaturesPage() {
  const features = [
    {
      icon: Bot,
      tag: '01. Autonomous Agents',
      title: 'Specialized Agents With Verified System Instructions',
      description:
        'Deploy agents engineered for discrete operational objectives. Each agent is constrained by role definitions, prompt schemas, and fine-tuned temperature settings to guarantee consistent production output.',
      details: [
        'Deterministic JSON schema validation for all tool calls',
        'Configurable temperature and token limits',
        'Gemini 2.5 Pro & Flash reasoning integration',
        'Stateful memory and contextual session recall',
      ],
      linkText: 'Explore Agents',
      linkUrl: '/dashboard/agents',
    },
    {
      icon: Zap,
      tag: '02. Orchestration Engine',
      title: 'Fault-Tolerant, High-Throughput Automation Workflows',
      description:
        'Chain triggers from webhooks, incoming emails, or database events into multi-stage execution pipelines. FlowPilot manages exponential backoffs, concurrency limits, and retry queues automatically.',
      details: [
        'Multi-step branching and conditional fallback logic',
        'Sub-second execution latencies with event pooling',
        'Automated dunning and payment failure remediation',
        'Zero-code and low-code builder interfaces',
      ],
      linkText: 'View Automations',
      linkUrl: '/dashboard/automations',
    },
    {
      icon: MessageSquare,
      tag: '03. Omnichannel Inbox',
      title: 'Unified Customer Ingestion Across 4 Major Channels',
      description:
        'Bridge email threads, Slack team channels, WhatsApp Business, and embedded webchat widgets into a single high-density inbox. AI resolves common queries while humans can take over seamlessly in one click.',
      details: [
        'Sentiment detection (positive, neutral, urgent)',
        'One-click human takeover with agent silence toggle',
        'Automated ticket categorization and priority routing',
        'Audit logs and customer interaction history',
      ],
      linkText: 'Open Unified Inbox',
      linkUrl: '/dashboard/conversations',
    },
    {
      icon: Users,
      tag: '04. Revenue Intelligence',
      title: 'Continuous Lead Enrichment & ICP Intent Scoring',
      description:
        'Never let a high-value inbound lead go cold. FlowPilot enriches company firmographics, cross-references revenue and headcount, and delivers a 0-100 buying readiness score within 3 seconds of form submission.',
      details: [
        'Automated domain lookup and executive mapping',
        'Pipeline value estimation and deal generation in HubSpot',
        'Instant routing to account executives via Slack and Calendar',
        'CSV export and bi-directional CRM synchronizations',
      ],
      linkText: 'Inspect Leads',
      linkUrl: '/dashboard/leads',
    },
    {
      icon: Grid,
      tag: '05. Enterprise Ecosystem',
      title: 'Pre-Built Connectors for Your Entire Tech Stack',
      description:
        'Connect Salesforce, HubSpot, Slack, Stripe, Google Workspace, and Postgres with secure OAuth or API keys. Native rate limiting and error handling ensure external APIs never drop a payload.',
      details: [
        'OAuth 2.0 and API Key credential vaulting',
        'HMAC SHA-256 webhook signature verification',
        'Live sync indicators and health monitors',
        'REST API documentation and SDK integration',
      ],
      linkText: 'Browse Integrations',
      linkUrl: '/dashboard/integrations',
    },
    {
      icon: Shield,
      tag: '06. Security & Telemetry',
      title: 'Enterprise Governance, RBAC, and Audit Logging',
      description:
        'Engineered from day one for stringent security compliance. Role-based access control, end-to-end payload encryption at rest, and detailed chronological execution logs give your team complete visibility.',
      details: [
        'SOC2 Type II and GDPR compliant controls',
        'Granular workspace roles (Owner, Admin, Editor, Viewer)',
        'Comprehensive chronological event stream audit trail',
        'Private VPC peering and dedicated tenancy options',
      ],
      linkText: 'Review Workspace Settings',
      linkUrl: '/dashboard/settings',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
          Platform Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
          The Operating System for Business AI Automation
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          FlowPilot combines autonomous agent intelligence with deterministic enterprise workflow guarantees.
        </p>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{item.tag}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                  <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Key Specifications
                  </p>
                  <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-neutral-400" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                <Link
                  to={item.linkUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:underline group"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 sm:p-12 rounded-2xl bg-neutral-900 text-white border border-neutral-800 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Ready to Automate Your Business Operations?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
          Start building autonomous workflows in under 5 minutes with our pre-configured enterprise blueprints.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/signup">
            <Button size="md" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Get Started Free
            </Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" size="md">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
