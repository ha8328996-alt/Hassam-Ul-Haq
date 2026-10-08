import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Agent,
  AgentStatus,
  Automation,
  AutomationStatus,
  Conversation,
  Lead,
  LeadStatus,
  LeadActivity,
  LeadActivityType,
  LeadNote,
  Integration,
  Template,
  TeamMember,
  NotificationItem,
  EventLog,
  Message,
} from '../types';
import {
  supabase,
  isSupabaseConfigured,
  DatabaseAIAgent,
  DatabaseAutomation,
  DatabaseLead,
  DatabaseIntegration,
} from '../lib/supabase';
import { useAuth } from './AuthContext';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
const SARAH_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agt_inbound_qualifier',
    name: 'Inbound Qualifier Agent',
    role: 'Lead Triage & Qualification',
    model: 'Gemini 2.5 Pro',
    status: 'active',
    totalExecutions: 4812,
    avgLatencyMs: 340,
    successRate: 98.4,
    description: 'Inspects inbound demo requests, enriches company domain, scores pipeline fit, and schedules executive demos.',
    systemPrompt: 'You are an elite enterprise B2B qualification agent. Analyze intent, verify company revenue tier, and route high-fit leads to account executives.',
    system_instructions: 'You are an elite enterprise B2B qualification agent. Analyze intent, verify company revenue tier, and route high-fit leads to account executives.',
    temperature: 0.2,
    capabilities: ['Web Enrichment', 'Calendar Booking', 'CRM Update', 'Slack Alert'],
    lastActive: '2 mins ago',
    avatarIcon: 'bot',
    responseStyle: 'Professional',
    tools: {
      webSearch: true,
      leadCapture: true,
      email: true,
      calendar: true,
      crm: true,
      webhook: false,
    },
    memory: {
      enableMemory: true,
      conversationMemory: true,
      customerInfo: true,
    },
    humanHandoff: {
      enabled: true,
      condition: 'Prospect indicates revenue > $10M ARR or explicitly requests executive call',
    },
    knowledge: {
      name: 'B2B Qualification Guidelines v3',
      description: 'Ideal customer profile metrics, revenue tiers, and regional AE routing rules',
      sources: ['https://wiki.flowpilot.ai/icp', 'sales-territory-map.pdf'],
    },
    createdAt: '2026-08-14',
    updatedAt: '2026-10-02',
  },
  {
    id: 'agt_support_dispatcher',
    name: 'Support Dispatcher Agent',
    role: 'Tier 1 Resolution & Triage',
    model: 'Gemini 2.5 Flash',
    status: 'active',
    totalExecutions: 19430,
    avgLatencyMs: 180,
    successRate: 94.2,
    description: 'Resolves technical documentation queries, troubleshoots webhook failures, and escalates complex bugs to engineering.',
    systemPrompt: 'Resolve common developer questions using official API specs. When sentiment is critical or account issue arises, initiate warm human handover.',
    system_instructions: 'Resolve common developer questions using official API specs. When sentiment is critical or account issue arises, initiate warm human handover.',
    temperature: 0.3,
    capabilities: ['API Knowledge Base', 'Error Log Parsing', 'Ticket Escalation'],
    lastActive: 'Just now',
    avatarIcon: 'message',
    responseStyle: 'Friendly',
    tools: {
      webSearch: true,
      leadCapture: false,
      email: true,
      calendar: false,
      crm: true,
      webhook: true,
    },
    memory: {
      enableMemory: true,
      conversationMemory: true,
      customerInfo: true,
    },
    humanHandoff: {
      enabled: true,
      condition: 'Customer sentiment is negative or customer requests live support specialist',
    },
    knowledge: {
      name: 'Developer Documentation & API Specs',
      description: 'REST endpoints, webhook HMAC verification, and common error code catalog',
      sources: ['https://docs.flowpilot.ai/api', 'error-dictionary.json'],
    },
    createdAt: '2026-08-20',
    updatedAt: '2026-10-03',
  },
  {
    id: 'agt_meeting_concierge',
    name: 'Meeting Concierge Agent',
    role: 'Calendar Orchestration',
    model: 'Gemini 2.5 Flash',
    status: 'active',
    totalExecutions: 3120,
    avgLatencyMs: 210,
    successRate: 99.1,
    description: 'Eliminates calendar back-and-forth by coordinating optimal meeting slots across global timezones for prospect calls.',
    systemPrompt: 'Coordinate executive scheduling with precision. Respect working hours, buffer times, and VIP executive rules.',
    system_instructions: 'Coordinate executive scheduling with precision. Respect working hours, buffer times, and VIP executive rules.',
    temperature: 0.1,
    capabilities: ['Google Calendar', 'Outlook Sync', 'Timezone Resolver'],
    lastActive: '14 mins ago',
    avatarIcon: 'zap',
    responseStyle: 'Concise',
    tools: {
      webSearch: false,
      leadCapture: true,
      email: true,
      calendar: true,
      crm: true,
      webhook: false,
    },
    memory: {
      enableMemory: true,
      conversationMemory: true,
      customerInfo: true,
    },
    humanHandoff: {
      enabled: true,
      condition: 'Calendar conflict cannot be automatically reconciled within 3 days',
    },
    knowledge: {
      name: 'Executive Calendar Policies',
      description: 'Buffer times, VIP prospect slots, and round-robin allocation rules',
      sources: ['https://wiki.flowpilot.ai/scheduling'],
    },
    createdAt: '2026-09-01',
    updatedAt: '2026-10-01',
  },
  {
    id: 'agt_churn_sentinel',
    name: 'Churn Sentinel Agent',
    role: 'Retention & Account Health',
    model: 'Gemini 2.5 Pro',
    status: 'inactive',
    totalExecutions: 1540,
    avgLatencyMs: 420,
    successRate: 96.8,
    description: 'Monitors product telemetry drops and unresolved tickets to flag accounts at risk of churn with remediation steps.',
    systemPrompt: 'Analyze usage drops > 30% week-over-week. Draft personalized executive re-engagement briefing for the CS team.',
    system_instructions: 'Analyze usage drops > 30% week-over-week. Draft personalized executive re-engagement briefing for the CS team.',
    temperature: 0.4,
    capabilities: ['Telemetry Monitor', 'Churn Risk Scoring', 'Draft Email'],
    lastActive: '3 days ago',
    avatarIcon: 'cpu',
    responseStyle: 'Detailed',
    tools: {
      webSearch: true,
      leadCapture: false,
      email: true,
      calendar: false,
      crm: true,
      webhook: true,
    },
    memory: {
      enableMemory: true,
      conversationMemory: true,
      customerInfo: true,
    },
    humanHandoff: {
      enabled: true,
      condition: 'Customer Health Score drops below 40/100',
    },
    knowledge: {
      name: 'Account Health Telemetry Model',
      description: 'Signals of account disengagement, seat deactivations, and support escalations',
      sources: ['retention-playbook.pdf'],
    },
    createdAt: '2026-09-10',
    updatedAt: '2026-09-28',
  },
  {
    id: 'agt_research_analyst',
    name: 'Market Intelligence Agent',
    role: 'Competitive Research',
    model: 'OpenAI GPT-4o',
    status: 'draft',
    totalExecutions: 980,
    avgLatencyMs: 510,
    successRate: 97.5,
    description: 'Generates account dossiers and competitive intel summaries before strategic sales enterprise briefings.',
    systemPrompt: 'Conduct deep synthesis on prospect target company, recent funding, tech stack footprint, and key executives.',
    system_instructions: 'Conduct deep synthesis on prospect target company, recent funding, tech stack footprint, and key executives.',
    temperature: 0.2,
    capabilities: ['Company Dossier', 'Tech Stack Extraction', 'Executive Summary'],
    lastActive: '1 hour ago',
    avatarIcon: 'sparkles',
    responseStyle: 'Detailed',
    tools: {
      webSearch: true,
      leadCapture: true,
      email: false,
      calendar: false,
      crm: true,
      webhook: false,
    },
    memory: {
      enableMemory: true,
      conversationMemory: true,
      customerInfo: false,
    },
    humanHandoff: {
      enabled: false,
      condition: '',
    },
    knowledge: {
      name: 'Enterprise Tech Stack Directory',
      description: 'Competitive battlecards, pricing tear-downs, and objection scripts',
      sources: ['https://wiki.flowpilot.ai/intel'],
    },
    createdAt: '2026-09-18',
    updatedAt: '2026-10-02',
  },
];

const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: 'aut_lead_enrich_hubspot',
    name: 'Inbound Lead Enrichment & CRM Pipeline Sync',
    description: 'When a new lead fills demo form, enrich company data, score lead fit with Gemini, and create deal in HubSpot.',
    category: 'Lead Gen',
    status: 'active',
    triggerType: 'lead_created',
    runCount: 3840,
    successRate: 99.2,
    lastRun: '4 mins ago',
    createdAt: '2026-08-12',
    steps: [
      { id: 's1', type: 'trigger', title: 'New Demo Request', description: 'Webhook triggers from FlowPilot lead widget', service: 'Webhooks' },
      { id: 's2', type: 'action', title: 'Enrich & Score Lead', description: 'Run Inbound Qualifier Agent with company research', service: 'FlowPilot Agent' },
      { id: 's3', type: 'action', title: 'Sync to HubSpot CRM', description: 'Upsert contact and create deal in Pipeline', service: 'HubSpot' },
      { id: 's4', type: 'action', title: 'Alert Sales Channel', description: 'Post summary card into #pipeline-alerts', service: 'Slack' },
    ],
  },
  {
    id: 'aut_urgent_support_escalate',
    name: 'Omnichannel Urgent Support Triage & Handover',
    description: 'Classifies incoming tickets; if negative sentiment or VIP tier detected, notifies on-call engineer and auto-drafts triage notes.',
    category: 'Customer Support',
    status: 'active',
    triggerType: 'email_received',
    runCount: 12450,
    successRate: 98.7,
    lastRun: '1 min ago',
    createdAt: '2026-07-20',
    steps: [
      { id: 's1', type: 'trigger', title: 'Inbound Support Email', description: 'Received on support@acme.com', service: 'Gmail' },
      { id: 's2', type: 'action', title: 'Analyze Sentiment & Intent', description: 'Support Dispatcher Agent tags severity', service: 'FlowPilot Agent' },
      { id: 's3', type: 'action', title: 'Route Escalation', description: 'Ping on-call engineer on Slack with generated context', service: 'Slack' },
    ],
  },
  {
    id: 'aut_failed_payment_recovery',
    name: 'Stripe Failed Payment Recovery & Smart Followup',
    description: 'Triggers on invoice.payment_failed event. Checks churn risk score, pauses non-critical services, and sends friendly billing link.',
    category: 'Operations',
    status: 'active',
    triggerType: 'webhook',
    runCount: 642,
    successRate: 97.4,
    lastRun: '2 hours ago',
    createdAt: '2026-09-01',
    steps: [
      { id: 's1', type: 'trigger', title: 'Payment Failed Webhook', description: 'Stripe invoice.payment_failed event', service: 'Stripe' },
      { id: 's2', type: 'action', title: 'Assess Account Risk', description: 'Fetch LTV and usage tier history', service: 'FlowPilot DB' },
      { id: 's3', type: 'action', title: 'Dispatch Tailored Notice', description: 'Send graceful card update request with 72h grace window', service: 'Email' },
    ],
  },
  {
    id: 'aut_daily_executive_brief',
    name: 'Daily 08:00 AM Operational Executive Brief',
    description: 'Aggregates yesterday s agent resolutions, pipeline velocity, API latency, and sends formatted morning digest to leadership.',
    category: 'Operations',
    status: 'paused',
    triggerType: 'schedule',
    runCount: 184,
    successRate: 100,
    lastRun: 'Yesterday at 08:00 AM',
    createdAt: '2026-06-15',
    steps: [
      { id: 's1', type: 'trigger', title: 'Cron Schedule (08:00 AM EST)', description: 'Runs every weekday morning', service: 'Scheduler' },
      { id: 's2', type: 'action', title: 'Synthesize Operational KPIs', description: 'Market Intelligence Agent generates executive report', service: 'FlowPilot Agent' },
      { id: 's3', type: 'action', title: 'Broadcast Digest', description: 'Deliver to executive board via Slack & Email', service: 'Slack' },
    ],
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_101',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@nordicsteel.io',
    customerCompany: 'Nordic Steel Corp',
    channel: 'email',
    status: 'ai_handled',
    assignedAgent: 'Inbound Qualifier Agent',
    sentiment: 'positive',
    unreadCount: 0,
    lastMessage: 'I have scheduled your technical demonstration for Thursday at 2:00 PM EST with our Solutions Engineering Lead.',
    lastMessageTime: '6 mins ago',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Marcus Vance',
        content: 'Hi FlowPilot team, we are evaluating automated agent orchestration for 40 enterprise seats across our European plants. Can we see an end-to-end demo this week?',
        timestamp: '18 mins ago',
      },
      {
        id: 'm2',
        sender: 'agent',
        senderName: 'Inbound Qualifier Agent',
        content: 'Hello Marcus. Thank you for reaching out! Nordic Steel represents an ideal match for FlowPilot multi-region deployment. I have reviewed your plant operations requirements and prepared a tailored architectural walkthrough.',
        timestamp: '12 mins ago',
      },
      {
        id: 'm3',
        sender: 'agent',
        senderName: 'Inbound Qualifier Agent',
        content: 'I have scheduled your technical demonstration for Thursday at 2:00 PM EST with our Solutions Engineering Lead. You will receive the calendar invitation shortly.',
        timestamp: '6 mins ago',
      },
    ],
  },
  {
    id: 'conv_102',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@axiomlogistics.de',
    customerCompany: 'Axiom Logistics',
    channel: 'slack',
    status: 'needs_human',
    assignedAgent: 'Support Dispatcher Agent',
    sentiment: 'urgent',
    unreadCount: 1,
    lastMessage: 'Webhook signature verification returned 403 on batch #891. Could someone verify our rotating secret?',
    lastMessageTime: '14 mins ago',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Elena Rostova',
        content: 'Hello! We just deployed our production webhook listener, but verification is failing on batch #891.',
        timestamp: '25 mins ago',
      },
      {
        id: 'm2',
        sender: 'agent',
        senderName: 'Support Dispatcher Agent',
        content: 'Checking webhook logs for Axiom Logistics. I see HMAC SHA-256 header mismatch on endpoint /api/v1/shipments/status. Let me pull your active signing key.',
        timestamp: '20 mins ago',
      },
      {
        id: 'm3',
        sender: 'customer',
        senderName: 'Elena Rostova',
        content: 'Webhook signature verification returned 403 on batch #891. Could someone verify our rotating secret?',
        timestamp: '14 mins ago',
      },
    ],
  },
  {
    id: 'conv_103',
    customerName: 'Julian Croft',
    customerEmail: 'j.croft@vortexcapital.co',
    customerCompany: 'Vortex Capital',
    channel: 'webchat',
    status: 'resolved',
    assignedAgent: 'Support Dispatcher Agent',
    sentiment: 'neutral',
    unreadCount: 0,
    lastMessage: 'Thank you! The API rate limit increase is reflected on our dashboard.',
    lastMessageTime: '1 hour ago',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Julian Croft',
        content: 'Do you support custom rate limits on the Enterprise tier for financial backtesting queries?',
        timestamp: '2 hours ago',
      },
      {
        id: 'm2',
        sender: 'agent',
        senderName: 'Support Dispatcher Agent',
        content: 'Yes Julian, Enterprise workspaces have dedicated throughput partitions scalable up to 10,000 requests per minute with guaranteed 99.99% uptime SLAs.',
        timestamp: '1 hour ago',
      },
      {
        id: 'm3',
        sender: 'customer',
        senderName: 'Julian Croft',
        content: 'Thank you! The API rate limit increase is reflected on our dashboard.',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: 'conv_104',
    customerName: 'Dr. Clara Thorne',
    customerEmail: 'cthorne@helixbio.org',
    customerCompany: 'Helix BioSystems',
    channel: 'whatsapp',
    status: 'ai_handled',
    assignedAgent: 'Meeting Concierge Agent',
    sentiment: 'positive',
    unreadCount: 0,
    lastMessage: 'Confirmed. Added to calendar for Friday 10:00 AM PST.',
    lastMessageTime: '3 hours ago',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Dr. Clara Thorne',
        content: 'Hi, rescheduling our onboarding check-in to Friday morning.',
        timestamp: '4 hours ago',
      },
      {
        id: 'm2',
        sender: 'agent',
        senderName: 'Meeting Concierge Agent',
        content: 'Confirmed. Added to calendar for Friday 10:00 AM PST. Link sent via WhatsApp and email.',
        timestamp: '3 hours ago',
      },
    ],
  },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_01',
    name: 'Marcus Vance',
    email: 'm.vance@nordicsteel.io',
    phone: '+46 8 123 4567',
    company: 'Nordic Steel Corp',
    title: 'VP of Manufacturing Automation',
    score: 96,
    status: 'qualified',
    estimatedValue: 48000,
    source: 'Website Demo Request',
    country: 'Sweden',
    assignedTo: 'Sarah Chen',
    tags: ['Manufacturing', 'Enterprise', 'High ICP'],
    notes: '40 seats, looking to replace manual RPA workflows with autonomous AI agents across 3 production plants. High buying urgency.',
    aiNotes: '40 seats, looking to replace manual RPA workflows with autonomous AI agents across 3 production plants. High buying urgency.',
    createdAt: '2026-10-02',
    lastContacted: '6 mins ago',
  },
  {
    id: 'lead_02',
    name: 'Elena Rostova',
    email: 'elena@axiomlogistics.de',
    phone: '+49 30 9876543',
    company: 'Axiom Logistics GmbH',
    title: 'Chief Technology Officer',
    score: 91,
    status: 'contacted',
    estimatedValue: 64000,
    source: 'Referral',
    country: 'Germany',
    assignedTo: 'Alex Mercer',
    tags: ['Logistics', 'Enterprise', 'SAP ERP'],
    notes: 'Requires high-throughput webhook sync with legacy SAP ERP. High strategic value enterprise contract.',
    aiNotes: 'Requires high-throughput webhook sync with legacy SAP ERP. High strategic value enterprise contract.',
    createdAt: '2026-09-28',
    lastContacted: '14 mins ago',
  },
  {
    id: 'lead_03',
    name: 'Julian Croft',
    email: 'j.croft@vortexcapital.co',
    phone: '+44 20 7946 0912',
    company: 'Vortex Capital',
    title: 'Head of Quantitative Operations',
    score: 87,
    status: 'qualified',
    estimatedValue: 36000,
    source: 'Website',
    country: 'United Kingdom',
    assignedTo: 'Sarah Chen',
    tags: ['Fintech', 'Urgent', 'Compliance'],
    notes: 'Wants automated SEC filing document extraction and sentiment alerts piped into proprietary Slack channels.',
    aiNotes: 'Wants automated SEC filing document extraction and sentiment alerts piped into proprietary Slack channels.',
    createdAt: '2026-09-25',
    lastContacted: '1 hour ago',
  },
  {
    id: 'lead_04',
    name: 'Dr. Clara Thorne',
    email: 'cthorne@helixbio.org',
    phone: '+1 (415) 890-2134',
    company: 'Helix BioSystems',
    title: 'Director of Clinical Informatics',
    score: 84,
    status: 'converted',
    estimatedValue: 52000,
    source: 'AI Agent',
    country: 'United States',
    assignedTo: 'Sarah Chen',
    tags: ['HealthTech', 'HIPAA', 'Closed Won'],
    notes: 'HIPAA compliance signed. Workspace successfully provisioned on Enterprise tier.',
    aiNotes: 'HIPAA compliance signed. Workspace successfully provisioned on Enterprise tier.',
    createdAt: '2026-09-14',
    lastContacted: '3 hours ago',
  },
  {
    id: 'lead_05',
    name: 'Kenji Takahashi',
    email: 'takahashi@neo-tokyo-robotics.jp',
    phone: '+81 3 5555 0192',
    company: 'NeoTokyo Robotics',
    title: 'Global Supply Chain Director',
    score: 79,
    status: 'new',
    estimatedValue: 75000,
    source: 'Web Form',
    country: 'Japan',
    assignedTo: 'Alex Mercer',
    tags: ['Robotics', 'Multilingual'],
    notes: 'Requires multi-language customer agent dispatch in Japanese and English with real-time translation.',
    aiNotes: 'Requires multi-language customer agent dispatch in Japanese and English with real-time translation.',
    createdAt: '2026-10-03',
    lastContacted: 'Never',
  },
  {
    id: 'lead_06',
    name: 'Siddharth Patel',
    email: 'spatel@zenithcloud.in',
    phone: '+91 22 2490 8821',
    company: 'Zenith Cloud Infrastructure',
    title: 'VP Engineering',
    score: 72,
    status: 'new',
    estimatedValue: 24000,
    source: 'Automation',
    country: 'India',
    assignedTo: 'Alex Mercer',
    tags: ['Cloud', 'DevOps'],
    notes: 'Exploring self-hosted or dedicated cloud tenancy for automated DevOps alert triage.',
    aiNotes: 'Exploring self-hosted or dedicated cloud tenancy for automated DevOps alert triage.',
    createdAt: '2026-10-03',
    lastContacted: 'Never',
  },
  {
    id: 'lead_07',
    name: 'Sophia Laurent',
    email: 'sophia@auramedia.fr',
    phone: '+33 1 42 68 55 00',
    company: 'Aura Media Labs',
    title: 'VP of Digital Growth',
    score: 88,
    status: 'proposal',
    estimatedValue: 42000,
    source: 'Web Form',
    country: 'France',
    assignedTo: 'Sarah Chen',
    tags: ['Media', 'Contract Review', 'High Intent'],
    notes: 'Legal reviewing enterprise terms. Target implementation date next month.',
    aiNotes: 'Enterprise security questionnaire approved. Finalizing MSA signature.',
    createdAt: '2026-09-18',
    lastContacted: 'Yesterday',
  },
  {
    id: 'lead_08',
    name: 'Bradley Cooper',
    email: 'b.cooper@starlightretail.com',
    phone: '+1 (312) 555-0177',
    company: 'Starlight Retailers',
    title: 'Head of IT Infrastructure',
    score: 45,
    status: 'lost',
    estimatedValue: 18000,
    source: 'Website',
    country: 'United States',
    assignedTo: 'Alex Mercer',
    tags: ['Retail', 'Budget Freeze'],
    notes: 'Budget delayed until next fiscal year. Recommended to keep warm for Q2 outreach.',
    aiNotes: 'Budget freeze announced company-wide. Nurture campaign active.',
    createdAt: '2026-09-10',
    lastContacted: '2 weeks ago',
  },
];

const INITIAL_LEAD_ACTIVITIES: LeadActivity[] = [
  {
    id: 'act_01',
    lead_id: 'lead_01',
    activity_type: 'created',
    description: 'Inbound demo request submitted through website widget.',
    created_at: '2026-10-02T09:15:00Z',
  },
  {
    id: 'act_02',
    lead_id: 'lead_01',
    activity_type: 'ai_agent',
    description: 'Inbound Qualifier Agent enriched company firmographics and computed ICP Intent score: 96/100.',
    created_at: '2026-10-02T09:16:30Z',
  },
  {
    id: 'act_03',
    lead_id: 'lead_01',
    activity_type: 'status_changed',
    description: 'Pipeline status upgraded from New to Qualified by Sarah Chen.',
    created_at: '2026-10-02T11:00:00Z',
  },
  {
    id: 'act_04',
    lead_id: 'lead_02',
    activity_type: 'created',
    description: 'Lead ingested from Partner Referral network.',
    created_at: '2026-09-28T14:20:00Z',
  },
  {
    id: 'act_05',
    lead_id: 'lead_02',
    activity_type: 'email',
    description: 'Introductory enterprise architecture brief dispatched to Elena Rostova.',
    created_at: '2026-09-28T15:45:00Z',
  },
  {
    id: 'act_06',
    lead_id: 'lead_07',
    activity_type: 'status_changed',
    description: 'Status moved to Proposal after executive scoping session.',
    created_at: '2026-09-22T10:00:00Z',
  },
];

const INITIAL_LEAD_NOTES: LeadNote[] = [
  {
    id: 'note_01',
    lead_id: 'lead_01',
    note: 'Marcus indicated they have 40 human operators doing repetitive copy-pasting between ERP and logistics portals. High urgency for Q4 rollout.',
    author_name: 'Sarah Chen',
    created_at: '2026-10-02T10:30:00Z',
  },
  {
    id: 'note_02',
    lead_id: 'lead_02',
    note: 'Elena requested technical documentation for HMAC webhook signing keys and rate limit boundaries for batch sync.',
    author_name: 'Alex Mercer',
    created_at: '2026-09-29T08:15:00Z',
  },
  {
    id: 'note_03',
    lead_id: 'lead_07',
    note: 'Aura Media requested standard enterprise MSA with 99.9% uptime SLA guarantee and EU GDPR data residency clause.',
    author_name: 'Sarah Chen',
    created_at: '2026-09-21T16:00:00Z',
  },
];

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'int_webhooks',
    key: 'webhooks',
    name: 'Webhooks & REST APIs',
    category: 'Developer Tools',
    description: 'Trigger real-time HTTP callbacks to external endpoints, serverless functions, or custom applications on workflow and lead events.',
    status: 'connected',
    lastSync: 'Live (1 active endpoint)',
    authType: 'webhook',
    accountName: 'https://api.flowpilot.ai/v1/webhook-receiver',
    configuration: {
      webhookUrl: 'https://api.flowpilot.ai/v1/webhook-receiver',
      webhookMethod: 'POST',
      webhookEvents: ['lead.created', 'agent.action_completed'],
      lastTestedAt: '10 mins ago',
      lastTestStatus: 'success',
      lastLatencyMs: 124,
    },
    eventsSupported: ['lead.created', 'lead.status_updated', 'agent.action_completed', 'automation.executed', 'conversation.new_message'],
  },
  {
    id: 'int_google_sheets',
    key: 'google_sheets',
    name: 'Google Sheets',
    category: 'Productivity',
    description: 'Automatically append qualified CRM leads, export automation telemetry, and query spreadsheet rows as live tabular context.',
    status: 'setup_required',
    setupRequired: true,
    authType: 'oauth',
    accountName: 'FlowPilot Enterprise Inbound Pipeline',
    configuration: {
      spreadsheetName: 'FlowPilot Enterprise Inbound Pipeline',
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    },
    docsUrl: 'https://developers.google.com/sheets/api',
  },
  {
    id: 'int_slack',
    key: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Broadcast real-time high-intent lead alerts, pipeline anomalies, and interactive human-in-the-loop approval messages to team channels.',
    status: 'setup_required',
    setupRequired: true,
    authType: 'oauth',
    accountName: '#leads-firehose',
    configuration: {
      channelName: '#leads-firehose',
    },
    docsUrl: 'https://api.slack.com',
  },
  {
    id: 'int_gmail',
    key: 'gmail',
    name: 'Gmail',
    category: 'Productivity',
    description: 'Dispatch autonomous personalized email outreach sequences, deliver qualification summaries, and monitor customer replies via Google Workspace.',
    status: 'setup_required',
    setupRequired: true,
    authType: 'oauth',
    accountName: 'sales-ops@flowpilot.ai',
    configuration: {
      fromName: 'FlowPilot Sales Executive',
      accountEmail: 'sales-ops@flowpilot.ai',
    },
    docsUrl: 'https://developers.google.com/gmail/api',
  },
  {
    id: 'int_hubspot',
    key: 'hubspot',
    name: 'HubSpot CRM',
    category: 'Productivity',
    description: 'Bi-directional sync of contacts, pipeline deals, meeting recordings, and custom AI qualification properties.',
    status: 'setup_required',
    setupRequired: true,
    authType: 'oauth',
    accountName: 'Acme Global Operations (Hub ID: 894102)',
  },
  {
    id: 'int_stripe',
    key: 'stripe',
    name: 'Stripe Payments',
    category: 'Developer Tools',
    description: 'Stream invoice failures, new subscription events, and trigger automated smart dunning sequences.',
    status: 'setup_required',
    setupRequired: true,
    authType: 'api_key',
    accountName: 'acct_1M982qFlowPilotLive',
  },
  {
    id: 'int_salesforce',
    key: 'salesforce',
    name: 'Salesforce Enterprise',
    category: 'Productivity',
    description: 'Enterprise data mapping for Leads, Accounts, and Opportunities with custom APEX triggers.',
    status: 'disconnected',
    setupRequired: true,
    authType: 'oauth',
  },
  {
    id: 'int_discord',
    key: 'discord',
    name: 'Discord',
    category: 'Communication',
    description: 'Post real-time bot alerts, server notifications, and team updates to designated Discord channels via incoming webhooks.',
    status: 'setup_required',
    setupRequired: true,
    authType: 'webhook',
  },
];

const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tmpl_inbound_qualifier',
    title: 'Inbound Lead Qualification & Meeting Booking',
    category: 'Sales & Growth',
    description: 'Automatically enriches company info using domain intelligence, scores lead fit (0-100), and books calendar slots for high-intent prospects.',
    triggerType: 'lead_created',
    actionsCount: 4,
    complexity: 'Beginner',
    executionsEstimate: '~1,200 runs/mo',
    steps: [
      { id: 't1', type: 'trigger', title: 'New Demo Form Submitted', description: 'Website capture widget', service: 'Webhooks' },
      { id: 't2', type: 'action', title: 'Enrich Company Profile', description: 'Fetch employee count & funding', service: 'FlowPilot Agent' },
      { id: 't3', type: 'action', title: 'Score Fit with Gemini 2.5', description: 'Evaluate against ICP criteria', service: 'FlowPilot Agent' },
      { id: 't4', type: 'action', title: 'Send Calendar Invitation', description: 'Propose 3 optimal timeslots', service: 'Google Calendar' },
    ],
  },
  {
    id: 'tmpl_cs_triage',
    title: 'Multi-Channel Support Triage & Auto-Reply',
    category: 'Customer Support',
    description: 'Ingests tickets across Slack, Email, and WhatsApp. Resolves Tier 1 questions instantly with documentation grounding and routes anomalies.',
    triggerType: 'email_received',
    actionsCount: 3,
    complexity: 'Intermediate',
    executionsEstimate: '~4,500 runs/mo',
    steps: [
      { id: 't1', type: 'trigger', title: 'Customer Ticket Ingest', description: 'Support mailbox or chat', service: 'Omnichannel' },
      { id: 't2', type: 'action', title: 'Draft Grounded Resolution', description: 'Search knowledge base', service: 'FlowPilot Agent' },
      { id: 't3', type: 'action', title: 'Dispatch or Escalate', description: 'Handover if sentiment < 0.3', service: 'Slack' },
    ],
  },
  {
    id: 'tmpl_churn_alert',
    title: 'Churn Sentinel & Account Health Warning',
    category: 'Customer Success',
    description: 'Detects declining platform usage or recurring billing issues. Prepares customized retention summary for the account manager.',
    triggerType: 'webhook',
    actionsCount: 3,
    complexity: 'Advanced',
    executionsEstimate: '~300 runs/mo',
    steps: [
      { id: 't1', type: 'trigger', title: 'Usage Drop Trigger', description: 'Weekly event count < 50% baseline', service: 'Telemetry' },
      { id: 't2', type: 'action', title: 'Generate Health Audit', description: 'Summarize past 30 days interactions', service: 'FlowPilot Agent' },
      { id: 't3', type: 'action', title: 'Ping Account Executive', description: 'Slack DM with intervention strategy', service: 'Slack' },
    ],
  },
  {
    id: 'tmpl_invoice_recovery',
    title: 'Smart Dunning & Payment Recovery',
    category: 'Operations',
    description: 'Recovers failed card charges gracefully without degrading user trust. Sends localized billing updates with secure payment links.',
    triggerType: 'webhook',
    actionsCount: 3,
    complexity: 'Beginner',
    executionsEstimate: '~150 runs/mo',
    steps: [
      { id: 't1', type: 'trigger', title: 'Stripe invoice.payment_failed', description: 'Webhook listener', service: 'Stripe' },
      { id: 't2', type: 'action', title: 'Verify Customer Grace Period', description: 'Check subscription tier rules', service: 'FlowPilot DB' },
      { id: 't3', type: 'action', title: 'Send Personalized Recovery Email', description: 'Secure 1-click update link', service: 'Email' },
    ],
  },
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm_1',
    name: 'Alex Chen',
    email: 'alex.chen@flowpilot.ai',
    role: 'owner',
    avatarUrl: DEFAULT_AVATAR,
    status: 'active',
    joinedDate: 'Mar 2025',
  },
  {
    id: 'tm_2',
    name: 'Sarah Miller',
    email: 'sarah.miller@acme-ops.com',
    role: 'admin',
    avatarUrl: SARAH_AVATAR,
    status: 'active',
    joinedDate: 'Jan 2026',
  },
  {
    id: 'tm_3',
    name: 'David Vance',
    email: 'david.v@acme-ops.com',
    role: 'editor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    joinedDate: 'Feb 2026',
  },
  {
    id: 'tm_4',
    name: 'Morgan Blake',
    email: 'morgan.b@acme-ops.com',
    role: 'viewer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'invited',
    joinedDate: 'Pending invitation',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'New lead received',
    description: 'Sarah Jenkins (VP Tech, Meridian FinTech) scored 94/100. Demo meeting requested.',
    timestamp: '2 mins ago',
    read: false,
    type: 'lead',
    link: '/dashboard/leads',
  },
  {
    id: 'notif_2',
    title: 'Automation completed',
    description: 'Inbound Lead Enrichment & CRM Pipeline Sync batch finished in 184ms (14 records synced).',
    timestamp: '18 mins ago',
    read: false,
    type: 'automation',
    link: '/dashboard/automations',
  },
  {
    id: 'notif_3',
    title: 'AI agent needs attention',
    description: 'Meeting Concierge Agent requires calendar re-authorization for external guest booking.',
    timestamp: '45 mins ago',
    read: false,
    type: 'agent',
    link: '/dashboard/agents',
  },
  {
    id: 'notif_4',
    title: 'Integration disconnected',
    description: 'Salesforce Enterprise OAuth token expired. Please reconnect in Integrations hub.',
    timestamp: '2 hours ago',
    read: true,
    type: 'system',
    link: '/dashboard/integrations',
  },
  {
    id: 'notif_5',
    title: 'High-Intent Lead Qualified: Nordic Steel Corp',
    description: 'Score 96/100 — $48,000 ARR potential. Calendar invite confirmed.',
    timestamp: '4 hours ago',
    read: true,
    type: 'lead',
    link: '/dashboard/leads',
  },
];

const INITIAL_LOGS: EventLog[] = [
  {
    id: 'log_1',
    title: 'Webhook received on /api/v1/leads/inbound',
    detail: 'Payload verified (HMAC SHA-256). Triggered Inbound Lead Qualification flow.',
    timestamp: '10:04:12 AM',
    status: 'success',
    source: 'Webhook Gateway',
  },
  {
    id: 'log_2',
    title: 'Gemini 2.5 Pro Lead Evaluation Complete',
    detail: 'Domain nordicsteel.io classified: Tier 1 Manufacturing Enterprise (Score 96).',
    timestamp: '10:04:14 AM',
    status: 'success',
    source: 'Inbound Qualifier Agent',
  },
  {
    id: 'log_3',
    title: 'HubSpot Deal Created',
    detail: 'Deal #89201 generated in "Discovery Scheduled" stage ($48,000 ARR).',
    timestamp: '10:04:15 AM',
    status: 'success',
    source: 'HubSpot Integration',
  },
  {
    id: 'log_4',
    title: 'Slack Notification Dispatched',
    detail: 'Message posted to #pipeline-alerts with action buttons.',
    timestamp: '10:04:16 AM',
    status: 'success',
    source: 'Slack Bot',
  },
];

interface DataContextType {
  agents: Agent[];
  isLoadingAgents: boolean;
  agentsError: string | null;
  automations: Automation[];
  conversations: Conversation[];
  leads: Lead[];
  isLoadingLeads: boolean;
  leadsError: string | null;
  templates: Template[];
  team: TeamMember[];
  notifications: NotificationItem[];
  eventLogs: EventLog[];
  createAgent: (agent: Partial<Agent>) => Promise<Agent>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  duplicateAgent: (id: string) => Promise<Agent>;
  setAgentStatus: (id: string, status: AgentStatus) => Promise<void>;
  toggleAgentStatus: (id: string) => void;
  getAgentById: (id: string) => Agent | undefined;
  toggleAutomation: (id: string) => void;
  runAutomation: (id: string) => void;
  createAutomation: (automation: Partial<Automation> & { name: string }) => Promise<Automation>;
  updateAutomation: (id: string, updates: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  duplicateAutomation: (id: string) => Promise<Automation>;
  setAutomationStatus: (id: string, status: AutomationStatus) => Promise<void>;
  getAutomationById: (id: string) => Automation | undefined;
  sendConversationMessage: (conversationId: string, content: string, sender?: 'human' | 'agent') => void;
  resolveConversation: (conversationId: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContacted'> | Partial<Lead>) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
  refreshLeads: () => Promise<void>;
  leadActivities: LeadActivity[];
  getLeadActivities: (leadId: string) => LeadActivity[];
  addLeadActivity: (
    leadId: string,
    activityType: LeadActivityType,
    description: string,
    metadata?: Record<string, any>
  ) => Promise<LeadActivity>;
  leadNotes: LeadNote[];
  getLeadNotes: (leadId: string) => LeadNote[];
  addLeadNote: (leadId: string, noteText: string, authorName?: string) => Promise<LeadNote>;
  deleteLeadNote: (noteId: string) => Promise<void>;
  integrations: Integration[];
  isLoadingIntegrations: boolean;
  integrationsError: string | null;
  toggleIntegration: (id: string) => void;
  connectIntegration: (id: string, config?: Record<string, any>) => Promise<void>;
  disconnectIntegration: (id: string) => Promise<void>;
  updateIntegrationConfig: (id: string, config: Record<string, any>) => Promise<void>;
  testIntegrationConnection: (
    id: string,
    isDemoTest?: boolean,
    customPayload?: any
  ) => Promise<{
    success: boolean;
    latencyMs?: number;
    statusCode?: number;
    message: string;
    details?: any;
    isDemo?: boolean;
  }>;
  addCustomWebhook: (
    name: string,
    url: string,
    method?: string,
    events?: string[]
  ) => Promise<Integration>;
  refreshIntegrations: () => Promise<void>;
  inviteTeamMember: (name: string, email: string, role: TeamMember['role']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  useTemplate: (templateId: string) => Automation;
}

function mapDbLeadToLead(db: DatabaseLead): Lead {
  return {
    id: db.id,
    user_id: db.user_id,
    name: db.name,
    email: db.email || '',
    phone: db.phone || '',
    company: db.company || '',
    title: db.title || '',
    score: typeof db.lead_score === 'number' ? db.lead_score : 75,
    status: (db.status as LeadStatus) || 'new',
    estimatedValue: typeof db.estimated_value === 'number' ? db.estimated_value : 0,
    source: db.source || 'Website',
    country: db.country || '',
    assignedTo: db.assigned_to || '',
    tags: db.tags || [],
    notes: db.notes || '',
    aiNotes: db.notes || '',
    createdAt: db.created_at ? db.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    updatedAt: db.updated_at,
    lastContacted: 'Recently',
  };
}

function mapLeadToDbLead(lead: Lead, userId: string): DatabaseLead {
  return {
    id: lead.id,
    user_id: userId,
    name: lead.name,
    email: lead.email || null,
    phone: lead.phone || null,
    company: lead.company || null,
    title: lead.title || null,
    lead_score: typeof lead.score === 'number' ? lead.score : 70,
    status: lead.status || 'new',
    source: lead.source || null,
    assigned_to: lead.assignedTo || null,
    tags: lead.tags || null,
    notes: lead.notes || lead.aiNotes || null,
    estimated_value: typeof lead.estimatedValue === 'number' ? lead.estimatedValue : 0,
    country: lead.country || null,
    created_at: lead.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapDbAgentToAgent(db: DatabaseAIAgent): Agent {
  const config = db.configuration || {};
  return {
    id: db.id,
    user_id: db.user_id,
    name: db.name,
    description: db.description || '',
    systemPrompt: db.system_instructions || '',
    system_instructions: db.system_instructions || '',
    model: db.model || 'Gemini 2.5 Pro',
    temperature: typeof db.temperature === 'number' ? db.temperature : 0.2,
    status: (db.status as AgentStatus) || 'active',
    role: config.role || 'Autonomous Assistant',
    avatarIcon: config.avatarIcon || 'bot',
    responseStyle: config.responseStyle || 'Professional',
    tools: config.tools || {
      webSearch: true,
      leadCapture: true,
      email: true,
      calendar: true,
      crm: true,
      webhook: false,
    },
    memory: config.memory || {
      enableMemory: true,
      conversationMemory: true,
      customerInfo: true,
    },
    humanHandoff: config.humanHandoff || {
      enabled: false,
      condition: '',
    },
    knowledge: config.knowledge || {
      name: 'Default Knowledge Base',
      description: 'Standard product and service documentation',
      sources: [],
    },
    capabilities: config.capabilities || ['Schema Validation', 'Tool Execution', 'Context Recall'],
    totalExecutions: typeof config.totalExecutions === 'number' ? config.totalExecutions : 0,
    avgLatencyMs: typeof config.avgLatencyMs === 'number' ? config.avgLatencyMs : 240,
    successRate: typeof config.successRate === 'number' ? config.successRate : 98.4,
    lastActive: config.lastActive || 'Just now',
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function mapAgentToDbAgent(agent: Agent, userId: string): DatabaseAIAgent {
  return {
    id: agent.id,
    user_id: userId,
    name: agent.name,
    description: agent.description || null,
    system_instructions: agent.system_instructions || agent.systemPrompt || null,
    model: agent.model,
    temperature: agent.temperature,
    status: agent.status,
    configuration: {
      role: agent.role,
      avatarIcon: agent.avatarIcon,
      responseStyle: agent.responseStyle,
      tools: agent.tools,
      memory: agent.memory,
      humanHandoff: agent.humanHandoff,
      knowledge: agent.knowledge,
      capabilities: agent.capabilities,
      totalExecutions: agent.totalExecutions,
      avgLatencyMs: agent.avgLatencyMs,
      successRate: agent.successRate,
      lastActive: agent.lastActive,
    },
    created_at: agent.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapDbAutomationToAutomation(db: DatabaseAutomation): Automation {
  const config = db.configuration || {};
  const workflowData = db.workflow_data || config.workflow_data || null;
  return {
    id: db.id,
    user_id: db.user_id,
    name: db.name,
    description: db.description || '',
    category: config.category || 'Lead Gen',
    status: (db.status as AutomationStatus) || 'active',
    triggerType: db.trigger_type,
    steps: config.steps || [
      {
        id: 's1',
        type: 'trigger',
        title: 'Event Listener',
        description: `Triggered via ${db.trigger_type}`,
        service: 'Trigger Gateway',
      },
    ],
    workflow_data: workflowData,
    configuration: config,
    runCount: typeof db.run_count === 'number' ? db.run_count : typeof config.runCount === 'number' ? config.runCount : 0,
    successRate: typeof config.successRate === 'number' ? config.successRate : 98.5,
    lastRun: db.last_run_at || config.lastRun || 'Never',
    lastRunAt: db.last_run_at || undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    successfulRuns: typeof config.successfulRuns === 'number' ? config.successfulRuns : undefined,
    failedRuns: typeof config.failedRuns === 'number' ? config.failedRuns : undefined,
  };
}

function mapAutomationToDbAutomation(auto: Automation, userId: string): DatabaseAutomation {
  return {
    id: auto.id,
    user_id: userId,
    name: auto.name,
    description: auto.description || null,
    status: auto.status,
    trigger_type: auto.triggerType,
    configuration: {
      category: auto.category,
      steps: auto.steps,
      runCount: auto.runCount,
      successRate: auto.successRate,
      lastRun: auto.lastRun,
      successfulRuns: auto.successfulRuns,
      failedRuns: auto.failedRuns,
      workflow_data: auto.workflow_data,
    },
    workflow_data: auto.workflow_data || null,
    run_count: auto.runCount,
    last_run_at: auto.lastRunAt || null,
    created_at: auto.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapDbIntegrationToIntegration(db: DatabaseIntegration, baseItem?: Integration): Integration {
  const config = db.configuration || {};
  return {
    id: db.id,
    key: db.provider,
    name: db.name || baseItem?.name || db.provider,
    category: (db.category as any) || baseItem?.category || 'Developer Tools',
    description: baseItem?.description || 'Custom connected service',
    status: (db.status as any) || 'disconnected',
    authType: baseItem?.authType || (db.provider === 'webhooks' ? 'webhook' : 'oauth'),
    accountName: config.accountName || config.accountEmail || config.channelName || baseItem?.accountName,
    setupRequired: db.status === 'setup_required' || baseItem?.setupRequired,
    configuration: config,
    lastSync: db.last_synced_at ? 'Synced recently' : baseItem?.lastSync,
    errorMessage: db.error_message || undefined,
    eventsSupported: baseItem?.eventsSupported,
    docsUrl: baseItem?.docsUrl,
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, supabaseUser } = useAuth();
  const currentUserId = user?.id || 'demo_user';
  const storageKey = `flowpilot_agents_${currentUserId}`;
  const automationsStorageKey = `flowpilot_automations_${currentUserId}`;
  const leadsStorageKey = `flowpilot_leads_${currentUserId}`;
  const activitiesStorageKey = `flowpilot_lead_activities_${currentUserId}`;
  const notesStorageKey = `flowpilot_lead_notes_${currentUserId}`;
  const integrationsStorageKey = `flowpilot_integrations_${currentUserId}`;

  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [agentsError, setAgentsError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : INITIAL_AGENTS;
    } catch {
      return INITIAL_AGENTS;
    }
  });

  const [isLoadingAutomations, setIsLoadingAutomations] = useState(false);
  const [automationsError, setAutomationsError] = useState<string | null>(null);
  const [automations, setAutomations] = useState<Automation[]>(() => {
    try {
      const userSaved = localStorage.getItem(automationsStorageKey);
      if (userSaved) return JSON.parse(userSaved);
      const globalSaved = localStorage.getItem('flowpilot_automations');
      return globalSaved ? JSON.parse(globalSaved) : INITIAL_AUTOMATIONS;
    } catch {
      return INITIAL_AUTOMATIONS;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('flowpilot_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const userSaved = localStorage.getItem(leadsStorageKey);
      if (userSaved) return JSON.parse(userSaved);
      const globalSaved = localStorage.getItem('flowpilot_leads');
      return globalSaved ? JSON.parse(globalSaved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [leadActivities, setLeadActivities] = useState<LeadActivity[]>(() => {
    try {
      const saved = localStorage.getItem(activitiesStorageKey);
      return saved ? JSON.parse(saved) : INITIAL_LEAD_ACTIVITIES;
    } catch {
      return INITIAL_LEAD_ACTIVITIES;
    }
  });

  const [leadNotes, setLeadNotes] = useState<LeadNote[]>(() => {
    try {
      const saved = localStorage.getItem(notesStorageKey);
      return saved ? JSON.parse(saved) : INITIAL_LEAD_NOTES;
    } catch {
      return INITIAL_LEAD_NOTES;
    }
  });

  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [integrationsError, setIntegrationsError] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    try {
      const userSaved = localStorage.getItem(integrationsStorageKey);
      if (userSaved) return JSON.parse(userSaved);
      const globalSaved = localStorage.getItem('flowpilot_integrations');
      return globalSaved ? JSON.parse(globalSaved) : INITIAL_INTEGRATIONS;
    } catch {
      return INITIAL_INTEGRATIONS;
    }
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('flowpilot_team');
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('flowpilot_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [eventLogs, setEventLogs] = useState<EventLog[]>(INITIAL_LOGS);

  // Sync agents with Supabase when credentials exist
  useEffect(() => {
    let isMounted = true;
    const loadSupabaseAgents = async () => {
      setIsLoadingAgents(true);
      setAgentsError(null);
      try {
        if (isSupabaseConfigured && supabaseUser) {
          const { data, error } = await supabase
            .from('ai_agents')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            if (isMounted) {
              const mapped = data.map((d: DatabaseAIAgent) => mapDbAgentToAgent(d));
              setAgents(mapped);
              localStorage.setItem(storageKey, JSON.stringify(mapped));
              return;
            }
          }
        }
        const saved = localStorage.getItem(storageKey);
        if (saved && isMounted) {
          setAgents(JSON.parse(saved));
        } else if (isMounted) {
          setAgents(INITIAL_AGENTS);
        }
      } catch (err: any) {
        if (isMounted) {
          setAgentsError(err?.message || 'Failed to load agents from database');
          const saved = localStorage.getItem(storageKey);
          if (saved) setAgents(JSON.parse(saved));
        }
      } finally {
        if (isMounted) setIsLoadingAgents(false);
      }
    };

    loadSupabaseAgents();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, supabaseUser]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(agents));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  }, [agents, storageKey]);

  // Sync automations with Supabase when credentials exist
  useEffect(() => {
    let isMounted = true;
    const loadSupabaseAutomations = async () => {
      setIsLoadingAutomations(true);
      setAutomationsError(null);
      try {
        if (isSupabaseConfigured && supabaseUser) {
          const { data, error } = await supabase
            .from('automations')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            if (isMounted) {
              const mapped = data.map((d: DatabaseAutomation) => mapDbAutomationToAutomation(d));
              setAutomations(mapped);
              localStorage.setItem(automationsStorageKey, JSON.stringify(mapped));
              return;
            }
          }
        }
        const userSaved = localStorage.getItem(automationsStorageKey);
        if (userSaved && isMounted) {
          setAutomations(JSON.parse(userSaved));
        } else if (isMounted) {
          const globalSaved = localStorage.getItem('flowpilot_automations');
          setAutomations(globalSaved ? JSON.parse(globalSaved) : INITIAL_AUTOMATIONS);
        }
      } catch (err: any) {
        if (isMounted) {
          setAutomationsError(err?.message || 'Failed to load automations from database');
          const saved = localStorage.getItem(automationsStorageKey);
          if (saved) setAutomations(JSON.parse(saved));
        }
      } finally {
        if (isMounted) setIsLoadingAutomations(false);
      }
    };

    loadSupabaseAutomations();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, supabaseUser]);

  useEffect(() => {
    try {
      localStorage.setItem(automationsStorageKey, JSON.stringify(automations));
      localStorage.setItem('flowpilot_automations', JSON.stringify(automations));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  }, [automations, automationsStorageKey]);

  useEffect(() => {
    localStorage.setItem('flowpilot_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Sync leads with Supabase when credentials exist
  useEffect(() => {
    let isMounted = true;
    const loadSupabaseLeads = async () => {
      setIsLoadingLeads(true);
      setLeadsError(null);
      try {
        if (isSupabaseConfigured && supabaseUser) {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            if (isMounted) {
              const mapped = data.map((d: DatabaseLead) => mapDbLeadToLead(d));
              setLeads(mapped);
              localStorage.setItem(leadsStorageKey, JSON.stringify(mapped));
              return;
            }
          }
        }
        const userSaved = localStorage.getItem(leadsStorageKey);
        if (userSaved && isMounted) {
          setLeads(JSON.parse(userSaved));
        } else if (isMounted) {
          const globalSaved = localStorage.getItem('flowpilot_leads');
          setLeads(globalSaved ? JSON.parse(globalSaved) : INITIAL_LEADS);
        }
      } catch (err: any) {
        if (isMounted) {
          setLeadsError(err?.message || 'Failed to load leads from database');
          const saved = localStorage.getItem(leadsStorageKey);
          if (saved) setLeads(JSON.parse(saved));
        }
      } finally {
        if (isMounted) setIsLoadingLeads(false);
      }
    };

    loadSupabaseLeads();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, supabaseUser]);

  useEffect(() => {
    try {
      localStorage.setItem(leadsStorageKey, JSON.stringify(leads));
      localStorage.setItem('flowpilot_leads', JSON.stringify(leads));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  }, [leads, leadsStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(activitiesStorageKey, JSON.stringify(leadActivities));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  }, [leadActivities, activitiesStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(notesStorageKey, JSON.stringify(leadNotes));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  }, [leadNotes, notesStorageKey]);

  // Sync integrations with Supabase when credentials exist
  useEffect(() => {
    let isMounted = true;
    const loadSupabaseIntegrations = async () => {
      setIsLoadingIntegrations(true);
      setIntegrationsError(null);
      try {
        if (isSupabaseConfigured && supabaseUser) {
          const { data, error } = await supabase
            .from('integrations')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            if (isMounted) {
              const mapped = data.map((d: DatabaseIntegration) => {
                const base = INITIAL_INTEGRATIONS.find((i) => i.key === d.provider);
                return mapDbIntegrationToIntegration(d, base);
              });
              const existingKeys = new Set(mapped.map((m: Integration) => m.key));
              const combined = [
                ...mapped,
                ...INITIAL_INTEGRATIONS.filter((i) => !existingKeys.has(i.key)),
              ];
              setIntegrations(combined);
              localStorage.setItem(integrationsStorageKey, JSON.stringify(combined));
              localStorage.setItem('flowpilot_integrations', JSON.stringify(combined));
              return;
            }
          }
        }
        const saved = localStorage.getItem(integrationsStorageKey);
        if (saved && isMounted) {
          setIntegrations(JSON.parse(saved));
        } else if (isMounted) {
          setIntegrations(INITIAL_INTEGRATIONS);
        }
      } catch (err: any) {
        if (isMounted) {
          setIntegrationsError(err?.message || 'Failed to load integrations');
          const saved = localStorage.getItem(integrationsStorageKey);
          if (saved) setIntegrations(JSON.parse(saved));
        }
      } finally {
        if (isMounted) setIsLoadingIntegrations(false);
      }
    };

    loadSupabaseIntegrations();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, supabaseUser, integrationsStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(integrationsStorageKey, JSON.stringify(integrations));
      localStorage.setItem('flowpilot_integrations', JSON.stringify(integrations));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  }, [integrations, integrationsStorageKey]);

  useEffect(() => {
    localStorage.setItem('flowpilot_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('flowpilot_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleAutomation = (id: string) => {
    const target = automations.find((a) => a.id === id);
    if (!target) return;
    const nextStatus: AutomationStatus = target.status === 'active' ? 'paused' : 'active';
    setAutomationStatus(id, nextStatus);
  };

  const runAutomation = (id: string) => {
    const auto = automations.find((a) => a.id === id);
    if (!auto) return;
    const nextRunCount = (auto.runCount || 0) + 1;
    const nowStr = 'Just now';
    const nowIso = new Date().toISOString();

    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, runCount: nextRunCount, lastRun: nowStr, lastRunAt: nowIso } : a
      )
    );

    if (isSupabaseConfigured && supabaseUser) {
      supabase
        .from('automations')
        .update({
          run_count: nextRunCount,
          last_run_at: nowIso,
          updated_at: nowIso,
        })
        .eq('id', id)
        .then(() => {});
    }

    const newLog: EventLog = {
      id: 'log_' + Date.now(),
      title: `Automation Executed: ${auto.name}`,
      detail: `All ${auto.steps?.length || 1} steps executed cleanly with 0 errors.`,
      timestamp: new Date().toLocaleTimeString(),
      status: 'success',
      source: 'Workflow Engine',
    };
    setEventLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  const createAutomation = async (
    data: Partial<Automation> & { name: string }
  ): Promise<Automation> => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'aut_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();

    const newAuto: Automation = {
      id: newId,
      user_id: currentUserId,
      name: data.name?.trim() || 'Untitled Automation',
      description: data.description?.trim() || 'Autonomous business workflow.',
      category: data.category || 'Lead Gen',
      status: (data.status as AutomationStatus) || 'draft',
      triggerType: data.triggerType || 'webhook',
      steps: data.steps || [
        {
          id: 'step_1',
          type: 'trigger',
          title: 'Event Trigger',
          description: `Triggered via ${data.triggerType || 'webhook'}`,
          service: 'Trigger Gateway',
        },
      ],
      workflow_data: data.workflow_data || { nodes: [], edges: [] },
      configuration: data.configuration || {},
      runCount: 0,
      successRate: 100,
      lastRun: 'Never',
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured && supabaseUser) {
      try {
        const dbRecord = mapAutomationToDbAutomation(newAuto, currentUserId);
        const { error } = await supabase.from('automations').insert([dbRecord]);
        if (error) {
          console.warn('Supabase automation insert error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase automation insert network error:', e);
      }
    }

    setAutomations((prev) => [newAuto, ...prev]);
    return newAuto;
  };

  const updateAutomation = async (
    id: string,
    updates: Partial<Automation>
  ): Promise<void> => {
    const now = new Date().toISOString();
    let updatedRecord: Automation | undefined;

    setAutomations((prev) =>
      prev.map((auto) => {
        if (auto.id === id) {
          updatedRecord = {
            ...auto,
            ...updates,
            updatedAt: now,
          };
          return updatedRecord;
        }
        return auto;
      })
    );

    if (isSupabaseConfigured && supabaseUser && updatedRecord) {
      try {
        const dbRecord = mapAutomationToDbAutomation(updatedRecord, currentUserId);
        const { error } = await supabase
          .from('automations')
          .update(dbRecord)
          .eq('id', id);
        if (error) {
          console.warn('Supabase automation update error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase automation update network error:', e);
      }
    }
  };

  const deleteAutomation = async (id: string): Promise<void> => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    if (isSupabaseConfigured && supabaseUser) {
      try {
        const { error } = await supabase.from('automations').delete().eq('id', id);
        if (error) {
          console.warn('Supabase automation delete error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase automation delete network error:', e);
      }
    }
  };

  const duplicateAutomation = async (id: string): Promise<Automation> => {
    const source = automations.find((a) => a.id === id);
    if (!source) throw new Error('Source automation not found');

    const duplicateData: Partial<Automation> & { name: string } = {
      name: `${source.name} (Copy)`,
      description: source.description,
      category: source.category,
      status: 'draft',
      triggerType: source.triggerType,
      steps: source.steps ? JSON.parse(JSON.stringify(source.steps)) : [],
      workflow_data: source.workflow_data
        ? JSON.parse(JSON.stringify(source.workflow_data))
        : { nodes: [], edges: [] },
      configuration: source.configuration
        ? JSON.parse(JSON.stringify(source.configuration))
        : {},
    };
    return await createAutomation(duplicateData);
  };

  const setAutomationStatus = async (
    id: string,
    status: AutomationStatus
  ): Promise<void> => {
    await updateAutomation(id, { status });
  };

  const getAutomationById = (id: string): Automation | undefined => {
    return automations.find((a) => a.id === id);
  };

  const createAgent = async (agentData: Partial<Agent>): Promise<Agent> => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'agt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();

    const newAgent: Agent = {
      id: newId,
      user_id: currentUserId,
      name: agentData.name?.trim() || 'Untitled Agent',
      role: agentData.role?.trim() || 'AI Autonomous Assistant',
      model: agentData.model || 'Gemini 2.5 Pro',
      status: (agentData.status as AgentStatus) || 'active',
      description: agentData.description?.trim() || 'Autonomous agent configured for intelligent business operations.',
      systemPrompt: agentData.systemPrompt || agentData.system_instructions || 'You are an intelligent business operations assistant.',
      system_instructions: agentData.system_instructions || agentData.systemPrompt || 'You are an intelligent business operations assistant.',
      temperature: typeof agentData.temperature === 'number' ? agentData.temperature : 0.2,
      avatarIcon: agentData.avatarIcon || 'bot',
      responseStyle: agentData.responseStyle || 'Professional',
      tools: agentData.tools || {
        webSearch: true,
        leadCapture: true,
        email: true,
        calendar: false,
        crm: true,
        webhook: false,
      },
      memory: agentData.memory || {
        enableMemory: true,
        conversationMemory: true,
        customerInfo: true,
      },
      humanHandoff: agentData.humanHandoff || {
        enabled: false,
        condition: '',
      },
      knowledge: agentData.knowledge || {
        name: '',
        description: '',
        sources: [],
      },
      capabilities: agentData.capabilities || ['Schema Validation', 'Tool Execution', 'Context Recall'],
      totalExecutions: 0,
      avgLatencyMs: 240,
      successRate: 100,
      lastActive: 'Just now',
      createdAt: now,
      updatedAt: now,
    };

    if (isSupabaseConfigured && supabaseUser) {
      try {
        const dbRecord = mapAgentToDbAgent(newAgent, currentUserId);
        const { error } = await supabase.from('ai_agents').insert([dbRecord]);
        if (error) {
          console.warn('Supabase agent insert error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase agent insert network error:', e);
      }
    }

    setAgents((prev) => [newAgent, ...prev]);
    return newAgent;
  };

  const updateAgent = async (id: string, updates: Partial<Agent>): Promise<void> => {
    const now = new Date().toISOString();
    let updatedAgent: Agent | undefined;

    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          updatedAgent = {
            ...a,
            ...updates,
            systemPrompt: updates.systemPrompt || updates.system_instructions || a.systemPrompt,
            system_instructions: updates.system_instructions || updates.systemPrompt || a.system_instructions,
            updatedAt: now,
          };
          return updatedAgent;
        }
        return a;
      })
    );

    if (isSupabaseConfigured && supabaseUser && updatedAgent) {
      try {
        const dbRecord = mapAgentToDbAgent(updatedAgent, currentUserId);
        await supabase
          .from('ai_agents')
          .update({
            name: dbRecord.name,
            description: dbRecord.description,
            system_instructions: dbRecord.system_instructions,
            model: dbRecord.model,
            temperature: dbRecord.temperature,
            status: dbRecord.status,
            configuration: dbRecord.configuration,
            updated_at: now,
          })
          .eq('id', id)
          .eq('user_id', currentUserId);
      } catch (e) {
        console.warn('Supabase updateAgent error:', e);
      }
    }
  };

  const deleteAgent = async (id: string): Promise<void> => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    if (isSupabaseConfigured && supabaseUser) {
      try {
        await supabase.from('ai_agents').delete().eq('id', id).eq('user_id', currentUserId);
      } catch (e) {
        console.warn('Supabase deleteAgent error:', e);
      }
    }
  };

  const duplicateAgent = async (id: string): Promise<Agent> => {
    const target = agents.find((a) => a.id === id);
    if (!target) throw new Error('Agent not found');

    const copyData: Partial<Agent> = {
      ...target,
      name: `${target.name} Copy`,
      status: 'draft',
    };
    return await createAgent(copyData);
  };

  const setAgentStatus = async (id: string, status: AgentStatus): Promise<void> => {
    await updateAgent(id, { status });
  };

  const toggleAgentStatus = (id: string) => {
    const target = agents.find((a) => a.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'inactive' : 'active';
    updateAgent(id, { status: nextStatus });
  };

  const getAgentById = (id: string): Agent | undefined => {
    return agents.find((a) => a.id === id);
  };

  const sendConversationMessage = (
    conversationId: string,
    content: string,
    sender: 'human' | 'agent' = 'human'
  ) => {
    const newMessage: Message = {
      id: 'msg_' + Date.now(),
      sender,
      senderName: sender === 'human' ? 'Operator (You)' : 'AI Copilot',
      content,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: content,
            lastMessageTime: 'Just now',
            unreadCount: 0,
            status: sender === 'human' ? 'ai_handled' : c.status,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );
  };

  const resolveConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, status: 'resolved', unreadCount: 0 } : c))
    );
  };

  const refreshLeads = async (): Promise<void> => {
    setIsLoadingLeads(true);
    setLeadsError(null);
    try {
      if (isSupabaseConfigured && supabaseUser) {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: DatabaseLead) => mapDbLeadToLead(d));
          setLeads(mapped);
          localStorage.setItem(leadsStorageKey, JSON.stringify(mapped));
          return;
        }
      }
      const userSaved = localStorage.getItem(leadsStorageKey);
      if (userSaved) {
        setLeads(JSON.parse(userSaved));
      }
    } catch (err: any) {
      setLeadsError(err?.message || 'Failed to refresh leads');
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const getLeadById = (id: string): Lead | undefined => {
    return leads.find((l) => l.id === id);
  };

  const addLead = async (
    leadData: Omit<Lead, 'id' | 'createdAt' | 'lastContacted'> | Partial<Lead>
  ): Promise<Lead> => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    const newLead: Lead = {
      id: newId,
      user_id: currentUserId,
      name: leadData.name || 'Untitled Lead',
      email: leadData.email || '',
      phone: leadData.phone || '',
      company: leadData.company || '',
      title: leadData.title || 'Decision Maker',
      score: typeof leadData.score === 'number' ? leadData.score : 75,
      status: (leadData.status as LeadStatus) || 'new',
      estimatedValue: typeof leadData.estimatedValue === 'number' ? leadData.estimatedValue : 0,
      source: leadData.source || 'Website',
      country: leadData.country || 'United States',
      assignedTo: leadData.assignedTo || 'Sarah Chen',
      tags: leadData.tags || [],
      notes: leadData.notes || '',
      aiNotes: leadData.aiNotes || leadData.notes || 'Lead ingested into CRM.',
      createdAt: todayDate,
      updatedAt: nowIso,
      lastContacted: 'Just now',
    };

    if (isSupabaseConfigured && supabaseUser) {
      try {
        const dbRecord = mapLeadToDbLead(newLead, currentUserId);
        const { error } = await supabase.from('leads').insert([dbRecord]);
        if (error) {
          console.warn('Supabase lead insert error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase lead insert network error:', e);
      }
    }

    setLeads((prev) => [newLead, ...prev]);

    // Record activity
    const newActivity: LeadActivity = {
      id: 'act_' + Date.now(),
      lead_id: newId,
      user_id: currentUserId,
      activity_type: 'created',
      description: `Prospect ${newLead.name} created at ${newLead.company || 'Unknown Company'} with initial score ${newLead.score}/100.`,
      created_at: nowIso,
    };
    setLeadActivities((prev) => [newActivity, ...prev]);

    return newLead;
  };

  const updateLead = async (id: string, updates: Partial<Lead>): Promise<void> => {
    const nowIso = new Date().toISOString();
    let targetLead: Lead | undefined;

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          targetLead = {
            ...l,
            ...updates,
            updatedAt: nowIso,
          };
          return targetLead;
        }
        return l;
      })
    );

    if (isSupabaseConfigured && supabaseUser && targetLead) {
      try {
        const dbRecord = mapLeadToDbLead(targetLead, currentUserId);
        const { error } = await supabase.from('leads').update(dbRecord).eq('id', id);
        if (error) {
          console.warn('Supabase lead update error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase lead update network error:', e);
      }
    }

    if (updates.status) {
      const activity: LeadActivity = {
        id: 'act_' + Date.now(),
        lead_id: id,
        user_id: currentUserId,
        activity_type: 'status_changed',
        description: `Pipeline status updated to ${updates.status.toUpperCase()}.`,
        created_at: nowIso,
      };
      setLeadActivities((prev) => [activity, ...prev]);
    }
  };

  const deleteLead = async (id: string): Promise<void> => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setLeadActivities((prev) => prev.filter((a) => a.lead_id !== id));
    setLeadNotes((prev) => prev.filter((n) => n.lead_id !== id));

    if (isSupabaseConfigured && supabaseUser) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) {
          console.warn('Supabase lead delete error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase lead delete network error:', e);
      }
    }
  };

  const getLeadActivities = (leadId: string): LeadActivity[] => {
    return leadActivities.filter((a) => a.lead_id === leadId);
  };

  const addLeadActivity = async (
    leadId: string,
    activityType: LeadActivityType,
    description: string,
    metadata?: Record<string, any>
  ): Promise<LeadActivity> => {
    const newActivity: LeadActivity = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      lead_id: leadId,
      user_id: currentUserId,
      activity_type: activityType,
      description,
      created_at: new Date().toISOString(),
      metadata,
    };
    setLeadActivities((prev) => [newActivity, ...prev]);
    return newActivity;
  };

  const getLeadNotes = (leadId: string): LeadNote[] => {
    return leadNotes.filter((n) => n.lead_id === leadId);
  };

  const addLeadNote = async (
    leadId: string,
    noteText: string,
    authorName: string = user?.name || 'You'
  ): Promise<LeadNote> => {
    const newNote: LeadNote = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      lead_id: leadId,
      user_id: currentUserId,
      note: noteText,
      author_name: authorName,
      created_at: new Date().toISOString(),
    };
    setLeadNotes((prev) => [newNote, ...prev]);

    // Also log an activity entry
    addLeadActivity(
      leadId,
      'note_added',
      `New note added by ${authorName}: "${noteText.slice(0, 60)}${noteText.length > 60 ? '...' : ''}"`
    );
    return newNote;
  };

  const deleteLeadNote = async (noteId: string): Promise<void> => {
    setLeadNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'connected' ? 'disconnected' : 'connected';
          return {
            ...item,
            status: nextStatus,
            lastSync: nextStatus === 'connected' ? 'Just now' : undefined,
          };
        }
        return item;
      })
    );
  };

  const connectIntegration = async (id: string, config?: Record<string, any>): Promise<void> => {
    const target = integrations.find((i) => i.id === id);
    if (!target) return;

    const mergedConfig = { ...(target.configuration || {}), ...(config || {}) };
    const nextStatus = 'connected';
    const nextSync = 'Just now';

    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              lastSync: nextSync,
              configuration: mergedConfig,
              accountName:
                mergedConfig.accountEmail ||
                mergedConfig.channelName ||
                mergedConfig.spreadsheetName ||
                item.accountName,
              errorMessage: undefined,
            }
          : item
      )
    );

    if (isSupabaseConfigured && supabaseUser) {
      try {
        const safeConfig = { ...mergedConfig };
        delete safeConfig.apiSecret;
        delete safeConfig.clientSecret;
        delete safeConfig.accessToken;

        await supabase.from('integrations').upsert({
          id: target.id.startsWith('int_') ? undefined : target.id,
          user_id: currentUserId,
          provider: target.key,
          name: target.name,
          category: target.category,
          status: 'connected',
          configuration: safeConfig,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase integration connect upsert warning:', err);
      }
    }
  };

  const disconnectIntegration = async (id: string): Promise<void> => {
    const target = integrations.find((i) => i.id === id);
    if (!target) return;

    const nextStatus = target.setupRequired ? 'setup_required' : 'disconnected';

    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              lastSync: undefined,
            }
          : item
      )
    );

    if (isSupabaseConfigured && supabaseUser) {
      try {
        await supabase
          .from('integrations')
          .update({
            status: 'disconnected',
            updated_at: new Date().toISOString(),
          })
          .eq('provider', target.key)
          .eq('user_id', currentUserId);
      } catch (err) {
        console.warn('Supabase integration disconnect warning:', err);
      }
    }
  };

  const updateIntegrationConfig = async (id: string, newConfig: Record<string, any>): Promise<void> => {
    const target = integrations.find((i) => i.id === id);
    if (!target) return;

    const mergedConfig = { ...(target.configuration || {}), ...newConfig };

    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              configuration: mergedConfig,
              accountName:
                mergedConfig.accountEmail ||
                mergedConfig.channelName ||
                mergedConfig.spreadsheetName ||
                item.accountName,
            }
          : item
      )
    );

    if (isSupabaseConfigured && supabaseUser) {
      try {
        const safeConfig = { ...mergedConfig };
        delete safeConfig.apiSecret;
        delete safeConfig.clientSecret;
        delete safeConfig.accessToken;

        await supabase
          .from('integrations')
          .update({
            configuration: safeConfig,
            updated_at: new Date().toISOString(),
          })
          .eq('provider', target.key)
          .eq('user_id', currentUserId);
      } catch (err) {
        console.warn('Supabase integration config update warning:', err);
      }
    }
  };

  const testIntegrationConnection = async (
    id: string,
    isDemoTest: boolean = false,
    customPayload?: any
  ): Promise<{
    success: boolean;
    latencyMs?: number;
    statusCode?: number;
    message: string;
    details?: any;
    isDemo?: boolean;
  }> => {
    const target = integrations.find((i) => i.id === id);
    if (!target) {
      return { success: false, message: 'Integration not found.' };
    }

    // 1. Webhook connection test: Perform genuine HTTP fetch request
    if (target.authType === 'webhook') {
      const endpointUrl = target.configuration?.webhookUrl || customPayload?.url;
      if (!endpointUrl) {
        return {
          success: false,
          statusCode: 400,
          message: 'No webhook URL configured. Please enter a destination endpoint URL.',
        };
      }

      const startTime = performance.now();
      try {
        const method = target.configuration?.webhookMethod || 'POST';
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-FlowPilot-Event': 'test.ping',
          'X-FlowPilot-Timestamp': new Date().toISOString(),
        };

        const testBody =
          method === 'GET'
            ? undefined
            : JSON.stringify({
                event: 'flowpilot.ping',
                timestamp: new Date().toISOString(),
                workspace: 'FlowPilot Workspace',
                source: 'integration_tester',
                payload: customPayload || { ping: 'pong', version: '2.5' },
              });

        const res = await fetch(endpointUrl, {
          method,
          headers,
          body: testBody,
          mode: 'cors',
        });

        const latencyMs = Math.round(performance.now() - startTime);
        const success = res.ok;

        const result = {
          success,
          statusCode: res.status,
          latencyMs,
          message: success
            ? `Endpoint verified! HTTP ${res.status} response received in ${latencyMs}ms.`
            : `Endpoint responded with HTTP ${res.status} (${res.statusText || 'Error'}) in ${latencyMs}ms.`,
          details: {
            url: endpointUrl,
            method,
            headersSent: headers,
            status: res.status,
            latencyMs,
          },
        };

        updateIntegrationConfig(id, {
          lastTestedAt: 'Just now',
          lastTestStatus: success ? 'success' : 'failed',
          lastTestMessage: result.message,
          lastLatencyMs: latencyMs,
        });

        return result;
      } catch (err: any) {
        const latencyMs = Math.round(performance.now() - startTime);
        const result = {
          success: false,
          latencyMs,
          statusCode: 0,
          message: `Network request error: ${err?.message || 'CORS restriction or network unreachable'}. Browser could not reach endpoint directly.`,
          details: { error: err?.message, url: endpointUrl },
        };

        updateIntegrationConfig(id, {
          lastTestedAt: 'Just now',
          lastTestStatus: 'failed',
          lastTestMessage: result.message,
          lastLatencyMs: latencyMs,
        });

        return result;
      }
    }

    // 2. OAuth & API Connections: Check server credentials
    const hasLiveCredentials =
      (target.key === 'google_sheets' && Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)) ||
      (target.key === 'gmail' && Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)) ||
      (target.key === 'slack' && Boolean(import.meta.env.VITE_SLACK_CLIENT_ID || import.meta.env.VITE_SLACK_BOT_TOKEN));

    if (!hasLiveCredentials && !isDemoTest) {
      return {
        success: false,
        statusCode: 401,
        message: `Setup Required: Live OAuth credentials for ${target.name} are not configured in server environment variables. Cannot establish real connection.`,
        isDemo: false,
      };
    }

    if (isDemoTest) {
      await new Promise((r) => setTimeout(r, 650));
      const latencyMs = 82;
      const result = {
        success: true,
        statusCode: 200,
        latencyMs,
        isDemo: true,
        message: `[Demo Sandbox Test] Sandbox evaluation test executed successfully. Explicit Note: This is an isolated demo sandbox check; no live OAuth token is configured.`,
        details: {
          provider: target.key,
          mode: 'sandbox_demo',
          verifiedAt: new Date().toISOString(),
        },
      };

      updateIntegrationConfig(id, {
        lastTestedAt: 'Just now',
        lastTestStatus: 'success',
        lastTestMessage: result.message,
        lastLatencyMs: latencyMs,
      });

      return result;
    }

    return {
      success: false,
      statusCode: 500,
      message: 'Unexpected test condition.',
    };
  };

  const addCustomWebhook = async (
    name: string,
    url: string,
    method: string = 'POST',
    events: string[] = ['lead.created']
  ): Promise<Integration> => {
    const newIntegration: Integration = {
      id: 'int_hook_' + Date.now(),
      key: 'custom_webhook_' + Date.now(),
      name,
      category: 'Developer Tools',
      description: `Custom HTTP endpoint routing workflow signals to ${url.slice(0, 36)}...`,
      status: 'connected',
      authType: 'webhook',
      lastSync: 'Just created',
      configuration: {
        webhookUrl: url,
        webhookMethod: method as any,
        webhookEvents: events,
        lastTestedAt: 'Never',
      },
      eventsSupported: ['lead.created', 'lead.status_updated', 'agent.action_completed', 'automation.executed', 'conversation.new_message'],
    };

    setIntegrations((prev) => [newIntegration, ...prev]);

    if (isSupabaseConfigured && supabaseUser) {
      try {
        await supabase.from('integrations').insert({
          id: undefined,
          user_id: currentUserId,
          provider: newIntegration.key,
          name: newIntegration.name,
          category: 'Developer Tools',
          status: 'connected',
          configuration: newIntegration.configuration,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Failed to insert custom webhook in Supabase:', e);
      }
    }

    return newIntegration;
  };

  const refreshIntegrations = async (): Promise<void> => {
    setIsLoadingIntegrations(true);
    setIntegrationsError(null);
    try {
      if (isSupabaseConfigured && supabaseUser) {
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: DatabaseIntegration) => {
            const base = INITIAL_INTEGRATIONS.find((i) => i.key === d.provider);
            return mapDbIntegrationToIntegration(d, base);
          });
          const existingKeys = new Set(mapped.map((m: Integration) => m.key));
          const combined = [
            ...mapped,
            ...INITIAL_INTEGRATIONS.filter((i) => !existingKeys.has(i.key)),
          ];
          setIntegrations(combined);
          localStorage.setItem(integrationsStorageKey, JSON.stringify(combined));
          return;
        }
      }
      const saved = localStorage.getItem(integrationsStorageKey);
      if (saved) {
        setIntegrations(JSON.parse(saved));
      }
    } catch (err: any) {
      setIntegrationsError(err?.message || 'Failed to refresh integrations');
    } finally {
      setIsLoadingIntegrations(false);
    }
  };

  const inviteTeamMember = (name: string, email: string, role: TeamMember['role']) => {
    const newMember: TeamMember = {
      id: 'tm_' + Math.random().toString(36).substring(2, 7),
      name,
      email,
      role,
      avatarUrl: DEFAULT_AVATAR,
      status: 'invited',
      joinedDate: 'Invitation sent',
    };
    setTeam((prev) => [...prev, newMember]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const useTemplate = (templateId: string): Automation => {
    const tmpl = INITIAL_TEMPLATES.find((t) => t.id === templateId) || INITIAL_TEMPLATES[0];
    const newAuto: Automation = {
      id: 'aut_' + Math.random().toString(36).substring(2, 8),
      name: tmpl.title,
      description: tmpl.description,
      category: tmpl.category as Automation['category'],
      status: 'active',
      triggerType: tmpl.triggerType,
      runCount: 0,
      successRate: 100,
      lastRun: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      steps: tmpl.steps,
    };
    setAutomations((prev) => [newAuto, ...prev]);
    return newAuto;
  };

  return (
    <DataContext.Provider
      value={{
        agents,
        isLoadingAgents,
        agentsError,
        automations,
        conversations,
        leads,
        isLoadingLeads,
        leadsError,
        templates: INITIAL_TEMPLATES,
        team,
        notifications,
        eventLogs,
        toggleAutomation,
        runAutomation,
        createAutomation,
        updateAutomation,
        deleteAutomation,
        duplicateAutomation,
        setAutomationStatus,
        getAutomationById,
        createAgent,
        updateAgent,
        deleteAgent,
        duplicateAgent,
        setAgentStatus,
        toggleAgentStatus,
        getAgentById,
        sendConversationMessage,
        resolveConversation,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
        refreshLeads,
        leadActivities,
        getLeadActivities,
        addLeadActivity,
        leadNotes,
        getLeadNotes,
        addLeadNote,
        deleteLeadNote,
        integrations,
        isLoadingIntegrations,
        integrationsError,
        toggleIntegration,
        connectIntegration,
        disconnectIntegration,
        updateIntegrationConfig,
        testIntegrationConnection,
        addCustomWebhook,
        refreshIntegrations,
        inviteTeamMember,
        markNotificationRead,
        markAllNotificationsRead,
        useTemplate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
